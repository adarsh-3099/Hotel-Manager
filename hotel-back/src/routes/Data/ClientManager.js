const router = require("express").Router();
const VerifyManager = require("../utils/VerifyManager");

const User = require("../../models/User");

let activeConn = [];

// get all hotel names
router.post("/hotel", async (req, res) => {
  const { shopName, tableID, pass } = req.body;
  const user = await User.findOne({ shopName }).select("shopName");
  if (!user) return res.status(404).send("Hotel Not found");

  const search = activeConn.filter(
    (conn) => conn.shopName === shopName && conn.tableID === tableID
  );

  if (!search.length) {
    activeConn.push({ shopName, tableID, pass });
    return res.status(200).send("Success");
  }

  if (search[0].pass === pass) return res.status(200).send("Success");

  return res.status(401).send("Incorrect Password");
});

// fetch menu array from user model
router.get("/menu", async (req, res) => {
  const { shopName } = req.query;
  const user = await User.findOne({ shopName }).select("menu");
  if (!user) return res.status(404).send("Not found");

  if (user.menu.length === 0) return res.status(204).send("empty menu");
  return res.status(200).send(user.menu);
});

module.exports = router;
