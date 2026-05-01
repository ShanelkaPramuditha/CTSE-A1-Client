import { useAuth } from '@/hooks';
import { SignIn, SignUp } from '@/components/pages/auth';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { SignInSchema, SignUpSchema } from '@/schemas/auth/auth.schema';
import { Loader2Icon } from 'lucide-react';

type AuthViewMode = 'sign-in' | 'sign-up';

export const Route = createFileRoute('/$authView')({
  beforeLoad: ({
    params,
    context: {
      auth: { isAuthenticated },
    },
  }) => {
    const validViews: AuthViewMode[] = ['sign-in', 'sign-up'];

    if (isAuthenticated) {
      throw redirect({
        to: '/', // Changed from '/dashboard' to '/'
        replace: true,
      });
    }

    if (!validViews.includes(params.authView as AuthViewMode)) {
      throw redirect({
        to: '/$authView',
        params: { authView: 'sign-in' },
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { authView } = Route.useParams();
  const router = useRouter();
  const { login, register, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mode: AuthViewMode = authView === 'sign-up' ? 'sign-up' : 'sign-in';

  useEffect(() => {
    setErrorMessage(null);
  }, [mode]);

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <Loader2Icon className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  async function handleSignInSubmit(values: SignInSchema) {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });
      router.navigate({ to: '/', replace: true });
    } catch (error) {
      const err = error as { message?: string };
      setErrorMessage(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignUpSubmit(values: SignUpSchema) {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await register({
        email: values.email.trim(),
        password: values.password,
        name: values.name.trim(),
      });
      // Login after registration
      await login({
        email: values.email.trim(),
        password: values.password,
      });
      router.navigate({ to: '/', replace: true });
    } catch (error) {
      const err = error as { message?: string };
      setErrorMessage(err.message || 'Unable to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex h-full items-center justify-center'>
      {mode === 'sign-in' ? (
        <SignIn
          onSubmit={handleSignInSubmit}
          isSubmitting={isSubmitting}
          isPending={isLoading}
          errorMessage={errorMessage}
        />
      ) : (
        <SignUp
          onSubmit={handleSignUpSubmit}
          isSubmitting={isSubmitting}
          isPending={isLoading}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}
