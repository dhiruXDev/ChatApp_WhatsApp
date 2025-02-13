# WhatsApp Clone

A full-featured WhatsApp clone built using the MERN stack with Prisma and PostgreSQL. This project supports real-time messaging, status updates, media sharing, and AI-powered interactions.

## 🚀 Features

- ✅ Google Authentication / Direct login with Google 
- 🔄 **Real-time Messaging**: Messages are delivered instantly.
- 🎥 **Audio & Video Calls**: Integrated calling functionality.
- ✅ **Adding a Status**: Users can post and delete status updates.
- 💬 **Messaging**: Send text, images and audio messages.
- 🔍 **Search**: Find contacts, messages, and media quickly.
- 🤖 **Meta AI Integration**: Chat with an AI assistant.
- 🛠️ **Profile Updates**: Users can update their profile details.

## 🛠 Tech Stack
- **Frontend:** React, TailwindCSS
- **Backend**: Next.js, Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Firebase Auth
- **Real-time:** Socket.io
- **Storage:** Cloudinary
- **Hosting:** Render (backend), Vercel (frontend)

 🚀 **Live Demo:** [Click here to view](https://chat-app-whats-app.vercel.app/)


## 📂 Folder Structure
```plaintext
WhatsApp-Clone/
├── client/  # Frontend (React)
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── package.json
│
├── server/  # Backend (Node.js, Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── prisma/
│   ├── .env
│   ├── server.js
│   ├── package.json
│
├── README.md
└── .gitignore
```
## 🌍 Deployment
### Deploy Backend on Render
1. Push code to GitHub.
2. Create a new service on [Render](https://render.com/).
3. Select `server/` as the root.
4. Set up environment variables.
5. Deploy.

### Deploy Frontend on Vercel
1. Push `client/` code to GitHub.
2. Import repository on [Vercel](https://vercel.com/).
3. Set up environment variables.
4. Deploy.

## 🛠 Troubleshooting
- **Database Connection Issues?** Ensure the correct `DATABASE_URL` is used.
- **CORS Errors?** Check your backend CORS configuration.
- **Prisma Issues?** Run:
  ```sh
  npx prisma generate
  ```
- **Firebase Auth Error?** Ensure `Authorized Domains` in Firebase settings include your frontend URL.

## 📜 License
This project is open-source and available under the **MIT License**.

## 💡 Contributions
Feel free to fork and contribute by submitting a pull request!

---

**Created by Dhiraj** 🎉
