import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav.jsx';
import './Layout.css';

export default function Layout() {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  const isAuth = pathname === '/login' || pathname === '/register';
  const isListingDetail = /^\/marketplace\/[^/]+$/.test(pathname);
  const hideChrome = isLanding || isAuth;
  const hideNav = hideChrome || isListingDetail;
  const shellClass = [
    'app-shell',
    isLanding ? 'app-shell--landing' : '',
    isAuth ? 'app-shell--auth' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={shellClass}>
      <main className="app-shell__main">
        <Outlet />
      </main>
      {!hideNav ? <BottomNav /> : null}
    </div>
  );
}
