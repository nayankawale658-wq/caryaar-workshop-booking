# Engineering Learnings Log - CarYaar

This document summarizes the technical knowledge and troubleshooting strategies gained while building the full-stack workshop reservation tracking application.

---

## 1. Cloud Infrastructure & Proxy Handshakes
* **What I Learned**: Discovered how multi-tenant cloud architectures (like Supabase) leverage Server Name Indication (SNI) and routing proxies to map connections. 
* **Key Takeaway**: When encountering errors like `tenant/user not found`, checking configuration parameters like pooler string delimiters (dots vs hyphens) and using explicit encryption parameters (`sslmode`) is critical to direct packets through a shared cloud proxy network.

## 2. Debugging Cross-Origin Resource Sharing (CORS)
* **What I Learned**: Experienced how modern web browsers execute security mechanisms to isolate web environments running across differing local network ports (`localhost:3000` vs `127.0.0.1:8000`).
* **Key Takeaway**: Integrating FastAPI's specialized `CORSMiddleware` engine with precise header parameters (`allow_origins`, `allow_methods`) is mandatory to establish clear handshakes between client user interfaces and server APIs.

## 3. Dynamic Schema Alignment & ORM Errors
* **What I Learned**: Deepened understanding of SQLAlchemy tracking mechanisms when parsing raw queries. Faced the infamous `f405` programming errors when column names do not map seamlessly.
* **Key Takeaway**: Meticulous alignment between database tables, schema interfaces, and system modules prevents breaking serialization crashes during live execution.

## 4. Time Slot Generation Logic
* **What I Learned**: Formulated logical loops to dynamically construct operational timestamps tracking business openings across a 3-day window.
* **Key Takeaway**: Handling text-based timestamp formatting correctly ensures that dates map accurately from database rows to frontend dropdown options across different system locations.