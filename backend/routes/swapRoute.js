import express from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import Swap from "../models/Swap.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/swappable-slots", verifyToken, async (req, res) => {
  try {
    const userid = req.user?.id;
    if (!userid) {
      return res.status(401).json({
        result: false,
        msg: "Unauthorized",
      });
    }

    const slots = await Event.find({
      status: "SWAPPABLE",
      userId: { $ne: userid },
    }).populate("userId", "username email");

    return res.status(200).json({
      result: true,
      msg: "Fetched swappable slots successfully",
      slots: slots,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      result: false,
      msg: "Server error",
    });
  }
});

router.post("/swap-request", verifyToken, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    const userid = req.user?.id;
    if (!userid) {
      return res.status(401).json({
        result: false,
        msg: "Unauthorized",
      });
    }

    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot)
      return res.status(404).json({
        result: false,
        msg: "Slot not found",
      });
    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE")
      return res.status(400).json({
        result: false,
        msg: "Slots not swappable",
      });

    const existingSwap = await Swap.findOne({
      requesterId: req.user.id,
      mySlotId,
      theirSlotId,
      status: { $in: ["PENDING", "APPROVED"] },
    });
    if (existingSwap) {
      return res.status(400).json({
        result: false,
        msg: "Swap already requested for these slots",
      });
    }

    const swap = await Swap.create({
      requesterId: new mongoose.Types.ObjectId(userid),
      receiverId: theirSlot.userId,
      mySlotId,
      theirSlotId,
    });

    await mySlot.updateOne({ status: "SWAP_PENDING" });
    await theirSlot.updateOne({ status: "SWAP_PENDING" });

    return res.status(200).json({
      result: true,
      msg: "Swap Done",
      swap: swap,
    });
  } catch (err) {
    console.error("Swap request error:", err);
    res.status(500).json({
      result: false,
      msg: "Server Error",
    });
  }
});

router.post("/swap-response/:id", verifyToken, async (req, res) => {
  try {
    const { accept } = req.body;
    const swapid = req.params.id;
    const userId = req.user.id;

    const swap = await Swap.findById(swapid)
      .populate("mySlotId")
      .populate("theirSlotId");

    if (!swap)
      return res.status(403).json({
        result: false,
        msg: "Swap not found",
      });

    if (swap.receiverId.toString() !== userId) {
      return res.status(403).json({
        result: false,
        msg: "You are not authorized to respond to this swap.",
      });
    }

    if (!accept) {
      swap.status = "REJECTED";
      await swap.save();

      await Event.findByIdAndUpdate(swap.mySlotId._id, {
        status: "SWAPPABLE",
      });
      await Event.findByIdAndUpdate(swap.theirSlotId._id, {
        status: "SWAPPABLE",
      });

      return res.status(200).json({
        result: true,
        msg: "Swap rejected successfully.",
      });
    }

    swap.status = "ACCEPTED";
    await swap.save();

    const tempUser = swap.mySlotId.userId;
    await Event.findByIdAndUpdate(swap.mySlotId._id, {
      userId: swap.theirSlotId.userId,
      status: "BUSY",
    });
    await Event.findByIdAndUpdate(swap.theirSlotId._id, {
      userId: tempUser,
      status: "BUSY",
    });

    return res.status(200).json({
      result: true,
      msg: "Swap completed successfully!",
    });
  } catch (err) {
    console.error("Swap error:", err);
    res.status(500).json({
      result: false,
      msg: "Server Error",
    });
  }
});


router.get("/all-requests", verifyToken, async (req, res) => {
  try {
    const userid = req.user?.id;
    if (!userid) {
      return res.status(401).json({
        result: false,
        msg: "Unauthorized",
      });
    }
    const userObjectId = new mongoose.Types.ObjectId(userid);

    const requests = await Swap.find({
      $or: [{ requesterId: userObjectId }, { receiverId: userObjectId }],
    })
      .sort({ createdAt: -1 })
      .populate("requesterId", "username email")
      .populate("receiverId", "username email")
      .populate("mySlotId")
      .populate("theirSlotId");

    return res.status(200).json({
      result: true,
      myId: req.user.id,
      requests,
    });
  } catch (err) {
    console.error("Error fetching swap requests:", err);
    res.status(500).json({
      result: false,
      msg: "Server Error",
    });
  }
});

export default router;
