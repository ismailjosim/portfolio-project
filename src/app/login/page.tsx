import type { Metadata } from 'next';
import LoginForm from '../../components/shared/LoginForm';

export const metadata: Metadata = {
  title: 'Dashboard Access — Authentication Portal',
  description: 'Secure authentication portal for portfolio administration.',
  robots: {
    index: false,
    follow: false,
  },
};

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ from?: string }> }) => {
  const resolvedParams = await searchParams;
  const from = resolvedParams?.from || '/dashboard';

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="blob w-125 h-125 bg-accent -top-25 -left-25" />
        <div className="blob w-100 h-100 bg-primary -bottom-20 -right-20" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <span className="text-4xl">✌️</span>
            <h1
              className="mt-3 text-3xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Dashboard Access
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>

          <LoginForm from={from} />
        </div>

        {/* Bottom hint */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          This area is restricted to authorized users only.
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
