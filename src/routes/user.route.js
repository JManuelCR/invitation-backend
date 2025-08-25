const express = require("express");
const router = express.Router();
const {
  create,
  getUsers,
  patchUser,
  deleteUser,
  getUserById,
} = require("../usesCases/user.usecase");
const { auth } = require("../middlewares/auth.midleware");

// PUBLIC ENDPOINT - No authentication required
router.post("/", async (req, res) => {
  try {
    const user = await create(req.body);
    res.status(201);
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

// PROTECTED ENDPOINT - Requires JWT authentication
router.get("/", auth, async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200);
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const users = await getUserById(id);
    res.status(200);
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const users = await deleteUser(userId);
    res.status(200);
    res.json({
      success: true,
      message: "user deleted",
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message,
    });
  }
});

router.patch("/", auth, async (req, res) => {
  try {
    const user = await patchUser(req.body);
    res.status(200);
    res.json({
      success: true,
      message: "User updated successfully",
      data: user.description,
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