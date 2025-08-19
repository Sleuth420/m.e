'use client';

import {
  Code,
  Shield,
  Wrench,
  Store,
  Zap,
  Heart,
  Database,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Microchip,
  Home,
  Palette,
  Camera,
  Building,
  Leaf,
  Gamepad2,
  Globe,
  Users,
  Sparkles,
} from 'lucide-react';

export type IconName =
  | 'Code'
  | 'Shield'
  | 'Wrench'
  | 'Store'
  | 'Zap'
  | 'Heart'
  | 'Database'
  | 'ExternalLink'
  | 'Github'
  | 'Mail'
  | 'MapPin'
  | 'Microchip'
  | 'Home'
  | 'Palette'
  | 'Camera'
  | 'Building'
  | 'Leaf'
  | 'Gamepad2'
  | 'Globe'
  | 'Users'
  | 'Sparkles';

interface IconSelectorProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function IconSelector({ name, className = '', size = 24 }: IconSelectorProps) {
  const icons = {
    Code: <Code size={size} className={className} />,
    Shield: <Shield size={size} className={className} />,
    Wrench: <Wrench size={size} className={className} />,
    Store: <Store size={size} className={className} />,
    Zap: <Zap size={size} className={className} />,
    Heart: <Heart size={size} className={className} />,
    Database: <Database size={size} className={className} />,
    ExternalLink: <ExternalLink size={size} className={className} />,
    Github: <Github size={size} className={className} />,
    Mail: <Mail size={size} className={className} />,
    MapPin: <MapPin size={size} className={className} />,
    Microchip: <Microchip size={size} className={className} />,
    Home: <Home size={size} className={className} />,
    Palette: <Palette size={size} className={className} />,
    Camera: <Camera size={size} className={className} />,
    Building: <Building size={size} className={className} />,
    Leaf: <Leaf size={size} className={className} />,
    Gamepad2: <Gamepad2 size={size} className={className} />,
    Globe: <Globe size={size} className={className} />,
    Users: <Users size={size} className={className} />,
    Sparkles: <Sparkles size={size} className={className} />,
  };

  return icons[name] || null;
}

export function getProjectIcon(title: string): IconName {
  if (title.toLowerCase().includes('electrician')) return 'Zap';
  if (title.toLowerCase().includes('glazey')) return 'Store';
  if (title.toLowerCase().includes('electrovision')) return 'Wrench';
  if (title.toLowerCase().includes('reaching out')) return 'Heart';
  if (title.toLowerCase().includes('pokedex')) return 'Gamepad2';
  if (title.toLowerCase().includes('cybersecurity')) return 'Shield';
  if (title.toLowerCase().includes('wedding')) return 'Sparkles';
  if (title.toLowerCase().includes('max trans')) return 'Home';
  if (title.toLowerCase().includes('grow-y') || title.toLowerCase().includes('growy')) return 'Leaf';
  if (title.toLowerCase().includes('perfect circle')) return 'Gamepad2';
  return 'Code';
}
