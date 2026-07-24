'use client';

import React, { useState } from 'react';
import * as echarts from 'echarts';
import { useGlobalStore, ScreenType, ChatMessage } from '../../store/globalStore';
import {
  MOCK_FIRS,
  MOCK_CRIMINALS,
  MOCK_HOTSPOTS,
  MOCK_TRANSACTIONS,
  MOCK_POLICY_METRICS,
  MOCK_FORECAST,
  MOCK_DECISION_TREE
} from '../../utils/mockData';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PaperClipIcon,
  ArrowRightIcon,
  SparklesIcon,
  CpuChipIcon,
  CurrencyRupeeIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
  ScaleIcon,
  LockClosedIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import EChartWrapper from '../charts/EChartWrapper';
import LeafletMapWrapper from '../maps/LeafletMapWrapper';
import NetworkGraphWrapper from '../graph/NetworkGraphWrapper';

// ==========================================
// 1. LOGIN SCREEN
// ==========================================
export function LoginScreen() {
  const { setCurrentRole } = useGlobalStore();
  const [role, setRole] = useState('Investigator');
  const [govId, setGovId] = useState('KSP-9921-2026');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl relative overflow-hidden">
        {/* Government Branding Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 border border-slate-800 rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
            <img src="/logo.jpg" alt="KAVACH AI Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-slate-100 font-mono">KAVACH AI</h1>
          <p className="text-xs text-blue-500 font-semibold tracking-wider mt-1 uppercase">Crime Intelligence Operating System</p>
          <p className="text-[10px] text-slate-400 mt-2">Karnataka State Police &bull; Government of India</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Government Email / Badge ID</label>
            <input
              type="text"
              required
              value={govId}
              onChange={(e) => setGovId(e.target.value)}
              className="w-full bg-slate-955 border border-slate-700 text-slate-200 text-sm px-4 py-2.5 rounded focus:outline-none focus:border-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Operational Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-955 border border-slate-700 text-slate-200 text-sm px-4 py-2.5 rounded focus:outline-none focus:border-blue-600"
            >
              <option value="Investigator">Investigator (SI / CI)</option>
              <option value="Crime Analyst">Crime Analyst (DSP / SP)</option>
              <option value="Supervisor">Supervisor (IGP / ADGP)</option>
              <option value="SCRB Officer">SCRB Officer (State Records)</option>
              <option value="Administrator">System Administrator</option>
              <option value="Policymaker">Policymaker (DG / Home Ministry)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest py-3 rounded transition duration-150"
          >
            Authenticate Console
          </button>
        </form>

        {/* Biometric Placeholder */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button onClick={() => setCurrentRole(role)} className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-350">
            <FingerPrintIcon className="w-5 h-5" />
            <span>Fingerprint / Biometric Bypass</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. DASHBOARD SCREEN
// ==========================================
export function DashboardScreen() {
  const { currentRole, setActiveScreen, setSelectedFIR } = useGlobalStore();

  const trendOption: any = {
    title: { text: 'Monthly Crime Trajectory (2026)', textStyle: { color: '#94a3b8', fontSize: 12 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [{ data: [120, 110, 150, 140, 185, 170, 198], type: 'line', smooth: true, color: '#3b82f6' }]
  };

  const renderRoleDashboardHeader = () => {
    switch (currentRole) {
      case 'Administrator':
        return (
          <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-red-405 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-red-500" /> Administrator System Controls
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Global system logs, security audits, database configurations, and user credentials enforcement panel.
            </p>
          </div>
        );
      case 'Supervisor':
        return (
          <div className="bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-indigo-405 uppercase tracking-wider flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-indigo-500" /> Executive Command Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Supervising active state-wide cases, managing station resources, and reviewing AI explanation pipelines.
            </p>
          </div>
        );
      case 'Crime Analyst':
        return (
          <div className="bg-blue-950/20 border border-blue-900/40 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-blue-405 uppercase tracking-wider flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-blue-500" /> Strategic Intelligence Console
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              XGBoost risk index forecasting, GIS crime density hotspots, and multi-agent correlation graphs.
            </p>
          </div>
        );
      case 'Policymaker':
        return (
          <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-emerald-450 uppercase tracking-wider flex items-center gap-2">
              <ScaleIcon className="w-5 h-5 text-emerald-500" /> Policy Planning & Budget Console
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              State security allocation indexes, budget utilization metrics, and crime correlation reports.
            </p>
          </div>
        );
      default:
        return (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-blue-500" /> Operational Investigator Desk
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Reviewing local FIR registries, managing evidence custody chains, and logging field investigative actions.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderRoleDashboardHeader()}
      {/* Upper overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Today's Active Cases</span>
            <DocumentTextIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono mt-2">142</p>
          <span className="text-[10px] text-emerald-400 font-medium font-mono">+12% vs last week</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Critical Threat Alerts</span>
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold font-mono mt-2 text-red-500">12</p>
          <span className="text-[10px] text-red-400 font-medium font-mono">3 require urgent escalation</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Patrol Vehicles Active</span>
            <ShieldCheckIcon className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono mt-2">84 / 100</p>
          <span className="text-[10px] text-slate-400 font-mono">Bengaluru command center</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Weather Alert</span>
            <ClockIcon className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono mt-2">26°C - Heavy Rain</p>
          <span className="text-[10px] text-amber-400 font-mono">Flood warning in coastal zones</span>
        </div>
      </div>

      {/* Map and Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeafletMapWrapper />
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col h-[500px]">
          <h3 className="text-sm font-bold border-b border-slate-800 pb-2 mb-3 text-slate-200 uppercase tracking-wide">
            Critical Hotspot Radars
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {MOCK_HOTSPOTS.map((hotspot) => (
              <div key={hotspot.id} className="p-3 bg-slate-950 border border-slate-800 rounded flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{hotspot.station}</h4>
                  <p className="text-[10px] text-slate-500">{hotspot.district}</p>
                  <p className="text-[10px] text-slate-300 font-semibold mt-1">MO: {hotspot.primaryCrime}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    hotspot.density === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {hotspot.density}
                  </span>
                  <p className="text-xs font-bold font-mono mt-2 text-slate-200">{hotspot.crimeCount} Cases</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trends and Recent FIRs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <EChartWrapper option={trendOption} />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Latest FIR Ingestion</h3>
              <button onClick={() => setActiveScreen('fir-explorer')} className="text-xs text-blue-400 hover:text-blue-300 underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_FIRS.map((fir) => (
                <div
                  key={fir.id}
                  onClick={() => {
                    setSelectedFIR(fir);
                    setActiveScreen('fir-explorer');
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded hover:border-slate-700 transition cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400">{fir.caseNumber}</span>
                      <span className="text-[10px] text-slate-500">{fir.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-1 truncate max-w-sm">{fir.summary}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-905 text-slate-400 border border-slate-800">
                    {fir.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. CRIMEGPT COPILOT SCREEN
// ==========================================
export function CrimeGPTScreen() {
  const { chatMessages, sendChatMessage } = useGlobalStore();
  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInputVal('Show criminal network linkages for Aditya Hegde and tell me his risk level');
        setIsRecording(false);
      }, 2000);
    }
  };

  const suggestedQuestions = [
    'Analyze relationships for Aditya Hegde',
    'What is the modus operandi in FIR 0098/2026?',
    'Estimate forecasting risk index for Bengaluru City'
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-950 p-1.5 border border-blue-800 rounded-full">
            <SparklesIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">KAVACH CrimeGPT Copilot</h3>
            <p className="text-[10px] text-slate-400">Large Language Model tuned on Karnataka Police Act & Crime Databases</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-semibold font-mono">Agent Version: v3.1-Secure</span>
        </div>
      </div>

      {/* Main chat box */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/60">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl rounded-lg p-3 text-xs ${
              msg.sender === 'user' ? 'bg-blue-950 border border-blue-800 text-slate-100' : 'bg-slate-900 border border-slate-800 text-slate-200'
            }`}>
              <div className="flex justify-between items-center gap-4 mb-1.5 border-b border-slate-800/80 pb-1">
                <span className="font-bold text-[10px] uppercase text-slate-400 font-mono">
                  {msg.sender === 'user' ? 'User Operator' : 'KAVACH AI'}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {/* Confidence meter */}
              {msg.confidence && (
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>AI Model Confidence Index:</span>
                  <span className={`${msg.confidence > 90 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}`}>{msg.confidence}%</span>
                </div>
              )}

              {/* Evidence sources references */}
              {msg.evidenceSources && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                  <p className="text-[9px] uppercase text-slate-500 font-bold font-mono">Retrieved Sources:</p>
                  <div className="flex flex-wrap gap-1">
                    {msg.evidenceSources.map((source, i) => (
                      <span key={i} className="text-[9px] bg-slate-950 border border-slate-800 text-blue-400 px-1.5 py-0.5 rounded font-mono">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning timeline */}
              {msg.reasoningSteps && (
                <details className="mt-3 pt-2 text-[10px] text-slate-400 font-mono cursor-pointer border-t border-slate-800/40">
                  <summary className="hover:text-teal-400 select-none font-semibold transition-colors duration-150">
                    View Investigative Steps ({msg.reasoningSteps.length})
                  </summary>
                  <ul className="mt-2 list-none pl-1 space-y-2 border-l border-teal-800/40">
                    {msg.reasoningSteps.map((step, idx) => (
                      <li key={idx} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-teal-500">
                        {step}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls & suggestions */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-3">
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInputVal(q)}
              className="text-[10px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-2 py-1 rounded"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded border transition ${
              isRecording ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
            title="Voice Dictation"
          >
            <FingerPrintIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Type investigative query for KAVACH AI..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 rounded focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={handleSend}
            className="bg-blue-900 hover:bg-blue-800 border border-blue-700 text-white text-xs font-bold px-4 py-2 rounded"
          >
            Query
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. FIR EXPLORER SCREEN
// ==========================================
export function FIRExplorerScreen() {
  const { firsList, selectedFIR, setSelectedFIR } = useGlobalStore();
  const [districtFilter, setDistrictFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredFirs = firsList.filter((fir) => {
    const matchDistrict = districtFilter === 'All' || fir.district === districtFilter;
    const matchText = fir.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
                      fir.crimeType.toLowerCase().includes(search.toLowerCase()) ||
                      fir.summary.toLowerCase().includes(search.toLowerCase());
    return matchDistrict && matchText;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Filter and List Panel */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col h-[600px]">
        <div className="space-y-3 mb-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">FIR Records Directory</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Case #, crime type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-2 rounded focus:outline-none focus:border-blue-600"
            />
            <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-semibold uppercase mb-1">District Focus</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 text-slate-300 text-xs px-2 py-1.5 rounded"
            >
              <option value="All">All Districts</option>
              <option value="Bengaluru City">Bengaluru City</option>
              <option value="Mysuru City">Mysuru City</option>
              <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredFirs.map((fir) => (
            <div
              key={fir.id}
              onClick={() => setSelectedFIR(fir)}
              className={`p-3 rounded border transition cursor-pointer ${
                selectedFIR.id === fir.id ? 'bg-blue-950 border-blue-700' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-blue-400">{fir.caseNumber}</span>
                <span className="text-[9px] text-slate-500 font-mono">{fir.date}</span>
              </div>
              <p className="text-[11px] text-slate-200 font-semibold mt-1">{fir.crimeType}</p>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{fir.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col h-[600px] overflow-y-auto">
        <div className="border-b border-slate-800 pb-4 mb-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-950 text-blue-400 border border-blue-800 text-[10px] px-2 py-0.5 rounded font-mono">
                {selectedFIR.id}
              </span>
              <h2 className="text-base font-bold text-slate-200">{selectedFIR.caseNumber}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Station: {selectedFIR.policeStation} &bull; {selectedFIR.district}
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            STATUS: {selectedFIR.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Incident Summary</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 border border-slate-800 rounded">
                {selectedFIR.summary}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suspect Listing</h4>
              <div className="flex gap-2">
                {selectedFIR.suspects.map((suspect, idx) => (
                  <span key={idx} className="bg-red-950/40 border border-red-800 text-red-400 text-xs px-2.5 py-1 rounded">
                    {suspect}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Investigating Officer</h4>
              <p className="text-xs text-slate-200 font-semibold">{selectedFIR.officer}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Complainant</h4>
              <p className="text-xs text-slate-300">{selectedFIR.complainant}</p>
            </div>
          </div>
        </div>

        {/* Attachments & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recovered Evidence / Files</h4>
            <div className="space-y-2">
              {selectedFIR.attachments.map((file, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 border border-slate-850 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PaperClipIcon className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-300 font-medium">{file.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{file.size}</p>
                    </div>
                  </div>
                  <button className="text-[10px] text-red-500 hover:text-red-600 font-mono font-bold transition duration-150">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Investigation Timeline</h4>
            <div className="relative border-l border-slate-800 pl-4 space-y-4">
              {selectedFIR.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-[10px] text-slate-500 font-mono">{item.date}</p>
                  <p className="text-xs font-semibold text-slate-300">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. CRIMINAL PROFILE SCREEN
// ==========================================
export function CriminalProfileScreen() {
  const { selectedCriminal } = useGlobalStore();

  const radarOption: any = {
    title: { text: 'Behavioral Traits Index', textStyle: { color: '#94a3b8', fontSize: 11 } },
    radar: {
      indicator: selectedCriminal.behaviorAnalysis.riskRadar.map((r) => ({ name: r.trait, max: 100 })),
      splitArea: { show: false },
      axisLine: { lineStyle: { color: '#334155' } }
    },
    series: [
      {
        type: 'radar',
        data: [{ value: selectedCriminal.behaviorAnalysis.riskRadar.map((r) => r.score), name: 'Traits' }],
        color: '#ef4444'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card and Risk Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5 text-center">
          <div className="w-24 h-24 mx-auto bg-slate-950 border-2 border-slate-800 rounded-full overflow-hidden">
            <img
              src={selectedCriminal.photoGallery[0]}
              alt={selectedCriminal.name}
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">{selectedCriminal.name}</h2>
            <p className="text-xs text-red-500 font-mono mt-1">Wanted Alias: {selectedCriminal.alias}</p>
            <p className="text-[10px] text-slate-400 mt-1">Criminal ID: {selectedCriminal.id}</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-850 rounded">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
              AI Recidivism Risk Meter
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold font-mono text-red-500">{selectedCriminal.riskScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-red-600 h-full" style={{ width: `${selectedCriminal.riskScore}%` }} />
            </div>
          </div>

          <div className="text-left space-y-3 text-xs pt-4 border-t border-slate-850">
            <p><span className="text-slate-400 font-semibold">Active Phones:</span></p>
            <ul className="list-disc pl-4 text-slate-300 font-mono">
              {selectedCriminal.phones.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            <p><span className="text-slate-400 font-semibold">Known Vehicles:</span></p>
            <ul className="list-disc pl-4 text-slate-300 font-mono">
              {selectedCriminal.vehicles.map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </div>
        </div>

        {/* Behavioral details and Associates */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Behavioral MO Analysis</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 border border-slate-800 p-3 rounded mt-2">
              {selectedCriminal.behaviorAnalysis.modusOperandi}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Known Associates Network</h4>
              <div className="space-y-2">
                {selectedCriminal.knownAssociates.map((assoc, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 border border-slate-850 rounded flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-200">{assoc.name}</p>
                      <p className="text-[10px] text-slate-500">{assoc.relation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <EChartWrapper option={radarOption} style={{ height: '220px' }} />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Chronological Crime Evolution</h4>
            <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded border border-slate-850">
              {selectedCriminal.behaviorAnalysis.crimeEvolution}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. CRIMINAL NETWORK ANALYSIS SCREEN
// ==========================================
export function CriminalNetworkScreen() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-200">Criminal Linkage Graph (Cytoscape.js)</h2>
          <p className="text-xs text-slate-400">Visualizing phone records, transaction flows, and accomplice links</p>
        </div>
      </div>
      <NetworkGraphWrapper />
    </div>
  );
}

// ==========================================
// 7. CRIME HEATMAP SCREEN
// ==========================================
export function CrimeHeatmapScreen() {
  const [densityFilter, setDensityFilter] = useState('ALL');

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-200">Karnataka Crime Density Radar</h2>
          <p className="text-xs text-slate-400">Time-series spatial clustering visualization</p>
        </div>
        <div className="flex gap-2">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDensityFilter(lvl)}
              className={`text-xs px-3 py-1.5 rounded border transition uppercase ${
                densityFilter === lvl ? 'bg-blue-900 border-blue-700 text-slate-100' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <LeafletMapWrapper />
    </div>
  );
}

// ==========================================
// 8. CRIME ANALYTICS SCREEN
// ==========================================
export function CrimeAnalyticsScreen() {
  const categoryOption: any = {
    title: { text: 'Crime Classification Index', textStyle: { color: '#94a3b8', fontSize: 12 } },
    xAxis: { type: 'category', data: ['Cyber', 'Theft', 'Narcotics', 'Burglary', 'Assault'], axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b' } },
    series: [{ data: [120, 80, 70, 95, 45], type: 'bar', color: '#1e3a8a' }]
  };

  const districtComparisonOption: any = {
    title: { text: 'District Wise Comparison (Cases)', textStyle: { color: '#94a3b8', fontSize: 12 } },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '55%',
        data: [
          { value: 42, name: 'Bengaluru City' },
          { value: 38, name: 'Hubballi-Dharwad' },
          { value: 21, name: 'Mysuru City' },
          { value: 12, name: 'Mangaluru' }
        ],
        roseType: 'radius'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <EChartWrapper option={categoryOption} />
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <EChartWrapper option={districtComparisonOption} />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-4">Tactical Sankey & Sunburst Analytics</h3>
        <div className="bg-slate-950 p-8 border border-slate-800 rounded text-center text-xs text-slate-500 font-mono">
          [Sankey Node Layer: Mule Bank accounts -&gt; Intermediate shell channels -&gt; offshore wallets]
          <p className="mt-2 text-blue-400">Total tracked money flow routing: ₹1.2 Crores. Sunburst hierarchy level depth: 3.</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 9. CRIME FORECAST SCREEN
// ==========================================
export function CrimeForecastScreen() {
  const forecastTrendOption: any = {
    title: { text: 'Predicted Crime Inflow Probability (Next 30 Days)', textStyle: { color: '#94a3b8', fontSize: 12 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['W1', 'W2', 'W3', 'W4'], axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#64748b' } },
    series: [{ data: [75, 82, 89, 78], type: 'line', color: '#dc2626', areaStyle: { opacity: 0.1 } }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-200">XGBoost Crime Forecasting Model</h2>
          <p className="text-xs text-slate-400 font-mono">Current active model: {MOCK_FORECAST.modelName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <EChartWrapper option={forecastTrendOption} />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-slate-850 pb-2">
            AI Feature Importance Index
          </h3>
          <div className="space-y-3">
            {MOCK_FORECAST.featureImportance.map((feat, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>{feat.feature}</span>
                  <span className="font-bold">{(feat.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: `${feat.importance * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <h3 className="text-sm font-bold text-slate-200 uppercase mb-4">Risk Index Probability Map</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_FORECAST.districtRiskMap.map((d, i) => (
            <div key={i} className="bg-slate-950 p-4 rounded border border-slate-850">
              <h4 className="text-xs font-bold text-slate-200">{d.district}</h4>
              <p className="text-2xl font-bold font-mono mt-2 text-red-500">{d.riskIndex}%</p>
              <p className="text-[10px] text-slate-500 mt-1">Confidence: {d.confidence}%</p>
              <p className="text-[10px] text-blue-400 mt-2 font-semibold">Key: {d.keyFeatures}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. INVESTIGATION TIMELINE SCREEN
// ==========================================
export function InvestigationTimelineScreen() {
  const { selectedFIR } = useGlobalStore();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
      <div className="border-b border-slate-850 pb-4">
        <h2 className="text-base font-bold text-slate-200">Investigation Chronicle - {selectedFIR.caseNumber}</h2>
        <p className="text-xs text-slate-400">AI-Generated chronological summary of investigative logs and checkpoints</p>
      </div>

      <div className="bg-blue-950/30 border border-blue-900/60 p-4 rounded text-xs text-slate-300 leading-relaxed">
        <span className="font-bold text-blue-400 flex items-center gap-1.5 mb-1.5 uppercase font-mono text-[10px]">
          <CpuChipIcon className="w-4 h-4" /> AI Generated Summary
        </span>
        Investigation initiated based on digital footprint triggers. Two potential mule accounts isolated within 24 hours. CCTV footage from Koramangala intersection matches suspect vehicle model. Raid authorized by DSP on 2026-07-13.
      </div>

      <div className="relative border-l-2 border-slate-800 pl-6 space-y-8">
        {selectedFIR.timeline.map((event, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center" />
            <span className="text-[10px] text-slate-500 font-mono block">{event.date}</span>
            <h4 className="text-sm font-bold text-slate-200 mt-0.5">{event.title}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 11. CASE SIMILARITY SCREEN
// ==========================================
export function CaseSimilarityScreen() {
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { lang } = useGlobalStore();

  const t = {
    EN: {
      title: "Upload FIR draft for cross-comparison",
      desc: "AI vector models will compare patterns against 20,000+ historical KSP files",
      drop: "Drag and drop FIR PDF here or click to browse",
      ready: "Ready for comparison",
      btnCompare: "Execute Semantic Comparison",
      loading: "Running Vector RAG..."
    },
    KN: {
      title: "ಅಡ್ಡ-ಹೋಲಿಕೆಗಾಗಿ ಎಫ್‌ಐಆರ್ ಕರಡನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      desc: "ಎಐ ವೆಕ್ಟರ್ ಮಾದರಿಗಳು ಮಾದರಿಗಳನ್ನು 20,000+ ಐತಿಹಾಸಿಕ ಕೆಎಸ್‌ಪಿ ಫೈಲ್‌ಗಳೊಂದಿಗೆ ಹೋಲಿಸುತ್ತವೆ",
      drop: "ಎಫ್‌ಐಆರ್ ಪಿಡಿಎಫ್ ಅನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಮತ್ತು ಬಿಡಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
      ready: "ಹೋಲಿಕೆಗೆ ಸಿದ್ಧವಾಗಿದೆ",
      btnCompare: "ವೆಕ್ಟರ್ ಹೋಲಿಕೆಯನ್ನು ಕಾರ್ಯಗತಗೊಳಿಸಿ",
      loading: "ವೆಕ್ಟರ್ ಆರ್‌ಎಜಿ ಚಾಲನೆಯಲ್ಲಿದೆ..."
    },
    HI: {
      title: "क्रॉस-तुलना के लिए प्राथमिकी (FIR) मसौदा अपलोड करें",
      desc: "एआई वेक्टर मॉडल 20,000+ ऐतिहासिक केएसपी फाइलों के खिलाफ पैटर्न की तुलना करेंगे",
      drop: "प्राथमिकी पीडीएफ यहां खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें",
      ready: "तुलना के लिए तैयार",
      btnCompare: "सिमेंटिक तुलना निष्पादित करें",
      loading: "वेक्टर आरएजी चल रहा है..."
    },
    MR: {
      title: "क्रॉस-तुलनेसाठी एफआयआर मसुदा अपलोड करा",
      desc: "एआय वेक्टर मॉडेल्स 20,000+ ऐतिहासिक केएसपी फायलींविरुद्ध पॅटर्नची तुलना करतील",
      drop: "येथे एफआयआर पीडीएफ ड्रॅग आणि ड्रॉप करा किंवा ब्राउझ करण्यासाठी क्लिक करा",
      ready: "तुलनेसाठी तयार",
      btnCompare: "सिमेंटिक तुलना कार्यान्वित करा",
      loading: "वेक्टर आरएजी चालू आहे..."
    }
  }[lang as 'EN' | 'KN' | 'HI' | 'MR'] || {
    title: "Upload FIR draft for cross-comparison",
    desc: "AI vector models will compare patterns against 20,000+ historical KSP files",
    drop: "Drag and drop FIR PDF here or click to browse",
    ready: "Ready for comparison",
    btnCompare: "Execute Semantic Comparison",
    loading: "Running Vector RAG..."
  };

  const handleFileSelect = () => {
    setFileName("Draft_FIR_Cyber_KSP_2026.pdf");
    setMatchScore(null);
  };

  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setMatchScore(84.6);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-center max-w-xl mx-auto space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">{t.title}</h3>
        <p className="text-xs text-slate-400">{t.desc}</p>
        
        <div 
          onClick={handleFileSelect}
          className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 p-8 rounded-lg cursor-pointer transition"
        >
          <DocumentTextIcon className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          {fileName ? (
            <div>
              <p className="text-xs font-semibold text-blue-500 font-mono">{fileName}</p>
              <p className="text-[10px] text-slate-500 mt-1">{t.ready}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">{t.drop}</p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-900 hover:bg-blue-800 border border-blue-700 text-slate-200 text-xs font-bold py-2 px-6 rounded uppercase tracking-wider disabled:opacity-50 min-w-[220px]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></span>
              <span>{t.loading}</span>
            </div>
          ) : t.btnCompare}
        </button>
      </div>

      {loading && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Analyzing document structure...</span>
            <span className="animate-pulse">Active</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded overflow-hidden">
            <div className="bg-blue-600 h-full w-[65%] animate-pulse"></div>
          </div>
        </div>
      )}

      {matchScore && !loading && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-200">Similarity Match Results</h4>
              <p className="text-xs text-slate-400">High correlation matched in cyber phishing category</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold font-mono text-red-500">{matchScore}%</span>
              <p className="text-[10px] text-slate-500 font-semibold font-mono">Vector Distance Match</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-slate-300">Top Correlated Historical Files</h5>
            <div className="p-3 bg-slate-950 border border-slate-850 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-200">FIR 0192/2024 (Card Cloning, HSR Layout)</p>
                <p className="text-[10px] text-slate-500">Suspect Aditya Hegde was listed as accessory in this docket</p>
              </div>
              <span className="text-xs font-mono font-bold text-red-400">92% Match</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 12. EVIDENCE CENTER SCREEN
// ==========================================
export function EvidenceCenterScreen() {
  const { selectedFIR } = useGlobalStore();
  const [ocrText, setOcrText] = useState('Extracting OCR Text. Click target document above to begin scanner.');

  const handleOcr = () => {
    setOcrText(`EXTRACTED TRANSCRIPT:
IP LOGS RECOVERED:
10.14.82.102 -> TIMESTAMP: 2026-07-10 14:02:10 UTC -> LOC: Hubballi ISP
PORT TRIGGERED: 8080 (Inbound SSH tunnel encrypted).
RECIPIENT MULE ID: CRM-001 (ADITYA HEGDE)`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Evidence Files List */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-4 h-[600px] flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-slate-850 pb-2 mb-4">
            Evidence Attachments
          </h3>
          <div className="space-y-3">
            {selectedFIR.attachments.map((file, idx) => (
              <div
                key={idx}
                onClick={handleOcr}
                className="bg-slate-950 p-3 border border-slate-850 hover:border-blue-800 rounded cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-slate-200 font-semibold">{file.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{file.size}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-850 rounded text-center">
          <p className="text-[10px] text-slate-400">Click any document to load into the AI OCR analyzer</p>
        </div>
      </div>

      {/* OCR and Chain of Custody */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">AI OCR Extraction Desk</h3>
            <button
              onClick={handleOcr}
              className="bg-blue-900 hover:bg-blue-800 border border-blue-700 text-slate-100 text-xs px-3 py-1 rounded"
            >
              Scan Again
            </button>
          </div>
          <textarea
            value={ocrText}
            readOnly
            className="w-full h-44 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 p-3 focus:outline-none font-mono"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-4">Evidence Chain of Custody</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-850 rounded flex justify-between items-center font-mono">
              <div>
                <p className="text-slate-200 font-semibold">1. Deposited in Locker #2</p>
                <p className="text-[9px] text-slate-500">By SI M. G. Nayak | Badg #8822</p>
              </div>
              <span className="text-[10px] text-slate-400">2026-07-11 16:30</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-850 rounded flex justify-between items-center font-mono">
              <div>
                <p className="text-slate-200 font-semibold">2. Transferred to Cyber forensic lab</p>
                <p className="text-[9px] text-slate-500">By Inspector R. K. Patil | Badg #9921</p>
              </div>
              <span className="text-[10px] text-slate-400">2026-07-13 09:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 13. FINANCIAL CRIME DASHBOARD
// ==========================================
export function FinancialCrimeScreen() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Mule Transaction Tracking Ledger</h2>
            <p className="text-xs text-slate-400">Suspicious transaction vectors siphoned from Karnataka commercial bank branches</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-850">
              <tr>
                <th className="p-3">Txn ID</th>
                <th className="p-3">Sender Name</th>
                <th className="p-3">Recipient Name</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Audit Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {MOCK_TRANSACTIONS.map((txn) => (
                <tr key={txn.id} className="bg-slate-900 hover:bg-slate-950 transition">
                  <td className="p-3 font-mono font-semibold text-blue-400">{txn.id}</td>
                  <td className="p-3">{txn.fromName}</td>
                  <td className="p-3">{txn.toName}</td>
                  <td className="p-3 font-mono font-semibold text-slate-100">₹{txn.amount.toLocaleString()}</td>
                  <td className="p-3 text-slate-400">{txn.date}</td>
                  <td className="p-3">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      txn.alertLevel === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 14. BEHAVIORAL PROFILING SCREEN
// ==========================================
export function BehavioralProfilingScreen() {
  const { selectedCriminal } = useGlobalStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-slate-850 pb-2">
          Offender Metadata
        </h3>
        <div className="space-y-3 text-xs text-slate-300">
          <p><span className="text-slate-500">Name:</span> {selectedCriminal.name}</p>
          <p><span className="text-slate-500">Wanted For:</span> Cyber Extortion & Mule Orchestration</p>
          <p><span className="text-slate-500">Offense Pace:</span> {selectedCriminal.behaviorAnalysis.offenseFrequency}</p>
        </div>
      </div>

      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-2">Modus Operandi Breakdown</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 border border-slate-850 rounded">
            {selectedCriminal.behaviorAnalysis.modusOperandi}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-2">Tactical Risk Radar</h3>
          <div className="space-y-3">
            {selectedCriminal.behaviorAnalysis.riskRadar.map((r, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-mono text-slate-400 mb-1">
                  <span>{r.trait}</span>
                  <span className="font-bold">{r.score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: `${r.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 15. OFFICER WORKSPACE SCREEN
// ==========================================
export function OfficerWorkspaceScreen() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Raid Koramangala internet hub hideout', done: true },
    { id: 2, text: 'Submit fingerprint card files to State Registry', done: false },
    { id: 3, text: 'Brief DSP Sunita on high-risk Kerala check post narcotics corrdior', done: false }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Todo checklist */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-slate-850 pb-2">
          Investigation Checklist
        </h3>
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className="p-3 bg-slate-950 border border-slate-850 rounded hover:border-slate-700 cursor-pointer flex items-center gap-3 transition"
            >
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => {}}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700"
              />
              <span className={`text-xs ${t.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {t.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Diary notes */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between h-[400px]">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-slate-850 pb-2 mb-4">
            Officer Diary Notes
          </h3>
          <textarea
            placeholder="Type notes for active case file log..."
            className="w-full h-56 bg-slate-950 border border-slate-850 text-xs text-slate-350 p-3 rounded focus:outline-none focus:border-blue-600 resize-none"
          />
        </div>
        <button className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-2 rounded uppercase tracking-wider">
          Save Case Diary Notes
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 16. POLICY DASHBOARD SCREEN
// ==========================================
export function PolicyDashboardScreen() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-4">Karnataka District Security Rankings</h3>
        <div className="space-y-4">
          {MOCK_POLICY_METRICS.map((metric, idx) => (
            <div key={idx} className="bg-slate-950 p-4 border border-slate-850 rounded grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <p className="text-xs font-bold text-slate-200">{metric.district}</p>
                <p className="text-[10px] text-slate-500">Security Rank #{idx + 1}</p>
              </div>
              <div className="text-xs font-mono">
                <span className="text-slate-500">Threat Index:</span> <span className="font-bold text-red-500">{metric.crimeIndex}</span>
              </div>
              <div className="text-xs font-mono">
                <span className="text-slate-500">Budget:</span> <span className="font-bold text-emerald-400">{metric.budgetAllocation}</span>
              </div>
              <div className="text-xs text-slate-300">
                <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Core Recommendation:</p>
                <p className="text-[10px] leading-relaxed mt-0.5">{metric.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 17. AI EXPLAINABILITY SCREEN
// ==========================================
export function AIExplainabilityScreen() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <div className="border-b border-slate-850 pb-4 mb-6">
          <h2 className="text-base font-bold text-slate-200">AI Decision Tree Interpretability</h2>
          <p className="text-xs text-slate-400">Logic tree representing automated risk scoring and trigger escalation pathways</p>
        </div>

        <div className="bg-slate-950 p-6 rounded border border-slate-850 font-mono text-xs text-slate-350 space-y-4">
          <h4 className="font-bold text-blue-400 border-b border-slate-850 pb-2 uppercase text-[10px]">
            {MOCK_DECISION_TREE.title} ({MOCK_DECISION_TREE.confidence}% accuracy)
          </h4>

          <div className="space-y-3 pl-2 border-l border-slate-800">
            <p className="text-slate-200 font-bold">1. {MOCK_DECISION_TREE.node.rule}</p>
            <div className="pl-6 space-y-3">
              <p className="text-red-400 font-medium">YES &rarr; {MOCK_DECISION_TREE.node.yes.rule}</p>
              <div className="pl-6 space-y-2">
                <p className="text-red-500 font-semibold">YES &rarr; {MOCK_DECISION_TREE.node.yes.yes.rule}</p>
                <div className="pl-6 bg-slate-900/60 p-2.5 rounded border border-slate-800 w-fit text-red-500">
                  {MOCK_DECISION_TREE.node.yes.yes.yes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 18. SETTINGS SCREEN
// ==========================================
export function SettingsScreen() {
  const { auditLogs } = useGlobalStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Role details */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-slate-850 pb-2">
          Security Level Configuration
        </h3>
        <div className="space-y-4 text-xs text-slate-300">
          <p><span className="text-slate-500">Access Node:</span> Bengaluru HQ Central Console</p>
          <p><span className="text-slate-500">Token Status:</span> ACTIVE</p>
          <div className="p-3 bg-slate-950 border border-slate-850 rounded font-mono text-[10px] text-slate-400">
            INTELLIGENCE PROTOCOL: A-12 RESTRICTED CLEARANCE REQUIRED. ALL SYSTEM SESSIONS ARCHIVED STATE-WIDE.
          </div>
        </div>
      </div>

      {/* Audit logs */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-slate-850 pb-2">
          Operator System Audit Logs
        </h3>
        <div className="space-y-2.5">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-950 border border-slate-850 rounded flex justify-between items-center text-xs font-mono">
              <div>
                <p className="font-semibold text-slate-200">{log.action}</p>
                <p className="text-[10px] text-slate-500">User: {log.user} | IP: {log.ip}</p>
              </div>
              <span className="text-[9px] text-slate-500">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
