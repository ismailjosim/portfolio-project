import { Code2, Zap, Calendar, Award } from 'lucide-react';
import { ISkill } from '../../../models/Skill';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Badge } from '../../ui/badge';
import InfoRow from '../../shared/InfoRow';
import { Separator } from '../../ui/separator';
import { formatDateTime } from '../../../lib/formatters.ts';
import SkillIcon from '../../shared/SkillIcon';

interface ISkillViewDialogProps {
  open: boolean;
  onClose: () => void;
  skill: ISkill | null;
}

const SkillViewDetailDialog = ({ open, onClose, skill }: ISkillViewDialogProps) => {
  if (!skill) return null;

  const proficiencyColors: Record<'beginner' | 'intermediate' | 'advanced' | 'expert', string> = {
    beginner: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    expert: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col px-px py-5 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Skill Details</DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-2 pb-6">
          {/* Skill Header */}
          <div className="flex items-center gap-5 p-5 bg-linear-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg mb-6">
            <div className="p-3 rounded-xl bg-background shadow-xs border border-border">
              <SkillIcon icon={skill.icon} className="text-3xl" size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold mb-1">{skill.name}</h2>
              <p className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
                <span>{skill.category}</span>
              </p>
              <Badge className={`text-sm ${proficiencyColors[skill.proficiency]}`}>
                <Award className="h-3 w-3 mr-1" />
                {skill.proficiency.charAt(0).toUpperCase() + skill.proficiency.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {/* Skill Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Skill Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Code2 className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Name" value={skill.name} />
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow
                    label="Proficiency"
                    value={skill.proficiency.charAt(0).toUpperCase() + skill.proficiency.slice(1)}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Code2 className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Category" value={skill.category} />
                </div>
                {skill.yearsOfExperience !== undefined && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                    <InfoRow
                      label="Experience"
                      value={`${skill.yearsOfExperience} ${skill.yearsOfExperience === 1 ? 'year' : 'years'}`}
                    />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Zap className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Published" value={skill.isPublished ? 'Yes' : 'Draft'} />
                </div>
                {skill.icon && (
                  <div className="flex items-start gap-3">
                    <Code2 className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium">Icon</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <SkillIcon icon={skill.icon} size={18} className="shrink-0" />
                        <span className="text-sm font-medium">
                          {skill.icon.startsWith('http') || skill.icon.startsWith('/') || skill.icon.startsWith('data:')
                            ? 'Custom Uploaded Icon'
                            : skill.icon.startsWith('devicon-')
                            ? skill.icon
                                .replace('devicon-', '')
                                .replace('-plain', '')
                                .replace('-original', '')
                                .replace('colored', '')
                                .trim()
                            : skill.icon}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {skill.description && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">Description</h3>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="text-muted-foreground">{skill.description}</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Metadata */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Metadata</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Created" value={formatDateTime(skill.createdAt)} />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow
                    label="Updated"
                    value={formatDateTime(skill.updatedAt || skill.createdAt)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillViewDetailDialog;
