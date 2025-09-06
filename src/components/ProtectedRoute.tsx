import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../config';
import { DefaultUserPage } from '../pages/DefaultUserPage';
import { LandingPage } from '../pages/LandingPage';

export const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.roles.includes(ROLES.ADMIN) || user?.roles.includes(ROLES.LUCAS)) {
    return <LandingPage />;
  }

  if (user?.roles.includes(ROLES.DEFAULT)) {
    return <DefaultUserPage />;
  }

  if (user?.roles.includes(ROLES.ADMIN)) {
    return <LandingPage />;
  }

  return <DefaultUserPage />;
};