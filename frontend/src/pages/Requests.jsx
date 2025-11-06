import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Requests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/swap/all-requests"); 
      const myId = res.data.myId;

      setIncoming(res.data.requests.filter((r) => r.receiverId._id === myId));
      setOutgoing(res.data.requests.filter((r) => r.requesterId._id === myId));
    } catch (err) {
      console.error(err);
    }
  };

  const respondToRequest = async (id, accept) => {
    try {
      await API.post(`/swap/swap-response/${id}`, { accept });
      alert(accept ? "Swap accepted!" : "Swap rejected!");
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-3xl font-semibold mb-6">🔔 Swap Requests</h2>

        {/* Incoming Requests */}
        <section className="mb-6">
          <h3 className="text-2xl mb-2">Incoming Requests</h3>
          {incoming.length === 0 ? (
            <p>No incoming requests.</p>
          ) : (
            incoming.map((req) => (
              <div
                key={req._id}
                className="p-4 border rounded-lg mb-3 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>{req.requesterId.name}</strong> wants to swap their{" "}
                    <em>{req.mySlotId.title}</em> with your{" "}
                    <em>{req.theirSlotId.title}</em>
                  </p>
                  <p>Status: {req.status}</p>
                </div>
                {req.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => respondToRequest(req._id, true)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondToRequest(req._id, false)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>

        {/* Outgoing Requests */}
        <section>
          <h3 className="text-2xl mb-2">Outgoing Requests</h3>
          {outgoing.length === 0 ? (
            <p>No outgoing requests.</p>
          ) : (
            outgoing.map((req) => (
              <div
                key={req._id}
                className="p-4 border rounded-lg mb-3 flex justify-between items-center"
              >
                <div>
                  <p>
                    You offered your <em>{req.mySlotId.title}</em> to{" "}
                    <strong>{req.receiverId.name}</strong> for their{" "}
                    <em>{req.theirSlotId.title}</em>
                  </p>
                  <p>Status: {req.status}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
};

export default Requests;
