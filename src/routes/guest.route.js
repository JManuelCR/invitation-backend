const express = require("express");
const router = express.Router();
const { createGuest, getGuest, getAllGuests, updateGuest, deleteGuest } = require("../usesCases/guest.usecase");
const { findOneAndDelete } = require("../models/guest.model");

router.get("/guests", async (req, res) => {
    const guests = await getAllGuests();
    res.status(200).json(guests);
});

router.post("/", async (req, res) => {
    const guest = req.body;
    const newGuest = await createGuest(guest);
    if (!newGuest) {
        return res.status(400).json({ message: "Failed to create guest" });
    }
    res.status(201).json(newGuest);
}); 

router.get("/:guestId", async (req, res) => {
    const guestId = req.params.guestId;
    const guest = await getGuest(guestId);
    if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
    }
    res.status(200).json(guest);
});

router.patch("/:guestId", async (req, res) => {
    const guestId = req.params.guestId;
    const guest = req.body;
    const updatedGuest = await updateGuest(guestId, guest);
    if (!updatedGuest) {
        return res.status(404).json({ message: "Guest not found" });
    }
    res.status(200).json(updatedGuest);
});

router.delete("/:guestId", async (req, res) => {
    const guestId = req.params.guestId;
    const deletedGuest = await deleteGuest(guestId);
    if (!deletedGuest) {
        return res.status(404).json({ message: "Guest not found" });
    }
    res.status(200).json(deletedGuest);
});

module.exports = router;




