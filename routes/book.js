const express = require("express");
const auth = require("../middleware/auth");
const {
  selectbook,
  rentalBook,
  myBook,
  returnBook,
} = require("../controller/book");

const router = express.Router();
router.route("/").get(selectbook);
router.route("/rental").post(auth, rentalBook);
router.route("/me").get(auth, myBook);
router.route("/return").delete(auth, returnBook);

module.exports = router;
