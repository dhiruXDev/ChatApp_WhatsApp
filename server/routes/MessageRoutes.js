const Router = require("express");
const { addMessage, getMessages, addImageMessages, addAudioMessage, getInitialContactWithMessages } = require("../controllers/MessageController");
const multer = require("multer");

const router = Router();
const uploadImage =  multer({dest : "uploads/images"});
const uploadsAudio = multer({dest: "uploads/recordings"});

router.post('/add-message',addMessage);
router.get('/get-messages/:from/:to',getMessages);
router.post('/add-image-message',uploadImage.single("image"),addImageMessages);
router.post('/add-audio-message',uploadsAudio.single("audio"),addAudioMessage);
router.get('/get-initial-contacts/:from',getInitialContactWithMessages);

module.exports = router;