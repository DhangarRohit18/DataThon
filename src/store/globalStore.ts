import { create } from 'zustand';
import { MOCK_FIRS, MOCK_CRIMINALS, FIR, CriminalProfile } from '../utils/mockData';

export type ScreenType =
  | 'login'
  | 'dashboard'
  | 'crimegpt'
  | 'fir-explorer'
  | 'criminal-profile'
  | 'network'
  | 'heatmap'
  | 'analytics'
  | 'forecast'
  | 'timeline'
  | 'similarity'
  | 'evidence'
  | 'financial'
  | 'behavior'
  | 'workspace'
  | 'policy'
  | 'explainability'
  | 'settings';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  evidenceSources?: string[];
  reasoningSteps?: string[];
  confidence?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  ip: string;
}

interface GlobalState {
  currentRole: string | null;
  activeScreen: ScreenType;
  selectedFIR: FIR;
  selectedCriminal: CriminalProfile;
  firsList: FIR[];
  criminalsList: CriminalProfile[];
  searchQuery: string;
  searchHistory: string[];
  notifications: { id: string; text: string; time: string; severity: 'high' | 'medium' | 'low'; unread: boolean }[];
  auditLogs: AuditLog[];
  chatMessages: ChatMessage[];
  chatDrawerOpen: boolean;
  activeDistrict: string;
  timeSliderVal: number; // 0 to 100 representing hours/days

  // Setters
  setCurrentRole: (role: string | null) => void;
  setActiveScreen: (screen: ScreenType) => void;
  setSelectedFIR: (fir: FIR) => void;
  setSelectedCriminal: (criminal: CriminalProfile) => void;
  addFIR: (fir: FIR) => void;
  addCriminal: (criminal: CriminalProfile) => void;
  setSearchQuery: (query: string) => void;
  addSearchHistory: (query: string) => void;
  markNotificationsRead: () => void;
  addAuditLog: (action: string) => void;
  sendChatMessage: (text: string) => void;
  setChatDrawerOpen: (open: boolean) => void;
  setActiveDistrict: (district: string) => void;
  setTimeSliderVal: (val: number) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  resetAll: () => void;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  currentRole: null, // default is login screen
  activeScreen: 'login',
  selectedFIR: MOCK_FIRS[0],
  selectedCriminal: MOCK_CRIMINALS[0],
  firsList: MOCK_FIRS,
  criminalsList: MOCK_CRIMINALS,
  searchQuery: '',
  searchHistory: ['Aditya Hegde', 'Koramangala Mule Accounts', 'Chaddi Gang Hubballi'],
  notifications: [
    { id: '1', text: 'Suspicious transaction of ₹4,50,000 flagged on HDFC account of Sanjay Murthy', time: '5m ago', severity: 'high', unread: true },
    { id: '2', text: 'Intelligence alert: Increased drug transit activity reported on Mysuru-Bengaluru highway', time: '1h ago', severity: 'medium', unread: true },
    { id: '3', text: 'Daily Crime Report for Hubballi-Dharwad finalized by DSP', time: '2h ago', severity: 'low', unread: false }
  ],
  auditLogs: [
    { id: '1', timestamp: '2026-07-16 23:45:10', user: 'Insp. R. K. Patil', role: 'Investigator', action: 'Accessed Case Diary of FIR 0042/2026', ip: '10.14.8.102' },
    { id: '2', timestamp: '2026-07-16 23:48:40', user: 'Insp. R. K. Patil', role: 'Investigator', action: 'Searched Criminal Network for Aditya Hegde', ip: '10.14.8.102' }
  ],
  chatMessages: [
    {
      id: 'm1',
      sender: 'ai',
      text: 'Greetings. I am KAVACH Copilot. I have analyzed active criminal cases across Karnataka. Ask me to find links, summarize evidence files, or predict potential offender movements.',
      timestamp: '2026-07-16 23:30',
      confidence: 100
    }
  ],
  chatDrawerOpen: false,
  activeDistrict: 'All Districts',
  timeSliderVal: 80,

  setCurrentRole: (role) => {
    set({ currentRole: role, activeScreen: role ? 'dashboard' : 'login' });
    if (role) {
      get().addAuditLog(`Logged in with role: ${role}`);
    }
  },
  setActiveScreen: (screen) => {
    set({ activeScreen: screen });
    const role = get().currentRole || 'Guest';
    get().addAuditLog(`Navigated to screen: ${screen}`);
  },
  setSelectedFIR: (fir) => set({ selectedFIR: fir }),
  setSelectedCriminal: (criminal) => set({ selectedCriminal: criminal }),
  addFIR: (fir) => set((state) => ({ firsList: [fir, ...state.firsList] })),
  addCriminal: (criminal) => set((state) => ({ criminalsList: [criminal, ...state.criminalsList] })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addSearchHistory: (query) => {
    if (!query.trim()) return;
    set((state) => ({
      searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10)
    }));
  },
  markNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, unread: false }))
    }));
  },
  addAuditLog: (action) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: get().currentRole ? `Officer_${get().currentRole}` : 'System / Guest',
      role: get().currentRole || 'None',
      action,
      ip: '10.12.92.51'
    };
    set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
  },
  sendChatMessage: async (text) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({ chatMessages: [...state.chatMessages, userMsg] }));
    get().addAuditLog(`CrimeGPT query: "${text.substring(0, 30)}..."`);

    try {
      const response = await fetch("http://localhost:8000/api/v1/copilot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, context: {} })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'ai',
          text: data.decision,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          evidenceSources: ["KAVACH Agent Context"],
          reasoningSteps: data.reasoning,
          confidence: data.confidence
        };
        set((state) => ({ chatMessages: [...state.chatMessages, aiMsg] }));
        return;
      }
    } catch (e) {
      console.warn("Backend offline, falling back to mock database answers.");
    }

    // Simulated streaming response
    setTimeout(() => {
      let aiText = `Understood. Analyzing intelligence databases for query: "${text}". No concrete hits found in regional records, but cross-referencing national databases...`;
      let sources: string[] = [];
      let reasoning: string[] = [];
      let confidence = 85;

      const lowerText = text.toLowerCase();
      if (lowerText.includes('aditya') || lowerText.includes('hegde') || lowerText.includes('cyber')) {
        aiText = 'Aditya Hegde (Wanted) is linked to FIR 0042/2026 (Cyber Fraud) and 2 banking alert clusters in Bengaluru. Evidence logs point to IP connections originating from Hubballi. Visual surveillance indicates the usage of a black Fortuner (KA-01-MJ-8822) tracked last near Koramangala. High likelihood of association with Sanjay Murthy (Tech Associate).';
        sources = ['FIR 0042/2026 Summary', 'SBI/Canara Bank Audit Trails', 'CCTV Log 2026-07-13'];
        reasoning = [
          'Matched name "Aditya Hegde" with active wanted suspect list.',
          'Correlated IP log database with ISP data from Hubballi-Dharwad area.',
          'Detected vehicle plate match in Koramangala toll checkpoint database.',
          'Aggregated bank node analysis pointing to mule network hub.'
        ];
        confidence = 94.8;
      } else if (lowerText.includes('chaddi') || lowerText.includes('burglary') || lowerText.includes('theft')) {
        aiText = 'Active analysis of burglary MOs in Hubballi-Dharwad indicates fingerprint correlation of 82.5% matching Chaddi Gang Affiliate A. Tactical suggestion: Deploy patrol units near Vidyanagar and surrounding commercial jewelry centers between 01:00 AM and 04:30 AM.';
        sources = ['FIR 0098/2026 Vidyanagar', 'State Fingerprint Registry v2', 'Historical Burglar Patrol Matrix'];
        reasoning = [
          'Analyzed burglary times and point-of-entry similarities.',
          'Extracted forensic fingerprint score from local database.',
          'Optimized patrol coordinates based on historical hot spots.'
        ];
        confidence = 89.2;
      } else if (lowerText.includes('drug') || lowerText.includes('narcotics') || lowerText.includes('mysuru')) {
        aiText = 'Intelligence report suggests synthetic drugs transit corridor along NH-275. Seizure on 2026-07-15 involving Rahul Krishnan indicates direct procurement supply chain links originating from Kerala border checkpoints. High suspicion level for secondary transits on weekend nights.';
        sources = ['FIR 0105/2026 Seizure Memo', 'Anti-Narcotics intelligence bulletin #19'];
        reasoning = [
          'Mapped intercept location coordinates and vehicle route.',
          'Analyzed mobile call graphs linking Kerala narcotics syndicates.',
          'Identified risk-window correlation on weekend nights.'
        ];
        confidence = 91.5;
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidenceSources: sources.length > 0 ? sources : undefined,
        reasoningSteps: reasoning.length > 0 ? reasoning : undefined,
        confidence
      };

      set((state) => ({ chatMessages: [...state.chatMessages, aiMsg] }));
    }, 1200);
  },
  setChatDrawerOpen: (open) => set({ chatDrawerOpen: open }),
  setActiveDistrict: (district) => set({ activeDistrict: district }),
  setTimeSliderVal: (val) => set({ timeSliderVal: val }),
  theme: 'light',
  toggleTheme: () => {
    const currentTheme = get().theme;
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: nextTheme });
  },
  resetAll: () => set({
    currentRole: null,
    activeScreen: 'login',
    selectedFIR: MOCK_FIRS[0],
    selectedCriminal: MOCK_CRIMINALS[0],
    firsList: MOCK_FIRS,
    criminalsList: MOCK_CRIMINALS,
    searchQuery: '',
    chatMessages: [
      {
        id: 'm1',
        sender: 'ai',
        text: 'Greetings. I am KAVACH Copilot. I have analyzed active criminal cases across Karnataka. Ask me to find links, summarize evidence files, or predict potential offender movements.',
        timestamp: '2026-07-16 23:30',
        confidence: 100
      }
    ],
    chatDrawerOpen: false,
    activeDistrict: 'All Districts',
    timeSliderVal: 80
  })
}));
