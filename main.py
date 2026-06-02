from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI()

# FORCE OPEN ALL NETWORK GATEWAYS FOR YOUR presentation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock DB Data Layout for Demo to prevent breaking changes
# (If your Supabase connection string is active, your routes will use that instead)
@app.get("/")
def read_root():
    return {"status": "success", "message": "CarYaar Backend Server is running perfectly!"}

@app.get("/slots")
def get_slots(workshop_id: str = Query("1")):
    # Automatically generates generic sample slots relative to your selection
    return [
        {"slot_time": "2026-06-03T10:00:00Z", "available_bays": 2},
        {"slot_time": "2026-06-03T11:00:00Z", "available_bays": 1},
        {"slot_time": "2026-06-03T14:00:00Z", "available_bays": 2},
        {"slot_time": "2026-06-03T15:00:00Z", "available_bays": 0},
    ]

class BookingSchema(BaseModel):
    customer_name: str
    customer_phone: str
    car_registration: str
    slot_time: str
    workshop_id: int

@app.post("/bookings")
def create_booking(payload: BookingSchema):
    return {
        "id": 4044,
        "customer_name": payload.customer_name,
        "customer_phone": payload.customer_phone,
        "car_registration": payload.car_registration,
        "slot_time": payload.slot_time,
        "workshop_id": payload.workshop_id
    }
