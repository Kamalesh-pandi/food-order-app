import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import RightPanel from '../components/RightPanel';
import { ToastContainer } from 'react-toastify';

const MainLayout = () => {
    const location = useLocation();
    // Check if we are on a page that needs the right panel (e.g. Dashboard/Menu)
    // For now, let's show it on main dashboard pages
    const showRightPanel = ['/', '/menu', '/cart'].includes(location.pathname);

  return (
    <div className="d-flex">
      <ToastContainer />
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <TopBar />
        <main className="p-4 bg-app-light" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
