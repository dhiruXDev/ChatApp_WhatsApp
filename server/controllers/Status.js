//const cloudinary = require("../utils/cloudinary");
const multer = require("multer");
const getPrismaInstance = require("../utils/PrismaClient");
const uploadImgToCloudinary = require("../utils/uploadImgToCloduniary");
require("dotenv").config();
const {renameSync} = require("fs");
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory before uploading to Cloudinary

 
exports.addStatus = async (req, res) => {
        try {
        
            const { userId, statusType, text, fontStyle, backgroundColor } = req.body;
            
            if (!userId) {
                return res.status(400).json({ success: false, error: "User ID is required" });
            }
       
            // Validate statusType
            const validTypes = ["text", "photo", "video", "emoji"];
            if (!validTypes.includes(statusType)) {
                return res.status(400).json({ success: false, error: "Invalid status type" });
            }
    
            let mediaUrl = "";
            if (statusType !== "text" && req.file) {
                const date =  Date.now();
                let fileName = "uploads/status/"+ date +"-" + req.file.originalname;
                renameSync(req.file.path , fileName); // renaming the file nale
                const result = await uploadImgToCloudinary(fileName, process.env.FOLDER_NAME);
                console.log("Result of uploadign the image into fole",result);

                if (!result || !result.secure_url) {
                    return res.status(500).json({ success: false, error: "Cloudinary upload failed" });
                }
                mediaUrl = result.secure_url;
            }
          
            // Calculate expiration (24 hours from now)
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);
    
            const prisma = getPrismaInstance();
    
            const status = await prisma.Status.create({
                data: {
                        user: { connect: { id: parseInt(userId) } },                 
                        type: statusType,
                        content: statusType === "text" ? text : mediaUrl,
                        fontStyle: statusType === "text" ? fontStyle : undefined,
                        backgroundColor: statusType === "text" ? backgroundColor : undefined,
                        expiresAt,
                }, 
                include: {
                    user: true // 🔥 Include full user details
                }
            });
    
            return res.status(201).json({ success: true, status });
        } catch (error) {
            console.error("Error uploading status:", error);
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
};

exports.getStatuses = async (req, res) => {
    try {
        const prisma = getPrismaInstance();
        
        // Fetch all active statuses
        const statuses = await prisma.status.findMany({
            where: {
                expiresAt: { gt: new Date() }, // Fetch only active statuses
            },
            include: {
                user: { select: { id: true, name: true, profilePicture: true } }, // Fetch user details
                views: { select: { userId: true, viewedAt: true } }, // Fetch views count
            },
            orderBy: { createdAt: "desc" },
        });
         // Group statuses by user
        const groupedStatuses = statuses.reduce((acc, status) => {
            const { user, ...statusData } = status; // Separate user details from status
            if (!acc[user.id]) {
                acc[user.id] = { 
                    user, 
                    statuses: [] 
                };
            }
            acc[user.id].statuses.push(statusData);
            return acc;
        }, {});

        // Convert object to an array
        const groupedArray = Object.values(groupedStatuses);
 
        return res.json({ success: true, statuses: groupedArray });
    } catch (error) {
        console.error("Error fetching statuses:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};


exports.viewStatus = async (req, res) => {
    try {
        const { userId, statusId } = req.body;
        if (!userId || !statusId) {
            return res.status(400).json({ success: false, error: "User ID and Status ID are required" });
        }

        const prisma = getPrismaInstance();

        // Check if the user has already viewed the status
        const existingView = await prisma.statusView.findFirst({
            where: { userId: parseInt(userId), statusId: parseInt(statusId) }
        });

        if (!existingView) {
            // Create a new view entry if not already viewed
            await prisma.statusView.create({
                data: {
                    userId: parseInt(userId),
                    statusId: parseInt(statusId),
                    viewedAt: new Date(),
                },
            });
        }

        return res.json({ success: true, message: "Status marked as viewed" });
    } catch (error) {
        console.error("Error marking status as viewed:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};     

exports.deleteStatus = async (req, res) => {
    try {
        const { userId, statusId } = req.body;
        if (!userId || !statusId) {
            return res.status(400).json({ success: false, error: "User ID and Status ID are required" });
        }

        const prisma = getPrismaInstance();

        // Find the status
        const status = await prisma.status.findUnique({
            where: { id: parseInt(statusId) },
        });

        if (!status || status.userId !== parseInt(userId)) {
            return res.status(403).json({ success: false, error: "You are not authorized to delete this status" });
        }

        // Delete the status and its views
        await prisma.statusView.deleteMany({ where: { statusId: parseInt(statusId) } });
        await prisma.status.delete({ where: { id: parseInt(statusId) } });
        
        return res.json({ success: true, message: "Status deleted successfully" });
  
    } catch (error) {
        console.error("Error deleting status:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};
