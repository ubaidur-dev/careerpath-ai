import {
  Code2,
  BarChart3,
  PenTool,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Search,
  Zap,
  ShieldCheck,
  Smartphone,
  Globe,
  Cpu,
  Brain,
  Microscope,
  Lightbulb,
  Stethoscope,
  Bot,
  Flame,
  GraduationCap,
  Building2,
  HeartPulse,
  Scale,
  Wrench,
  Palette,
  Camera,
  Film,
  Plane,
  Truck,
  Compass,
  Headphones,
  FileText,
  Database,
  Server,
  Terminal,
  Lock,
  Activity,
  HelpCircle
} from 'lucide-react';

export const CAREER_ICON_MAP = {
  Code2,
  BarChart3,
  PenTool,
  Briefcase,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Search,
  SearchIcon: Search,
  Zap,
  ShieldCheck,
  Smartphone,
  Globe,
  Cpu,
  Brain,
  Microscope,
  Lightbulb,
  Stethoscope,
  Bot,
  Flame,
  GraduationCap,
  Building2,
  HeartPulse,
  Scale,
  Wrench,
  Palette,
  Camera,
  Film,
  Plane,
  Truck,
  Compass,
  Headphones,
  FileText,
  Database,
  Server,
  Terminal,
  Lock,
  Activity
};

export function getCareerIcon(iconKey) {
  return CAREER_ICON_MAP[iconKey] || HelpCircle;
}

export const getDemandBadgeProps = (demandStr = '') => {
  const lower = (demandStr || '').toLowerCase();
  
  if (lower.includes('very high')) {
    return {
      bgClass: 'bg-[#F8FFF8]',
      textClass: 'text-[#00CF56]',
      borderClass: 'border-[#00CF56]',
      Icon: TrendingUp,
      iconColor: 'text-[#00CF56]'
    };
  }
  if (lower.includes('high')) {
    return {
      bgClass: 'bg-[#F5F8FF]',
      textClass: 'text-[#0047FF]',
      borderClass: 'border-[#0047FF]',
      Icon: TrendingUp,
      iconColor: 'text-[#0047FF]'
    };
  }
  if (lower.includes('medium')) {
    return {
      bgClass: 'bg-[#FFFDE3]',
      textClass: 'text-[#CF7900]',
      borderClass: 'border-[#CF7900]',
      Icon: TrendingUp,
      iconColor: 'text-[#CF7900]'
    };
  }
  if (lower.includes('low')) {
    return {
      bgClass: 'bg-[#FFF7F7]',
      textClass: 'text-[#DC2626]',
      borderClass: 'border-[#DC2626]',
      Icon: TrendingDown,
      iconColor: 'text-[#DC2626]'
    };
  }

  return {
    bgClass: 'bg-[#F5F8FF]',
    textClass: 'text-[#0047FF]',
    borderClass: 'border-[#0047FF]',
    Icon: TrendingUp,
    iconColor: 'text-[#0047FF]'
  };
};

export const CAREER_CARD_ICON_BG = 'bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]';
export const CAREER_CARD_ICON_COLOR = 'text-[#FF2D55]';

export const CAREER_DETAILS_ICON_BG = 'border-2 border-pink-200 bg-pink-50/40';
export const CAREER_DETAILS_ICON_COLOR = 'text-purple-600';
