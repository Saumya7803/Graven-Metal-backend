import { Navigate, useLocation } from 'react-router-dom';
import { RouteLoader } from '../ui/RouteLoader';
import { useCustomerAuth } from './AuthProvider';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isReady, isAuthenticated } = useCustomerAuth();

  if (!isReady) return <RouteLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
