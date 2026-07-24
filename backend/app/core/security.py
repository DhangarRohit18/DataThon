from datetime import datetime, timedelta, timezone
from typing import Any, Union, List
from jose import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

# Role based Permissions matrix
ROLE_PERMISSIONS = {
    "Administrator": ["*"],
    "SCRB Officer": ["fir:read", "fir:write", "criminal:read", "criminal:write", "analytics:read"],
    "Investigator": ["fir:read", "fir:write", "criminal:read", "evidence:read", "evidence:write", "workspace:all"],
    "Crime Analyst": ["fir:read", "criminal:read", "network:read", "forecast:read", "heatmap:read", "analytics:read"],
    "Supervisor": ["fir:read", "timeline:read", "analytics:read", "workspace:read", "policy:read", "explainability:read"],
    "Policymaker": ["analytics:read", "policy:read", "policy:write"],
    "Guest": ["fir:read"]
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], role: str, expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "permissions": ROLE_PERMISSIONS.get(role, ["fir:read"])
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
    return encoded_jwt

def decode_token(token: str) -> dict:
    try:
        decoded_payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return decoded_payload
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

class PermissionChecker:
    def __init__(self, required_permissions: List[str]):
        self.required_permissions = required_permissions

    def __call__(self, token: str = Depends(oauth2_scheme)) -> dict:
        payload = decode_token(token)
        user_role = payload.get("role")
        user_permissions = payload.get("permissions", [])

        # Admin gets global authorization
        if "*" in user_permissions:
            return payload

        # Verify role has all required permissions
        for perm in self.required_permissions:
            if perm not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"User role '{user_role}' lacks required permission: '{perm}'"
                )
        return payload
