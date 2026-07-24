'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalStore, ScreenType } from '../store/globalStore';
import {
  LoginScreen,
  DashboardScreen,
  CrimeGPTScreen,
  FIRExplorerScreen,
  CriminalProfileScreen,
  CriminalNetworkScreen,
  CrimeHeatmapScreen,
  CrimeAnalyticsScreen,
  CrimeForecastScreen,
  InvestigationTimelineScreen,
  CaseSimilarityScreen,
  EvidenceCenterScreen,
  FinancialCrimeScreen,
  BehavioralProfilingScreen,
  OfficerWorkspaceScreen,
  PolicyDashboardScreen,
  AIExplainabilityScreen,
  SettingsScreen
} from '../components/screens/Screens';
import {
  ShieldCheckIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  UserCircleIcon,
  FolderOpenIcon,
  ChartBarIcon,
  MapIcon,
  FingerPrintIcon,
  WrenchIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  ClipboardDocumentIcon,
  ChatBubbleBottomCenterTextIcon,
  QueueListIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const {
    currentRole,
    setCurrentRole,
    activeScreen,
    setActiveScreen,
    notifications,
    markNotificationsRead,
    addAuditLog,
    resetAll
  } = useGlobalStore();

  const [lang, setLang] = useState('EN');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotInput, setCopilotInput] = useState('');

  const [mounted, setMounted] = useState(false);
  const activeTheme = useGlobalStore((state) => state.theme);

  // Handle Ctrl+K Command Palette shortcut and mount status
  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Grouped Navigation Items matching 18 Screens - dynamic depending on Role Permissions
  const getNavGroups = () => {
    const groups = [
      {
        title: 'Command Center',
        items: [
          { screen: 'dashboard', label: 'Overview Dashboard', icon: ChartBarIcon, allowed: ['*'] },
          { screen: 'crimegpt', label: 'CrimeGPT Copilot', icon: SparklesIcon, allowed: ['Investigator', 'Crime Analyst', 'Supervisor', 'SCRB Officer', 'Administrator'] },
          { screen: 'workspace', label: 'Officer Workspace', icon: ClipboardDocumentIcon, allowed: ['Investigator', 'Supervisor', 'Administrator'] }
        ]
      },
      {
        title: 'Investigative Records',
        items: [
          { screen: 'fir-explorer', label: 'FIR Explorer', icon: FolderOpenIcon, allowed: ['Investigator', 'Crime Analyst', 'Supervisor', 'SCRB Officer', 'Administrator'] },
          { screen: 'criminal-profile', label: 'Criminal Profiles', icon: UserCircleIcon, allowed: ['Investigator', 'Crime Analyst', 'Supervisor', 'SCRB Officer', 'Administrator'] },
          { screen: 'evidence', label: 'Evidence Center', icon: DocumentDuplicateIcon, allowed: ['Investigator', 'Supervisor', 'Administrator'] },
          { screen: 'timeline', label: 'Case Timeline', icon: ClockIcon, allowed: ['Investigator', 'Supervisor', 'Administrator'] },
          { screen: 'similarity', label: 'Case Similarity', icon: QueueListIcon, allowed: ['Investigator', 'Crime Analyst', 'Administrator'] }
        ]
      },
      {
        title: 'Advanced Intelligence',
        items: [
          { screen: 'network', label: 'Network Linkages', icon: FingerPrintIcon, allowed: ['Crime Analyst', 'Supervisor', 'Administrator'] },
          { screen: 'heatmap', label: 'GIS Crime Heatmap', icon: MapIcon, allowed: ['Crime Analyst', 'Supervisor', 'Policymaker', 'Administrator'] },
          { screen: 'financial', label: 'Financial Crimes', icon: FolderOpenIcon, allowed: ['Crime Analyst', 'Supervisor', 'Administrator'] },
          { screen: 'behavior', label: 'MO & Behavior Profile', icon: ClipboardDocumentIcon, allowed: ['Crime Analyst', 'Administrator'] },
          { screen: 'forecast', label: 'XGBoost Risk Forecast', icon: ChartBarIcon, allowed: ['Crime Analyst', 'Policymaker', 'Administrator'] }
        ]
      },
      {
        title: 'System & Governance',
        items: [
          { screen: 'policy', label: 'Policy Dashboard', icon: ShieldCheckIcon, allowed: ['Policymaker', 'Supervisor', 'Administrator'] },
          { screen: 'explainability', label: 'AI Explainability', icon: ShieldCheckIcon, allowed: ['Supervisor', 'Administrator'] },
          { screen: 'settings', label: 'System Settings', icon: WrenchIcon, allowed: ['Administrator'] }
        ]
      }
    ];

    return groups.map(group => ({
      ...group,
      items: group.items.filter(item => 
        item.allowed.includes('*') || item.allowed.includes(currentRole || '')
      )
    })).filter(group => group.items.length > 0);
  };

  const navGroups = getNavGroups();

  if (!currentRole) {
    return <LoginScreen />;
  }

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;
    addAuditLog(`Executed global search for: "${localSearch}"`);
    if (localSearch.toLowerCase().includes('aditya') || localSearch.toLowerCase().includes('hegde')) {
      setActiveScreen('criminal-profile');
    } else {
      setActiveScreen('fir-explorer');
    }
    setSearchOpen(false);
    setLocalSearch('');
  };

  const handleQuickCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    useGlobalStore.getState().sendChatMessage(copilotInput);
    setCopilotInput('');
    setActiveScreen('crimegpt');
    setCopilotOpen(false);
  };

  const t = {
    EN: {
      title: "KAVACH AI",
      subtitle: "Karnataka Police Command Console",
      search: "Global Registry Search..."
    },
    KN: {
      title: "ಕವಚ ಎಐ",
      subtitle: "ಕರ್ನಾಟಕ ಪೊಲೀಸ್ ಕಮಾಂಡ್ ಕನ್ಸೋಲ್",
      search: "ಜಾಗತಿಕ ನೋಂದಾವಣೆ ಹುಡುಕಾಟ..."
    },
    HI: {
      title: "कवच एआई",
      subtitle: "कर्नाटक पुलिस कमांड कंसोल",
      search: "वैश्विक रजिस्ट्री खोज..."
    },
    MR: {
      title: "कवच एआय",
      subtitle: "कर्नाटक पोलीस कमांड कन्सोल",
      search: "जागतिक नोंदणी शोध..."
    }
  }[lang as 'EN' | 'KN' | 'HI' | 'MR'] || {
    title: "KAVACH AI",
    subtitle: "Karnataka Police Command Console",
    search: "Global Registry Search..."
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 h-14 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
            <img src="/logo.jpg" alt="KAVACH Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold font-mono tracking-wider text-sm">{t.title}</span>
            <span className="text-[9px] text-slate-500 font-mono tracking-tight">{t.subtitle}</span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="ml-4">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-350 text-[10px] px-2 py-1 rounded focus:outline-none focus:border-blue-600 font-mono"
          >
            <option value="EN">English</option>
            <option value="KN">ಕನ್ನಡ (Kannada)</option>
            <option value="HI">हिंदी (Hindi)</option>
            <option value="MR">मराठी (Marathi)</option>
          </select>
        </div>

        {/* Global Search and Breadcrumbs */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div
            onClick={() => setSearchOpen(true)}
            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 pl-3 pr-8 py-2 rounded flex justify-between items-center cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-500" />
              <span>{t.search}</span>
            </div>
            <kbd className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] border border-slate-700 font-mono">Ctrl+K</kbd>
          </div>
        </div>

        {/* Right side operations bar */}
        <div className="flex items-center gap-4">
          {/* Quick Chat Drawer Icon */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="bg-blue-900/40 hover:bg-blue-900 border border-blue-800 p-2 rounded text-blue-400 hover:text-blue-300 transition"
            title="KAVACH AI Quick Draw"
          >
            <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => useGlobalStore.getState().toggleTheme()}
            className="bg-slate-950 hover:bg-slate-900 border border-slate-800 p-2 rounded text-slate-400 hover:text-slate-200 transition"
            title="Toggle Day / Night mode"
          >
            {mounted && activeTheme === 'dark' ? (
              <span className="text-xs">☀️ Day</span>
            ) : (
              <span className="text-xs">🌙 Night</span>
            )}
          </button>

          {/* Quick Role Switcher */}
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-blue-600 font-mono"
            >
              <option value="Investigator">Investigator (SI)</option>
              <option value="Crime Analyst">Crime Analyst (DSP)</option>
              <option value="Supervisor">Supervisor (IGP)</option>
              <option value="SCRB Officer">SCRB Officer (State)</option>
              <option value="Administrator">Administrator (Sys)</option>
              <option value="Policymaker">Policymaker (Ministry)</option>
            </select>
          </div>

          {/* Notifications Panel Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                markNotificationsRead();
              }}
              className="bg-slate-950 border border-slate-850 p-2 rounded text-slate-400 hover:text-slate-200 relative"
            >
              <BellIcon className="w-4 h-4" />
              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-slate-950" />
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-3 z-50">
                <h4 className="text-xs font-bold border-b border-slate-800 pb-1.5 mb-2 uppercase text-slate-400 tracking-wider">
                  Tactical Feeds / Alerts
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 bg-slate-950 rounded border border-slate-850 text-[10px]">
                      <div className="flex justify-between font-bold">
                        <span className={n.severity === 'high' ? 'text-red-400' : n.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'}>
                          {n.severity.toUpperCase()} ALERT
                        </span>
                        <span className="text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-slate-300 mt-1">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 bg-slate-950 border border-slate-850 px-3 py-1.5 rounded"
            >
              <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs text-blue-500">
                O
              </div>
              <span className="text-xs font-mono hidden sm:inline">{currentRole}</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded shadow-2xl p-2 z-50">
                <button
                  onClick={() => {
                    resetAll();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left text-xs hover:bg-slate-950 p-2 rounded text-red-400"
                >
                  Terminate Session
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main shell layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 overflow-y-auto hidden lg:block shrink-0 p-4">
          <div className="space-y-6">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 font-mono">
                  {group.title}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeScreen === item.screen;
                    return (
                      <button
                        key={item.screen}
                        onClick={() => setActiveScreen(item.screen as ScreenType)}
                        className={`w-full text-left px-3 py-2 rounded text-xs flex items-center gap-2.5 transition ${
                          isActive
                            ? 'bg-blue-950 border border-blue-800 text-blue-400 font-bold'
                            : 'hover:bg-slate-950 text-slate-350 border border-transparent'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header (Breadcrumbs) */}
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>KAVACH AI</span>
                <span>/</span>
                <span>{currentRole} Console</span>
                <span>/</span>
                <span className="text-slate-300 font-bold uppercase">{activeScreen.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Render targeted screen */}
            {activeScreen === 'dashboard' && <DashboardScreen />}
            {activeScreen === 'crimegpt' && <CrimeGPTScreen />}
            {activeScreen === 'fir-explorer' && <FIRExplorerScreen />}
            {activeScreen === 'criminal-profile' && <CriminalProfileScreen />}
            {activeScreen === 'network' && <CriminalNetworkScreen />}
            {activeScreen === 'heatmap' && <CrimeHeatmapScreen />}
            {activeScreen === 'analytics' && <CrimeAnalyticsScreen />}
            {activeScreen === 'forecast' && <CrimeForecastScreen />}
            {activeScreen === 'timeline' && <InvestigationTimelineScreen />}
            {activeScreen === 'similarity' && <CaseSimilarityScreen />}
            {activeScreen === 'evidence' && <EvidenceCenterScreen />}
            {activeScreen === 'financial' && <FinancialCrimeScreen />}
            {activeScreen === 'behavior' && <BehavioralProfilingScreen />}
            {activeScreen === 'workspace' && <OfficerWorkspaceScreen />}
            {activeScreen === 'policy' && <PolicyDashboardScreen />}
            {activeScreen === 'explainability' && <AIExplainabilityScreen />}
            {activeScreen === 'settings' && <SettingsScreen />}
          </div>
        </main>
      </div>

      {/* Floating Quick AI Copilot Drawer */}
      {copilotOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-mono">
              <SparklesIcon className="w-4 h-4 text-blue-500" />
              KAVACH QUICK COPILOT
            </h4>
            <button onClick={() => setCopilotOpen(false)} className="text-slate-400 text-xs hover:text-slate-200">
              Close
            </button>
          </div>
          <div className="flex-1 p-4 bg-slate-950/60 overflow-y-auto">
            <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
              Enter question or command to pre-populate CrimeGPT workstation:
            </p>
            <form onSubmit={handleQuickCopilot} className="mt-4 space-y-3">
              <textarea
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder="Ask e.g., 'What is Aditya Hegde risk profile?'"
                className="w-full h-32 bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-slate-250 focus:outline-none focus:border-blue-600 resize-none font-mono"
              />
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-2 rounded uppercase tracking-wider"
              >
                Send to Workstation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ctrl+K Command Palette Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-4 shadow-2xl">
            <form onSubmit={handleGlobalSearch} className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search suspects, vehicle registration, accounts, or case number..."
                className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 font-mono"
              />
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-4 py-2 rounded font-bold uppercase tracking-wider"
              >
                Inspect
              </button>
            </form>
            <div className="mt-4 pt-2 border-t border-slate-850 text-[10px] text-slate-500 font-mono">
              Suggestions: Search "Aditya Hegde" or "FIR 0042/2026". Press Esc to close.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
