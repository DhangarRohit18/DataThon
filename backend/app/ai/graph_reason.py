from typing import List, Dict, Any
from app.database.session import neo4j_connector

class GraphReasoningEngine:
    def __init__(self):
        self.connector = neo4j_connector

    def generate_cypher_lookup(self, suspect_name: str) -> str:
        """Dynamically build Cypher lookup command for target suspect network."""
        safe_name = suspect_name.replace("'", "\\'")
        return (
            f"MATCH (suspect:Criminal {{name: '{safe_name}'}})-[relationship:KNOWS|USED|CALLED|TRANSFERRED]-(accomplice)\n"
            "RETURN suspect.name, type(relationship), accomplice.name LIMIT 25;"
        )

    def find_shortest_path_cypher(self, source_suspect: str, target_suspect: str) -> str:
        """Find how two suspects are connected through phone calls, accounts, or vehicles."""
        safe_source = source_suspect.replace("'", "\\'")
        safe_target = target_suspect.replace("'", "\\'")
        return (
            f"MATCH (p1:Criminal {{name: '{safe_source}'}}), (p2:Criminal {{name: '{safe_target}'}})\n"
            "MATCH path = shortestPath((p1)-[*..6]-(p2))\n"
            "RETURN path;"
        )

    def run_community_detection(self) -> List[Dict[str, Any]]:
        """
        Concept query representing gang cluster grouping.
        Highlights isolated modules sharing similar phone calls or bank transactions.
        """
        # Simulated result structure
        return [
            {
                "gang_name": "Bengaluru Phishing Syndicate Alpha",
                "members": ["Aditya Hegde", "Sanjay Murthy", "Deepak Rao"],
                "common_assets": ["KA-01-MJ-8822 (Fortuner)", "SBI A/C *9282"],
                "influence_rank": 9.4
            },
            {
                "gang_name": "Mysuru Narcotics Transit Channel",
                "members": ["Rahul Krishnan", "Shameer K."],
                "common_assets": ["MH-09 Checkpoint Courier vehicle"],
                "influence_rank": 7.8
            }
        ]
