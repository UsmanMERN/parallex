# 🍔 L'Âge d'Or — Premium WebGL Parallax Showcase

Welcome to **L'Âge d'Or**, an ultra-premium, interactive single-page restaurant showcase application. This project serves as an exploration of cutting-edge frontend techniques, focusing on scroll-linked 3D WebGL animations, advanced custom shaders, and luxury UI/UX design.

Designed with a warm cream and gold luxury aesthetic, this site leverages Next.js 16 (App Router), React Three Fiber, Framer Motion, and Tailwind CSS v4 to construct an immersive storytelling experience centered around a scroll-linked 3D burger assembly sequence.

---

## ✨ Key Features & Technical Highlights

### 1. Scroll-Linked 3D WebGL Assembly
*   **PNG Sequence Optimization:** Uses a high-quality 600-frame transparent PNG sequence to animate a detailed 3D burger assembling dynamically as the user scrolls.
*   **Frame-Skipping & Smooth Interpolation:** Implements intelligent delta-time based frame skipping and scroll dampening to guarantee a locked 60 FPS visual experience, even under rapid scrolling.
*   **Memory-Efficient Image Caching:** Pre-loads all 600 frames into a global non-reactive cache before initializing the Canvas, preventing garbage-collection hitches and React re-render lags.

### 2. High-Performance Preloader
*   **Responsive Preload Progress:** A bespoke, elegant serif-style counter tracks exact frame loading progress.
*   **Chroma Key Background Removal:** Employs parallelized `ffmpeg` processes to isolate the burger from its original gray-blue background, preserving crisp reflections, sesame seeds, and highlight details.

### 3. Screen-Space Post-Processing
*   **Cinematic Rendering:** Configured with advanced effects including **Bloom** (glowing highlights), **Vignette** (soft darkened edges), and **Chromatic Aberration** (lens color separation) tuned specifically for a light warm-cream background.
*   **Dynamic Effect Resolution:** Implements a dynamic traversal system of the Three.js compositor to bypass React 19 / Next.js 16 circular reference JSON serialization limitations.

### 4. Particles & Ambient Physics
*   **Floating Gold Dust:** Features a customized CPU-driven particle system containing thousands of individual warm gold and cream particles floating in 3D space, reacting subtly to mouse movement and scroll position.

### 5. Premium Luxury UI & Design System
*   **Warm Cream & Gold Theme:** A custom-tailored luxury palette utilizing HSL colors (`#faf8f5` background, `#c5a880` gold accents, `#1a1a1a` typography).
*   **High-End Glassmorphism:** Floating info cards, responsive navigation bars, and overlays styled with high-blur backdrops, subtle gradients, and low-opacity borders.
*   **Micro-Animations:** Fluid lists, staggered text, hover shimmers, and active-nav indicators powered by Framer Motion.

---

## 🛠️ Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Runtime:** React 19 & React DOM 19
*   **3D / WebGL:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
*   **Effects:** React Three Postprocessing (`@react-three/postprocessing`)
*   **Styling:** Tailwind CSS v4 & PostCSS
*   **Animations:** Framer Motion 12
*   **Assets Processing:** ffmpeg (Parallel Chroma Keying)
*   **Icons:** Lucide React

---

## 🚀 Setup & Installation

### Prerequisites
*   Node.js (v18.x or newer recommended)
*   `npm` or `yarn`
*   `ffmpeg` installed globally on your machine (required for frame extraction/background removal). On macOS, you can install it via Homebrew:
    ```bash
    brew install ffmpeg
    ```

### 1. Clone the Repository
```bash
git clone https://github.com/UsmanMERN/parallex.git
cd parallex
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Process the Burger Frames
The repository contains the original high-resolution frames with a solid background inside `public/burger-frames/` (tracked under Git). To generate the high-quality transparent frames used by the WebGL canvas, run the parallel extraction script:
```bash
npm run process-frames
```
This script leverages all available CPU cores to extract the frames into `public/frames/` (which is excluded from Git to keep the repository lightweight).

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

---

## 🧑‍💻 Author's Learning Journey

This project was built to explore the boundaries of interactive 3D on the web. Key learnings and experiments include:

*   **React 19 Compatibility:** Resolving circular references between React 19 fiber trees and Three.js canvas engines.
*   **High-FPS Scroll-Syncing:** Building custom hooks that translate scroll delta smoothly into texture swaps.
*   **GPU vs CPU Particles:** Optimizing CPU particle counts to remain responsive without overloading memory.
*   **Chroma-Key Fine-Tuning:** Discovering the perfect `ffmpeg colorkey` threshold parameters (`0xC6CDD0:0.12:0.05`) to remove background color while preserving white sesame seeds and lighting highlights.

---

## 📄 License
This project is open-source and available under the MIT License.
