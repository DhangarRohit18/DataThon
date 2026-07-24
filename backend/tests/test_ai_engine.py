import pytest
from app.ai.similarity import CaseSimilarityEngine
from app.ai.rag import RAGPipeline
from app.ai.agents import CoordinatorAgent
from app.ai.graph_reason import GraphReasoningEngine

def test_semantic_overlap_calculation():
    """Verify CaseSimilarityEngine accurately scores semantic overlaps in text."""
    engine = CaseSimilarityEngine()
    
    # Test identical summaries
    score_identical = engine.calculate_semantic_overlap("cyber crime phishing wire transfer", "cyber crime phishing wire transfer")
    assert score_identical == 100.0

    # Test distinct summaries
    score_distinct = engine.calculate_semantic_overlap("narcotics checkpost Mysuru", "cyber card cloning Koramangala")
    assert score_distinct < 20.0

def test_composite_similarity_score():
    """Verify CaseSimilarityEngine aggregates weights correctly."""
    engine = CaseSimilarityEngine()
    fir_a = {"summary": "Cyber card spoofing and wire transfers", "evidence": ["IP Log", "Bank Book"]}
    fir_b = {"summary": "Wire transfer phishing card spoofing", "evidence": ["IP Log"]}
    
    result = engine.compute_composite_similarity_score(fir_a, fir_b)
    assert "composite_similarity" in result
    assert result["composite_similarity"] > 50.0 # High overlap

@pytest.mark.asyncio
async def test_coordinator_agent_routing():
    """Verify CoordinatorAgent correctly routes queries to target specialized sub-agents."""
    coordinator = CoordinatorAgent()
    context = {}
    
    # Test financial routing
    resp_fin = await coordinator.route_and_resolve("trace money and transactions", context)
    assert resp_fin.agent_name == "KAVACH Financial Crime Agent"
    
    # Test network routing
    resp_net = await coordinator.route_and_resolve("Accomplices of suspect Aditya Hegde", context)
    assert resp_net.agent_name == "KAVACH Network Analyst Agent"
    
    # Test forecast routing
    resp_forecast = await coordinator.route_and_resolve("predict future crime trends", context)
    assert resp_forecast.agent_name == "KAVACH Forecast Analytics Agent"

@pytest.mark.asyncio
async def test_rag_grounding_score():
    """Verify RAGPipeline calculates correct hallucination protection grounding indexes."""
    pipeline = RAGPipeline()
    sources = [
        {"text": "FIR 0042/2026 states suspect Aditya Hegde operates a phishing syndicate in Koramangala."}
    ]
    
    # Fully grounded response
    response_grounded = "Aditya Hegde operates a phishing syndicate in Koramangala"
    score_grounded = pipeline.calculate_grounding_score(response_grounded, sources)
    assert score_grounded > 80.0

    # Hallucinated response
    response_hallucinated = "Aditya Hegde was arrested with 5 kilograms of narcotics in Mysuru checkpost"
    score_hallucinated = pipeline.calculate_grounding_score(response_hallucinated, sources)
    assert score_hallucinated < 30.0

def test_cypher_query_escaping():
    """Verify GraphReasoningEngine escapes malicious characters to prevent Cypher injection."""
    engine = GraphReasoningEngine()
    
    malicious_input = "Aditya' DETACH DELETE c //"
    cypher_lookup = engine.generate_cypher_lookup(malicious_input)
    
    # Check that quote is escaped to prevent string breakout
    assert "Aditya\\'" in cypher_lookup
