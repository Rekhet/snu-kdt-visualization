# Disease 3D Visualization

A high-performance, interactive 3D web application for visualizing disease data on a human model. Built with React, Three.js (via React Three Fiber), D3.js, and Tailwind CSS.

## Features

### 3D Visualization & Interaction
- **Scroll-Driven Storytelling**: Seamless transition from an intro hero section to a single interactive model, then to a historical chart race, and finally to a population grid view.
- **Interactive 3D Mannequin**: A translucent, glass-like human model with internal organs.
- **Deep Zoom & Focus**: Double-click any body part (or select from search) to smoothly fly the camera to that specific region.
- **Navigation Controls**: On-screen directional pad, zoom, and reset controls for accessibility.
- **Floating Navigation**: A smart floating button that guides users back to the interactive model view when scrolled away.

### Data & Analytics
- **Historical Chart Race**: An animated bar chart race visualizing the changing landscape of cancer causes over the years (1983-2024), controlled by scrolling.
- **Context-Sensitive Charts**: Organ-specific data visualizations integrated into detail views and overlays:
    - **Incidence Trends**: Age-based incidence rates for specific cancers.
    - **Survival Comparison**: Relative survival rate changes compared to other organs.
    - **Treatment Efficacy**: Heatmap showing effectiveness of various treatments for the selected organ.
- **Dedicated Analytics Dashboard**: A centralized view for global cancer trends and disease statistics.
- **Search System**: Real-time search to locate, highlight, and zoom into specific body parts.

### Customization & State
- **Global Settings**: Toggle between Light/Dark themes and Wireframe/Solid model modes.
- **Context Preservation**: State is managed via Context API (`PopupContext`, `ThemeContext`) and persisted where appropriate.

## Tech Stack

- **Framework**: React 19 + Vite
- **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
- **Data Visualization**: D3.js
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Animations**: Custom scroll physics, Framer Motion (UI)

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

```
src/
├── components/          # Reusable UI and 3D components
│   ├── FloatingScrollButton.jsx  # Smart navigation button
│   ├── HumanModel.jsx            # The 3D Human Mesh
│   ├── PopulationGrid.jsx        # Instanced mesh grid for data view
│   ├── NavigationControls.jsx    # Camera control UI
│   ├── Overlay.jsx               # 2D Info & Search Overlay
│   ├── ... (Charts: Line, Pie, Heatmap, DivergingBar)
├── config/
│   └── scrollConfig.js  # Configuration for scroll-based animation phases
├── context/             # Global state (Theme, Popups)
├── data/                # Static data assets (cancer stats, body parts)
├── pages/               # Route views
│   ├── Home.jsx         # Main 3D scroll experience
│   ├── Charts.jsx       # D3 Visualization Dashboard
│   ├── OrganDetail.jsx  # Specific organ deep-dive
│   └── Settings.jsx     # App configuration
└── App.jsx              # Main entry & Routing setup
```

## Configuration

The scroll-based animation system is centrally configured in `src/config/scrollConfig.js`. You can adjust:
- `containerHeightVh`: Total scrollable height.
- `thresholdFactor`: Sensitivity of scroll-to-animation mapping.

### Scroll Event Points
The experience is divided into distinct "Event Points" based on scroll progress (0.0 - 1.0):
1. **EVENT_TITLE** (0.0 - 0.1): Intro title fades out.
2. **EVENT_CHART_RACE** (0.15 - 0.5): Independent historical chart race section.
3. **EVENT_MODEL_REVEAL** (0.55 - 0.7): 3D Body model appears and scales up.
4. **EVENT_MODEL_INTERACT** (0.7 - 0.9): Model is interactive (zoom/rotate/select).
5. **EVENT_GRID_EXPAND** (0.92 - 1.0): Transition to population grid view.
