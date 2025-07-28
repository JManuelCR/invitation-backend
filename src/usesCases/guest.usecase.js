const Guest = require("../models/guest.model");

const createGuest = async (guest) => {
    const newGuest = new Guest(guest);
    await newGuest.save();
    return newGuest;
}

const getGuest = async (guestId) => {
    console.log(guestId);
    const guest = await Guest.findOne({ guestInvitationId: guestId });
    console.log(guest);
    return guest;
}

const getAllGuests = async () => {
    const guests = await Guest.find();
    return guests;
}

const updateGuest = async (guestId, guest) => {
    const updatedGuest = await Guest.findOneAndUpdate({ guestInvitationId: guestId }, guest, { new: true });
    return updatedGuest;
}
const deleteGuest = async (guestId) => {
    const deletedGuest = await Guest.findOneAndDelete({ guestInvitationId: guestId });
    return deletedGuest;
}


module.exports = { createGuest, getGuest, getAllGuests, updateGuest, deleteGuest };


