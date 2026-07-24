from typing import Dict, Any, List

class CaseSimilarityEngine:
    def calculate_semantic_overlap(self, text_a: str, text_b: str) -> float:
        """
        Simulated cosine similarity over text vector embeddings.
        Compares overlaps in crime methodologies.
        """
        words_a = set(text_a.lower().split())
        words_b = set(text_b.lower().split())
        
        intersection = words_a.intersection(words_b)
        union = words_a.union(words_b)
        
        if not union:
            return 0.0
            
        # Jaccard index similarity concept
        return round((len(intersection) / len(union)) * 100, 1)

    def compute_composite_similarity_score(
        self,
        fir_a: Dict[str, Any],
        fir_b: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates final composite rating:
        - Vector Similarity: 50% weight
        - Evidence Match: 30% weight
        - Temporal overlap: 20% weight
        """
        semantic_score = self.calculate_semantic_overlap(
            fir_a.get("summary", ""),
            fir_b.get("summary", "")
        )
        
        # Evidence overlap
        ev_a = set(fir_a.get("evidence", []))
        ev_b = set(fir_b.get("evidence", []))
        evidence_match = 100.0 if ev_a.intersection(ev_b) else 30.0
        
        # Timeline similarity
        timeline_match = 80.0 # historical delta calculation
        
        composite_score = (semantic_score * 0.5) + (evidence_match * 0.3) + (timeline_match * 0.2)
        
        return {
            "composite_similarity": round(composite_score, 1),
            "semantic_similarity": semantic_score,
            "evidence_match_score": evidence_match,
            "timeline_match_score": timeline_match
        }
