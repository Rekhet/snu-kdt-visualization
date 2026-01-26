# Disease 3D Visualization

A high-performance, interactive 3D web application for visualizing disease data on a human model. Built with React, Three.js (via React Three Fiber), and Tailwind CSS.

## Features

- **Interactive 3D Mannequin**: A translucent, glass-like human model with internal organs.
- **Deep Zoom**: Double-click any body part (or select from search) to smoothly fly the camera to that specific region.
- **360° Inspection**: Unrestricted camera rotation and zoom.
- **Disease Data**: Overlay displaying common conditions associated with the selected organ/region.
- **Search**: Real-time search to locate and highlight body parts.

## Tech Stack

- **Framework**: React + Vite
- **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (UI), Maath/Spring (3D)

## Usage

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Project Structure

- `src/components/HumanModel.jsx`: The procedural 3D geometry of the body.
- `src/components/Overlay.jsx`: The 2D UI layer (Search, Info Card).
- `src/data/bodyParts.js`: Database of body parts and disease info.
- `src/App.jsx`: Main scene configuration and state management.