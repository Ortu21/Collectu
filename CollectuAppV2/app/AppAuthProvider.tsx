import { AuthProvider } from '../hooks/useAuth';

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
