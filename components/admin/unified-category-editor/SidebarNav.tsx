'use client';

import { Check, AlertCircle, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
  required: string[];
}

interface SidebarNavProps {
  sections: Section[];
  activeSection: string;
  getSectionStatus: (sectionId: string) => 'complete' | 'incomplete' | 'empty';
  onSectionClick: (sectionId: string) => void;
  progress: number;
}

export default function SidebarNav({
  sections,
  activeSection,
  getSectionStatus,
  onSectionClick,
  progress,
}: SidebarNavProps) {
  return (
    <nav className="w-60 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col sticky top-[61px] h-[calc(100vh-61px)]">
      {/* Progress */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tiến độ</span>
          <span className="text-xs font-bold text-slate-600">{progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              progress === 100
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-rose-500 to-pink-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-2 px-2 overflow-y-auto">
        {sections.map((section) => {
          const status = getSectionStatus(section.id);
          const isActive = activeSection === section.id;
          const Icon = section.icon;

          return (
            <button
              key={section.id}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left mb-0.5
                transition-all duration-150 border border-transparent cursor-pointer bg-white
                ${isActive
                  ? 'bg-rose-50 border-rose-200/60 text-rose-700'
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
              onClick={() => onSectionClick(section.id)}
            >
              {/* Icon */}
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${isActive
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                  : 'bg-slate-100 text-slate-500'
                }
              `}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Label */}
              <span className={`flex-1 text-[13px] truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {section.label}
              </span>

              {/* Status */}
              {status === 'complete' ? (
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </div>
              ) : status === 'incomplete' ? (
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-3 h-3" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
                  <Minus className="w-3 h-3" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
