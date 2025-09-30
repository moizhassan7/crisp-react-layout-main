// src/components/common/IconPicker.tsx
import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons
import { ChevronDown, Search } from 'lucide-react';

// Define the type for Lucide icons
type LucideIconName = keyof typeof LucideIcons;

interface IconPickerProps {
  value: string; // Current icon name (e.g., "Users", "Shield")
  onChange: (iconName: string) => void;
  label?: string;
}

// Map of icon names to components (ensure this list is comprehensive for your needs)
const iconMap: { [key: string]: React.ElementType } = {
  // Add all Lucide icons you might use in your website here
  ArrowRight: LucideIcons.ArrowRight,
  Play: LucideIcons.Play,
  Shield: LucideIcons.Shield,
  Users: LucideIcons.Users,
  Zap: LucideIcons.Zap,
  Server: LucideIcons.Server,
  Cctv: LucideIcons.Cctv,
  Smartphone: LucideIcons.Smartphone,
  Network: LucideIcons.Network,
  Check: LucideIcons.Check,
  Star: LucideIcons.Star,
  Crown: LucideIcons.Crown,
  Wifi: LucideIcons.Wifi,
  Database: LucideIcons.Database,
  Monitor: LucideIcons.Monitor,
  FireExtinguisher: LucideIcons.FireExtinguisher,
  Megaphone: LucideIcons.Megaphone,
  FolderKanban: LucideIcons.FolderKanban,
  Code2: LucideIcons.Code2,
  Cloud: LucideIcons.Cloud,
  BarChart3: LucideIcons.BarChart3,
  Headphones: LucideIcons.Headphones,
  CheckCircle: LucideIcons.CheckCircle,
  HardDrive: LucideIcons.HardDrive,
  Camera: LucideIcons.Camera,
  Activity: LucideIcons.Activity,
  Target: LucideIcons.Target,
  Award: LucideIcons.Award,
  Lightbulb: LucideIcons.Lightbulb,
  BarChart: LucideIcons.BarChart,
  Linkedin: LucideIcons.Linkedin,
  Twitter: LucideIcons.Twitter,
  Github: LucideIcons.Github,
  // ... continue adding more as needed
};

// Get a sorted list of icon names for display
const allIconNames = Object.keys(iconMap).sort();

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, label = "Select Icon" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const CurrentIcon = value ? iconMap[value as LucideIconName] : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredIcons = allIconNames.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectIcon = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchTerm(''); // Clear search on selection
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {CurrentIcon ? (
          <span className="flex items-center">
            <CurrentIcon className="w-5 h-5 mr-2" />
            {value}
          </span>
        ) : (
          <span className="text-gray-500">No icon selected</span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search icons..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ul>
            {filteredIcons.length > 0 ? (
              filteredIcons.map((iconName) => {
                const IconComponent = iconMap[iconName as LucideIconName];
                return (
                  <li
                    key={iconName}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectIcon(iconName)}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 mr-2 text-gray-600" />}
                    {iconName}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-2 text-gray-500">No icons found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export { IconPicker, iconMap }; // Export iconMap for use in other components
