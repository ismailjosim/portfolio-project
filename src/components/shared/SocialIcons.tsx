import {
  Mail,
  Github,
  Linkedin,
  Facebook,
  X,
  Phone,
  MessageCircleMore,
  Youtube,
} from 'lucide-react';
import { Button } from '../ui/button';

type SocialButtonProps = {
  href: string;
  label: string;
  icon: React.ElementType;
  hoverColorClass?: string;
};

function SocialButton({ href, label, icon: Icon, hoverColorClass }: SocialButtonProps) {
  const isExternal = href.startsWith('http');

  return (
    <Button
      asChild
      size="icon"
      className={`h-9 w-9 rounded-lg border border-border text-muted-foreground bg-transparent transition-all duration-200 hover:text-white active:scale-90 cursor-pointer ${hoverColorClass || 'hover:bg-accent hover:border-accent'}`}
    >
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        title={label}
      >
        <Icon className="w-4 h-4" />
      </a>
    </Button>
  );
}

const SocialIcons = {
  Email: () => (
    <SocialButton
      href="mailto:ismailjosim@yahoo.com"
      label="Email"
      icon={Mail}
      hoverColorClass="hover:bg-[#EA4335] hover:border-[#EA4335]"
    />
  ),

  Github: () => (
    <SocialButton
      href="https://github.com/ismailjosim"
      label="GitHub"
      icon={Github}
      hoverColorClass="hover:bg-[#181717] hover:border-[#181717]"
    />
  ),

  Linkedin: () => (
    <SocialButton
      href="https://www.linkedin.com/in/ismailjosim/"
      label="LinkedIn"
      icon={Linkedin}
      hoverColorClass="hover:bg-[#0A66C2] hover:border-[#0A66C2]"
    />
  ),

  Facebook: () => (
    <SocialButton
      href="https://www.facebook.com/ismailjosim99"
      label="Facebook"
      icon={Facebook}
      hoverColorClass="hover:bg-[#1877F2] hover:border-[#1877F2]"
    />
  ),

  Twitter: () => (
    <SocialButton
      href="https://x.com/ismail_josim"
      label="X (Twitter)"
      icon={X}
      hoverColorClass="hover:bg-black hover:border-black"
    />
  ),
  Phone: () => (
    <SocialButton
      href="tel:+8801715052808"
      label="Phone"
      icon={Phone}
      hoverColorClass="hover:bg-green-600 hover:border-green-600"
    />
  ),
  WhatsApp: () => (
    <SocialButton
      href="https://wa.me/8801715052808"
      label="WhatsApp"
      icon={MessageCircleMore}
      hoverColorClass="hover:bg-[#25D366] hover:border-[#25D366]"
    />
  ),
  Youtube: () => (
    <SocialButton
      href="https://youtube.com/"
      label="YouTube"
      icon={Youtube}
      hoverColorClass="hover:bg-[#FF0000] hover:border-[#FF0000]"
    />
  ),
};

export default SocialIcons;
