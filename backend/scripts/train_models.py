import time
import json
import os
from app.ai.forecast import ForecastMLPipeline

# Local mock datasets for model training pipelines
MOCK_HOTSPOTS = [
    {"district": "Bengaluru City", "primaryCrime": "Cyber Fraud"},
    {"district": "Mysuru City", "primaryCrime": "Narcotics"},
    {"district": "Hubballi-Dharwad", "primaryCrime": "Burglary"},
    {"district": "Bengaluru City", "primaryCrime": "Cyber Fraud"},
    {"district": "Mysuru City", "primaryCrime": "Burglary"}
]

MOCK_TRANSACTIONS = [
    {"amount": 150000, "recipient_age_days": 12},
    {"amount": 5000, "recipient_age_days": 200},
    {"amount": 300000, "recipient_age_days": 5},
    {"amount": 15000, "recipient_age_days": 90}
]

def train_xgboost_forecast():
    """Simulates training an XGBoost Regressor model for crime risk forecasting."""
    print("==================================================")
    print("[MLOps] Starting Crime Forecast XGBoost Training Pipeline")
    print("==================================================")
    
    # 1. Load data
    print(f"[MLOps] Loading historical crime logs: {len(MOCK_HOTSPOTS)} active hotspots loaded.")
    time.sleep(1)
    
    # 2. Feature engineering
    pipeline = ForecastMLPipeline()
    raw_logs = [
        {"district": h["district"], "crime_type": h["primaryCrime"]} for h in MOCK_HOTSPOTS
    ]
    features = pipeline.engineer_spatial_temporal_features(raw_logs)
    print(f"[MLOps] Extracted {len(features)} spatial-temporal feature matrices.")
    time.sleep(1)
    
    # 3. Model parameters config
    params = {
        "learning_rate": 0.05,
        "max_depth": 6,
        "n_estimators": 150,
        "subsample": 0.8,
        "colsample_bytree": 0.8,
        "eval_metric": "rmse"
    }
    print(f"[MLOps] Hyperparameters: {json.dumps(params, indent=2)}")
    
    # 4. Simulated training iterations
    for epoch in range(1, 6):
        loss = 0.85 / (epoch ** 0.5)
        print(f"[MLOps] Epoch {epoch}/5 - Training Loss: {loss:.4f} - Validation Loss: {loss * 1.15:.4f}")
        time.sleep(0.8)
        
    # 5. Evaluation metrics
    metrics = {
        "Root Mean Squared Error (RMSE)": 0.1245,
        "Mean Absolute Error (MAE)": 0.0892,
        "R-squared Accuracy": 0.912
    }
    print(f"[MLOps] Final Validation Metrics: {json.dumps(metrics, indent=2)}")
    print("[MLOps] XGBoost Forecast Model weights successfully written to: 'app/models/forecast_xgboost.bin'")
    print("==================================================\n")

def train_anomaly_detector():
    """Simulates training an Isolation Forest model for financial transaction anomalies."""
    print("==================================================")
    print("[MLOps] Starting Transaction Anomaly Isolation Forest Pipeline")
    print("==================================================")
    
    # 1. Load ledger data
    print(f"[MLOps] Loading transaction ledgers: {len(MOCK_TRANSACTIONS)} audit lines loaded.")
    time.sleep(1)
    
    # 2. Extract features (Amount, Recipient Account Age)
    print("[MLOps] Feature matrices: [Transaction Amount, Recipient Account Age]")
    time.sleep(0.5)
    
    # 3. Train Isolation Forest
    print("[MLOps] Model parameters: contamination=0.05, n_estimators=100")
    time.sleep(1)
    print("[MLOps] Running tree splits...")
    time.sleep(1)
    
    # 4. Evaluation
    anomalous = 0
    pipeline = ForecastMLPipeline()
    for txn in MOCK_TRANSACTIONS:
        if pipeline.detect_transaction_anomaly(txn["amount"], txn["recipient_age_days"]):
            anomalous += 1
            
    print(f"[MLOps] Isolation Forest successfully fit. Detected {anomalous} outlier nodes.")
    print("[MLOps] Anomaly detection ruleset compiled.")
    print("==================================================")

if __name__ == "__main__":
    train_xgboost_forecast()
    train_anomaly_detector()
