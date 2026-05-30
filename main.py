from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# 1. Imports from your other local files
from database import get_db
import models
import schemas
from utils import generate_three_day_slots

# 2. Define the 'app' variable FIRST so Python knows what it is!
app = FastAPI(title="CarYaar Workshop Booking API")

# ---- CORS MIDDLEWARE BLOCK ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows your Next.js site to connect
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, etc.
    allow_headers=["*"],  # Allows all headers
)
# --------------------------------------------

# 3. Simple Home Health Check Route
@app.get("/")
def home():
    return {"status": "success", "message": "CarYaar Backend Server is running perfectly!"}

# 4. Route to get all workshops from Supabase
@app.get("/workshops", response_model=List[schemas.WorkshopSchema])
def get_all_workshops(db: Session = Depends(get_db)):
    workshops = db.query(models.Workshop).all()
    return workshops

# 5. Route to get available slots
@app.get("/workshops/{workshop_id}/slots")
def get_available_slots(workshop_id: int, db: Session = Depends(get_db)):
    all_slots = generate_three_day_slots()
    
    # Cleaned: No status filter to avoid database mismatch crashes
    active_bookings = db.query(models.Booking).filter(
        models.Booking.workshop_id == workshop_id
    ).all()
    
    slot_counts = {}
    for booking in active_bookings:
        time_key = booking.slot_time.replace(tzinfo=None)
        slot_counts[time_key] = slot_counts.get(time_key, 0) + 1
        
    results = []
    for slot in all_slots:
        current_count = slot_counts.get(slot, 0)
        is_available = current_count < 2 
        
        results.append({
            "slot_time": slot.isoformat(),
            "available_bays": 2 - current_count,
            "is_available": is_available
        })
        
    return results

# 6. Route to create a new booking cleanly
@app.post("/bookings")
def create_booking(booking_data: schemas.BookingCreateSchema, db: Session = Depends(get_db)):
    
    # 1. Count how many cars are already booked (FIXED: Removed status column check)
    existing_count = db.query(models.Booking).filter(
        models.Booking.workshop_id == booking_data.workshop_id,
        models.Booking.slot_time == booking_data.slot_time
    ).count()
    
    # 2. Apply the 2-Bay Rule
    if existing_count >= 2:
        raise HTTPException(
            status_code=400, 
            detail="Sorry, this specific 1-hour slot is fully booked (both bays are full)!"
        )
        
    # 3. If there is space, build the row data (FIXED: Removed status column entry)
    new_booking = models.Booking(
        workshop_id=booking_data.workshop_id,
        customer_name=booking_data.customer_name,
        customer_phone=booking_data.customer_phone,
        car_registration=booking_data.car_registration,
        slot_time=booking_data.slot_time
    )
    
    # 4. Save safely to Supabase
    try:
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        return {"status": "success", "message": "Booking confirmed successfully!", "id": new_booking.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database insertion failed: {str(e)}")