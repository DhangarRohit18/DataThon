from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Boolean, Text, Table, Column
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

# Many-to-many relationship mapping accused to case files
fir_accused_association = Table(
    "fir_accused_association",
    Base.metadata,
    Column("fir_id", String, ForeignKey("firs.id", ondelete="CASCADE"), primary_key=True),
    Column("accused_id", String, ForeignKey("accused.id", ondelete="CASCADE"), primary_key=True)
)

class PoliceStation(Base):
    __tablename__ = "police_stations"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    district: Mapped[str] = mapped_column(String, index=True)
    jurisdiction_radius: Mapped[int] = mapped_column(Integer, default=500)
    
    users: Mapped[List["User"]] = relationship(back_populates="police_station")
    firs: Mapped[List["FIR"]] = relationship(back_populates="police_station")

class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String, default="Guest")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    police_station_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey("police_stations.id"))

    police_station: Mapped[Optional["PoliceStation"]] = relationship(back_populates="users")
    audit_logs: Mapped[List["AuditLog"]] = relationship(back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="user")

class FIR(Base):
    __tablename__ = "firs"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    case_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    police_station_id: Mapped[str] = mapped_column(String, ForeignKey("police_stations.id"))
    crime_type: Mapped[str] = mapped_column(String, index=True)
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    status: Mapped[str] = mapped_column(String, default="PENDING")
    complainant: Mapped[str] = mapped_column(String)
    officer: Mapped[str] = mapped_column(String)
    summary: Mapped[str] = mapped_column(Text)

    police_station: Mapped["PoliceStation"] = relationship(back_populates="firs")
    accused_list: Mapped[List["Accused"]] = relationship(
        secondary=fir_accused_association, back_populates="firs"
    )
    evidence: Mapped[List["Evidence"]] = relationship(back_populates="fir")

class Accused(Base):
    __tablename__ = "accused"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    alias: Mapped[Optional[str]] = mapped_column(String)
    risk_score: Mapped[int] = mapped_column(Integer, default=0)
    phone: Mapped[Optional[str]] = mapped_column(String)
    address: Mapped[Optional[str]] = mapped_column(String)

    firs: Mapped[List["FIR"]] = relationship(
        secondary=fir_accused_association, back_populates="accused_list"
    )
    vehicles: Mapped[List["Vehicle"]] = relationship(back_populates="owner")

class Evidence(Base):
    __tablename__ = "evidence"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    fir_id: Mapped[str] = mapped_column(String, ForeignKey("firs.id"))
    file_name: Mapped[str] = mapped_column(String)
    file_size: Mapped[str] = mapped_column(String)
    ocr_extracted_text: Mapped[Optional[str]] = mapped_column(Text)

    fir: Mapped["FIR"] = relationship(back_populates="evidence")

class Vehicle(Base):
    __tablename__ = "vehicles"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    plate_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    make: Mapped[str] = mapped_column(String)
    model: Mapped[str] = mapped_column(String)
    owner_id: Mapped[str] = mapped_column(String, ForeignKey("accused.id"))

    owner: Mapped["Accused"] = relationship(back_populates="vehicles")

class FinancialRecord(Base):
    __tablename__ = "financial_records"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    from_account: Mapped[str] = mapped_column(String, index=True)
    to_account: Mapped[str] = mapped_column(String, index=True)
    from_name: Mapped[str] = mapped_column(String)
    to_name: Mapped[str] = mapped_column(String)
    amount: Mapped[float] = mapped_column(Float)
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    status: Mapped[str] = mapped_column(String, default="SUCCESS")
    alert_level: Mapped[str] = mapped_column(String, default="LOW")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    action: Mapped[str] = mapped_column(String)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    ip_address: Mapped[str] = mapped_column(String)

    user: Mapped["User"] = relationship(back_populates="audit_logs")

class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    text: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String, default="low")
    unread: Mapped[bool] = mapped_column(Boolean, default=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="notifications")
