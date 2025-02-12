const getPrismaInstance = require("../utils/PrismaClient");

exports.editProfileImage = async(req,res,next)=>{
      const userId = parseInt(req.params.userId);
      const {Picture} = req.body;

      const prisma = getPrismaInstance();
      try {
            const user =  await prisma.User.update({
                where :{
                    id : userId
                },
                data:{
                    profilePicture :  Picture
                }
            });
            return res.status(200).json({
                success:true,
                message:"Profile Picture updated successfully",
                data:user
            })
      }  catch(error){ 
        console.error("Error during updating Image",error);
        next(error);
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }

}

exports.editProfileDetails = async(req,res,next)=>{
       const userId =  parseInt(req.params.userId);

       const{name,email,about} = req.body;

       const prisma = getPrismaInstance();
       try{
           const user = await prisma.User.update({
               where : {
               id: userId
               },
               data : {
                   name,
                   email,
                   about
               }
           });

           return res.status(200).json({
               success:true,
               message:"Profile updated successfully",
               data:user
           })
           
       }
       catch(error){
           console.error("Error during updating profile",error);
           next(error);
           return res.status(400).json({
               success:false,
               message:error.message
           })
       }
}