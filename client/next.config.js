/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: true,v   ---> It will run twice the Page/ Application 
  reactStrictMode: false,
  env : {
          NEXT_PUBLIC_ZEGO_APP_ID : 12316490,
          NEXT_PUBLIC_ZEGO_SERVER_SECRET_ID : "b801a254a3d5b8ed70ede967f7fe0c61",
  },
  images :{
    domains :["localhost"]
  }
};

module.exports = nextConfig;
