# Architectural Decisions Log - CarYaar

This document details the core architectural choices made during the development of the CarYaar Workshop Slot Booking System to maintain clean code separation, security, and infrastructure resilience.

---

## 1. Database Connection & Network Strategy
* **Decision**: Switched from default direct connection parameters to the Supabase Connection Pooler string format utilizing Port `6543` and hardcoded regional AWS IPv4 routing (`3.108.251.216`).
* **Rationale**: Local network firewalls and DNS translation layers blocked standard PostgreSQL connections, throwing `Name or service not known` and `ENOIDENTIFIER` proxy failures. Direct IP targeting combined with `?sslmode=require` resolved the proxy handshake cleanly.

## 2. Decoupling Database Models from API Schemas
* **Decision**: Maintained explicit validation schemas (`schemas.py`) powered by Pydantic, decoupled entirely from the SQLAlchemy database structure (`models.py`).
* **Rationale**: Protects database architecture from structural exposure. Client inputs are validated on the perimeter before triggering SQL engine evaluations.

## 3. SQLAlchemy Column Level Mapping
* **Decision**: Used explicit variable definitions on column declarations utilizing the `name=` keyword argument parameter in SQLAlchemy (`customer_phone = Column(String, name="phone")`).
* **Rationale**: Allowed code layers and JSON inputs to use highly readable naming conventions (`customer_registration`) while mapping directly to pre-configured compact legacy columns in Supabase (`car_reg`) without forcing destructive database migrations.

## 4. Concurrent Booking Validation (The 2-Bay Guard)
* **Decision**: Enforced capacity metrics through an analytical count execution loop (`db.query().filter().count()`) directly preceding database commits inside the `POST /bookings` execution layer.
* **Rationale**: Guarantees strict compliance with the business criterion of maximum 2 vehicles per hour slot, rejecting excess payloads before an invalid transaction write takes place.