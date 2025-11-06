import express from "express";
import Event from "../models/Event.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/events", verifyToken, async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    const userid = req.user?.id;

    if (!title || !startTime || !endTime || !userid) {
      return res.status(400).json({
        result: false,
        msg: "Enter Details",
      });
    }

    const newEvent = await Event.create({
      title: title,
      startTime: startTime,
      endTime: endTime,
      userId: userid,
    });

    return res.status(201).json({
      result: true,
      msg: "Created",
      event: newEvent,
    });
  } catch {
    return res.status(500).json({
      result: false,
      msg: "Server Error",
    });
  }
});

router.get("/events", verifyToken, async (req, res) => {
  try {
    const userid = req.user?.id;
    if (!userid) {
      return res.status(401).json({
        result: false,
        msg: "Unauthorized",
      });
    }
    const allEvents = await Event
      .find({ userId: userid })
      .sort({ startTime: 1 });

    return res.json({
      result: true,
      events: allEvents,
    });
  } catch {
    return res.status(500).json({
      result: false,
      msg: "Server error",
    });
  }
});

router.put("/events/:id/status", verifyToken, async (req, res) => {
  try {
    const eventid = req.params.id;
    const { status } = req.body;
    const userid = req.user?.id;

    if (!eventid || !status || !userid) {
      return res.status(400).json({
        result: false,
        msg: "Invalid request",
      });
    }

    // console.log(eventid, status, userid);
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventid, userId: userid },
      { status: status },
      { new: true }
    );

        if (!updatedEvent) {
      return res.status(404).json({
        result: false,
        msg: "Event not found or not authorized",
      });
    }

    return res.status(200).json({
      result: true,
      msg: "updated",
      event: updatedEvent,
    });
  } catch {
    return res.status(500).json({
      result: false,
      msg: "Server Error",
    });
  }
});

export default router;
