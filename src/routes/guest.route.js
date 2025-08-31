const express = require("express");
const router = express.Router();
const { createGuest, getGuest, getAllGuests, updateGuest, deleteGuest } = require("../usesCases/guest.usecase");
const { findOneAndDelete } = require("../models/guest.model");
const { auth } = require("../middlewares/auth.midleware");
const { emitToAll } = require("../lib/socket.lib");

// PROTECTED ENDPOINT - Requires JWT authentication
router.get("/guests", auth, async (req, res) => {
    try {
        const guests = await getAllGuests();
        
        // Emitir evento de socket SOLO cuando se obtienen todos los invitados
        emitToAll('guests-fetched', {
            action: 'fetched',
            count: guests.length,
            timestamp: new Date().toISOString()
        });
        
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching guests", error: error.message });
    }
});

// PROTECTED ENDPOINT - Requires JWT authentication
router.post("/", auth, async (req, res) => {
    try {
        const guest = req.body;
        const newGuest = await createGuest(guest);
        if (!newGuest) {
            return res.status(400).json({ message: "Failed to create guest" });
        }
        
        // Emitir evento cuando se crea un nuevo invitado
        emitToAll('guest-created', {
            action: 'created',
            guest: newGuest,
            timestamp: new Date().toISOString()
        });
        
        res.status(201).json(newGuest);
    } catch (error) {
        res.status(500).json({ message: "Error creating guest", error: error.message });
    }
}); 

// PROTECTED ENDPOINT - Requires JWT authentication
router.get("/:guestId", auth, async (req, res) => {
    try {
        const guestId = req.params.guestId;
        const guest = await getGuest(guestId);
        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }
        res.status(200).json(guest);
    } catch (error) {
        res.status(500).json({ message: "Error fetching guest", error: error.message });
    }
});

// PROTECTED ENDPOINT - Requires JWT authentication
router.patch("/:guestId", auth, async (req, res) => {
    try {
        const guestId = req.params.guestId;
        const guest = req.body;
        const updatedGuest = await updateGuest(guestId, guest);
        
        if (!updatedGuest) {
            return res.status(404).json({ message: "Guest not found" });
        }
        
        // Emitir evento cuando se actualiza un invitado
        emitToAll('guest-updated', {
            action: 'updated',
            guestId: guestId,
            guest: updatedGuest,
            timestamp: new Date().toISOString()
        });
        
        res.status(200).json(updatedGuest);
    } catch (error) {
        res.status(500).json({ message: "Error updating guest", error: error.message });
    }
});

// PROTECTED ENDPOINT - Requires JWT authentication
router.delete("/:guestId", auth, async (req, res) => {
    try {
        const guestId = req.params.guestId;
        const deletedGuest = await deleteGuest(guestId);
        
        if (!deletedGuest) {
            return res.status(404).json({ message: "Guest not found" });
        }
        
        // Emitir evento cuando se elimina un invitado
        emitToAll('guest-deleted', {
            action: 'deleted',
            guestId: guestId,
            timestamp: new Date().toISOString()
        });
        
        res.status(200).json(deletedGuest);
    } catch (error) {
        res.status(500).json({ message: "Error deleting guest", error: error.message });
    }
});

module.exports = router;




