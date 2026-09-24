'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Sparkles, ArrowRight, Loader2, Send, User, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import FadeUp from '../ui/FadeUp';

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
    <section id="newsletter" className="py-20 md:px-6 px-2 scroll-mt-20 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header (Matches ProjectsSection Header) */}
        <FadeUp className="text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            Stay Connected
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            Join the Newsletter
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed mx-auto">
            Get exclusive access to my latest articles, project breakdowns, and tech insights
            delivered straight to your inbox. No spam, just value.
          </p>
        </FadeUp>

        <FadeUp delay={100}>
          {/* Main Newsletter Card (Matches ProjectShowcaseCard) */}
          <article className="group relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10 active:scale-[0.99] dark:border-slate-800/60 dark:bg-[#0B1329] dark:text-slate-100 dark:hover:border-primary/30 dark:hover:shadow-primary/5">
            <div className="relative grid grid-cols-1 lg:grid-cols-12">
              {/* Left Visual Column */}
              <div className="project-visual relative flex min-h-80 lg:min-h-100 flex-col items-center justify-center overflow-hidden border-b border-border bg-slate-950 lg:col-span-5 lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-[#070D1E] p-8 text-center">
                {/* Glow effects */}
                <div className="absolute right-0 top-0 z-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80 dark:bg-primary/20" />
                <div className="absolute left-0 bottom-0 z-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />

                {/* Visual Elements */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
                  <div className="relative flex items-center justify-center size-24 md:size-28 rounded-full border border-white/10 bg-slate-900/80 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                    <Mail
                      className="size-10 md:size-12 text-accent dark:text-primary transition-colors duration-300"
                      strokeWidth={1.5}
                    />
                    <div className="absolute -top-1 -right-1 flex items-center justify-center size-8 rounded-full bg-emerald-500 text-white shadow-lg border-2 border-slate-900 animate-bounce">
                      <Bell className="size-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      Dev Digest
                    </h3>
                    <p className="mt-3 text-sm font-normal leading-relaxed text-slate-300 drop-shadow-md max-w-62.5">
                      Weekly insights, tutorials, and deep dives for modern developers.
                    </p>
                  </div>
                </div>

                {/* Badges mimicking Project Visual */}
                <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                    Active
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 font-mono text-[11px] text-accent backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/90 dark:text-primary">
                    <Sparkles className="h-3 w-3" />
                    Free Forever
                  </div>
                </div>
              </div>

              {/* Right Content Column (Form) */}
              <div className="relative flex flex-col justify-center bg-card p-6 sm:p-8 lg:p-12 lg:col-span-7 dark:bg-[#0A1124]">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl dark:bg-primary/5" />

                <div className="relative z-10 w-full max-w-md mx-auto lg:max-w-none">
                  {/* Internal Header Label */}
                  <div className="mb-8">
                    <span className="inline-flex rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent dark:border-primary/30 dark:bg-primary/10 dark:text-primary">
                      Subscription
                    </span>
                    <h3 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground dark:text-white">
                      Never miss an update.
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground dark:text-slate-300">
                      Join a growing community of developers. Unsubscribe at any time with a single
                      click.
                    </p>
                  </div>

                  {subscribed ? (
                    <div className="bg-background/80 border border-border rounded-xl p-6 md:p-8 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500">
                      <div className="flex items-center justify-center size-12 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                        <Send className="size-5" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground">Check your inbox!</h4>
                      <p className="text-muted-foreground text-sm text-center">
                        We&apos;ve sent a confirmation link to{' '}
                        <strong className="text-foreground">{submittedEmail}</strong>. Please click
                        it to verify.
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground text-xs mt-2"
                        onClick={() => {
                          setSubscribed(false);
                          setSubmittedEmail('');
                        }}
                      >
                        Use a different email address
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4" id="newsletter-form">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="newsletter-name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 h-12 text-sm rounded-lg border-border/80 bg-background/80 backdrop-blur-sm focus-visible:ring-accent focus-visible:border-accent dark:bg-slate-950/60 dark:border-slate-800"
                            disabled={loading}
                            autoComplete="given-name"
                          />
                        </div>
                        <div className="relative flex-1">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="newsletter-email"
                            type="email"
                            placeholder="Email address..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 text-sm rounded-lg border-border/80 bg-background/80 backdrop-blur-sm focus-visible:ring-accent focus-visible:border-accent dark:bg-slate-950/60 dark:border-slate-800"
                            required
                            disabled={loading}
                            autoComplete="email"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        id="newsletter-submit-btn"
                        className="w-full h-12 rounded-lg text-sm font-semibold group shadow-md transition-all duration-300 hover:shadow-accent/20"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Subscribe
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </article>
        </FadeUp>
      </div>
    </section>
  );
}
