import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout = () => {
  const { logout, session } = useAuth();

  return (
    <div className="min-h-screen bg-[#f5f6fb]">
      <Sidebar
        username={session?.username ?? ''}
        role={session?.role ?? ''}
        workspace={session?.workspace ?? ''}
        onLogout={logout}
      />
      <div className="lg:pl-64">
        <Outlet />
      </div>
    </div>
  );
};
