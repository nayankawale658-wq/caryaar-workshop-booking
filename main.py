from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from supabase import create_client, Client
import os

app = FastAPI()

# 1. FORCE CORE ALLOWANCE GATEWAYS FOR EVERY INCOMING DOMAIN
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: Plug your real Supabase dashboard credentials right here!
SUPABASE_URL = "https://your-project-id.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-real-anon-key"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class BookingSchema(BaseModel):
    customer_name: str
    customer_phone: str
    car_registration: str
    slot_time: str
    workshop_id: int

@app.get("/")
def read_root():
    return {"status": "success", "message": "CarYaar Backend Engine Live!"}

# 2. FORCE COMPLETE OPTIONS HANDSHAKE BYPASS (CRUSHES PREFLIGHT CORS ERRORS)
@app.options("/{path:path}")
def handle_options(path: str):
    response = JSONResponse(content={"status": "ok"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# 3. GET SYSTEM SLOTS WITH AUTOMATIC 2-BAY CAPACITY REDUCTION
@app.get("/slots")
def get_slots(workshop_id: int = Query(1)):
    try:
        # Fetch all predefined timeline slot rows for this station
        slots_response = supabase.table("slots").select("*").eq("workshop_id", workshop_id).execute()
        all_slots = slots_response.data

        # Fetch current active registrations to calculate available gaps
        bookings_response = supabase.table("bookings").select("slot_time").eq("workshop_id", workshop_id).execute()
        active_bookings = bookings_response.data

        # Tally active bookings per time window
        booking_counts = {}
        for b in active_bookings:
            t = b["slot_time"]
            booking_counts[t] = booking_counts.get(t, 0) + 1

        # Restrict bay maximum boundaries to 2
        MAX_CAPACITY = 2
        for slot in all_slots:
            time_str = slot["slot_time"]
            booked_count = booking_counts.get(time_str, 0)
            slot["available_bays"] = max(0, MAX_CAPACITY - booked_count)

        return all_slots
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. POST BOOKING DISPATCH WITH CAPACITY ENFORCEMENT
@app.post("/bookings")
def create_booking(payload: BookingSchema):
    try:
        # Re-verify live totals before authorizing a rewrite row instance
        existing = supabase.table("bookings").select("id").eq("workshop_id", payload.workshop_id).eq("slot_time", payload.slot_time).execute()
        
        if len(existing.data) >= 2:
            raise HTTPException(status_code=400, detail="This timing window is fully booked! (Maximum 2 Bays filled)")

        insert_data = {
            "customer_name": payload.customer_name,
            "customer_phone": payload.customer_phone,
            "car_registration": payload.car_registration,
            "slot_time": payload.slot_time,
            "workshop_id": payload.workshop_id
        }
        response = supabase.table("bookings").insert(insert_data).execute()
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))

# 5. DELETE COMMAND FOR INSTANT DATABASE CANCELLATION
@app.delete("/bookings/{booking_id}")
def cancel_booking(booking_id: int):
    try:
        response = supabase.table("bookings").delete().eq("id", booking_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Booking ticket record not found.")
        return {"status": "success", "message": f"Booking {booking_id} dropped from database."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
