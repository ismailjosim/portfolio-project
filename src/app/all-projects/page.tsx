'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import FadeUp from '@/src/components/ui/FadeUp';
import Navbar from '@/src/components/shared/Navbar';
import Footer from '@/src/components/shared/Footer';
import ScrollToTop from '@/src/components/ui/ScrollToTop';
import { EmptyState, ProjectListSkeleton } from '@/src/components/shared/PublicDataSkeletons';
import ProjectShowcaseCard from '@/src/components/projects/ProjectShowcaseCard';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';

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

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects?limit=100');
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

  // Compute unique categories dynamically
  const categories = useMemo(() => {
    const types = new Set<string>();
    projects.forEach((p) => {
      if (p.type) types.add(p.type);
    });
    return ['all', ...Array.from(types)];
  }, [projects]);

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (project.type && project.type.toLowerCase() === selectedCategory.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesSearch =
        project.name?.toLowerCase().includes(query) ||
        project.title?.toLowerCase().includes(query) ||
        project.subtitle?.toLowerCase().includes(query) ||
        project.technologies?.some((tech) => tech.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen transition-all duration-300 bg-background pt-8">
        <section className="py-20 px-2 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <FadeUp>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="w-4 h-4" />
                </span>
                <p className="text-xs font-semibold tracking-widest uppercase text-accent">
                  Full Engineering Showcase
                </p>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 tracking-tight">
                All Projects & Case Studies
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                Explore full-stack web applications, SaaS platforms, and developer tooling
                engineered with clean architecture, robust testing, and modern design principles.
              </p>
            </FadeUp>

            {/* Filter & Search Bar */}
            <FadeUp delay={100}>
              <div className="mb-12 p-4 md:p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
                {/* Search Input */}
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search projects by name, keywords, or tech stack (e.g. Next.js, TypeScript, MongoDB)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-12 w-full rounded-xl bg-background/80 border-border text-sm md:text-base placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Categories */}
                {categories.length > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                      <span>Filter:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className={`rounded-xl text-xs h-8 px-3 transition-all cursor-pointer ${
                            selectedCategory === category
                              ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {category === 'all' ? 'All Projects' : category}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FadeUp>

            {/* Results Counter */}
            {!loading && (
              <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Showing <strong className="text-foreground">{filteredProjects.length}</strong> of{' '}
                  <strong className="text-foreground">{projects.length}</strong> projects
                </span>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Clear active filters
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <ProjectListSkeleton count={4} />
            ) : filteredProjects.length === 0 ? (
              <EmptyState
                icon="projects"
                title="No matching projects found"
                description="Try adjusting your search keywords or switching category filters."
              />
            ) : (
              <div className="space-y-12">
                {filteredProjects.map((project, i) => (
                  <FadeUp key={project._id} delay={i * 50}>
                    <ProjectShowcaseCard
                      project={project}
                      reverse={project.reverse}
                      priority={i === 0}
                    />
                  </FadeUp>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <ScrollToTop />
      <Footer />
    </>
  );
}
