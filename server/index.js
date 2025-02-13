
const express = require("express"); //Importing Express modele i
const app = express();                // Initilizing the express module
const cors =require("cors");
require("dotenv").config();
const FileUpload = require("express-fileupload");
const {cloudinaryConnecter}= require("./utils/Cloudinary.js")
const { connection } = require("./utils/database");

const AuthRoutes = require("./routes/AuthRoutes");
const MessageRoutes = require("./routes/MessageRoutes");
const StatusRoutes = require("./routes/StatusRoutes")
// const GroupRoutes = require("./routes/GroupRoutes")
const { Server, Socket } = require("socket.io");
const getPrismaInstance = require("./utils/PrismaClient");
const PORT = process.env.PORT || 4000;


//Middleware
app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use( cors({
    origin : "http://localhost:3000",
    credentials:true
}))


 

//Mountaing 
app.use("/api/auth",AuthRoutes);
app.use("/api/messages",MessageRoutes);
// app.use("/api/groupMessage",GroupRoutes);
app.use("/api/status",StatusRoutes);

app.use("/uploads/images",express.static("uploads/images"));
app.use("/uploads/recordings",express.static("uploads/recordings"));

app.use(
    FileUpload({
        useTempFiles : true,
        tempFileDir : "/temp"
    })
)


// conecting cloudinary  For uplaoding the Img & Video into MongoDB 
cloudinaryConnecter();
connection();

const server = app.listen(PORT , ()=>{
    console.log(`Server is activated at ${PORT}`)
})
   
// =============== Socket.Io ========================= 
//Establish the socket here 
const io = new Server(server , {
    cors : {
        origin : "http://localhost:3000",
    }
})
 

global.onlineUsers = new Map();
   
io.on("connection" , (socket)=>{
     global.chatSocket = socket ;
    // console.log("d00", global.chatSocket);

     socket.on("add-user" , (userId)=>{
        onlineUsers.set(userId,socket.id);

        socket.broadcast.emit("online-users",{
            onlineUsers: Array.from(onlineUsers.keys())
        })
      });  
       
     socket.on("signout", (id)=>{
        onlineUsers.delete(id);  
        socket.broadcast.emit("online-users",{
            onlineUsers : Array.from(onlineUsers.keys())
        })
     })  
          
     socket.on("send-msg" , (data)=>{ 
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) { // check if the User is Online
            socket.to(sendUserSocket).emit("msg-recieve" , {
                from : data.from,
                message : data.message 
            })
        }
     });

// Real-time Status Events
        socket.on("add-status", ({userId,status}) => {
            console.log("Inside socket",userId,status)
            socket.broadcast.emit("add-new-status", {userId,status});
        });  

        socket.on("status-delete", ({userId,statusId}) => {
            socket.broadcast.emit("delete-status", {userId,statusId});
        });
          
     // markk as read the message , when the message i recieve
     socket.on("mark-as-read",async({from,to,messageIds})=>{
            // DB Update 
            try { 
                const prisma = getPrismaInstance();
                await prisma.Messages.updateMany({
                    where:{
                        id:{in:messageIds},
                        recieverId: from,
                        senderId: to,
                    },
                    data : {
                        messageStatus : "read"
                    }
                });

                io.to(to).emit("message-read",{from,messageIds});

            } catch (error) {
                 console.log("Error",error);
            }
     }) 
  
     socket.on("outgoing-voice-call", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
             socket.to(sendUserSocket).emit("incoming-voice-call" , {
                  from: data.from,
                  roomId : data.roomId,
                  callType : data.callType
             })
        }
     });     

     socket.on("outgoing-video-call" , (data)=>{
          const sendUserSocket = onlineUsers.get(data.to);
          if (sendUserSocket) {
               socket.to(sendUserSocket).emit("incoming-video-call",{
                     from :data.from,
                     callType :data.callType,
                     roomId : data.roomId
               })
          }
     });
    
     socket.on("reject-video-call",(data)=>{
       // const sendUserSocket = onlineUsers.get(data.to);  ///checking the uset is online or not
        const sendUserSocket = onlineUsers.get(data.from);  ///checking the uset is online or not
        if (sendUserSocket) {
             socket.to(sendUserSocket).emit("video-call-rejected")
        }
     });
  
     socket.on("reject-voice-call",(data)=>{
        // const sendUserSocket = onlineUsers.get(data.to);
        const sendUserSocket = onlineUsers.get(data.from);  ///checking the uset is online or not
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("voice-call-rejected")
        }
     })

     socket.on("accept-incoming-call",( {id})=>{
        const sendUserSocket = onlineUsers.get(id);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("accept-call")
        }
     })

})

// ///Default routes
app.get("/", (req,res)=>{
     return res.json({
        success :true,
        message : "Server is Up and running..."
     })
})
