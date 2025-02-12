
// const getPrismaInstance = require("../utils/PrismaClient");

// exports.checkUser = async (req,res,next)=>{
//        try { 
//              console.log( "Welcoome Backend")
//              const {email}=req.body;
//              console.log( "Email",email);
//              if(!email){
//                 return res.status(404).json({
//                     success :false,
//                     message : "Email is required"
//                 })
//              }

//              const prisma = getPrismaInstance();
//              const user = await prisma.User.findUnique({where: {email}});  // Checking the User is present or not in DB
//              console.log( user);

//              if(!user){
//                  return res.json({
//                      success:false,
//                      message : "User is not Found"
//                  })
//              }
//                 return res.status(200).json({
//                     success : true,
//                     message : "User Found",
//                     data : user
//                 });
            
//        } catch (error) {
//            console.log( "Error during Authenticting the User",error);
//            next(error);  // What is the meaning of thsi
//            return res.status(400).json({
//             success :false,
//             message :error.message
//            })

//        }
// }

// // creting New User in DB 
// exports.onBoardUser = async(req,res,next)=>{
//       try {
//             const {email,name,about,profilePicture,}=req.body;
//             console.log(  {email,name,about,profilePicture,} )
//             if(!email || !name || !profilePicture){
//                 return res.send("Email , name, about is required");
//             }

//             const prisma = getPrismaInstance();
//             const resp=   await prisma.User.create({
//                 data : {name , email,about,profilePicture,}
//             });
//           console.log( "Respone ",resp)
//           return res.status(200).json({
//             success: true,
//             message :"User is created succesfully"
//           })

//       } catch (error) {
//          next(error)
//          console.log( "ERROR DURING CREAAATING DB ",error)
//       }

// }


const getPrismaInstance = require("../utils/PrismaClient");
const generateToken04 = require("../utils/TokenGenerator");
// Handler to check if a user exists in the database
exports.checkUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
//means that the code is calling a function named getPrismaInstance to obtain an instance (or connection) of the Prisma client, which is used to interact with the database.
        const prisma = getPrismaInstance();
        const user = await prisma.User.findUnique({ where: { email } });

        if (!user) {
            // User not found in database
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        // User found, returning user data
        return res.status(200).json({
            success: true,
            message: "User found",
            data: user,
        });
    } catch (error) {
        console.error("Error during user authentication", error);
        next(error);  // Pass error to the next middleware or error handler
    }
};

//-------->  SignUp  <------------------
// Handler to onboard a new user by saving their information to the database
exports.onBoardUser = async (req, res, next) => {
    try {
        const { email, name, about , profilePicture } = req.body;
          
        // Validating required fields
        if (!email || !name || !profilePicture) {
            return res.status(400).json({
                success: false,
                message: "Email, name, and profile picture are required",
            });
        }

        const prisma = getPrismaInstance();
        const user = await prisma.User.create({
            data: { name ,
                    email,
                     about : about === "" ? "Hey there, I'm using Whatsapp":about ,
                     profilePicture },
        });

        // Respond with success if user is created successfully
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error during user creation", error);
        next(error);  // Pass error to error-handling middleware
    }
};

// Fetching all Users with their alphabetial order
exports.getAllUsers = async(req,res,next)=>{
     try {
        const prisma = getPrismaInstance();
        // Find all user withh their specific requirement like name,id,emal.. should be and also List all Users with thier Alphabetical order 
        const AllUsers =await prisma.User.findMany({ 
               orderBy:{name:"asc"},
               select :{
                   id:true,
                   name:true,
                   email:true,
                   profilePicture:true,
                   about:true,
               }
        });
        // console.log( "all Users ",AllUsers);
   // Creating a array object link { A : ["abhishek" , "Avhi" ...]} , Means all users with ascedning order in alphabetical order with  all Users
        const usersGroupByInitialLetter ={};
        AllUsers.forEach((user) => {
             const initialLetter = user.name.charAt(0).toUpperCase();
             if(!usersGroupByInitialLetter[initialLetter]){  // Means selected Initial's letter has no any Contact/User , then push empty array 
                  usersGroupByInitialLetter[initialLetter] = [];
             }
             usersGroupByInitialLetter[initialLetter].push(user);
        });
        // console.log( "All ",usersGroupByInitialLetter)
        return res.status(200).json({
            success:true,
            message:"Succesfully Fetched all Users with their Alphabetical order",
            users:usersGroupByInitialLetter
        });
     } catch (error) {
        console.log( "Error during fetching all Users from DB ",error)
        next(error)
     }
}

exports.generateToken = async(req,res,next)=>{
    try {
        const appId = parseInt(process.env.ZEGO_APP_ID);
        const serverSecretId = process.env.ZEGO_SERVER_SECRET_ID;
        const userId = req.params.userId;
        const effectiveTime = 3600;
        const payload = "";
         console.log("first",appId,serverSecretId,userId,effectiveTime,payload);
        if(appId && serverSecretId && userId){
            // callign the generateToken04 func for generating token
             const token = generateToken04(appId,userId, serverSecretId,effectiveTime, payload  );
             console.log("token",token);
             return res.status(200).json({ token});
        }
        return res.status(400).send("Appid,serverSecretId and userrId is required");

    } catch (error) {
         console.log("error during generating token ",error);
         next(error);
    }
}