const express = require("express");
const app = express();
app.use(express.json());

// routes
const routerGuest = require("./routes/guest.route");


app.use('/guest', routerGuest);

app.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = app;