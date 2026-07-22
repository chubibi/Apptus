# 🚀 APTUS — Interactive Mobile Engineer Portfolio

[![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-51+-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo Router](https://img.shields.io/badge/Navigation-Expo_Router_v3-4630EB?style=for-the-badge&logo=expo&logoColor=white)](https://docs.expo.dev/router/introduction/)
[![Reanimated 3](https://img.shields.io/badge/Animations-Reanimated_v3-FF4154?style=for-the-badge&logo=react&logoColor=white)](https://docs.swmansion.com/react-native-reanimated/)

**APTUS** is a production-grade, interactive mobile engineering portfolio built with **React Native** and **Expo**. Designed specifically for technical evaluations, live interviews, and Tech Lead reviews, APTUS *is* the live technical proof: rather than presenting a static CV, the application showcases architectural best practices, custom UI components, hardware integration, and native gesture animations in real time.

---

## 📱 App Preview & Interface Showcase

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <b>01. Animated Splash & Onboarding</b><br><br>
        <img src="/assets/screenshoots/splash.png" width="240" alt="Splash & Onboarding" /><br><br>
        <sub>Custom Reanimated 3 entrance with 3-step paging flow & dot indicators.</sub>
      </td>
      <td align="center" width="33%">
        <b>02. Sequential Permissions</b><br><br>
        <img src="/assets/screenshoots/permission.png" width="240" alt="Permissions Flow" /><br><br>
        <sub>Asynchronous permission request engine for Location, Camera, and Push Notifications.</sub>
      </td>
      <td align="center" width="33%">
        <b>03. Mock Interactive OTP</b><br><br>
        <img src="/assets/screenshoots/otp.png" width="240" alt="OTP Screen" /><br><br>
        <sub>Auto-focus sequence, dynamic code generation, and Reanimated shake mechanics.</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <b>04. Developer Profile & Home</b><br><br>
        <img src="/assets/screenshoots/welcome.png" width="240" alt="Home Screen" /><br><br>
        <sub>Personalized greeting leveraging AsyncStorage persistence and quick social actions.</sub>
      </td>
      <td align="center" width="33%">
        <b>05. Interactive Tech Stack</b><br><br>
        <img src="assets/screenshots/stack.png" width="240" alt="Tech Stack" /><br><br>
        <sub>Categorized mastery grid (Mobile, Frontend, Backend, DevOps) with 1–5 level metrics.</sub>
      </td>
      <td align="center" width="33%">
        <b>06. Experience Timeline</b><br><br>
        <img src="assets/screenshots/experience.png" width="240" alt="Experience" /><br><br>
        <sub>Vertical layout highlighting role achievements, technical stacks, and tenure milestones.</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <b>07. Projects & Embedded WebView</b><br><br>
        <img src="assets/screenshots/projects.png" width="240" alt="Projects" /><br><br>
        <sub>Featured project showcase supporting native detail views and in-app WebViews.</sub>
      </td>
      <td align="center" width="33%">
        <b>08. Hardware & API Playground</b><br><br>
        <img src="assets/screenshots/playground.png" width="240" alt="Tech Playground" /><br><br>
        <sub>Live execution of native camera previews, physics-based gestures, and async handling.</sub>
      </td>
      <td align="center" width="33%">
        <b>09. Skills Roadmap</b><br><br>
        <img src="assets/screenshots/roadmap.png" width="240" alt="Skills Roadmap" /><br><br>
        <sub>Interactive checklist tracking Mastered, In-Progress, and Upcoming technical goals.</sub>
      </td>
    </tr>
  </table>
</div>

> 💡 **Note for Reviewers:** Replace images inside `./assets/screenshots/` with your device recordings or emulator captures (`splash.png`, `welcome.png`, `otp.png`, `home.png`, etc.).

---

## ⚙️ Architecture & Technical Decisions

- **File-Based Routing:** Full usage of `expo-router` with separated route groups `(auth)` and `(tabs)` managed by a root entry controller (`app/index.tsx`).
- **Zero-Backend Architecture:** Standalone, deterministic runtime powered by strictly typed data structures located in `/constants`.
- **Minimal Local Persistence:** Utilizes `@react-native-async-storage/async-storage` strictly for session state (`onboarding_completed`) and user identity personalization (`user_name`).
- **Sequential Permission Flow:** Asynchronous permission engine enforcing non-blocking user UX using `expo-location`, `expo-camera`, and `expo-notifications`.
- **UI State Machine Pattern:** Standardized `Idle -> Loading -> Success -> Error` state lifecycle across async operations via a reusable `<StateHandler />` wrapper.
- **Declarative Native Animations:** Smooth 60 FPS UI transitions, spring gesture physics, and shake feedback powered by `react-native-reanimated` v3.

---

## 📁 Repository Directory Structure

```bash
aptus/
├── app/                           # Expo Router File-Based Navigation
│   ├── index.tsx                  # Root Routing Engine (AsyncStorage Guard)
│   ├── (auth)/                    # Onboarding Flow (Unauthenticated Group)
│   │   ├── _layout.tsx            # Auth Layout Wrapper
│   │   ├── splash.tsx             # Animated Splash Screen (Reanimated 3)
│   │   ├── onboarding.tsx         # 3-Slide Paging View
│   │   ├── welcome.tsx            # Sequential Permission Gateway
│   │   ├── otp.tsx                # Auto-Focus Interactive OTP Verification
│   │   └── username.tsx           # Identity Input & Storage Initialization
│   ├── (tabs)/                    # Main Application Shell (Tab Bar)
│   │   ├── _layout.tsx            # Bottom Tab Navigation Config
│   │   ├── index.tsx              # Home & Developer Overview
│   │   ├── stack.tsx              # Categorized Tech Stack Dashboard
│   │   ├── experience.tsx         # Interactive Timeline View
│   │   ├── projects.tsx           # Featured Projects Grid
│   │   └── playground.tsx         # Demos Menu (Gestures, Camera, Async)
│   ├── project/[id].tsx           # Dynamic Project Details & In-App WebView
│   ├── experience/[id].tsx        # Deep-dive Experience Details
│   └── playground/                # Native Hardware & UI Lab
│       ├── animations.tsx         # Gesture Handler & Spring Physics Demo
│       ├── async-api.tsx          # Custom Hook (useFetch) & Skeleton Loaders
│       └── camera.tsx             # Native Camera Capture & Real-time Preview
├── components/                    # Modular Component Architecture
│   ├── ui/                        # Reusable Atomic UI Engine (Badge, StateHandler)
│   ├── auth/                      # Onboarding & Auth-specific Components
│   ├── profile/                   # Header & Social Action Links
│   ├── experience/                # Timeline Renderers
│   ├── projects/                  # Cards & WebView Shells
│   └── playground/                # Custom Interactive Demo Widgets
├── constants/                     # Centralized Mock Data Source (TypeScript)
│   ├── profile.ts                 # Personal Bio, Metadata & Social Links
│   ├── skills.ts                  # Technical Competencies & Mastery Levels
│   ├── experience.ts              # Work History & Achievements
│   ├── projects.ts                # App Showcase & Repository References
│   ├── roadmap.ts                 # Technical Growth Timeline
│   └── onboarding.ts              # Onboarding Slide Configuration
├── hooks/                         # Custom React Hooks
│   ├── useFetch.ts                # Async Lifecycle Management Hook
│   ├── useCameraPermission.ts     # Camera Capability Hooks
│   └── useOnboarding.ts           # Local Storage State Interface
├── types/                         # Immutable TypeScript Data Contracts
│   └── index.ts                   # Domain Types (Skills, Projects, Experience)
└── theme/                         # Design Tokens (Colors, Fonts, Spacing)
```

---

## 🛠️ Stack & Dependencies

| Category | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | `React Native` + `Expo SDK 51+` | Cross-platform mobile foundation |
| **Navigation** | `expo-router` | Typed, file-based navigation tree |
| **Type System** | `TypeScript` (Strict Mode) | End-to-end type safety & data contracts |
| **Animation & Gestures** | `react-native-reanimated` v3 | High-performance UI interactions |
| **Gesture Engine** | `react-native-gesture-handler` | Native drag & physics interactions |
| **Persistence** | `@react-native-async-storage` | Lightweight client-side key-value storage |
| **Hardware APIs** | `expo-camera`, `expo-location` | Native sensor and hardware integrations |
| **Embedded Web** | `react-native-webview` | Native in-app browser environment |
| **Push Gateway** | `expo-notifications` | Push messaging permissions engine |

---

## ⚡ Quick Start & Local Execution

### Prerequisites
- Node.js `>= 18.0.0`
- npm or pnpm
- [Expo Go](https://expo.dev/go) on your physical device, or an configured Android Emulator / iOS Simulator.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/aptus.git
   cd aptus
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

4. **Run on target environment:**
   - Press `i` to launch in the **iOS Simulator**.
   - Press `a` to launch in the **Android Emulator**.
   - Scan the QR code with your mobile camera via **Expo Go**.

---

## 🧪 Testing the Interactive Demos

Once launched, navigate through the onboarding or jump straight to the app:
1. **Permissions Flow (`(auth)/welcome`):** Request native permissions sequentially without blocking application execution.
2. **Interactive OTP (`(auth)/otp`):** Auto-generated dynamic verification codes with error shakes and auto-tabbing inputs.
3. **Async State Handling (`(playground)/async-api`):** Trigger REST requests with live skeleton loaders, fallback handling, and manual retry triggers.
4. **Gesture Physics (`(playground)/animations`):** Drag interactive cards powered by spring physics and real-time color interpolation.
5. **Native Camera (`(playground)/camera`):** Stream live camera viewports and trigger local photo captures.

---

## 📄 License & Author

Developed with ❤️ by **Your Name / Mobile Engineer**.  
Distributed under the **MIT License**.