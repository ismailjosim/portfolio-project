'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Sparkles, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/lib/utils';

interface NewsletterSubscribeBoxProps {
  variant?: 'blog' | 'project' | 'default';
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function NewsletterSubscribeBox({
  variant = 'default',
  title,
  subtitle,
  className,
}: NewsletterSubscribeBoxProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const defaultTitle =
    variant === 'blog'
      ? 'Enjoyed this article?'
      : variant === 'project'
        ? 'Interested in real-world architecture?'
        : 'Stay in the loop with tech updates';

  const defaultSubtitle =
    variant === 'blog'
      ? 'Get hand-crafted engineering deep dives, production best practices, and new tutorial releases delivered straight to your inbox.'
      : variant === 'project'
        ? 'Subscribe to receive occasional write-ups on production case studies, system design breakdowns, and open-source releases.'
        : 'Join my newsletter for curated web development insights, software engineering tutorials, and project updates.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please provide a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Something went wrong. Please try again.');
        return;
      }

      setSubmittedEmail(email.trim());
      setSubscribed(true);
      toast.success(data.message || 'Confirmation email sent! Please check your inbox.');
      setEmail('');
      setName('');
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-br from-card/90 via-card/60 to-primary/5 p-6 sm:p-8 backdrop-blur-xl shadow-xl dark:border-slate-800/80 dark:bg-[#0A1124]/90',
        className
      )}
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10">
        {subscribed ? (
          <div className="flex flex-col items-center text-center py-4 space-y-3 animate-in fade-in-50 zoom-in-95 duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Check your inbox to confirm!</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                We sent a 24-hour verification link to{' '}
                <strong className="text-foreground">{submittedEmail}</strong>. Click the
                confirmation button in the email to activate your free subscription.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSubscribed(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Subscribe another email
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                <span>Developer Newsletter</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                {title || defaultTitle}
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {subtitle || defaultSubtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-4">
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="bg-background/60 border-border/80 text-sm h-11"
                  />
                </div>

                <div className="sm:col-span-5">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="pl-10 bg-background/60 border-border/80 text-sm h-11"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 font-semibold gap-1.5 shadow-md shadow-primary/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
                <span>🔒 No spam, ever. 1-click unsubscribe anytime.</span>
                <span>✨ Double opt-in verified</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
