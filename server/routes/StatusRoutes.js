const Router = require("express");
const { addStatus, getStatuses, deleteStatus, viewStatus } = require("../controllers/Status");
const multer = require("multer");
const router = Router();

// Use Multer to handle file uploads

const uploadStatus =  multer({dest : "uploads/status"});
 
router.post("/add-status",uploadStatus.single("file"), addStatus);
router.get("/get-status",getStatuses);
router.post("/delete-status",deleteStatus);
router.post("/view-status",viewStatus);

module.exports = router ;