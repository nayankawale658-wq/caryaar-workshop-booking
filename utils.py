from datetime import datetime, timedelta, time

def generate_three_day_slots():
    slots = []
    current_date = datetime.now().date()
    
    days_added = 0
    # Keep checking dates until we successfully add 3 operating days
    while days_added < 3:
        current_date += timedelta(days=1)
        
        # Check if the day is Sunday (6 means Sunday in Python's weekday tracker)
        if current_date.weekday() == 6:
            continue  # Skip Sunday because the workshop is closed! [cite: 42]
            
        # For each valid day, generate 1-hour slots from 09:00 to 18:00 [cite: 42]
        for hour in range(9, 19):
            slot_time = datetime.combine(current_date, time(hour, 0))
            slots.append(slot_time)
            
        days_added += 1
        
    return slots