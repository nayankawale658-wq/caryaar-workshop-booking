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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = "https://real-adults-cut.loca.lt";

  useEffect(() => {
    async function fetchSlots() {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/slots?workshop_id=${workshop}`, {
          method: "GET",
          headers: {
            "Bypass-Tunnel-Reminder": "true",
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) throw new Error("Server dropped network package handshake.");
        
        const data = await response.json();
        setSlots(data);
        if (data.length > 0) {
          setSelectedSlot(data[0].slot_time);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Could not connect to live database backend tunnel.");
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [workshop]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert("Please select a valid time slot.");
      return;
    }

    const bookingPayload = {
      customer_name: name,
      customer_phone: phone,
      car_registration: carReg,
      slot_time: selectedSlot,
      workshop_id: parseInt(workshop)
    };

    try {
      const response = await fetch(`${BACKEND_URL}/bookings`, {
        method: "POST",
        headers: {
          "Bypass-Tunnel-Reminder": "true",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) throw new Error("Data submission to Supabase routing channels failed.");

      const result = await response.json();
      alert(`🎉 Booking Confirmed Successfully!\n\nYour record has been processed by your backend server.`);
      
      setMyBookings((prev) => [result, ...prev]);
      setName("");
      setPhone("");
      setCarReg("");
    } catch (err) {
      alert(`❌ Sync Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "700px", margin: "0 auto" }}>
      <header style={{ borderBottom: "2px solid #eaeaea", paddingBottom: "10px", marginBottom: "30px" }}>
        <h1 style={{ color: "#1e3a8a", margin: 0 }}>🚗 CarYaar Management Studio</h1>
        <p style={{ color: "#6b7280", margin: "5px 0 0 0" }}>Live Database Sync Engine via Vercel Cloud</p>
      </header>

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

          <div style={{ fontVariantNumeric: "lining-nums", marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Select Available Timing Window:</label>
            {loading ? (
              <p style={{ color: "#2563eb", margin: "5px 0" }}>📡 Scanning live database channels...</p>
            ) : error ? (
              <p style={{ color: "#dc2626", margin: "5px 0" }}>⚠️ {error}</p>
            ) : (
              <select 
                value={selectedSlot} 
                onChange={(e) => setSelectedSlot(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
              >
                {slots.map((s) => (
                  <option key={s.slot_time} value={s.slot_time} disabled={s.available_bays <= 0}>
                    {new Date(s.slot_time).toLocaleString()} ({s.available_bays} Bays Open)
                  </option>
                ))}
              </select>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || !!error}
            style={{ width: "100%", padding: "12px", backgroundColor: (loading || !!error) ? "#9ca3af" : "#1e3a8a", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
          >
            Confirm Vehicle Slot Booking
          </button>
        </form>
      </main>

      <section style={{ background: "#fff", padding: "25px", borderRadius: "8px", border: "1px solid #ef4444" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#b91c1c" }}>🛡️ Active Bookings Authorization Console</h2>
        {myBookings.length === 0 ? (
          <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "14px" }}>No active sessions recorded in this panel view instance yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {myBookings.map((b, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "6px", background: "#fef2f2" }}>
                <div>
                  <span style={{ fontWeight: "bold", color: "#111827" }}>Confirmed Slot</span> — {b.customer_name} ({b.car_registration})
                  <br />
                  <small style={{ color: "#4b5563" }}>Time: {new Date(b.slot_time).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
