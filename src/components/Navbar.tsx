import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  History,
  Cpu,
  AlertTriangle,
  Printer,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'screening' | 'syndicate' | 'rules' | 'audit';
  setActiveTab: (tab: 'home' | 'screening' | 'syndicate' | 'rules' | 'audit') => void;
  officerId: string;
  onOpenReport: () => void;
  totalScreenedCount: number;
  flaggedCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  officerId,
  onOpenReport,
  totalScreenedCount,
  flaggedCount,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    id: 'home' | 'screening' | 'syndicate' | 'rules' | 'audit';
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'home',      label: 'Home',       icon: <Home className="w-4 h-4" /> },
    { id: 'screening', label: 'Screening',   icon: <Search className="w-4 h-4" /> },
    { id: 'syndicate', label: 'Network',     icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'rules',     label: 'Rule Engine', icon: <Cpu className="w-4 h-4" /> },
    { id: 'audit',     label: 'Audit Trail', icon: <History className="w-4 h-4" /> },
  ];

  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md shadow-sm transition-colors ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-900'
          : 'bg-[#0f1117]/95 border-slate-800 text-white'
      }`}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Brand */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex shrink-0 cursor-pointer items-center gap-3 outline-offset-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600 text-white shadow-md">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div className="text-left">
              <span className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                DocShield <span className="text-accent-500">AI</span>
              </span>
            </div>
          </button>

          {/* Desktop Nav — plain links, no card container */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-tab`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-accent-600 text-white shadow-sm'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="hidden sm:flex shrink-0 items-center gap-2">
            {/* Stats */}
            <div className={`hidden lg:flex items-center gap-3 text-xs font-mono mr-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>
                <span className={isLight ? 'text-slate-400' : 'text-slate-500'}>Screened </span>
                <strong className={isLight ? 'text-slate-700' : 'text-white'}>{totalScreenedCount}</strong>
              </span>
              <span className={isLight ? 'text-slate-300' : 'text-slate-700'}>•</span>
              <span>
                <span className={isLight ? 'text-slate-400' : 'text-slate-500'}>Flagged </span>
                <strong className="text-rose-500">{flaggedCount}</strong>
              </span>
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className={`cursor-pointer rounded-lg p-2.5 transition-all ${
                isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Print dossier icon button — ONLY on non-landing pages */}
            {activeTab !== 'home' && (
              <button
                type="button"
                id="btn-print-case-dossier"
                onClick={onOpenReport}
                className={`cursor-pointer rounded-lg p-2.5 transition-all ${
                  isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Print Case Dossier"
                aria-label="Print Case Dossier"
              >
                <Printer className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`rounded-lg p-2 ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {activeTab !== 'home' && (
              <button
                type="button"
                onClick={onOpenReport}
                className={`rounded-lg p-2 ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                aria-label="Print Case Dossier"
              >
                <Printer className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`rounded-lg p-2 ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className={`border-t md:hidden ${isLight ? 'bg-white border-slate-200' : 'bg-[#0f1117] border-slate-800'}`}>
          <div className="mx-auto max-w-[1560px] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-accent-600 text-white'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
