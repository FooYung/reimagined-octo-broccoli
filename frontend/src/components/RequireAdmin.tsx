import { Navigate, Outlet, useLocation } from 'react-router';
import { useCurrentUser } from '../api/auth.ts';
import ForbiddenPage from '../pages/ForbiddenPage.tsx';

function RequireAdmin() {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();

  // Guard flicker is acceptable for this app; no spinner.
  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== 'ADMIN') {
    return <ForbiddenPage />;
  }

  return <Outlet />;
}

export default RequireAdmin;
