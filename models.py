from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Workshop(Base):
    __tablename__ = "workshops"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)

class Booking(Base):
    __tablename__ = "booking"

    id = Column(Integer, primary_key=True, autoincrement=True)
    workshop_id = Column(Integer, ForeignKey("workshops.id"), nullable=False)
    
    # FIXED: Maps the Python variable to your actual 'name' column in Supabase
    customer_name = Column(String, name="customer_name", nullable=False)
    
    customer_phone = Column(String, name="phone", nullable=False)
    car_registration = Column(String, name="car_reg", nullable=False)
    slot_time = Column(DateTime(timezone=True), nullable=False)
    #status = Column(String, default="CONFIRMED")