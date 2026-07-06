import { Outlet } from 'react-router';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
