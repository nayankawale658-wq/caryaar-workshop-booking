from pydantic import BaseModel
from datetime import datetime

class WorkshopSchema(BaseModel):
    id: int  # Changed from UUID to int
    name: str

    class Config:
        from_attributes = True

class BookingCreateSchema(BaseModel):
    workshop_id: int  # Changed from UUID to int
    customer_name: str
    customer_phone: str
    car_registration: str
    slot_time: datetime