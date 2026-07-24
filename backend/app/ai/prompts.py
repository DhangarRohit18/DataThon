# KAVACH AI - Prompt Library

CASE_SUMMARY_PROMPT = """
You are a Senior Criminal Investigator for Karnataka State Police. Analyze the provided FIR log:
FIR Number: {case_number}
Summary: {summary}
Evidence list: {evidence}
Suspect list: {suspects}

Generate a structured Case Summary containing:
1. Incident Timeline Breakdown.
2. Modus Operandi (MO) description.
3. Key gaps in evidence collection.
4. Immediate priority checklist for the Investigating Officer.
Format the output as a professional police briefing note.
"""

EVIDENCE_ANALYSIS_PROMPT = """
You are a Forensic Cyber Crime Expert. Examine the extracted text and metadata:
Document Name: {file_name}
Extracted Contents: {extracted_text}

Provide:
1. Semantic relevance score (0-100) linking this file to active suspects.
2. Flagged indicators (IP addresses, transaction balances, spoof IDs).
3. Chain of custody verification checklist.
4. Suggested follow-up forensic steps.
"""

INVESTIGATION_STRATEGY_PROMPT = """
You are a Principal Crime Strategist. Based on the accused profile:
Suspect Name: {name} (Alias: {alias})
Risk Score: {risk_score}%
Modus Operandi: {modus_operandi}
Known Associates: {associates}

Formulate an active investigation strategy:
1. Direct interview questions targeting MO loopholes.
2. Digital surveillance endpoints (specific IP scopes, communication profiles).
3. Financial audit paths (specific ledger routes, bank accounts).
4. Physical surveillance hot spots near previous sightings.
"""

CRIME_PREDICTION_PROMPT = """
You are an AI Forecast System Engineer. Given the district data:
District: {district}
Historical Crime Index: {crime_index}
Risk Index: {risk_index}%
Model Used: XGBoost v4.8 Time-Series Classifier

Explain the forecast:
1. Why does the model predict a risk score of {risk_index}%?
2. Which feature variables (e.g. temperature, seasonality, patrol vacancy) contributed most?
3. Recommended deployment shifts for police vehicles.
"""

EXPLAINABILITY_GROUNDING_PROMPT = """
You are an Explainable AI (XAI) Grounding Assessor. Evaluate the generated decision:
Context Sources: {sources}
AI Prediction: {prediction}

Output:
1. Hallucination assessment (Is the prediction 100% grounded in sources? Yes/No).
2. Citation indexes (Match each claim in the prediction to a source file).
3. AI Confidence level calculated based on source grounding density.
"""
