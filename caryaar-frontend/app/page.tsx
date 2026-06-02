"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");        
  const [carReg, setCarReg] = useState("");      
  const [workshop, setWorkshop] = useState("1");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [myBookings, setMyBookings] = useState([]);

  // Generate 3 days of hourly slots completely on the frontend (No backend needed!)
  useEffect(() => {
    const generatedSlots = [];
    const now = new Date();
    
    // Generate slots for today, tomorrow, and the day after
    for (let day = 0; day < 3; day++) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() + day);
      
      // Creating standard workshop hours from 9:00 AM to 5:00 PM
      for (let hour = 9; hour <= 17; hour++) {
        const slotTime = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hour, 0, 0);
        
        // Skip hours that have already passed today
        if (slotTime > now) {
          generatedSlots.push({
            slot_time: slotTime.toISOString(),
            available_bays: 2, // Default maximum workshop capacity
            is_available: true
          });
        }
      }
    }
    setSlots(generatedSlots);
    if (generatedSlots.length > 0) {
      setSelectedSlot(generatedSlots[0].slot_time);
    }
  }, [workshop]); // Re-calculates cleanly if workshop changes

  // Handle Form Submission smoothly entirely on frontend state
  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert("Please select a valid time slot first!");
      return;
    }

    // Generate a clean random ticket ID number for your presentation reference
    const mockTicketId = Math.floor(1000 + Math.random() * 9000);

    const newBookingRecord = {
      id: mockTicketId,
      customer_name: name,
      customer_phone: phone,
      car_registration: carReg,
      slot_time: selectedSlot,
      workshop_id: workshop
    };

    // Update capacity counts dynamically for the chosen slot in your dropdown
    setSlots(prevSlots => 
      prevSlots.map(slot => {
        if (slot.slot_time === selectedSlot) {
          const updatedBays = slot.available_bays - 1;
          return {
            ...slot,
            available_bays: updatedBays,
            is_available: updatedBays > 0
          };
        }
        return slot;
      })
    );

    // Save to active bookings console array instantly
    setMyBookings([...myBookings, newBookingRecord]);
    
    alert(`🎉 Booking Confirmed Successfully!\n\nYour Unique Ticket ID is: #${mockTicketId}\n\nThis session has been registered in the tracking panel below.`);
    
    // Reset all form entry fields
    setName("");
    setPhone("");
    setCarReg("");
  };

  // Handle Cancellation manually
  const handleCancel = (bookingId, slotTimeOfBooking) => {
    if (!confirm("Are you sure you want to authorize cancellation for this vehicle slot?")) return;

    // Remove from active list console state
    setMyBookings(myBookings.filter(b => b.id !== bookingId));

    // Restore the available bay slot capacity count dynamically
    setSlots(prevSlots => 
      prevSlots.map(slot => {
        if (slot.slot_time === slotTimeOfBooking) {
          return {
            ...slot,
            available_bays: Math.min(slot.available_bays + 1, 2),
            is_available: true
          };
        }
        return slot;
      })
    );

    alert("🗑️ Booking successfully cancelled and slot freed!");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "700px", margin: "0 auto" }}>
      <header style={{ borderBottom: "2px solid #eaeaea", paddingBottom: "10px", marginBottom: "30px" }}>
        <h1 style={{ color: "#1e3a8a", margin: 0 }}>🚗 CarYaar Management Studio</h1>
        <p style={{ color: "#6b7280", margin: "5px 0 0 0" }}>End-to-End Local Workspace Session</p>
      </header>

      {/* BLOCK A: THE BOOKING PANEL */}
      <main style={{ background: "#f9fafb", padding: "25px", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#1f2937" }}>Secure Your Appointment Slot</h2>
        
        <form onSubmit={handleBooking}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Customer Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Enter full name"
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Contact Number:</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              placeholder="Enter 10-digit mobile number"
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Vehicle Registration Number:</label>
            <input 
              type="text" 
              value={carReg} 
              onChange={(e) => setCarReg(e.target.value)} 
              required 
              placeholder="e.g., MH-43-AA-1111"
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Select Workshop Station:</label>
            <select 
              value={workshop} 
              onChange={(e) => setWorkshop(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            >
              <option value="1">Main Workshop Vashi</option>
              <option value="2">CarYaar Express Hub</option>
              <option value="3">Premium Care Service Center</option>
            </select>
          </div>

          {/* HIGHLY OPTIMIZED FRONTEND TIME WINDOW DROPDOWN */}
          <div style={{ fontVariantNumeric: "lining-nums", marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Select Available Timing Window:</label>
            <select 
              value={selectedSlot} 
              onChange={(e) => setSelectedSlot(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            >
              {slots.map((s) => (
                <option key={s.slot_time} value={s.slot_time} disabled={!s.is_available}>
                  {new Date(s.slot_time).toLocaleString()} ({s.available_bays} Bays Open) {!s.is_available ? "[FULLY BOOKED]" : ""}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            style={{ width: "100%", padding: "12px", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
          >
            Confirm Vehicle Slot Booking
          </button>
        </form>
      </main>

      {/* BLOCK B: LIVE ACTIVE CONSOLE */}
      <section style={{ background: "#fff", padding: "25px", borderRadius: "8px", border: "1px solid #ef4444" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#b91c1c" }}>🛡️ Active Bookings Authorization Console</h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "15px" }}>Manage row sessions deployed below in real time:</p>

        {myBookings.length === 0 ? (
          <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "14px" }}>No active sessions recorded in this panel view instance yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {myBookings.map((b) => (
              <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "6px", background: "#fef2f2" }}>
                <div style={{ flexGrow: 1 }}>
                  <span style={{ fontWeight: "bold", color: "#111827" }}>Ticket #{b.id}</span> — {b.customer_name} ({b.car_registration})
                  <br />
                  <small style={{ color: "#4b5563" }}>Phone: {b.customer_phone} | Time: {new Date(b.slot_time).toLocaleString()}</small>
                </div>
                <button 
                  onClick={() => handleCancel(b.id, b.slot_time)}
                  style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
                >
                  Authorize Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
