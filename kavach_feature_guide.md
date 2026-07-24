# KAVACH AI: Feature & Workflow Reference Guide

Welcome to the **KAVACH AI** documentation reference. KAVACH is a secure, state-of-the-art Crime Intelligence Operating System developed for the **Karnataka State Police**. The system is built around a dynamic, role-based architecture that limits data visibility and isolates command views based on administrative and tactical clearance.

---

## 1. Feature Map by Operational Role

KAVACH segments its interface dynamically into 5 distinct workspaces. Here is the feature-to-role matrix mapping out exactly what permissions are enabled:

| Navigation Group | Feature Screen | Investigator | Crime Analyst | Supervisor | Policymaker | Administrator |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Command Center** | Overview Dashboard | Yes | Yes | Yes | Yes | Yes |
| | CrimeGPT Copilot | Yes | Yes | Yes | - | Yes |
| | Officer Workspace | Yes | - | Yes | - | Yes |
| **Investigative Records** | FIR Explorer | Yes | Yes | Yes | - | Yes |
| | Criminal Profiles | Yes | Yes | Yes | - | Yes |
| | Evidence Center | Yes | - | Yes | - | Yes |
| | Case Timeline | Yes | - | Yes | - | Yes |
| | Case Similarity (Vector RAG) | Yes | Yes | - | - | Yes |
| **Advanced Intelligence** | Network Linkages (Neo4j) | - | Yes | Yes | - | Yes |
| | GIS Crime Heatmap | - | Yes | Yes | Yes | Yes |
| | Financial Crimes | - | Yes | Yes | - | Yes |
| | MO & Behavior Profile | - | Yes | - | - | Yes |
| | XGBoost Risk Forecast | - | Yes | - | Yes | Yes |
| **System & Governance** | Policy Dashboard | - | - | Yes | Yes | Yes |
| | AI Explainability (Shapley) | - | - | Yes | - | Yes |
| | System Settings (Audit Logs) | - | - | - | - | Yes |

---

## 2. Core Features Description & Operational Flows

### Feature 1: Role-Based Secure Login Flow
- **Goal**: Protect sensitive police records from unauthorized actors using secure badge-level credential verification and MFA simulation.
- **Workflow**:
  1. Operator enters their **Badge ID / Government Email** (e.g., `KSP-9921-2026`).
  2. Selects their **Operational Role** from the dropdown (determines interface restrictions).
  3. Clicks **Request Secure OTP** -> A 6-digit numeric token is simulated and sent to the registered officer's mobile number.
  4. Entering the valid OTP logs the user into the environment, dynamically building the workspace sidebar navigation according to their role rules.

### Feature 2: CrimeGPT Copilot Flow
- **Goal**: Natural language query interface allowing officers to ask conversational questions about active suspects, modus operandi, and crime clusters.
- **Workflow**:
  1. The user inputs an investigative query (e.g., *"What is Aditya Hegde's risk level and associates?"*).
  2. The frontend routes the text via POST to `/api/v1/copilot/query`.
  3. The **Coordinator Agent** parses the intent and routes the query to the correct specialized sub-agent (e.g., Financial Agent, Evidence Agent, Network Agent).
  4. The sub-agent queries the live database (SQL/NoSQL) using structured query parameters.
  5. The assistant returns a unified message along with **Evidence Sources** (traceable documents), **Reasoning Steps** (decision timeline), and **AI Confidence Level**.

### Feature 3: Case Similarity (Vector RAG) Flow
- **Goal**: Automate semantic pattern recognition to match new FIR files against historical police records.
- **Workflow**:
  1. The officer drafts or uploads an FIR in PDF/document format.
  2. Clicks **Execute Semantic Comparison**.
  3. The backend runs the document through an embedding model and queries a vector database (ChromaDB) using nearest-neighbor similarity.
  4. The page returns a **Vector Distance Match Score (%)** and lists the top correlated dockets (e.g., identifying that the modus operandi matches a known cyber phishing gang from 2024).

### Feature 4: Network Linkages (Neo4j Graph) Flow
- **Goal**: Uncover hidden crime rings by visualizing phone records, transaction trails, and co-accused relationships.
- **Workflow**:
  1. Analyst inputs a suspect's name (e.g., *"Aditya Hegde"*).
  2. The application requests network data from the `/criminals/network/{name}` endpoint.
  3. A Cypher query executes against the Neo4j Graph Database to find all connections within a 2-hop radius.
  4. The screen renders an interactive force-directed graph (Cytoscape.js) showing suspects as nodes and relations (KNOWS, TRANSFERRED, CALLED) as labeled edges.

### Feature 5: GIS Crime Heatmap Flow
- **Goal**: Map spatial-temporal hotspots to dispatch patrols efficiently.
- **Workflow**:
  1. Interactive Map displays current incident coordinates across districts using Leaflet.js.
  2. Analysts filter incidents by density level (`HIGH`, `MEDIUM`, `LOW`) or use the time-slider to scrub through historical periods.
  3. Hotspot areas with dense incident logs display as prominent color-clustered circles, enabling supervisors to route patrol vehicles dynamically.

### Feature 6: XGBoost Risk Forecast Flow
- **Goal**: Predict future crime trends based on seasonal indicators, weather parameters, and economic variables.
- **Workflow**:
  1. The forecaster aggregates historical records.
  2. XGBoost model forecasts the risk probability score for the upcoming month across districts.
  3. The interface displays the **Predicted Crime Probability**, lists the **AI Feature Importance Index** (e.g., UPI volume spike: 42%, Weather index: 18%), and lists specific tactical recommendations.

---

## 3. Custom Dashboard Mock Views

### 👮 Investigator View
- **Focus**: Day-to-day operations and case files.
- **Widgets**: Today's Active Cases, Local Patrol Vehicle Status, Latest FIR Ingestion list, Case Diary Notes form, and Evidence OCR extractors.

### 📊 Crime Analyst View
- **Focus**: Intel aggregation and trend predictions.
- **Widgets**: Monthly Crime Trajectory line chart, Cyber/Theft Classification bar charts, GIS Heatmaps, Neo4j connection tables, and XGBoost forecasting cards.

### 🎖️ Supervisor View
- **Focus**: Command coordination and auditing.
- **Widgets**: State-wide Command Overview, Critical Threat Alerts (urgent escalation flags), Audit log feeds, and AI Shapley Explainability trees.

### 🏛️ Policymaker View
- **Focus**: Long-term state planning and budgets.
- **Widgets**: District Security Rankings, Threat Indexes, Budget allocations, and Strategic policy recommendation logs.
