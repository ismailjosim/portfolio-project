import { Code2, Zap, Link, Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import { IProject } from '../../../types/project.interface';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Badge } from '../../ui/badge';
import InfoRow from '../../shared/InfoRow';
import { Separator } from '../../ui/separator';
import { formatDateTime } from '@/src/lib/formatters';

interface IProjectViewDialogProps {
  open: boolean;
  onClose: () => void;
  project: IProject | null;
}

const ProjectViewDetailDialog = ({ open, onClose, project }: IProjectViewDialogProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full max-h-[90vh] flex flex-col px-px py-5 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Project Details</DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-2 pb-6">
          {/* Project Header */}
          <div className="flex flex-col gap-4 p-5 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg mb-6">
            {project.image && (
              <Image
                src={project.image}
                alt={project.title}
                width={1200}
                height={300}
                className="w-full h-48 rounded-lg object-cover border-4 border-white shadow-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-2 wrap-break-word">{project.title}</h2>
              <p className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
                <Code2 className="h-4 w-4 shrink-0" />
                <span>{project.type}</span>
              </p>
              {project.subtitle && (
                <p className="text-sm text-muted-foreground mb-3">{project.subtitle}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Project Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Project Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Code2 className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Name" value={project.name} />
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Type" value={project.type} />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Created On" value={formatDateTime(project.createdAt as string)} />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow
                    label="Last Updated"
                    value={formatDateTime(project.updatedAt as string)}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Featured" value={project.featured ? 'Yes' : 'No'} />
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Published" value={project.isPublished ? 'Yes' : 'No'} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {project.description && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-lg">Description</h3>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold text-lg">Technologies</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 bg-muted/50 p-4 rounded-lg">
                    {project.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <Code2 className="h-3 w-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-lg">Features</h3>
                  </div>
                  <ul className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Zap className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />
              </>
            )}

            {/* Links */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Link className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-lg">Links</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
                  >
                    <Github className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">GitHub Repository</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">Live Demo</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                )}
                {!project.githubUrl && !project.liveUrl && (
                  <p className="text-sm text-muted-foreground">No links available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectViewDetailDialog;
