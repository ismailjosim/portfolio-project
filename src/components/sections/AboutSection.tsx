'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import FadeUp from '../ui/FadeUp';
import { Phone, MapPin, Mail, Languages } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// --------------------------
// Info Interface
// --------------------------
interface AboutInfo {
  label: string;
  value: string;
  icon: LucideIcon;
}

// --------------------------
// Info Data
// --------------------------
const aboutInfo: AboutInfo[] = [
  { label: 'Location', value: 'Bangladesh', icon: MapPin },
  { label: 'Phone', value: '+880-1715-052-808', icon: Phone },
  { label: 'Email', value: 'ismailjosim@yahoo.com', icon: Mail },
  { label: 'Languages', value: 'EN / BN / HI', icon: Languages },
];

const aboutImages = [
  '/slide01.jpeg',
  '/slide02.jpeg',
  '/slide03.jpeg',
  '/slide04.jpeg',
  '/slide05.jpeg',
  '/slide06.jpeg',
  '/slide07.jpeg',
  '/slide08.jpeg',
  '/slide09.jpeg',
  '/slide10.jpeg',
  '/slide11.jpg',
  '/slide12.jpeg',
  '/slide13.jpeg',
  '/slide14.jpeg',
  '/slide15.jpeg',
  '/slide16.jpeg',
  '/slide17.jpeg',
  '/slide18.jpeg',
  '/slide19.jpeg',
  '/slide20.jpg',
];

// --------------------------
// Component
// --------------------------
export default function AboutSection() {
  const swiperRef = useRef<HTMLDivElement>(null);

  // --------------------------
  // Slideshow Logic
  // --------------------------
  useEffect(() => {
    const slides = swiperRef.current?.querySelectorAll<HTMLElement>('.slide-image');
    if (!slides || slides.length === 0) return;

    let current = 0;
    slides[0].classList.add('opacity-100');

    const interval = setInterval(() => {
      slides[current].classList.remove('opacity-100');
      slides[current].classList.add('opacity-0');

      current = (current + 1) % slides.length;

      slides[current].classList.remove('opacity-0');
      slides[current].classList.add('opacity-100');
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
      className="sm:min-h-screen flex items-center px-2 md:px-6 py-16 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <FadeUp>
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            Get to know me
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
            About Me
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:gap-16 md:gap-10 gap-6 items-start mt-10">
          {/* LEFT CONTENT */}
          <FadeUp delay={100}>
            <div className="space-y-5">
              <p className="text-muted-foreground sm:text-lg sm:text-justify leading-relaxed">
                I’m a passionate{' '}
                <span className="text-primary font-semibold">Full Stack Developer</span> based in
                Bangladesh, specializing in the MERN stack. Currently serving as a{' '}
                <span className="text-primary font-semibold">
                  Senior Web Instructor at Programming Hero
                </span>
                , I lead advanced workshops and mentor aspiring developers.
              </p>

              <p className="text-muted-foreground sm:text-lg sm:text-justify leading-relaxed">
                I thrive at the intersection of clean code and impactful teaching. Whether building
                scalable APIs, architecting frontend systems, or designing curriculum — I bring
                precision and clarity to everything I do.
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
                {aboutInfo.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-primary/10">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* RIGHT SLIDESHOW */}
          <FadeUp delay={200}>
            <div ref={swiperRef} className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              {aboutImages.map((item, i) => (
                <Image
                  key={i}
                  src={item}
                  alt={`About slide ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="slide-image absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000"
                />
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
