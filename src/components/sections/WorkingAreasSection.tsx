'use client';

import FadeUp from '../ui/FadeUp';
import { Code2, ServerCog, Database, Layers, Users, Rocket } from 'lucide-react';
import { Card } from '../ui/card';
import type { IWorkArea } from '@/src/interface/content.interface';

const areas: IWorkArea[] = [
  {
    Icon: Code2,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-100 dark:bg-orange-500/20',
    title: 'Frontend Development',
    desc: 'Pixel-perfect, responsive UIs with React, Next.js, TypeScript, Tailwind CSS, and modern animation libraries.',
  },
  {
    Icon: ServerCog,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-500/20',
    title: 'Backend & API Development',
    desc: 'Scalable RESTful APIs with Node.js, Express.js, JWT auth, Redis caching, and cloud integrations.',
  },
  {
    Icon: Database,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-100 dark:bg-purple-500/20',
    title: 'Database Design',
    desc: 'Efficient schema design with MongoDB, Mongoose ODM, and PostgreSQL for performant data access.',
  },
  {
    Icon: Layers,
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-100 dark:bg-pink-500/20',
    title: 'Full Stack MERN Apps',
    desc: 'End-to-end application development with auth, payments (Stripe/SSLCommerz), real-time features, and deployment.',
  },
  {
    Icon: Users,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-100 dark:bg-yellow-500/20',
    title: 'Web Mentoring',
    desc: '1-on-1 or group mentoring for aspiring developers on React, Node.js, JavaScript, and career guidance.',
  },
  {
    Icon: Rocket,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-100 dark:bg-green-500/20',
    title: 'Deployment & DevOps',
    desc: 'Production-ready deployments on Vercel, Netlify, and Firebase with CI/CD and performance optimization.',
  },
];

export default function WorkingAreasSection() {
  return (
    <section
      id="workings"
      className="py-20 flex justify-center items-center scroll-mt-20 md:scroll-mt-24"
    >
      <div className="container mx-auto w-full px-6">
        <FadeUp>
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            What I do
          </p>
          <h2 className="text-4xl font-bold text-foreground mb-10">My Working Areas</h2>
        </FadeUp>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <FadeUp key={area.title} delay={i * 80}>
              <Card className="group flex flex-col p-8 h-full cursor-pointer border border-border hover:border-accent hover:shadow-xl active:scale-[0.98] active:border-accent active:shadow-md transition-all duration-300">
                {/* Icon */}
                <div
                  className={`w-14 h-14 mb-5 flex items-center justify-center rounded-2xl ${area.iconBg} transition-colors duration-300 group-hover:bg-accent group-active:bg-accent`}
                >
                  <area.Icon
                    size={22}
                    className={`transition-colors duration-300 ${area.iconColor} group-hover:text-white group-active:text-white`}
                  />
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold mb-2 text-foreground transition-colors group-hover:text-accent group-active:text-accent">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{area.desc}</p>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
