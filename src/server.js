const express = require("express");
const corsMiddleware = require("./middlewares/cors.middleware");
const app = express();

// Aplicar middleware de CORS personalizado
app.use(corsMiddleware);

app.use(express.json());

// routes
const routerGuest = require("./routes/guest.route");

app.use('/guest', routerGuest);

app.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = app;