const { response } = require("express");
const mongoose = require("mongoose");


const guestSchema = new mongoose.Schema({
    guestType: {
        type: String,
        required: false,
    },
    guestRelationship: {
        type: String,
        required: false,
    },
    guestName: {
        type: String,
        required: true,
    },
    guestPassesNumberToRecibe: {
        type: Number,
        required: true,
        min: 0,
        max: 8,
        default: 0
    },
    guestIsInvited: {
        type: Boolean,
        required: true,
        default: false
    },
    guestInvited: {
        type: String,
        required: false,
        enum: ["YES", "NO","MAYBE"],
        default: "NO"
    },
    guestSide: {
        type: String,
        required: false,
        default: "Ambos"
    },
    guestProbability: {
        type: Number,
        required: false,
        min: 0,
        max: 6,
        default: 0
    },
    guestPriority: {
        type: Number,
        required: false,
        default: 0
    },
    guestInvitationDelivered: {
        type: Boolean,
        required: false,
        default: false
    },
    guestTransportCount: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    guestForeigner: {
        type: String,
        required: false,
        enum: ["YES", "NO"],
        default: "NO"
    },
    guestChurchAssistantConfirmation: {
        type: Boolean,
        required: false,
        default: false
    },
    guestReceptionAssistantConfirmation: {
        type: Boolean,
        required: false,
        default: false
    },
    guestPrimaryContact: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 20,
        validate: {
            validator: function (v) {
                return v === null || /^\+?\d{10,20}$/.test(v);
              },
              message: 'El número debe estar en formato internacional (ej. +52 554 026 19 32) y tener entre 10 y 13 dígitos.'  
        }
    },
    guestSecondaryContact: {
        type: String,
        required: false,
        minlength: 10,
        maxlength: 20,
        default: null,
        validate: {
            validator: function (v) {
                return v === null || /^\+?\d{10,20}$/.test(v);
              },
              message: 'El número debe estar en formato internacional (ej. +52 554 026 19 32) y tener entre 10 y 13 dígitos.'  
        }
    },
    guestPhysicalInvitation: {
        type: Boolean,
        required: true,
        default: false
    },
    guestInvitationResponse: {
        type: Boolean,
        default: false
    },
    guestParticipation: {
        type: Number,
        required: false,
        min: 0,
        max: 8,
        default: 0
    },
    guestLanguage: {
        type: String,
        required: false,
        enum: ["Espanol", "Ingles"],
        default: "Espanol"
    },
    guestInvitationId: {
        type: String,
        required: true,
        unique: true
    },
    guestPorkCountDesire: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    guestChickenCountDesire: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    guestInvitationUrl: {
        type: String,
        required: false,
        default: null
    },
    guestQRCodeUrl: {
        type: String,
        required: false,
        default: null
    }
})

const Guest = mongoose.model('Guest', guestSchema, 'guests');

module.exports = Guest;
