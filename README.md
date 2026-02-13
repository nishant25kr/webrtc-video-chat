# 🎥 Omegle-Style Video Chat

<div align="center">

**A modern, real-time 1-to-1 random video chat application**

Built with WebRTC • Socket.IO • React • Node.js

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [How It Works](#-how-it-works) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

This project is a **learning-focused implementation** of an Omegle-style random video chat platform. Users are instantly matched with strangers for real-time video conversations, with the ability to skip to the next person at any time.

Perfect for understanding WebRTC signaling, peer-to-peer connections, and real-time matchmaking systems.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Random Matching** | Intelligent queue system pairs users instantly |
| 🎥 **HD Video & Audio** | Crystal-clear WebRTC peer-to-peer streaming |
| ⚡ **Instant Skip** | Next button for seamless partner switching |
| 🔄 **Auto-Reconnect** | Automatic re-queuing after disconnect |
| 🧹 **Resource Cleanup** | Proper memory management and connection handling |
| 🌐 **Local Network Ready** | STUN server support for NAT traversal |

---

## 🎬 Demo

> **Note:** This is a development/learning project. For production use, additional security and TURN server configuration is required.

### Testing Locally
1. Open the app in **two separate browser tabs** (or different devices on the same network)
2. Allow camera and microphone permissions
3. Watch the magic happen! 🎉

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/omegle-clone.git
cd omegle-clone
```

**2. Start the backend server**
```bash
cd server
npm install
node index.js
```
🟢 Server running at `http://localhost:3030`

**3. Start the frontend client**
```bash
cd client
npm install
npm run dev
```
🟢 Client running at `http://localhost:5173` (or your Vite default)

---

## 🧠 How It Works

### Connection Flow

```
┌─────────────┐         ┌─────────────┐
│   User A    │         │   User B    │
└──────┬──────┘         └──────┬──────┘
       │                       │
       │   1. Join Queue       │
       ├──────────┬────────────┤
       │          │            │
       │    ┌─────▼─────┐      │
       │    │  Server   │      │
       │    │ Matchmaker│      │
       │    └─────┬─────┘      │
       │          │            │
       │   2. Room Created     │
       ◄──────────┴───────────►│
       │                       │
       │   3. WebRTC Offer     │
       ├──────────────────────►│
       │                       │
       │   4. WebRTC Answer    │
       ◄──────────────────────┤
       │                       │
       │   5. ICE Exchange     │
       ◄──────────────────────►│
       │                       │
       │   🎥 P2P Stream 🎥    │
       ◄═══════════════════════►
```

### Step-by-Step Process

1. **User Initialization**
   - Camera and microphone access requested
   - User added to matching queue via Socket.IO

2. **Matchmaking**
   - Server pairs two available users
   - Creates a unique room ID
   - Notifies both clients

3. **WebRTC Signaling**
   - User A creates and sends an SDP offer
   - User B receives offer and sends SDP answer
   - Both exchange ICE candidates for NAT traversal

4. **Peer Connection**
   - Direct peer-to-peer audio/video stream established
   - Media flows without server relay (unless TURN is needed)

5. **Next Button**
   - Closes current `RTCPeerConnection`
   - Cleans up media streams
   - Returns user to queue
   - Initiates new matching cycle

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **WebRTC API** | Peer-to-peer video/audio |
| **Socket.IO Client** | Real-time signaling |
| **Vite** | Build tool and dev server |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express** | Web server |
| **Socket.IO** | WebSocket server |
| **Custom Managers** | User queue and room logic |

---


## 🔧 Configuration

### STUN Server Configuration
The app uses Google's public STUN servers by default:

```javascript
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
];
```

### Custom Server Ports
Edit the following files to change default ports:

**Backend** (`server/index.js`):
```javascript
const PORT = process.env.PORT || 3030;
```

**Frontend** (Socket.IO connection):
```javascript
const socket = io('http://localhost:3030');
```

---

## ⚠️ Known Limitations

| Issue | Impact | Solution |
|-------|--------|----------|
| No TURN server | Connections may fail behind strict NATs/firewalls | Add TURN server for production |
| No moderation | Potential for abuse | Implement reporting system |
| Video only | No text chat option | Add chat feature |
| Mobile layout | Not optimized for small screens | Responsive design needed |

---

## 🔮 Roadmap & Improvements

- [ ] **TURN Server Integration** - For production-grade NAT traversal
- [ ] **Text Chat** - Real-time messaging alongside video
- [ ] **User Reporting** - Safety and moderation tools
- [ ] **Mobile Responsive UI** - Touch-friendly interface
- [ ] **Region-Based Matching** - Connect users by location
- [ ] **Connection Quality Indicators** - Show latency and bandwidth
- [ ] **Auto-Skip on Disconnect** - Better user experience
- [ ] **End-to-End Encryption** - Enhanced privacy
- [ ] **Screen Sharing** - Share screen instead of camera
- [ ] **Interest Tags** - Match users with common interests

---

## 📚 What You'll Learn

This project is an excellent educational resource for:

✅ WebRTC fundamentals (SDP, ICE, STUN/TURN)  
✅ Real-time signaling with Socket.IO  
✅ Peer-to-peer media streaming  
✅ Connection lifecycle management  
✅ Resource cleanup and memory management  
✅ Asynchronous JavaScript patterns  
✅ React hooks for media devices  

---

## 🐛 Troubleshooting

### Camera/Microphone Not Working
- Ensure browser permissions are granted
- Check if HTTPS is enabled (required for WebRTC in production)
- Verify no other app is using the devices

### Connection Not Establishing
- Check browser console for errors
- Verify server is running and accessible
- Test with both users on same network first
- Check firewall settings

### "Next" Button Not Working
- Ensure proper cleanup in `Room.jsx`
- Check server logs for room management issues
- Verify socket connection is active

---

## 🤝 Contributing

Contributions are welcome! This is a learning project, so improvements of all kinds are appreciated.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


## 🧑‍💻 Author

**Nishant Kumar**

Built to explore WebRTC, real-time systems, and peer-to-peer architecture.

- GitHub: [@your-username](https://github.com/nishant25kr)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/nishant-kumar-239003232/)

---

## ⭐ Support This Project

If you found this helpful for learning WebRTC:
- ⭐ Star this repository
- 🍴 Fork it and build something cool
- 📣 Share it with others learning real-time web technologies
- 💬 Open issues for questions or suggestions

---

<div align="center">

**Happy Coding!** 🚀

Made with ❤️ for the developer community

</div>