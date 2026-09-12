import FadeUp from '../ui/FadeUp';

const academic = [
  {
    title: 'Master of Business Administration',
    duration: '2022 - 2023',
    institution: 'National University, Bangladesh',
    major: 'Accounting',
    points: [
      'Specialized in advanced financial auditing, corporate tax laws, and strategic management.',
      'Developed high-level professional expertise in analyzing complex organizational structures.',
      'Refined leadership and project management capabilities within a business context.',
    ],
  },
  {
    title: 'Bachelor of Business Administration',
    institution: 'National University, Bangladesh',
    duration: '2016 - 2021',
    major: 'Accounting',
    points: [
      'Studied foundational accounting principles, cost management, and statistical analysis.',
      'Cultivated a disciplined, detail-oriented approach to data and financial reporting.',
      'Gained a comprehensive understanding of business operations and economic theory.',
    ],
  },
  {
    title: 'Higher Secondary Certificate (HSC)',
    institution: 'National Board of Bangladesh',
    duration: '2013 - 2015',
    major: 'Business Studies',
    points: [
      'Completed secondary education with a focus on Business Organization, Management, and Accounting.',
      'Developed strong quantitative reasoning and mathematical problem-solving skills.',
      'Built a solid foundation in professional communication and business ethics.',
    ],
  },
];

const certifications = [
  {
    title: 'Computer Science Fundamentals',
    sub: 'Phitron · Technical Training',
    status: 'Certified',
    points: [
      'Rigorous study of Data Structures (Arrays, Linked Lists, Trees, Graphs) and Algorithms.',
      'Focused on problem-solving with C++ and understanding memory management.',
      'Strengthened logic building through competitive programming challenges.',
    ],
  },
  {
    title: 'Next Level Web Development',
    sub: 'Programming Hero · Advanced Course',
    status: 'Certified',
    points: [
      'Mastered advanced TypeScript, Next.js (App Router), and Prisma ORM for type-safe applications.',
      'Deep dive into Redux state management and performance optimization for complex frontends.',
      'Architected scalable full-stack applications with high-level backend integration.',
    ],
  },
  {
    title: 'Complete Web Development Course',
    sub: 'Programming Hero · Full Stack Bootcamp',
    status: 'Certified',
    points: [
      'Comprehensive training in MERN stack (MongoDB, Express, React, Node.js).',
      'Developed 15+ real-world projects including e-commerce platforms and dashboard systems.',
      'Gained proficiency in Firebase authentication, responsive UI design, and RESTful APIs.',
    ],
  },
];

export default function EducationSection() {
  return (
    <section
      id="education"
      className="py-20 flex justify-center items-center scroll-mt-20 md:scroll-mt-24"
    >
      <div className="container mx-auto w-full px-6">
        <FadeUp>
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            Learning Path
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            Education & Qualifications
          </h2>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Academic Column */}
          <FadeUp delay={100}>
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-bold text-foreground">Academic Education</h3>
                <div className="h-px grow bg-border mt-1"></div>
              </div>

              <div className="space-y-10">
                {academic.map((item) => (
                  <div key={item.title} className="relative pl-6 border-l-2 border-accent/20">
                    {/* Timeline Dot */}
                    <div className="absolute -left-2.25 top-1 h-4 w-4 rounded-full border-2 border-accent bg-background" />

                    <h4 className="font-bold text-lg text-foreground leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm font-medium text-accent mt-1">
                      {item.major} · {item.institution}
                      <span className="block md:inline md:ml-2 text-muted-foreground font-normal">
                        ({item.duration})
                      </span>
                    </p>

                    <ul className="mt-4 space-y-2">
                      {item.points.map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2 mt-1.5 h-1 w-2 bg-accent/50 rounded-full shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Certifications Column */}
          <FadeUp delay={200}>
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-bold text-foreground">Professional Certifications</h3>
                <div className="h-px grow bg-border mt-1"></div>
              </div>

              <div className="space-y-10">
                {certifications.map((item) => (
                  <div key={item.title} className="relative pl-6 border-l-2 border-accent/20">
                    {/* Timeline Dot */}
                    <div className="absolute -left-2.25 top-1 h-4 w-4 rounded-full border-2 border-accent bg-background" />

                    <h4 className="font-bold text-lg text-foreground leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm font-medium text-accent italic mb-2">{item.sub}</p>

                    {/* <div className="mt-2 mb-3">
											<span className='inline-flex items-center bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-green-500/20'>
												✓ {item.status}
											</span>
										</div> */}

                    <ul className="space-y-2">
                      {item.points.map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2 mt-1.5 h-1 w-2 bg-accent/50 rounded-full shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
