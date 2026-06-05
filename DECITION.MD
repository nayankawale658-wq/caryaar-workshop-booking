# 🏛️ Architecture & System Design Decisions (CarYaar Studio)

This document outlines the 5 critical architectural, database, and technical design patterns chosen during the development of the CarYaar Workshop Booking System.

---

## 1. Soft-Delete Flag Pattern (`is_cancelle`)
* **Decision:** Replaced structural row removals (`DELETE` queries) with a boolean status flag (`is_cancelle`) inside the Supabase `booking` table.
* **Rationale:** In a real-world enterprise ecosystem, dropping rows leads to a loss of operational history and corrupts business analytics data. By keeping rows intact and flipping a boolean flag, we preserve customer data history while opening back up scheduling slots.
* **Impact:** The system maintains 100% accurate database records for audit trails, while backend lookup counters ignore any row where `is_cancelle = true`.

---

## 2. Dynamic Programmatic Slot Allocation Engine
* **Decision:** Shifted from an independent, rigid cloud `slots` table to a programmatic backend scheduling matrix generated on-the-fly inside FastAPI.
* **Rationale:** Maintaining a physical table for infinite future dates creates database bloat and requires complex chron-jobs to clean past timestamps. Programmatically generating standard hourly operational windows (9:00 AM – 7:00 PM) based on the server's current runtime date guarantees that the scheduling engine updates seamlessly every midnight without any database maintenance.

---

## 3. Double-Layer 2-Bay Protection Matrix
* **Decision:** Enforced a strict validation checker block at both the database readout layer (`GET /slots`) and the write-operation routing gate (`POST /bookings`).
* **Rationale:** To prevent overbooking friction at the workshop bays, the frontend dropdown automatically disables fully booked hours, and the backend post-route runs a query count checker to block duplicate form injections. If a third client attempts to inject a payload for an identical hour block, the backend raises an explicit `400 Bad Request` HTTP exception.

---

## 4. Unrestricted Cross-Origin Resource Sharing (CORS) Configuration
* **Decision:** Opened global middleware access permissions (`allow_origins=["*"]`) on the FastAPI app instance.
* **Rationale:** During localized sandboxed deployment—especially when running cross-platform architecture simulations (such as running both servers out of terminal shells on Android ARM64 hardware inside Termux)—strict source domain checks generate CORS browser blocking handshakes. Global open parameters ensure flawless microservice data exchanges over local network channels.

---

## 5. Standardized Localized ISO Dates
* **Decision:** Stored and passed time values as raw local time string objects (`YYYY-MM-DDTHH:MM:SS`) instead of standardized UTC strings with a `Z` flag.
* **Rationale:** Utilizing raw localized strings prevents standard client-side browser JavaScript date-parsers from shifting appointment clocks backward or forward based on the user's local machine time zone variables, keeping booking times completely stable.
