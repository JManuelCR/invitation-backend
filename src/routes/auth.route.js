const express = require("express");
const router = express.Router();
const { login } = require("../usesCases/user.usecase");

router.post("/login", async (req, res) => {
    try {
      const user = await login(req.body.email, req.body.password);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      res.status(err.status || 500);
      res.json({
        success: false,
        message: err.message,
      });
    }
  });
  
  module.exports = router;