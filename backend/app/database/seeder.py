"""
KAVACH AI — Database Seeder
Seeds all tables with rich demo data for Karnataka State Police hackathon demonstration.
"""
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import hashlib

from app.domain.models import (
    PoliceStation, User, FIR, Accused, Evidence,
    Vehicle, FinancialRecord, AuditLog, Notification,
    fir_accused_association
)

def _hash(pw: str) -> str:
    """Simple seeder hash — demo only."""
    return "$demo$" + hashlib.sha256(pw.encode()).hexdigest()


async def seed_database(db: AsyncSession):
    """Idempotent seeder — skips if data already exists."""
    result = await db.execute(select(FIR))
    if result.scalars().first():
        return  # Already seeded

    # ── Police Stations ──────────────────────────────────────────────────────
    stations = [
        PoliceStation(id="PS-KOR", name="Koramangala PS", district="Bengaluru City", jurisdiction_radius=800),
        PoliceStation(id="PS-HUB", name="Hubballi Central PS", district="Hubballi-Dharwad", jurisdiction_radius=600),
        PoliceStation(id="PS-MYS", name="Mysuru City PS", district="Mysuru City", jurisdiction_radius=700),
        PoliceStation(id="PS-MNG", name="Mangaluru East PS", district="Mangaluru", jurisdiction_radius=500),
        PoliceStation(id="PS-IND", name="Indiranagar PS", district="Bengaluru City", jurisdiction_radius=600),
    ]
    db.add_all(stations)

    # ── Users ────────────────────────────────────────────────────────────────
    users = [
        User(id="USR-001", username="inspector_arjun", email="arjun@ksp.gov.in",
             hashed_password=_hash("ksp2026"), role="Inspector", police_station_id="PS-KOR"),
        User(id="USR-002", username="si_priya", email="priya@ksp.gov.in",
             hashed_password=_hash("ksp2026"), role="SI", police_station_id="PS-HUB"),
        User(id="USR-003", username="dsp_raghavan", email="raghavan@ksp.gov.in",
             hashed_password=_hash("ksp2026"), role="DSP", police_station_id="PS-MYS"),
        User(id="USR-SYS", username="kavach_system", email="system@kavach.ai",
             hashed_password=_hash("system2026"), role="Admin", police_station_id="PS-KOR"),
    ]
    db.add_all(users)

    # ── Accused Profiles ─────────────────────────────────────────────────────
    accused_list = [
        Accused(id="ACC-001", name="Aditya Hegde", alias="Adi / Cyber King",
                risk_score=88, phone="+91 98450 11223",
                address="Flat 4B, Shivaji Nagar, Hubballi - 580031"),
        Accused(id="ACC-002", name="Sanjay Murthy", alias="SM / The Coder",
                risk_score=72, phone="+91 98860 44921",
                address="Absconding — last pinged Mysuru Railway Station"),
        Accused(id="ACC-003", name="Deepak Rao", alias="Dee / Mule King",
                risk_score=65, phone="+91 97310 22108",
                address="14, Gandhi Nagar, Dharwad - 580001"),
        Accused(id="ACC-004", name="Meena Shenoy", alias="MS / Finance Admin",
                risk_score=45, phone="+91 96320 77450",
                address="22, MG Road, Bengaluru - 560001"),
        Accused(id="ACC-005", name="Rahul Krishnan", alias="RK / Transit King",
                risk_score=78, phone="+91 99001 55312",
                address="Remanded — Mysuru District Jail"),
        Accused(id="ACC-006", name="Chaddi Gang Member A", alias="Unknown",
                risk_score=55, phone=None,
                address="Unknown — fingerprint match 82.5% on State Registry"),
    ]
    db.add_all(accused_list)

    # ── Vehicles ─────────────────────────────────────────────────────────────
    vehicles = [
        Vehicle(id="VEH-001", plate_number="KA-01-MJ-8822", make="Toyota", model="Fortuner", owner_id="ACC-001"),
        Vehicle(id="VEH-002", plate_number="TN-09-AL-7721", make="Tata", model="Ace", owner_id="ACC-005"),
        Vehicle(id="VEH-003", plate_number="KA-20-AB-1234", make="Honda", model="Activa", owner_id="ACC-003"),
    ]
    db.add_all(vehicles)

    # ── FIR Records ──────────────────────────────────────────────────────────
    firs = [
        FIR(id="FIR-001", case_number="0042/2026", police_station_id="PS-KOR",
            crime_type="Cyber Fraud", date=datetime(2026, 7, 10, tzinfo=timezone.utc),
            status="UNDER_INVESTIGATION", complainant="Karnataka Gramin Bank Ltd.",
            officer="Insp. Arjun Kumar",
            summary=(
                "Complainant reported fraudulent UPI reversals totalling INR 4.5 crore executed via "
                "spoofed payment gateway links sent to 312 bank customers. Primary accused Aditya Hegde "
                "operated phishing kits hosted on compromised domains. Sections: IT Act 66C, 66D; IPC 420, 120B."
            )),
        FIR(id="FIR-002", case_number="0098/2026", police_station_id="PS-HUB",
            crime_type="Burglary", date=datetime(2026, 6, 28, tzinfo=timezone.utc),
            status="UNDER_INVESTIGATION", complainant="Shree Lakshmi Jewellers, Vidyanagar",
            officer="SI Priya Nair",
            summary=(
                "Burglary at Shree Lakshmi Jewellers, Vidyanagar between 01:30-04:00 AM. Suspects entered via "
                "false-ceiling breach and bypassed CCTV DVR power supply. Stolen: gold jewelry worth INR 18.4 "
                "lakhs and INR 2.1 lakhs cash. Fingerprint match 82.5% with Chaddi Gang affiliate on State registry."
            )),
        FIR(id="FIR-003", case_number="0105/2026", police_station_id="PS-MYS",
            crime_type="NDPS Act Violation", date=datetime(2026, 7, 15, tzinfo=timezone.utc),
            status="CHARGESHEETED", complainant="STF Mysuru — Intelligence-based",
            officer="DSP Raghavan Pillai",
            summary=(
                "Seizure of 4.2 kg synthetic methamphetamine tablets near Nanjangud Toll Plaza, NH-275. "
                "Primary accused Rahul Krishnan driving TN-09-AL-7721 with hidden axle compartment. "
                "Supply chain links to Kerala narcotics syndicate confirmed via CDR analysis."
            )),
        FIR(id="FIR-004", case_number="0112/2026", police_station_id="PS-IND",
            crime_type="Cyber Fraud", date=datetime(2026, 7, 18, tzinfo=timezone.utc),
            status="PENDING", complainant="HDFC Bank Ltd.",
            officer="Insp. Arjun Kumar",
            summary=(
                "Fraudulent NEFT transfers aggregating INR 1.2 crore from 45 accounts using stolen credentials "
                "obtained via vishing calls. Suspected secondary operation linked to Aditya Hegde syndicate. "
                "Digital forensics in progress."
            )),
        FIR(id="FIR-005", case_number="0078/2026", police_station_id="PS-MNG",
            crime_type="Assault", date=datetime(2026, 6, 10, tzinfo=timezone.utc),
            status="CLOSED", complainant="Mohammed Irfan, Mangaluru",
            officer="SI Ramesh Kamath",
            summary=(
                "Victim assaulted near Mangaluru Port Road by 3 unidentified persons at 22:15 hrs. "
                "CCTV recovered, two suspects identified. Case closed after settlement under Sec 320 CrPC."
            )),
    ]
    db.add_all(firs)
    await db.commit()  # Commit FIRs and Accused before inserting FK associations

    # ── FIR ↔ Accused Associations ───────────────────────────────────────────
    await db.execute(
        fir_accused_association.insert().values([
            {"fir_id": "FIR-001", "accused_id": "ACC-001"},
            {"fir_id": "FIR-001", "accused_id": "ACC-002"},
            {"fir_id": "FIR-001", "accused_id": "ACC-003"},
            {"fir_id": "FIR-001", "accused_id": "ACC-004"},
            {"fir_id": "FIR-002", "accused_id": "ACC-006"},
            {"fir_id": "FIR-003", "accused_id": "ACC-005"},
            {"fir_id": "FIR-004", "accused_id": "ACC-001"},
        ])
    )

    # ── Evidence Records ─────────────────────────────────────────────────────
    evidence = [
        Evidence(id="EV-001", fir_id="FIR-001", file_name="phishing_kit_dump.zip",
                 file_size="14.2 MB",
                 ocr_extracted_text="Spoofed UPI domain: paytm-secure-login.xyz — hosted on AWS us-east-1"),
        Evidence(id="EV-002", fir_id="FIR-001", file_name="CCTV_koramangala_13Jul.mp4",
                 file_size="1.8 GB",
                 ocr_extracted_text="Vehicle KA-01-MJ-8822 spotted at 11:42:07 hrs near Koramangala 5th Block signal"),
        Evidence(id="EV-003", fir_id="FIR-001", file_name="SBI_audit_trail.xlsx",
                 file_size="2.1 MB",
                 ocr_extracted_text="312 victim accounts, total debit INR 4,50,00,000 over 6-day window"),
        Evidence(id="EV-004", fir_id="FIR-002", file_name="fingerprint_report_SFSL.pdf",
                 file_size="0.8 MB",
                 ocr_extracted_text="Latent print match score: 82.5% — Chaddi Gang Affiliate, State Registry ID: FP-KA-2023-441"),
        Evidence(id="EV-005", fir_id="FIR-003", file_name="FSL_narcotics_analysis.pdf",
                 file_size="1.2 MB",
                 ocr_extracted_text="Sample: Methamphetamine, purity 94.3%. Weight: 4.2 kg. Hidden axle compartment — custom fabrication"),
    ]
    db.add_all(evidence)

    # ── Financial Records ─────────────────────────────────────────────────────
    fin_records = [
        FinancialRecord(id="FIN-001", from_account="SBI A/C *9282", to_account="HDFC A/C *0182",
                        from_name="Deepak Rao (Mule)", to_name="Sanjay Murthy",
                        amount=4500000.0, date=datetime(2026, 7, 11, tzinfo=timezone.utc),
                        status="FLAGGED", alert_level="CRITICAL"),
        FinancialRecord(id="FIN-002", from_account="HDFC A/C *0182", to_account="SWIFT-DXB-XXX",
                        from_name="Sanjay Murthy", to_name="Dubai Correspondent Bank",
                        amount=920000.0, date=datetime(2026, 7, 12, tzinfo=timezone.utc),
                        status="FLAGGED", alert_level="CRITICAL"),
        FinancialRecord(id="FIN-003", from_account="SBI A/C *9282", to_account="UBI A/C *3341",
                        from_name="Deepak Rao (Mule)", to_name="Mule Account 1",
                        amount=48000.0, date=datetime(2026, 7, 11, tzinfo=timezone.utc),
                        status="FLAGGED", alert_level="HIGH"),
        FinancialRecord(id="FIN-004", from_account="SBI A/C *9282", to_account="AXIS A/C *7723",
                        from_name="Deepak Rao (Mule)", to_name="Mule Account 2",
                        amount=49500.0, date=datetime(2026, 7, 11, tzinfo=timezone.utc),
                        status="FLAGGED", alert_level="HIGH"),
        FinancialRecord(id="FIN-005", from_account="SBI A/C *9282", to_account="BOI A/C *6610",
                        from_name="Deepak Rao (Mule)", to_name="Mule Account 3",
                        amount=47200.0, date=datetime(2026, 7, 12, tzinfo=timezone.utc),
                        status="FLAGGED", alert_level="HIGH"),
        FinancialRecord(id="FIN-006", from_account="PNB A/C *1192", to_account="SBI A/C *9282",
                        from_name="Victim UPI Pool", to_name="Deepak Rao (Mule)",
                        amount=1200000.0, date=datetime(2026, 7, 10, tzinfo=timezone.utc),
                        status="FLAGGED", alert_level="CRITICAL"),
    ]
    db.add_all(fin_records)

    # ── Audit Logs ────────────────────────────────────────────────────────────
    audit_logs = [
        AuditLog(id="AUD-001", user_id="USR-001", action="Opened FIR 0042/2026 case file",
                 timestamp=datetime(2026, 7, 10, 9, 15, tzinfo=timezone.utc), ip_address="10.12.92.51"),
        AuditLog(id="AUD-002", user_id="USR-002", action="Uploaded fingerprint report for FIR 0098/2026",
                 timestamp=datetime(2026, 6, 29, 11, 30, tzinfo=timezone.utc), ip_address="10.12.88.14"),
        AuditLog(id="AUD-003", user_id="USR-003", action="Authorized arrest warrant — Rahul Krishnan",
                 timestamp=datetime(2026, 7, 15, 14, 0, tzinfo=timezone.utc), ip_address="10.14.10.3"),
        AuditLog(id="AUD-004", user_id="USR-001", action="Requested FIU-IND SAR filing for SBI A/C *9282",
                 timestamp=datetime(2026, 7, 16, 10, 45, tzinfo=timezone.utc), ip_address="10.12.92.51"),
    ]
    db.add_all(audit_logs)

    # ── Notifications ─────────────────────────────────────────────────────────
    notifications = [
        Notification(id="NOT-001", user_id="USR-001", text="CRITICAL: SBI A/C *9282 flagged — INR 45L transfer detected",
                     severity="critical", unread=True),
        Notification(id="NOT-002", user_id="USR-002", text="Fingerprint lab report ready for FIR 0098/2026",
                     severity="high", unread=True),
        Notification(id="NOT-003", user_id="USR-003", text="Suspect Aditya Hegde: new CCTV hit — Koramangala 13-Jul",
                     severity="critical", unread=True),
    ]
    db.add_all(notifications)

    await db.commit()
    print("[KAVACH Seeder] Database seeded with full KSP demo dataset.")
