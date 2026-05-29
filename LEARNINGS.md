# Technical Learnings Log

### Database Architecture & SQLAlchemy
* Learned how to use `declarative_base()` to create blueprint classes in Python that map directly to physical Postgres tables in Supabase.
* Learned that database timestamps must explicitly use `timezone=True` so that server time differences don't shift a customer's booked hour.

### REST API Development with FastAPI
* Learned how to structure routes cleanly using standard HTTP verbs (`@app.get` for reading and `@app.post` for creating records).
* Mastered using Pydantic's `BaseModel` schemas with `from_attributes = True` to instantly convert database model structures into clean JSON data.

### Debugging & Workspace Setup
* Learned how Windows can hide the `.txt` file extension by default (e.g., creating `main.py.txt`), causing severe import crashes until file name extensions are explicitly enabled and fixed.
* Learned how to interpret Uvicorn terminal errors and trace them to mismatching file paths or missing Python modules.
