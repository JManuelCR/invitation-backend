const { response } = require("express");
const mongoose = require("mongoose");


const guestSchema = new mongoose.Schema({
    guestFrom: {
        type: String,
        required: true,
        default: "Novio y Novia",
        enum: ["Novio y Novia", "Novio", "Novia", "Amigo", "Amiga", "Familiar", "Otro"],  
    },
    guestType: {
        type: String,
        required: false,
    },
    guestRelationship: {
        type: Number,
        required: false,
        enum: ["Padre", "Madre", "Hermano", "Hermana", "Tio", "Tia", "Sobrino", "Sobrina", "Primo", "Prima", "Amigo", "Amiga", "Familiar", "Otro"],
    },
    guestName: {
        type: String,
        required: true,
    },
    guestPassesNumberToRecibe: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
        default: 0
    },
    guestPeopleNumber:{
        type: Number,
        required: true,
        min: 0,
        max: 6,
        default: 0
    },
    guestInvitation: {
        type: Boolean,
        default: false,
        required: true,
    },
    guestWouldAccept: {
        type: Boolean,
        required: true,
        default: false
    },
    guestExpectationAssistant: {
        type: Number,
        required: false,
        min: 0,
        max: 6,
        default: 0
    },
    priority:{
        type: Number,
        required: false,
        default: null
    },
    guestCanBeDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    guestInvitationName: {
        type: String,
        required: true,
    },
    guestPrimaryContact: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 15,
        validate: {
            validator: function (v) {
                return v === null || /^\+\d{10,15}$/.test(v);
              },
              message: 'El número debe estar en formato internacional (ej. +5215512345678) y tener entre 10 y 15 dígitos.'  
        }
    },
    guestSecondaryContact: {
        type: String,
        required: false,
        minlength: 10,
        maxlength: 15,
        default: null,
        validate: {
            validator: function (v) {
                return v === null || /^\+\d{10,15}$/.test(v);
              },
              message: 'El número debe estar en formato internacional (ej. +5215512345678) y tener entre 10 y 15 dígitos.'  
        }
    },
    guestPhysicalInvitation: {
        type: Boolean,
        default: false
    },
    guestWasInvited: {
        type: Boolean,
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
        max: 6,
        default: 0
    },
    guestLanguage: {
        type: String,
        required: false,
        enum: ["Español", "Inglés", "Portugués", "Francés", "Alemán", "Italiano", "Otro"],
        default: "Español"
    },
    guestInvitationId: {
        type: String,
        required: true,
        unique: true
    }
})

const Guest = mongoose.model('Guest', guestSchema, 'guests');

module.exports = Guest;
