'use client';

import { Award, Star, Users, Code2, FileCheck, Video, Sparkles, CheckCircle2 } from 'lucide-react';
import FadeUp from '../ui/FadeUp';

const CORE_STATS = [
  {
    value: '14,777',
    label: 'Live Problems Solved',
    description: 'Real-time debugging, algorithmic troubleshooting, and technical unblocking.',
    icon: Code2,
    iconBg: 'bg-blue-500/10 text-blue-500',
  },
  {
    value: '11,201',
    label: 'Projects & Assignments Checked',
    description: 'Thorough PR reviews, architectural guidance, and clean code evaluations.',
    icon: FileCheck,
    iconBg: 'bg-purple-500/10 text-purple-500',
  },
  {
    value: '1,500+ hrs',
    label: 'Live Training Sessions',
    description: 'Interactive workshops and masterclasses on React, Next.js, and MongoDB.',
    icon: Video,
    iconBg: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    value: '2,000+',
    label: 'Developers Mentored',
    description: 'Empowering aspiring engineers to transition into high-impact tech roles.',
    icon: Users,
    iconBg: 'bg-rose-500/10 text-rose-500',
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="impact"
      className="py-20 px-4 md:px-8 scroll-mt-20 md:scroll-mt-24 bg-card/30 border-y border-border/40"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-accent mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Instructional Impact &amp; Recognition
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              Instructor Excellence &amp; Mentorship Milestones
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Recognized with the <strong>Instructor Excellence Award</strong> at Programming Hero
              for sustained commitment to student success, deep technical coaching, and hands-on
              code reviews.
            </p>
          </div>
        </FadeUp>

        {/* Featured Award Bento Card */}
        <FadeUp delay={100}>
          <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-linear-to-br from-card via-card to-primary/10 border border-primary/30 shadow-lg mb-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Award Info */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 shadow-md">
                  <Award className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Honored Recognition
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Programming Hero Web Instruction
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                    Instructor Excellence Award
                  </h3>

                  <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
                    Awarded in recognition of exceptional instructional delivery, dedication to
                    resolving real-world programming roadblocks, and maintaining a high standard of
                    educational mentorship across comprehensive MERN and full-stack curricula.
                  </p>
                </div>
              </div>

              {/* Rating Card */}
              <div className="lg:border-l lg:border-border/60 lg:pl-8 flex flex-col justify-center shrink-0">
                <div className="p-5 rounded-2xl bg-background/60 border border-border/80 backdrop-blur-xs flex flex-col items-center text-center">
                  <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                    Average Session Rating
                  </span>

                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-4xl md:text-5xl font-black text-foreground">4.5</span>
                    <span className="text-sm text-muted-foreground font-semibold">/ 5.0</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 my-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <Star className="w-4 h-4 fill-amber-400/50 text-amber-400" />
                  </div>

                  <span className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified Learner Feedback
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Core Stats Grid */}
        <FadeUp delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CORE_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-md transition-all group"
                >
                  <div>
                    <div
                      className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
                      {stat.value}
                    </div>

                    <h4 className="text-sm md:text-base font-semibold text-foreground mb-1">
                      {stat.label}
                    </h4>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
