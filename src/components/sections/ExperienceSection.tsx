import FadeUp from '../ui/FadeUp';

const experiences = [
  {
    title: 'Senior Web Instructor',
    company: 'Programming Hero — Remote, Bangladesh',
    period: 'Apr 2025 – Present',
    bullets: [
      'Led advanced MERN stack workshops and supported junior instructors',
      'Reviewed and improved course content for technical quality & industry alignment',
    ],
  },
  {
    title: 'Web Instructor',
    company: 'Programming Hero — Remote, Bangladesh',
    period: 'Jul 2023 – Apr 2025',
    bullets: [
      'Taught full-stack development to 1000+ students (React, Node.js, Express.js, MongoDB)',
      'Delivered live coding support sessions and designed project-based learning modules',
      'Developed curriculum materials and conducted debugging workshops',
    ],
  },
  {
    title: 'Web Instructor (Intern)',
    company: 'Programming Hero — Remote, Bangladesh',
    period: 'Apr 2023 – Jun 2023',
    bullets: [
      'Assisted in live classes, demo projects, and debugging tasks',
      'Gained hands-on experience with educational content delivery',
    ],
  },
  {
    title: 'Web Developer (Intern)',
    company: 'Winsple — Remote, Bengaluru, India',
    period: 'Jan 2023 – Feb 2023',
    bullets: [
      'Built React-based web applications and integrated REST APIs for production',
      'Collaborated with backend developers on cross-functional team projects',
    ],
  },
];

const stats = [
  {
    value: '3+',
    label: 'Years Experience',
    colorVar: '--badge-tools-color',
    bgVar: '--badge-tools-bg',
  },
  {
    value: '2000+',
    label: 'Students Mentor',
    colorVar: '--badge-frontend-color',
    bgVar: '--badge-frontend-bg',
  },
  {
    value: '150+',
    label: 'Github Repositories',
    colorVar: '--badge-career-color',
    bgVar: '--badge-career-bg',
  },
  {
    value: '10+',
    label: 'Full Stack Project',
    colorVar: '--badge-backend-color',
    bgVar: '--badge-backend-bg',
  },
  {
    value: '11200+',
    label: 'Student Problems Solved',
    colorVar: '--accent',
    bgVar: '--tech-bg',
  },
  {
    value: '1500+',
    label: 'Hours Live Session',
    colorVar: '--badge-career-color',
    bgVar: '--badge-career-bg',
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-16 sm:py-20 lg:py-24 scroll-mt-20 md:scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <p className="uppercase tracking-widest text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3">
            My journey
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-foreground">
            Work Experience
          </h2>
        </FadeUp>

        <div className="lg:grid flex flex-col-reverse md:grid-cols-2 gap-10">
          {/* Experiences */}
          <FadeUp delay={100}>
            <div className="space-y-10">
              {experiences.map((exp) => (
                <div key={exp.title} className="timeline-item">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">{exp.title}</h3>
                      <p className="font-semibold text-sm sm:text-base text-accent">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-foreground py-1 px-3.5 inline-block font-medium rounded-2xl bg-primary text-sm">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm sm:text-base mt-3 list-disc list-inside text-muted-foreground">
                    {exp.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Stats */}
          <FadeUp delay={200}>
            <div className="grid grid-cols-2 gap-6">
              {stats.map(({ value, label, colorVar, bgVar }) => (
                <div
                  key={label}
                  className="text-center p-6 sm:p-8 md:p-12 rounded-2xl"
                  style={{ background: `var(${bgVar})` }}
                >
                  <div
                    className="text-2xl sm:text-4xl md:text-5xl font-black mb-2"
                    style={{ color: `var(${colorVar})` }}
                  >
                    {value}
                  </div>
                  <div className="font-medium text-muted-foreground text-sm sm:text-base">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
