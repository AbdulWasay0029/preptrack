const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { requireInternalAuth } = require('../middleware/auth');

let Razorpay;
try {
  Razorpay = require('razorpay');
} catch {
  console.warn('Razorpay package not found — payment routes disabled');
}

const PRO_AMOUNT_PAISE = 19900; // ₹199

// POST /payments/create-order — create a Razorpay order
// Called by web dashboard when user clicks "Upgrade to Pro"
router.post('/create-order', async (req, res) => {
  if (!Razorpay) return res.status(503).json({ error: 'Payments not configured' });

  const { telegram_id } = req.body;
  if (!telegram_id) return res.status(400).json({ error: 'telegram_id required' });

  try {
    const { rows: userRows } = await db.query(
      'SELECT id FROM users WHERE telegram_id = $1',
      [telegram_id]
    );
    if (!userRows.length) return res.status(404).json({ error: 'User not found' });
    const userId = userRows[0].id;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: PRO_AMOUNT_PAISE,
      currency: 'INR',
      receipt: `preptrack_${userId}_${Date.now()}`,
    });

    // Record pending payment
    await db.query(
      `INSERT INTO payments (user_id, razorpay_order_id, amount_paise, status)
       VALUES ($1, $2, $3, 'pending')`,
      [userId, order.id, PRO_AMOUNT_PAISE]
    );

    res.json({
      orderId: order.id,
      amount: PRO_AMOUNT_PAISE,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('POST /payments/create-order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /payments/verify — verify Razorpay payment signature
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, telegram_id } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !telegram_id) {
    return res.status(400).json({ error: 'Missing payment fields' });
  }

  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSig !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  try {
    // Update payment record
    await db.query(
      `UPDATE payments
       SET razorpay_payment_id = $1, status = 'completed'
       WHERE razorpay_order_id = $2`,
      [razorpay_payment_id, razorpay_order_id]
    );

    // Upgrade user to Pro
    await db.query(
      'UPDATE users SET is_pro = TRUE WHERE telegram_id = $1',
      [telegram_id]
    );

    res.json({ ok: true, message: 'Payment verified. You are now Pro!' });
  } catch (err) {
    console.error('POST /payments/verify error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /payments/webhook — Razorpay webhook endpoint
router.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!secret) {
    console.warn('RAZORPAY_WEBHOOK_SECRET not set, ignoring webhook');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== req.headers['x-razorpay-signature']) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = req.body.event;

  try {
    if (event === 'payment.captured' || event === 'order.paid') {
      const orderId = req.body.payload.payment.entity.order_id;
      const paymentId = req.body.payload.payment.entity.id;

      // Update payment record and get user_id
      const { rows } = await db.query(
        `UPDATE payments
         SET razorpay_payment_id = $1, status = 'completed'
         WHERE razorpay_order_id = $2
         RETURNING user_id`,
        [paymentId, orderId]
      );

      if (rows.length > 0) {
        // Upgrade user to Pro
        await db.query(
          'UPDATE users SET is_pro = TRUE WHERE id = $1',
          [rows[0].user_id]
        );
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
