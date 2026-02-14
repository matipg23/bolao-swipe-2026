'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="hover:underline">
      Logout
    </button>
  );
}
