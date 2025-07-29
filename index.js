require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = require('./src/server')
const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const port = process.env.PORT || 3000;
const databaseUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

mongoose
.connect(databaseUrl)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((error) => {
    console.log('Error connecting to MongoDB', error);
});