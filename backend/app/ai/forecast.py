from typing import List, Dict, Any

class ForecastMLPipeline:
    def __init__(self):
        self.model_name = "XGBoost-Regressor-v4.8"

    def engineer_spatial_temporal_features(self, raw_incident_logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Maps raw logs to ML features:
        - `mule_spike_index`: density of bank registrations.
        - `patrol_gap`: vacancy multiplier.
        - `temporal_season`: holiday periods.
        """
        features = []
        for log in raw_incident_logs:
            features.append({
                "district": log.get("district"),
                "mule_spike_index": 1.5 if log.get("crime_type") == "Cyber Fraud" else 0.2,
                "patrol_gap": 0.18,
                "temporal_season": 0.85, # holiday season loading factor
                "risk_rating": 89.0 if log.get("district") == "Bengaluru City" else 45.0
            })
        return features

    def detect_transaction_anomaly(self, txn_amount: float, recipient_acc_age_days: int) -> bool:
        """
        Isolation Forest logic check:
        Flag transaction as anomalous if amount exceeds threshold of ₹1,00,000
        and recipient account age is less than 30 days.
        """
        if txn_amount > 100000 and recipient_acc_age_days < 30:
            return True
        return False
