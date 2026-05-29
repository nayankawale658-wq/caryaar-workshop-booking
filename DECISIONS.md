# Architecture Decisions - CarYaar Workshop Booking Mini-System

### 1. Database Data Types for Phone Numbers
* **Decision:** Stored the `customer_phone` column as a `String` (Text) instead of an `Integer`.
* **Why:** Phone numbers frequently start with a leading zero. Storing them as integers would strip out the leading zero, corrupting the customer's contact data.

### 2. Choice of Python Version
* **Decision:** Installed and deployed on Python 3.12.
* **Why:** Sticking directly to Python 3.12 aligns with the internal tech stack requirements defined in the internship brief, ensuring complete stability and cross-compatibility with FastAPI and SQLAlchemy.

### 3. Database Session Lifecycle Management
* **Decision:** Implemented a standalone connection file with a `get_db()` generator function.
* **Why:** This ensures database sessions are strictly opened cleanly for each individual API request and safely closed afterward (`finally: db.close()`), preventing connection leaks on the Supabase free tier.

### 4. Database Table Generation
* **Decision:** Handled table definition via SQLAlchemy models and automatically mapped them using `metadata.create_all()` during the FastAPI server startup event loop.
* **Why:** This avoids human error caused by running manual SQL generation scripts directly in the database dashboard during local development.

### 5. API Request/Response Formatting
* **Decision:** Used Pydantic schemas (`schemas.py`) separate from database models (`models.py`).
* **Why:** This creates a protective data layer, allowing us to strictly format incoming payloads and selectively hide sensitive internal columns from the public internet view.
