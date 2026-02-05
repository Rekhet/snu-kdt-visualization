# Todo List

## Completed Features
- [x] **Project Setup**: React, Vite, Tailwind, Three.js environment.
- [x] **3D Human Model**: Loaded GLB model with material transmission and wireframe toggle.
- [x] **Scroll Animation System**:
    - Hero text fade-out.
    - Model reveal (scale/spin).
    - "Interaction Lock" phase for exploring the single model.
    - Population Grid expansion (instanced meshes).
- [x] **Navigation & Controls**:
    - Orbit/Camera controls.
    - Custom UI Navigation Pad (Pan/Zoom/Rotate).
    - Floating Action Button (Smart scroll-to-view).
- [x] **Data Visualization**:
    - Integrated D3.js.
    - Implemented Diverging Bar Chart, Heatmap, Line Chart, Pie Chart.
- [x] **UI/UX**:
    - Dark/Light mode theming.
    - Search functionality for body parts.
    - Glassmorphism UI panels.
- [x] **Routing**:
    - Home (Scroll Experience).
    - Charts (Dashboard).
    - Settings.
    - Organ Details.

## In Progress / Refinement
- [ ] **Performance Optimization**:
    - Monitor draw calls for the Population Grid.
    - Optimize geometry for lower-end devices.
- [ ] **Data Integration**:
    - Connect charts to real dynamic data sources (currently using static CSVs/JSON).
    - Add more detailed medical descriptions to `bodyParts.js`.

## Future Ideas
- [ ] **Mobile Touch Optimization**: Refine touch controls for the 3D model on small screens.
- [ ] **Comparison View**: Mode to compare healthy vs. diseased organ models side-by-side.
- [ ] **Export Reports**: Allow users to download charts or summaries as PDF.