// const { type } = require("os");
// const getPrismaInstance = require("../utils/PrismaClient")
 
// const { parse } = require("path");
// const { create } = require("domain");

// exports.createGroup = async (req, res, next) => {
//    try {
//        const prisma = getPrismaInstance();
//        const { name, about = "", profilePicture = "", members } = req.body;

//        if (!name || !members || members.length === 0) {
//            return res.status(400).json({ success: false, message: "Name and members are required." });
//        }

//        const group = await prisma.Group.create({
//            data: {
//                name,
//                about,
//                profilePicture,
//                members: {
//                    connect: members.map(id => ({ id: parseInt(id) })),
//                },
//            },
//            include: {
//                members: true,
//            },
//        });

//        return res.status(200).json({ success: true, group });
//    } catch (error) {
//        console.log("Error during group creation: ", error);
//        next(error);
//    }
// };


// exports.addGroupMessage = async (req, res, next) => {
//    try {
//        const prisma = getPrismaInstance();
//        const { message, from, groupId } = req.body;

//        if (!message || !from || !groupId) {
//            return res.status(400).json({
//                success: false,
//                message: "Message, sender ID, and group ID are required.",
//            });
//        }

//        const newMessage = await prisma.Messages.create({
//            data: {
//                message,
//                sender: { connect: { id: parseInt(from) } },
//                group: { connect: { id: parseInt(groupId) } },
//                type: "text",
//                messageStatus: "sent",
//            },
//            include: {
//                sender: true,
//                group: true,
//            },
//        });

//        return res.status(200).json({
//            success: true,
//            message: newMessage,
//        });
//    } catch (error) {
//        console.log("Error during adding group message: ", error);
//        next(error);
//    }
// };


