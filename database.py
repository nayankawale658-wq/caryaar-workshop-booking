from sqlalchemy import create_engine  # <-- FIXED: Removed the typo import
from sqlalchemy.orm import sessionmaker, declarative_base

# Your live Supabase Connection String
# Backup Option: Only use if the direct string above throws a host name error
DATABASE_URL = "postgresql://postgres:nayankawale1510@db.hvooyoifcbbhhsoqikbs.supabase.co:5432/postgres"
# Create the engine to talk to Supabase
engine = create_engine(DATABASE_URL)

# Create a session maker for executing queries
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is the Base that models.py needs to inherit from
Base = declarative_base()

# Database dependency helper for your API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
