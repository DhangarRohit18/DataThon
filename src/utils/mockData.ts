// KAVACH AI - Karnataka State Police High-Fidelity Mock Dataset

export interface FIR {
  id: string;
  caseNumber: string;
  district: string;
  policeStation: string;
  crimeType: string;
  date: string;
  status: 'PENDING' | 'UNDER_INVESTIGATION' | 'CHARGE_SHEETED' | 'CLOSED';
  complainant: string;
  officer: string;
  summary: string;
  suspects: string[];
  evidence: string[];
  attachments: { name: string; size: string; type: string }[];
  timeline: { title: string; date: string; description: string; type: string }[];
}

export interface CriminalProfile {
  id: string;
  name: string;
  alias: string;
  riskScore: number; // 0 - 100
  knownAssociates: { name: string; relation: string; id?: string }[];
  vehicles: string[];
  phones: string[];
  addresses: string[];
  financialLinks: { bank: string; accountNo: string; balance: string; flag: string }[];
  caseHistory: string[];
  behaviorAnalysis: {
    modusOperandi: string;
    offenseFrequency: string;
    riskRadar: { trait: string; score: number }[];
    crimeEvolution: string;
  };
  photoGallery: string[];
  timeline: { date: string; event: string; status: string }[];
}

export interface Hotspot {
  id: string;
  district: string;
  station: string;
  lat: number;
  lng: number;
  density: 'HIGH' | 'MEDIUM' | 'LOW';
  crimeCount: number;
  primaryCrime: string;
  radius: number; // in meters
}

export interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  fromName: string;
  toName: string;
  amount: number;
  date: string;
  status: 'SUCCESS' | 'SUSPICIOUS' | 'FLAGGED';
  alertLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PolicyMetric {
  district: string;
  crimeIndex: number;
  performanceScore: number;
  budgetAllocation: string;
  resourceShortfall: string;
  recommendation: string;
}

export const ROLES = [
  { id: 'Investigator', label: 'Investigator (SI / CI)', description: 'Field investigation and case diary tracking' },
  { id: 'Crime Analyst', label: 'Crime Analyst (DSP / SP)', description: 'Geospatial hot-spots, network graphs, MO analysis' },
  { id: 'Supervisor', label: 'Supervisor (IGP / ADGP)', description: 'District performance metrics and review meetings' },
  { id: 'SCRB Officer', label: 'SCRB Officer (State Record Bureau)', description: 'State-wide statistics and criminal records' },
  { id: 'Administrator', label: 'System Administrator', description: 'User roles, permissions, audit trails' },
  { id: 'Policymaker', label: 'Policymaker (DG & IGP / Home Ministry)', description: 'Budgeting, policy, strategic allocation' }
];

export const MOCK_FIRS: FIR[] = [
  {
    id: 'FIR-2026-001',
    caseNumber: 'FIR 0042/2026',
    district: 'Bengaluru City',
    policeStation: 'Koramangala Police Station',
    crimeType: 'Cyber Fraud / Money Laundering',
    date: '2026-07-10',
    status: 'UNDER_INVESTIGATION',
    complainant: 'HDFC Bank Security Ops',
    officer: 'Inspector R. K. Patil',
    summary: 'Multi-phishing scam involving fraudulent transactions routing through mule accounts across Karnataka. Over ₹1.2 Crores siphoned through shell accounts.',
    suspects: ['Aditya Hegde (Alias: Adi)', 'Sanjay Murthy'],
    evidence: ['Mule account statements', 'IP logs pointing to Hubballi', 'WhatsApp chats recovered'],
    attachments: [
      { name: 'IP_Log_Analysis.csv', size: '1.2 MB', type: 'document' },
      { name: 'Mule_Account_Flow.xlsx', size: '4.5 MB', type: 'document' },
      { name: 'CCTV_Capture_Mule.jpg', size: '890 KB', type: 'image' }
    ],
    timeline: [
      { title: 'Incident Registered', date: '2026-07-10 10:30 AM', description: 'Complaint filed by bank security cell', type: 'registration' },
      { title: 'Evidence Collected', date: '2026-07-11 02:00 PM', description: 'IP Address Logs fetched from ISP provider', type: 'evidence' },
      { title: 'Mule Account Raid', date: '2026-07-13 06:00 AM', description: 'Raid at Koramangala hideout, seized laptops', type: 'arrest' }
    ]
  },
  {
    id: 'FIR-2026-002',
    caseNumber: 'FIR 0098/2026',
    district: 'Hubballi-Dharwad',
    policeStation: 'Vidyanagar Police Station',
    crimeType: 'Organized Theft / Burglary',
    date: '2026-07-12',
    status: 'PENDING',
    complainant: 'K. S. Narayana swamy',
    officer: 'Sub-Inspector M. G. Nayak',
    summary: 'Burglary at commercial jewellery house. CCTV shows masked men entering through ventilators. Modus operandi matches the "Chaddi Gang" gang.',
    suspects: ['Chaddi Gang Affiliate A', 'Devendrappa'],
    evidence: ['Ventilator fingerprint scan', 'CCTV Video file HD'],
    attachments: [
      { name: 'Ventilator_Fprint_Data.pdf', size: '2.1 MB', type: 'document' },
      { name: 'CCTV_Footage_FrontGate.mp4', size: '45 MB', type: 'video' }
    ],
    timeline: [
      { title: 'FIR Filed', date: '2026-07-12 09:00 AM', description: 'Victim reported burglary of 500g gold ornaments', type: 'registration' },
      { title: 'Fingerprint Retrieval', date: '2026-07-12 04:00 PM', description: 'Forensic team lifted two partial prints', type: 'evidence' }
    ]
  },
  {
    id: 'FIR-2026-003',
    caseNumber: 'FIR 0105/2026',
    district: 'Mysuru City',
    policeStation: 'Devaraja Police Station',
    crimeType: 'Narcotics Smuggling',
    date: '2026-07-15',
    status: 'CHARGE_SHEETED',
    complainant: 'Anti-Narcotics Squad',
    officer: 'DSP Sunita Deshpande',
    summary: 'Seizure of commercial quantities of synthetic drugs at a highway checkpoint outside Mysuru. Courier vehicle tracked from Kerala.',
    suspects: ['Rahul Krishnan', 'Shameer K.'],
    evidence: ['Seizure memo', 'Weighment reports', 'Mobile intercept transcripts'],
    attachments: [
      { name: 'Seizure_Memo_Certified.pdf', size: '840 KB', type: 'document' },
      { name: 'Narcotics_Lab_Report.pdf', size: '3.1 MB', type: 'document' }
    ],
    timeline: [
      { title: 'Vehicle Intercepted', date: '2026-07-15 02:15 AM', description: 'Checkpoint intercept of MH-09 vehicle', type: 'incident' },
      { title: 'Seizure & Arrests', date: '2026-07-15 04:00 AM', description: 'Rahul and Shameer booked under NDPS Act', type: 'arrest' },
      { title: 'Chargesheet Filed', date: '2026-07-16 04:00 PM', description: 'Chargesheet filed in NDPS Special Court', type: 'court' }
    ]
  }
];

export const MOCK_CRIMINALS: CriminalProfile[] = [
  {
    id: 'CRM-001',
    name: 'Aditya Hegde',
    alias: 'Adi / Cyber Hegde',
    riskScore: 88,
    knownAssociates: [
      { name: 'Sanjay Murthy', relation: 'Co-conspirator / Tech Developer', id: 'CRM-002' },
      { name: 'Deepak Rao', relation: 'Mule Account Agent' },
      { name: 'Meena Shenoy', relation: 'Financial Administrator' }
    ],
    vehicles: ['KA-01-MJ-8822 (Black Fortuner)', 'KA-03-MM-4492 (White Swift)'],
    phones: ['+91 98450 11223', '+91 99002 88440'],
    addresses: ['Flat 402, Oakwood Apts, HSR Layout, Bengaluru', 'House 52, 4th Cross, Gokulam, Mysuru'],
    financialLinks: [
      { bank: 'SBI Koramangala', accountNo: '30291049282', balance: '₹4,50,000', flag: 'Mule Source' },
      { bank: 'Canara Bank Mysuru', accountNo: '109281039812', balance: '₹82,00,000', flag: 'Suspicious Flow' }
    ],
    caseHistory: ['FIR 0042/2026 (Cyber Fraud)', 'FIR 0192/2024 (Card Cloning)', 'FIR 0031/2023 (Identity Theft)'],
    behaviorAnalysis: {
      modusOperandi: 'Coordinates large-scale phishing campaigns hosted on offshore servers. Routes money in blocks of ₹45,000 via a nested layer of 50+ student bank accounts to bypass triggers.',
      offenseFrequency: 'High. Runs campaigns during festive seasons and income tax filing months.',
      riskRadar: [
        { trait: 'Violent Tendency', score: 10 },
        { trait: 'Technical Sophistication', score: 95 },
        { trait: 'Recidivism Risk', score: 85 },
        { trait: 'Network Size', score: 75 },
        { trait: 'Financial Impact', score: 90 }
      ],
      crimeEvolution: 'Transitioned from credit card cloning in 2023 to orchestrating cross-state AI-voice clone extortion syndicates in 2026.'
    },
    photoGallery: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
    ],
    timeline: [
      { date: '2023-04-12', event: 'Arrested in credit card fraud at Bengaluru Airport', status: 'BAIL_OUT' },
      { date: '2024-11-20', event: 'Suspect linked to ₹40 Lakh UPI spoofing incident', status: 'INVESTIGATION_ONGOING' },
      { date: '2026-07-10', event: 'Named as Primary Accused in FIR 0042/2026', status: 'WANTED' }
    ]
  },
  {
    id: 'CRM-002',
    name: 'Sanjay Murthy',
    alias: 'Code Murthy',
    riskScore: 72,
    knownAssociates: [
      { name: 'Aditya Hegde', relation: 'Lead Financier', id: 'CRM-001' }
    ],
    vehicles: ['KA-05-KP-7711 (Bullet 350)'],
    phones: ['+91 98860 44921'],
    addresses: ['PG Room 10, PG Elite, PG Lane, Marathahalli, Bengaluru'],
    financialLinks: [
      { bank: 'HDFC Marathahalli', accountNo: '40918290182', balance: '₹12,40,000', flag: 'Mule Receiver' }
    ],
    caseHistory: ['FIR 0042/2026 (Cyber Fraud)', 'FIR 0077/2025 (Source Code Leak)'],
    behaviorAnalysis: {
      modusOperandi: 'Writes custom spyware scripts and payload templates. Rents phishing kits to local syndicates. Prefers telegram-based operations.',
      offenseFrequency: 'Medium. Project-based involvement.',
      riskRadar: [
        { trait: 'Violent Tendency', score: 5 },
        { trait: 'Technical Sophistication', score: 90 },
        { trait: 'Recidivism Risk', score: 65 },
        { trait: 'Network Size', score: 40 },
        { trait: 'Financial Impact', score: 60 }
      ],
      crimeEvolution: 'Began as a freelance programmer, hired on freelance boards, gradually sucked into deep-web carding circles by Aditya.'
    },
    photoGallery: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'
    ],
    timeline: [
      { date: '2025-05-18', event: 'Detained for questioning in Source Code leak case', status: 'RELEASED' },
      { date: '2026-07-10', event: 'Identified as technical administrator of phishing servers', status: 'ABSCONDING' }
    ]
  }
];

export const MOCK_HOTSPOTS: Hotspot[] = [
  { id: 'H-01', district: 'Bengaluru City', station: 'Koramangala Police Station', lat: 12.9352, lng: 77.6244, density: 'HIGH', crimeCount: 42, primaryCrime: 'Cyber Fraud', radius: 400 },
  { id: 'H-02', district: 'Bengaluru City', station: 'Whitefield Police Station', lat: 12.9698, lng: 77.7499, density: 'HIGH', crimeCount: 35, primaryCrime: 'Identity Theft', radius: 300 },
  { id: 'H-03', district: 'Mysuru City', station: 'Devaraja Police Station', lat: 12.3086, lng: 76.6531, density: 'MEDIUM', crimeCount: 21, primaryCrime: 'Narcotics', radius: 600 },
  { id: 'H-04', district: 'Hubballi-Dharwad', station: 'Vidyanagar Police Station', lat: 15.3647, lng: 75.1240, density: 'HIGH', crimeCount: 38, primaryCrime: 'Burglary', radius: 500 },
  { id: 'H-05', district: 'Mangaluru City', station: 'Pandeshwar Police Station', lat: 12.8624, lng: 74.8436, density: 'LOW', crimeCount: 12, primaryCrime: 'Trafficking', radius: 700 }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-90812', fromAccount: '30291049282 (SBI)', toAccount: '40918290182 (HDFC)', fromName: 'Aditya Hegde', toName: 'Sanjay Murthy', amount: 450000, date: '2026-07-10 14:02', status: 'SUSPICIOUS', alertLevel: 'HIGH' },
  { id: 'TXN-90813', fromAccount: '40918290182 (HDFC)', toAccount: '99281029102 (Paytm)', fromName: 'Sanjay Murthy', toName: 'Unknown Mule A', amount: 50000, date: '2026-07-10 14:15', status: 'SUCCESS', alertLevel: 'LOW' },
  { id: 'TXN-90814', fromAccount: '30291049282 (SBI)', toAccount: '82710291029 (Canara)', fromName: 'Aditya Hegde', toName: 'Mule Agent Deepak', amount: 1500000, date: '2026-07-09 11:22', status: 'FLAGGED', alertLevel: 'HIGH' },
  { id: 'TXN-90815', fromAccount: '11002910291 (ICICI)', toAccount: '30291049282 (SBI)', fromName: 'Victim Client', toName: 'Aditya Hegde', amount: 1200000, date: '2026-07-08 09:30', status: 'FLAGGED', alertLevel: 'HIGH' }
];

export const MOCK_POLICY_METRICS: PolicyMetric[] = [
  { district: 'Bengaluru City', crimeIndex: 78, performanceScore: 92, budgetAllocation: '₹45 Crores', resourceShortfall: '15% Personnel, 8% Vehicles', recommendation: 'Deploy Cyber Crime dedicated sub-stations in East, South-East zones; double training allocation for junior sub-inspectors.' },
  { district: 'Mysuru City', crimeIndex: 42, performanceScore: 88, budgetAllocation: '₹18 Crores', resourceShortfall: '5% Personnel, 12% CCTV coverage', recommendation: 'Upgrade CCTV density around heritage zones; establish seasonal tourist police assistance booths.' },
  { district: 'Hubballi-Dharwad', crimeIndex: 61, performanceScore: 79, budgetAllocation: '₹22 Crores', resourceShortfall: '22% Personnel, 18% Patrol Cars', recommendation: 'Urgent reinforcement of highway patrols along AH47; deploy fast-response crime teams at commercial hubs.' },
  { district: 'Belagavi', crimeIndex: 35, performanceScore: 85, budgetAllocation: '₹14 Crores', resourceShortfall: '10% Communications Equipment', recommendation: 'Standardize cross-border district coordination protocols with Maharashtra state authorities.' }
];

// Forecaster feature importance & model info
export const MOCK_FORECAST = {
  modelName: 'KAVACH AI - Multi-Temporal XGBoost v4.8',
  districtRiskMap: [
    { district: 'Bengaluru City', riskIndex: 89, confidence: 94, trend: 'UPWARD', keyFeatures: 'Festive seasons, high digital transaction volumes, IP registration anomalies' },
    { district: 'Hubballi-Dharwad', riskIndex: 72, confidence: 88, trend: 'STABLE', keyFeatures: 'Highway transition density, historical gang activity records' },
    { district: 'Mysuru City', riskIndex: 48, confidence: 85, trend: 'DOWNWARD', keyFeatures: 'Community policing patrol frequency, high educational index' },
    { district: 'Mangaluru City', riskIndex: 55, confidence: 82, trend: 'UPWARD', keyFeatures: 'Port activity fluctuations, border transit checkpoints' }
  ],
  featureImportance: [
    { feature: 'Mule Account Creation Spike', importance: 0.35 },
    { feature: 'Seasonal Tourist Inflow', importance: 0.22 },
    { feature: 'Local Police Vacancy Rate', importance: 0.18 },
    { feature: 'Night Patrol Coverage Index', importance: 0.15 },
    { feature: 'Average Temperature Deviation', importance: 0.10 }
  ]
};

// AI Explainability tree structure
export const MOCK_DECISION_TREE = {
  title: 'AI Cyber Threat Risk Escalation Model',
  confidence: 96.4,
  node: {
    rule: 'Is Transfer Amount > ₹1,00,000?',
    yes: {
      rule: 'Is Recipient Account less than 30 days old?',
      yes: {
        rule: 'Is Recipient IP from anomalous high-risk zone?',
        yes: 'Escalate to HIGH ALERT (96.4% confidence)',
        no: 'Escalate to MEDIUM ALERT (82.1% confidence)'
      },
      no: 'Normal Risk Route (Low Alert)'
    },
    no: {
      rule: 'Has sender been associated with high-risk device?',
      yes: 'Escalate to MEDIUM ALERT (74.3% confidence)',
      no: 'Clear / Low Risk'
    }
  }
};
