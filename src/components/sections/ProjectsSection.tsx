'use client';
import { useEffect, useState } from 'react';
import FadeUp from '../ui/FadeUp';
import { Button } from '../ui/button';
import { EmptyState, ProjectListSkeleton } from '../shared/PublicDataSkeletons';
import ProjectShowcaseCard from '../projects/ProjectShowcaseCard';

interface IProject {
  _id: string;
  name: string;
  subtitle: string;
  title: string;
  type: string;
  image: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  createdAt?: string;
  slug?: string;
}

interface ProjectDisplay extends IProject {
  reverse?: boolean;
  bullets: string[];
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects?limit=3');
        const data = await response.json();

        if (data.projects && data.projects.length > 0) {
          const displayProjects: ProjectDisplay[] = data.projects.map(
            (project: IProject, index: number) => ({
              ...project,
              reverse: index % 2 !== 0,
              bullets: project.features.slice(0, 3),
            })
          );

          setProjects(displayProjects);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-20 md:px-6 px-2 scroll-mt-20 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeUp>
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            Things I&apos;ve built
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed">
            A selection of projects I&apos;ve worked on, showcasing modern engineering principles
            and user-centric solutions.
          </p>
        </FadeUp>

        {/* Projects Grid */}
        {loading ? (
          <ProjectListSkeleton count={3} />
        ) : projects.length === 0 ? (
          <EmptyState
            icon="projects"
            title="No featured projects yet"
            description="Featured work will appear here once projects are published."
          />
        ) : (
          <div className="space-y-12">
            {projects.map((project, i) => (
              <FadeUp key={project._id} delay={i * 100}>
                <ProjectShowcaseCard
                  project={project}
                  reverse={project.reverse}
                  priority={i === 0}
                />
              </FadeUp>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <FadeUp delay={300}>
          <div className="mt-16 flex flex-col items-center gap-6">
            <Button asChild size="lg">
              <a href="/all-projects">View All Projects</a>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Explore more projects and solutions I&apos;ve built
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default ProjectsSection;
