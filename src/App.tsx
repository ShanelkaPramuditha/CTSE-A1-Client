import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import '@/styles/globals.css';
import { useAuth } from '@/hooks';
import { FullScreenLoader } from '@/components/loaders/full-screen';

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <FullScreenLoader />;
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
