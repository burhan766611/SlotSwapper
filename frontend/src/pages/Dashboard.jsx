import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useRef } from "react";

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  const cardsRef = useRef([]);

  // useGSAP(() => {
  //   gsap.from(cardsRef.current, {
  //     x: 200,
  //     opacity: 0,
  //     duration: 0.8,
  //     delay: 0.3,
  //     stagger: 0.1
  //   });
  // }, [events]);

  const [meetingData, setMeetingData] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });

  const handleValues = (e) => {
    setMeetingData({ ...meetingData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/api/events");
      setEvents(res.data.events);
    } catch (err) {
      console.log(err);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    console.log(meetingData);
    try {
      const res = await API.post("/api/events", meetingData);
      console.log(res.data.msg);
    } catch (err) {
      console.log(err);
    } finally {
      setMeetingData({
        title: "",
        startTime: "",
        endTime: "",
      });
    }

    await fetchEvents();
  };

  const makeSwappable = async (id) => {
    try {
      const res = await API.put(`/api/events/${id}/status`, {
        status: "SWAPPABLE",
      });
      alert(res.data.msg);
    } catch (err) {
      console.log(err);
    }

    await fetchEvents();
  };

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          📅 My Events
        </h2>

        <form
          onSubmit={addEvent}
          className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row gap-4 mb-8"
        >
          <input
            value={meetingData.title}
            onChange={handleValues}
            name="title"
            placeholder="Event title"
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            type="datetime-local"
            onChange={handleValues}
            name="startTime"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            type="datetime-local"
            onChange={handleValues}
            name="endTime"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Add Event
          </button>
        </form>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <p className="text-gray-600 italic">
              No events yet. Add one above!
            </p>
          ) : (
            events.map((e, i) => (
              <div
              ref={(el) => (cardsRef.current[i] = el)} 
                key={e._id}
                className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {e.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  {new Date(e.startTime).toLocaleString()} <br />→{" "}
                  {new Date(e.endTime).toLocaleString()}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      e.status === "BUSY"
                        ? "bg-red-100 text-red-700"
                        : e.status === "SWAPPABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {e.status}
                  </span>

                  {e.status === "BUSY" && (
                    <button
                      onClick={() => makeSwappable(e._id)}
                      className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition"
                    >
                      Make Swappable
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

// <div>
//   <h2>My Events</h2>
//   <form onSubmit={addEvent}>
//     <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
//     <input type="datetime-local" onChange={(e) => setStart(e.target.value)} />
//     <input type="datetime-local" onChange={(e) => setEnd(e.target.value)} />
//     <button>Add</button>
//   </form>

//   <ul>
//     {events.map((e) => (
//       <li key={e._id}>
//         {e.title} ({e.status}){" "}
//         {e.status === "BUSY" && <button onClick={() => makeSwappable(e._id)}>Make Swappable</button>}
//       </li>
//     ))}
//   </ul>
// </div>
