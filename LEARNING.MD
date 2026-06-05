# 🧠 Project Learnings & Technical Takeaways

Developing the CarYaar Workshop Booking pipeline provided deep insights into cross-platform execution, API synchronization patterns, and the realities of production engineering bugs.

---

## 1. Endpoint Alignment & Pluralization
* **The Takeaway:** We discovered that a mismatch between frontend request paths (`/bookings`) and backend route declarations (`/booking`) results in immediate silent drops (`404 Not Found`). Consistent RESTful API routing structures must be established and explicitly mapped out before writing code.

---

## 2. UI Thread Safe Hydration
* **The Takeaway:** We learned that firing database data fetches the exact millisecond a page loads can outrun the framework's native page router initialization, triggering critical Next.js lifecycle hook crashes. Wrapping your startup functions inside **`requestAnimationFrame()`** allows the UI to render smoothly before fetching data.

---

## 3. Database Constraints over Frontend UI Controls
* **The Takeaway:** We learned that you cannot rely on frontend disabling rules alone to protect data limits or workshop capacity. True security must be handled inside your backend logic blocks using strict operational verification steps to successfully block over-booking attempts or forced API script injections.

---

## 4. ARM64 Native Compilation Obstacles (Termux Environments)
* **The Takeaway:** Running node applications and python libraries inside Termux on phone processors showed us that some packages (like `pydantic-core` or `Next Turbopack`) require manual local system compilers (`rust`, `clang`, `make`, `webpack`) to build successfully on mobile hardware. Compiling native wheels directly on mobile chips is a crucial skill for edge computing.

---

## 5. State Reset Mitigation via Persistent Feeds
* **The Takeaway:** We realized that standard React memory states reset to an empty array `[]` upon a simple page refresh, causing customer booking displays to disappear. Migrating the active session view panel to run an on-mount API call directly to the Supabase backend ensures that customer records stay perfectly visible even after a browser reload.
