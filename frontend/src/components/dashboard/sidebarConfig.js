import {
  LayoutDashboard,
  Film,
  Layers,
  ListOrdered,
  Settings2,
  FolderKanban,
  DollarSign,
  Briefcase,
  FileText,
  UserCircle,
  PenSquare,
  BookOpen,
  Image,
  Search,
  Phone,
  Users,
  Shield,
  Clock,
  CheckSquare,
} from "lucide-react";

export const sidebarSections = [
  {
    label: "Homepage",
    items: [
      {
        key: "hero",
        label: "Hero Section",
        icon: LayoutDashboard,
        feature: "hero",
      },
      {
        key: "showcase",
        label: "Showcase Videos",
        icon: Film,
        feature: "showcase",
      },
      {
        key: "aboutTabs",
        label: "We Understand Tabs",
        icon: Layers,
        feature: "aboutTabs",
      },
      {
        key: "workProcess",
        label: "Work Process",
        icon: ListOrdered,
        feature: "workProcess",
      },
      {
        key: "serviceCards",
        label: "Service Cards",
        icon: Settings2,
        feature: "serviceCards",
      },
      {
        key: "projects",
        label: "Projects",
        icon: FolderKanban,
        feature: "projects",
      },
      {
        key: "pricing",
        label: "Pricing",
        icon: DollarSign,
        feature: "pricing",
      },
    ],
  },
  {
    label: "Content Pages",
    items: [
      {
        key: "servicesPage",
        label: "Services Page",
        icon: Briefcase,
        feature: "servicesPage",
      },
      {
        key: "aboutPage",
        label: "About Page",
        icon: FileText,
        feature: "aboutPage",
      },
      {
        key: "team",
        label: "Team Members",
        icon: UserCircle,
        feature: "team",
      },
      {
        key: "blog",
        label: "Blog Posts",
        icon: PenSquare,
        feature: "blog",
      },
      {
        key: "caseStudies",
        label: "Case Studies",
        icon: BookOpen,
        feature: "caseStudies",
      },
      {
        key: "portfolio",
        label: "Portfolio",
        icon: Image,
        feature: "portfolio",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      { key: "seo", label: "Page SEO", icon: Search, feature: "seo" },
      {
        key: "aiCalls",
        label: "AI Call Logs",
        icon: Phone,
        feature: "aiCalls",
      },
    ],
  },
  {
    label: "HR & Attendance",
    items: [
      {
        key: "myDashboard",
        label: "My Dashboard",
        icon: LayoutDashboard,
        feature: "attendance",
        adminOnly: false, // visible to everyone with attendance: view
      },
      {
        key: "attendance",
        label: "Attendance",
        icon: Clock,
        feature: "attendance",
        adminOnly: true, // only admins see the full overview
      },
      {
        key: "tasks",
        label: "Tasks",
        icon: CheckSquare,
        feature: "tasks",
        adminOnly: true, // only admins can assign/manage tasks
      },
    ],
  },
  {
    label: "Administration",
    adminOnly: true,
    items: [
      {
        key: "users",
        label: "User Management",
        icon: Users,
        feature: "users",
      },
      {
        key: "roles",
        label: "Role Management",
        icon: Shield,
        feature: "roles",
      },
    ],
  },
];