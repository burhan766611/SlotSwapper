import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Marketplace = () => {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [offerSlotId, setOfferSlotId] = useState("");

  // Fetch all swappable slots from others
  const fetchSwappableSlots = async () => {
    try {
      const res = await API.get("/swap/swappable-slots");
      setSwappableSlots(res.data.slots);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch my own swappable slots (for offering)
  const fetchMySlots = async () => {
    try {
      const res = await API.get("/api/events");
      const swappable = res.data.events.filter((e) => e.status === "SWAPPABLE");
      setMySlots(swappable);
    } catch (err) {
      console.error(err);
    }
  };

  const requestSwap = async () => {
    if (!offerSlotId || !selectedSlot) {
      return alert("Select your slot first!");
    }

    try {
      const res = await API.post("/swap/swap-request", {
        mySlotId: offerSlotId,
        theirSlotId: selectedSlot._id,
      });

      if (res.data.result) {
        alert(res.data.msg || "Swap request sent!");
        setSelectedSlot(null);
        setOfferSlotId("");
        fetchSwappableSlots();
      } else {
        alert(res.data.msg || "Failed to send swap request");
      }
    } catch (err) {
      console.error("Error sending swap request:", err);
      alert("Failed to send swap request");
    }
  };

  useEffect(() => {
    fetchSwappableSlots();
    fetchMySlots();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-3xl font-semibold mb-4">
          🕒 Swappable Slots Marketplace
        </h2>
        {swappableSlots.length === 0 ? (
          <p>No swappable slots available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {swappableSlots.map((slot) => (
              <div
                key={slot._id}
                className="p-4 border rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{slot.title}</h3>
                <p>
                  {new Date(slot.startTime).toLocaleString()} -{" "}
                  {new Date(slot.endTime).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  By: {slot.userId?.username || "Unknown"}
                </p>

                <button
                  onClick={() => setSelectedSlot(slot)}
                  className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Request Swap
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[400px]">
              <h3 className="font-semibold text-xl mb-3">
                Offer one of your slots to swap
              </h3>
              {mySlots.length === 0 ? (
                <p>You have no swappable slots to offer.</p>
              ) : (
                <>
                  <select
                    className="w-full border rounded p-2 mb-3"
                    value={offerSlotId}
                    onChange={(e) => setOfferSlotId(e.target.value)}
                  >
                    <option value="">-- Select your slot --</option>
                    {mySlots.map((slot) => (
                      <option key={slot._id} value={slot._id}>
                        {slot.title} (
                        {new Date(slot.startTime).toLocaleString()})
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedSlot(null);
                        setOfferSlotId("");
                      }}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={requestSwap}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Send Request
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Marketplace;
