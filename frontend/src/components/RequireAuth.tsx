import { Navigate, Outlet, useLocation } from 'react-router';
import { useCurrentUser } from '../api/auth.ts';

function RequireAuth() {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();

  // Guard flicker is acceptable for this app; no spinner.
  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
