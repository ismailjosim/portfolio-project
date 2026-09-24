'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Sparkles, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import FadeUp from '../ui/FadeUp';

const BENEFITS = [
  '📰 Weekly tech roundup — what happened this week in the dev world',
  '💡 Tips & tricks from real-world projects',
  '🔧 Tool recommendations & deep dives',
  '🚀 Early access to my new blog posts',
];

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address.');
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

      const userEmail = email.trim();
      setSubmittedEmail(userEmail);
      toast.success(data.message || 'Please check your inbox to confirm your subscription!');
      setSubscribed(true);
      setEmail('');
      setName('');
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="py-20 scroll-mt-20 md:scroll-mt-24 relative overflow-hidden"
    >
      {/* Decorative background gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-175 h-100 rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-100 h-75 rounded-full bg-primary/5 blur-[80px]" />
      </div>

      <div className="container mx-auto max-w-4xl px-6">
        <FadeUp>
          <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-xl p-8 md:p-12">
            {/* Accent border glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-accent/10"
            />

            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left: Copy */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  Weekly Newsletter
                </div>

                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                    Stay ahead in <span className="text-accent">tech & dev</span>
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    Every week I curate the most useful things happening in the tech world —
                    delivered straight to your inbox. No spam, unsubscribe anytime.
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {BENEFITS.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Form */}
              <div>
                {subscribed ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
                    <div className="flex items-center justify-center size-14 rounded-full bg-accent/15 text-accent border border-accent/20">
                      <Mail className="size-7" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      Please confirm your email address
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                      I just sent a confirmation email to{' '}
                      <strong className="text-foreground font-mono">{submittedEmail}</strong>. Click the
                      link in the email to complete your subscription.
                    </p>
                    <div className="rounded-lg bg-muted/60 border border-border/70 p-3 text-xs text-muted-foreground max-w-sm">
                      No email? Check your spam folder and add{' '}
                      <span className="text-foreground font-medium">
                        newsletter@contact.ismailjosim.com
                      </span>{' '}
                      to your contacts.
                    </div>
                    <p className="text-sm font-medium text-foreground">Thanks! ✌️</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground text-xs mt-1"
                      onClick={() => {
                        setSubscribed(false);
                        setSubmittedEmail('');
                      }}
                    >
                      Subscribe another email
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" id="newsletter-form">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="newsletter-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Your name{' '}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <Input
                        id="newsletter-name"
                        type="text"
                        placeholder="Ismail"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        autoComplete="given-name"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="newsletter-email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email address <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newsletter-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9"
                          required
                          disabled={loading}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full group"
                      disabled={loading}
                      id="newsletter-submit-btn"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Subscribing…
                        </>
                      ) : (
                        <>
                          Subscribe — it&apos;s free
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      No spam. Weekly digest only. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
