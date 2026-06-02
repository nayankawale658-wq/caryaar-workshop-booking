"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");        // New state for phone number
  const [carReg, setCarReg] = useState("");      // New state for car registration
  const [workshop, setWorkshop] = useState("1");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [myBookings, setMyBookings] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch slots whenever the workshop selection changes
  useEffect(() => {
    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const res = await fetch(`http://localhost:8000/workshops/${workshop}/slots`);
        if (res.ok) {
          const data = await res.json();
          setSlots(data);
          const available = data.find(s => s.is_available);
          setSelectedSlot(available ? available.slot_time : "");
        }
      } catch (err) {
        console.error("Failed to load slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [workshop]);

  // Handle Form Submission
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert("Please select a valid time slot first!");
      return;
    }

    // Pushing the dynamic inputs directly to the backend payload
    const clientData = {
      workshop_id: parseInt(workshop),
      customer_name: name,
      customer_phone: phone,        // Dynamic live mobile input
      car_registration: carReg,      // Dynamic live license plate input
      slot_time: selectedSlot
    };

    try {
      const response = await fetch('http://localhost:8000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`🎉 Booking Confirmed!\nYour Unique Ticket ID is: #${data.id}`);
        
        // Reset all input fields on success
        setName("");
        setPhone("");
        setCarReg("");
        
        setMyBookings([...myBookings, { 
          id: data.id, 
          customer_name: name, 
          customer_phone: phone,
          car_registration: carReg,
          slot_time: selectedSlot, 
          workshop_id: workshop 
        }]);
      } else {
        alert(`Booking failed: ${data.detail || "Slot full."}`);
      }
    } catch (error) {
      alert("Network error connecting to backend.");
    }
  };

  // Handle Cancellation Route
  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to authorize cancellation for this vehicle slot?")) return;

    try {
      const response = await fetch(`http://localhost:8000/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("🗑️ Booking successfully cancelled!");
        setMyBookings(myBookings.filter(b => b.id !== bookingId));
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (err) {
      alert("Error processing cancellation request.");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "700px", margin: "0 auto" }}>
      <header style={{ borderBottom: "2px solid #eaeaea", paddingBottom: "10px", marginBottom: "30px" }}>
        <h1 style={{ color: "#1e3a8a", margin: 0 }}>🚗 CarYaar Management Studio</h1>
        <p style={{ color: "#6b7280", margin: "5px 0 0 0" }}>End-to-End Live Sync Workspace</p>
      </header>

      {/* BLOCK A: THE BOOKING PANEL */}
      <main style={{ background: "#f9fafb", padding: "25px", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#1f2937" }}>Secure Your Appointment Slot</h2>
        
        <form onSubmit={handleBooking}>
          {/* Input 1: Customer Name */}
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

          {/* Input 2: Phone Number */}
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

          {/* Input 3: Car Registration */}
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

          {/* Input 4: Select Workshop */}
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

          {/* Input 5: Slot Selection Dropdown */}
          <div style={{ fontVariantNumeric: "lining-nums", marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Select Available Timing Window:</label>
            {loadingSlots ? (
              <p style={{ color: "#2563eb", fontSize: "14px" }}>Calculating bay capacities...</p>
            ) : (
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
            )}
          </div>

          <button 
            type="submit" 
            style={{ width: "100%", padding: "12px", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
          >
            Confirm Vehicle Slot Booking
          </button>
        </form>
      </main>

      {/* BLOCK B: LIVE AUTHORIZATION & CANCELLATION ENGINE */}
      <section style={{ background: "#fff", padding: "25px", borderRadius: "8px", border: "1px solid #ef4444" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#b91c1c" }}>🛡️ Active Bookings Authorization Console</h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "15px" }}>Manage live data row sessions deployed below:</p>

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
                  onClick={() => handleCancel(b.id)}
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