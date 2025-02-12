const { type } = require("os");
const getPrismaInstance = require("../utils/PrismaClient")
const {renameSync} = require("fs");
const { connect } = require("http2");
const { parse } = require("path");
const { create } = require("domain");
/**     
 *    In Prisma, model names in your schema are automatically converted to lowercase when generating queries, so both Messages and messages refer to the same model.
 */
exports.addMessage = async(req,res,next)=>{
     try {
           const prisma = getPrismaInstance();
           const{message,to,from} = req.body;
           // check If the reciever User is online or not
           const getUser = onlineUsers.get(to);

/**  3  condition :-
 * if message is sent ---> sent
 * if message reciever is online ----> delevired
 * iff meassage is recieved (mesans seen) --> read
 */
           if(message && to && from){
                 const newMessage = await prisma.Messages.create({
                  data : {
                         message  ,
                         sender : { connect : { id :  parseInt(from) } } ,
                         reciever : {connect :{ id : parseInt(to)}} ,
                         messageStatus : getUser ? "delivered"  : "sent"
                  },
                    include :  {sender :true , reciever :true}
                 });
               return res.status(200).json({
                  success:true,
                  message: newMessage
               })
           }
           return res.status(400).json({
               success :false,
               message: "To ,From and Message is required"
           })
           
     } catch (error) {
          console.log( "Error during updating message DB : ", error);
          next(error);
          return res.status(403).json({
            success :false,
            message:error.message
          })
         
     }
}

exports.getMessages = async(req,res,next)=>{
         try {
            const prisma = getPrismaInstance();
            const{from,to} = req.params; 

// Fond message where some give condition   found ,means in both condition when where sender is sender or reciever
            const messages = await prisma.Messages.findMany({
                  where : {
                        OR : [ // satisfies one of them condition
                              {
                                    senderId : parseInt(from),
                                    recieverId : parseInt(to)
                              },
                              {
                                    senderId: parseInt(to),
                                    recieverId : parseInt(from)
                              }
                        ]
                  },
                  orderBy : {
                        id : "asc"
                  }
            });
 
            const unReadMessages = [];

            messages.forEach((message,index) => {
                    if (message.messageStatus !== "read" && message.senderId === parseInt(to) ) {
                          message.messageStatus = "read";
                          unReadMessages.push(message.id);
                    }
            });
 
         const updatesdata=   await prisma.Messages.updateMany({
                  where : {
                         id : {in : unReadMessages}    
                  },
                  data: {
                        messageStatus : "read"
                  }
            });
          //console.log( updatesdata);
            return res.status(200).json({
                    success :true,
                    messages
            })
            
         } catch (error) {
            console.log( "Error during getting message DB : ", error);
            next(error);
            return res.status(403).json({
              success :false,
              message:error.message
            })

       }
}

exports.addImageMessages = async(req,res,next)=>{
       try {
             if (req.file) {
                  const date = Date.now();
                  let fileName = "uploads/images/"+ date +"-" + req.file.originalname;
                  renameSync(req.file.path , fileName); // renaming the file nale
                   
                  const prisma= getPrismaInstance();
                  const {from,to}= req.query;

                  if (from && to) {
                          const message = await prisma.Messages.create({
                               
                              data: {
                                    message : fileName,
                                    sender: {connect : {id : parseInt(from)}} ,
                                    reciever : {connect : {id : parseInt(to)}},
                                    type : "Image"
                              }
                          });
                        //   console.log( "Message ",message )
                          return res.status(200).json({success :true, message})
                  }
                  return res.status(400).send("to and from is required");

             }
             return res.status(403).send("Image is requrired");
            
       } catch (error) {
            console.log( "Error : ",error);
            next(error);
       }
}
exports.addAudioMessage = async(req,res,next)=>{
       try {
            if(req.file){                
                  const date = Date.now();  
                  let fileName = "uploads/recordings/"+date+"-"+req.file.originalname;console.log("first")
                  renameSync(req.file.path ,fileName);
                  const prisma = getPrismaInstance();
                  const{from,to} =req.query;
                  // console.log( from,to)
                  if(to && from){
                        const message = await prisma.Messages.create({
                              data: {
                                    message: fileName,
                                    sender :{connect :{id : parseInt(from)}},
                                    reciever : {connect: { id : parseInt(to)}},
                                    type:"audio",

                              }
                        });
 
                        return res.status(200).json({success:true ,message})
                  }
                  return res.status(400).send("to and From is required");
            }
            return res.status(403).send("Audio is required")
            
       }  catch (error) {
            console.log( "Error : ",error);
            next(error);
       }
}


exports.getInitialContactWithMessages  =  async(req,res,next)=>{
      try {
             const prisma = getPrismaInstance(); 
             const userId=   parseInt(req.params.from); // from is the id of the user
             const user = await prisma.User.findUnique({
                   where : {id:userId},
                   include: {
                        sentMessage : {
                              include:{
                                    reciever :true,
                                    sender :true
                              },
                              orderBy :{
                                    createdAt : "desc"
                              }
                        },  
                        recievedMessage : { 
                              include:{
                                    sender :true,
                                    reciever : true
                              },
                              orderBy: {
                                    createdAt : "desc"
                              }
                        }
                   }
             });

            const messages = [...user.sentMessage , ...user.recievedMessage];

            messages.sort((a,b)=> b.createdAt.getTime() - a.createdAt.getTime());

            // - ===> means   b > a according to tiem
            const users = new Map();
            const messageStatusChanges = [];

            messages.forEach((msg)=>{

                 const isSender = msg.senderId === userId ;
                 const calculatedId = isSender ? msg.recieverId : msg.senderId;

                 if (msg.messageStatus === "sent") {
                         messageStatusChanges.push(msg.id);
                 }
                 
                 const{ 
                  id ,
                  type ,
                  message,
                  messageStatus,
                  createdAt,
                  senderId,
                  recieverId
             } = msg;
            
                 if (!users.get(calculatedId)) {
                    let user = {
                        messageId : id,
                        type,
                        message,
                        messageStatus,
                        createdAt,
                        senderId,
                        recieverId
                    }
                    if (isSender) {
                        user = {
                              ...user,
                              ...msg.reciever,
                              totalUnreadMessage : 0
                        }
                    }else{
                        user = {
                               ...user,
                               ...msg.sender,
                               totalUnreadMessage : messageStatus != "read" ? 1 : 0
                        }
                    }
                    users.set(calculatedId , {...user});
                 }
                 else if(msg.messageStatus !== "read" && !isSender ){
                    const user = users.get(calculatedId);
                    users.set(calculatedId,  {
                        ...user,
                        totalUnreadMessage : user.totalUnreadMessage + 1 
                    })

                 }

            });
            
//---------------------------------------------------------------------
// ✅ Fetch the latest status of users within 24 hours
    const statuses = await prisma.Status.findMany({
      where: {
        userId: { in: Array.from(users.keys()) }, // Get statuses for all chat users
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Only fetch statuses in the last 24 hours
        },
      },
      include: {
        user: true, // Include user details
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("Status",statuses)

    // Attach status to each user
    statuses.forEach((status) => {
      if (users.has(status.userId)) {
        const user = users.get(status.userId);
        users.set(status.userId, { ...user, latestStatus: status });
      }
    });
//-----------------------------------------------------------------------------         
            if (messageStatusChanges.length) {
                  await prisma.Messages.updateMany({
                        where : {
                              id: { in : messageStatusChanges}
                        },
                        data : {
                              messageStatus : "delivered"
                        }
                  })
            }  

            return res.status(200).json({
                  users : Array.from(users.values()),
                  onlineUsers : Array.from(onlineUsers.keys())  // Id of online users , and OnlineUsers info is set Globally , see in index.js --> global.onlineUsers = new Map(); read this line and afer this line
            })
   
      }  catch (error) {
            console.log("first",error.message)
            console.log( "Error : ",error);
            
            next(error);
       }
}


//       try {
//         const userId = parseInt(req.params.from);
//         const prisma = getPrismaInstance();
//         const user = await prisma.user.findUnique({
//           where: { id: userId },
//           include: {
//             sentMessage: {
//               include: {
//                 reciever: true,
//                 sender: true,
//               },
//               orderBy: {
//                 createdAt: "desc",
//               },
//             },
//             recievedMessage: {
//               include: {
//                 reciever: true,
//                 sender: true,
//               },
//               orderBy: {
//                 createdAt: "desc",
//               },
//             },
//           },
//         });
//         const messages = [...user.sentMessage, ...user.recievedMessage];
//         messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
//         const users = new Map();
//         const messageStatusChange = [];
//         messages.forEach((msg) => {
//           const isSender = msg.senderId === userId;
//           const calculatedId = isSender ? msg.recieverId : msg.senderId;
//           if (msg.messageStatus === "sent") {
//             messageStatusChange.push(msg.id);
//           }
//           const {
//             id,
//             type,
//             message,
//             messageStatus,
//             createdAt,
//             senderId,
//             recieverId,
//           } = msg;
//           if (!users.get(calculatedId)) {
//             let user = {
//               messageId: id,
//               type,
//               message,
//               messageStatus,
//               createdAt,
//               senderId,
//               recieverId,
//             };
//             if (isSender) {
//               user = { ...user, ...msg.reciever, totalUnreadMessages: 0 };
//             } else {
//               user = {
//                 ...user,
//                 ...msg.sender,
//                 totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
//               };
//             }
//             users.set(calculatedId, { ...user });
//           } else if (messageStatus !== "read" && !isSender) {
//             const user = users.get(calculatedId);
//             users.set(calculatedId, {
//               ...user,
//               totalUnreadMessages: user.totalUnreadMessages + 1,
//             });
//           }
//         });
//         if (messageStatusChange.length) {
//           await prisma.messages.updateMany({
//             where: { id: { in: messageStatusChange } },
//             data: { messageStatus: "delivered" },
//           });
//         }
 
//         return res.status(200).json({
//           users: Array.from(users.values()),
//           onlineUsers: Array.from(onlineUsers.keys()),
//         });
//       } catch (err) {
//         next(err);
//       }
//     };