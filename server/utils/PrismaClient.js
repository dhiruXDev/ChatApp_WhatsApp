 const {PrismaClient}  = require("@prisma/client");

let prismaInstance = null;
 function getPrismaInstance (){
       if(!prismaInstance){
            // Create new Prisma Instance
            prismaInstance = new PrismaClient;
       }
       return prismaInstance;
}

module.exports = getPrismaInstance;

/*
You are using a singleton pattern to ensure that only one instance of PrismaClient is created and reused throughout your application. This is a common and efficient way to manage database connections in Node.js applications.
 */