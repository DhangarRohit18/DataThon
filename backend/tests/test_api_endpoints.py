import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, AsyncMock, patch
from app.main import app
from app.database.session import get_db

# --- Mock Database Session Dependency ---
async def mock_get_db():
    mock_session = MagicMock()
    
    # Mock execution outputs to return simulated user objects
    mock_result = MagicMock()
    mock_user = MagicMock()
    mock_user.id = "USR-12345"
    mock_user.username = "officer_test_9921"
    mock_user.hashed_password = "mock_hashed_password"
    mock_user.role = "Investigator"
    
    mock_result.scalars.return_value.first.return_value = None # No duplicate user
    mock_session.execute = AsyncMock(return_value=mock_result)
    mock_session.commit = AsyncMock()
    
    yield mock_session

# Apply dependency override
app.dependency_overrides[get_db] = mock_get_db

client = TestClient(app)

def test_health_check_endpoint():
    """Verify system health report endpoint runs correctly."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data

def test_unauthorized_fir_access():
    """Verify authorization security blocks requests lacking bearer tokens."""
    response = client.get("/api/v1/firs")
    assert response.status_code == 401 # Unauthorized

@patch("app.api.endpoints.get_password_hash")
def test_auth_and_register(mock_hash):
    """Verify user registration and token encoding lifecycle."""
    mock_hash.return_value = "mock_hashed_pw"
    
    register_payload = {
        "username": "officer_test_9921",
        "email": "test_officer@ksp.gov.in",
        "password": "SecurePassword123!",
        "role": "Investigator"
    }
    
    response = client.post("/api/v1/auth/register", json=register_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "Investigator"
