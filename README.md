# 3D CD Player with Spotify Integration

A beautiful 3D interactive CD player that integrates with Spotify for music playback.

## 🎵 Features

- **3D Interactive Interface**: Realistic CD player with spinning discs
- **Spotify Integration**: Full OAuth authentication and playback control
- **Premium Audio**: Requires Spotify Premium for playback
- **Modern UI**: Clean, responsive design with smooth animations
- **Album Library**: Pre-loaded collection of classic albums

## 🚀 Quick Start

See detailed setup instructions in [`docs/README.md`](./docs/README.md)

## 📁 Project Structure

```
3d-cd-player/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── types/             # TypeScript definitions
│   ├── constants.ts       # Album data and constants
│   └── types.ts          # Type definitions
├── deployment/            # Deployment configurations
│   ├── frontend/         # Vercel deployment files
│   └── backend/          # Render deployment files
├── docs/                 # Documentation
├── server.js            # Express backend server
├── App.tsx              # Main React component
├── index.html          # HTML entry point
└── package.json        # Current environment config
```

## 🌐 Live Demo

- **Frontend**: [Deployed on Vercel](https://3d-cd-player-a800q0z23-patricks-projects-1e98187f.vercel.app)
- **Repository**: [GitHub](https://github.com/BrandeisPatrick/poetry-music-coffee)

## 📚 Documentation

- [**Setup Guide**](./docs/README.md) - Complete installation instructions
- [**Deployment Guide**](./docs/DEPLOY.md) - General deployment information  
- [**Render Deployment**](./docs/RENDER_DEPLOY.md) - Backend deployment to Render
- [**Backend Deployment**](./docs/BACKEND_DEPLOY.md) - Alternative backend deployment options

## 🛠 Technologies

- **Frontend**: React, TypeScript, Vite, Three.js, Tailwind CSS
- **Backend**: Node.js, Express, Spotify Web API
- **3D Graphics**: @react-three/fiber, @react-three/drei
- **Deployment**: Vercel (frontend), Render (backend)

## 🎮 Usage

1. **Login** with your Spotify Premium account
2. **Select** an album from the library
3. **Open** the CD tray and insert a disc
4. **Play** music and watch the 3D CD spin!

## 📄 License

ISC License - see individual package.json files for details.

---

Built with ❤️ and lots of ☕