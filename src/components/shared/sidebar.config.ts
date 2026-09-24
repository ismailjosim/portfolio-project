import {
  BookOpen,
  FolderKanban,
  Award,
  LayoutDashboard,
  MessageSquare,
  Mail,
  Settings,
} from 'lucide-react';

export const sidebarNav = [
  {
    title: 'Overview',
    url: '/overview',
    icon: LayoutDashboard,
  },
  {
    title: 'Blogs',
    url: '/blog',
    icon: BookOpen,
  },
  {
    title: 'Comments',
    url: '/comments',
    icon: MessageSquare,
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'Skills',
    url: '/skills',
    icon: Award,
  },
  {
    title: 'Newsletter',
    url: '/newsletter',
    icon: Mail,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export const sidebarUser = {
  name: 'Md. Jasim',
  email: 'dashboard@ismailjosim.com',
  avatar: '/person.jpeg',
};
