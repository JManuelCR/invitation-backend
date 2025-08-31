const Guest = require("../models/guest.model");

const createGuest = async (guest) => {
    const newGuest = new Guest(guest);
    await newGuest.save();
    return newGuest;
}

const getGuest = async (guestId) => {
    const guest = await Guest.findOne({ guestInvitationId: guestId });
    const partialGuestWerd = {
        guestName: guest.guestName,
        guestInvitationDelivered: guest.guestInvitationDelivered,
        guestInvitationId: guest.guestInvitationId,
        guestlanguage: guest.guestlanguage,
        guestInvitationResponse: guest.guestInvitationResponse,
        guestPassesNumberToRecibe: guest.guestPassesNumberToRecibe,
        guestChurchAssistantConfirmation: guest.guestChurchAssistantConfirmation,
        guestReceptionAssistantConfirmation: guest.guestReceptionAssistantConfirmation,
    }
    return partialGuestWerd;
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


