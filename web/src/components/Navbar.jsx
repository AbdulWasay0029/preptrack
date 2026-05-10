import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('telegram_id');
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-xl text-primary">PrepTrack</div>
      <div className="flex gap-4">
        <Link to="/" className="text-gray-300 hover:text-white">Dashboard</Link>
        <Link to="/progress" className="text-gray-300 hover:text-white">Progress</Link>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-400">Logout</button>
      </div>
    </nav>
  );
}
