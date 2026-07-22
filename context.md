Este documento resume el blueprint completo del proyecto "Aptus", una app
móvil portafolio personal para un desarrollador Front-End / Mobile. Fue
construido iterativamente por fases con un Arquitecto de Software Senior.
Su propósito es servir como contexto base para un agente de desarrollo.

--------------------------------------------------------------------------------
OBJETIVO DEL PROYECTO
--------------------------------------------------------------------------------

Desarrollar una aplicación móvil con React Native + Expo que funcione como
portafolio personal interactivo para un desarrollador Front-End/Mobile.
La app será mostrada directamente en entrevistas de trabajo para demostrar
habilidades técnicas reales en lugar de un CV estático.

Público objetivo:
- Reclutadores técnicos y no técnicos
- Tech Leads evaluando habilidades prácticas

Propuesta de valor diferenciadora:
- El portafolio ES la demostración técnica (la app misma es evidencia de skill)
- El flujo de onboarding demuestra: splash animado, slides, manejo de permisos,
  diseño de OTP completo y persistencia con AsyncStorage
- Demos interactivos en vivo de funcionalidades reales (cámara, animaciones, APIs)
- Roadmap visual que demuestra conocimiento del ecosistema de desarrollo móvil

--------------------------------------------------------------------------------
DECISIONES TÉCNICAS GLOBALES
--------------------------------------------------------------------------------

- Framework:        React Native con Expo (Expo Router para navegación)
- Sin backend:      100% estática, datos hardcodeados en archivos TypeScript
- Sin base de datos externa
- Lenguaje:         TypeScript estricto
- Datos:            Archivos en /constants (profile, skills, experience, etc.)
- Navegación:       Expo Router con grupos de rutas (auth) y (tabs)
- Persistencia:     AsyncStorage — solo para saber si el onboarding ya fue visto
- Permisos:         Cámara, Ubicación y Notificaciones (solicitados en Welcome)

--------------------------------------------------------------------------------
ARQUITECTURA DE NAVEGACIÓN (GRUPOS DE RUTAS)
--------------------------------------------------------------------------------

La app tiene dos grupos de rutas principales manejados por Expo Router:

  app/
  ├── index.tsx                  # Entry point: decide si ir a (auth) o (tabs)
  ├── (auth)/                    # Flujo de onboarding — solo primera vez
  │   ├── splash.tsx
  │   ├── onboarding.tsx
  │   ├── welcome.tsx
  │   ├── otp.tsx
  │   └── username.tsx
  └── (tabs)/                    # App principal
      ├── index.tsx              # Home / Perfil
      ├── stack.tsx
      ├── experience.tsx
      ├── projects.tsx
      └── playground.tsx

Lógica del entry point (app/index.tsx):
  1. Leer AsyncStorage key: 'onboarding_completed'
  2. Si NO existe → redirigir a /(auth)/splash
  3. Si SÍ existe → redirigir a /(tabs)/index
  Al finalizar el flujo (auth), guardar 'onboarding_completed': 'true' en
  AsyncStorage antes de navegar al Home.

--------------------------------------------------------------------------------
FLUJO COMPLETO DE ONBOARDING (FASE AUTH)
--------------------------------------------------------------------------------

PANTALLA 1 — SPLASH SCREEN (splash.tsx)
  - Logo/avatar del desarrollador centrado en pantalla
  - Animación de entrada: FadeIn + Scale con Reanimated
  - Duración: ~2 segundos, luego navega automáticamente a Onboarding
  - Sin interacción del usuario
  - Fondo con color primario del tema

PANTALLA 2 — ONBOARDING SLIDES (onboarding.tsx)
  - 3 slides horizontales con FlatList horizontal + pagingEnabled
  - Indicador de puntos (dots) en la parte inferior
  - Botón "Saltar" en la esquina superior derecha (navega directo a Welcome)
  - Botón "Siguiente" / "Comenzar" en el último slide
  - Contenido de los 3 slides:
      Slide 1: "Mi Stack Técnico"
               Ícono: código / laptop
               Texto: "Explora las tecnologías que domino en desarrollo
                       móvil y frontend, con niveles de experiencia reales."
      Slide 2: "Proyectos Reales"
               Ícono: cohete / portafolio
               Texto: "Navega por mis proyectos, ve demos en vivo y
                       revisa el código directamente desde la app."
      Slide 3: "Tech Playground"
               Ícono: laboratorio / experimento
               Texto: "Prueba demos interactivos: animaciones, consumo
                       de APIs, cámara y más. Todo funcionando en vivo."

PANTALLA 3 — WELCOME SCREEN (welcome.tsx)
  - Título: "Bienvenido 👋"
  - Mensaje principal: "Lo que verás a continuación es mi experiencia
    como desarrollador. Por el momento toda la información es mocked
    o hardcodeada para fines demostrativos."
  - Disclaimer visual (card con ícono de info): dejar claro que es un portafolio demo
  - Botón: "Entendido, continuar"
  - Al presionar el botón se solicitan los 3 permisos en secuencia:
      1. Ubicación      → expo-location        → requestForegroundPermissionsAsync()
      2. Cámara         → expo-camera          → Camera.requestCameraPermissionsAsync()
      3. Notificaciones → expo-notifications   → requestPermissionsAsync()
  - Cada permiso se solicita uno a la vez (await en secuencia, NO en paralelo)
  - Si el usuario deniega alguno: mostrar modal explicativo con el motivo
    por el que se necesita y opción "Entendido" para continuar de todas formas
  - La app NO bloquea el avance si un permiso es denegado (permisos opcionales)
  - Tras manejar todos los permisos → navegar a OTP

PANTALLA 4 — OTP SCREEN (otp.tsx)
  - Título: "Verificación de acceso"
  - Subtítulo: "Te enviamos un código de 4 dígitos" (flavor text, es mocked)
  - 4 casillas individuales de entrada (un dígito por casilla)
  - Al montar la pantalla:
      → Generar código random de 4 dígitos: Math.floor(1000 + Math.random() * 9000)
      → Mostrarlo en un Text debajo de las casillas con estilo destacado
        Ej: "Tu código es: 7392" (esto deja claro al reclutador que es demo)
  - Comportamiento de las casillas:
      → Auto-focus a la siguiente casilla al ingresar un dígito
      → Al borrar, regresa el focus a la casilla anterior
      → Al completar las 4 casillas, valida automáticamente sin necesidad de botón
  - Validación:
      → Correcto: animación de éxito (checkmark + color verde) → navega a Username
      → Incorrecto: Shake animation en las casillas con Reanimated + limpiar inputs
        + regenerar nuevo código random y mostrarlo
  - Botón "Reenviar código" (decorativo, solo regenera el código visible en pantalla)

PANTALLA 5 — USERNAME SCREEN (username.tsx)
  - Título: "¿Cómo te llamas?"
  - Subtítulo: "Para personalizar tu experiencia"
  - Input de texto con label "Tu nombre"
  - Validación:
      → Mínimo 2 caracteres
      → Máximo 30 caracteres
      → Solo letras y espacios: regex /^[a-zA-ZÀ-ÿ\s]+$/
      → Mostrar error inline si no cumple al presionar Continuar
  - Botón "Continuar" (deshabilitado hasta que el input sea válido)
  - Al confirmar:
      → Guardar nombre en AsyncStorage key: 'user_name'
      → Guardar 'onboarding_completed': 'true' en AsyncStorage
      → Navegar a /(tabs)/index (Home)
  - En el Home, leer el nombre de AsyncStorage para mostrar "Hola, [nombre] 👋"

--------------------------------------------------------------------------------
MÓDULOS DEL MVP — APP PRINCIPAL (tabs)
--------------------------------------------------------------------------------

1. HOME / PERFIL
   - Saludo personalizado con nombre guardado: "Hola, [nombre] 👋"
   - Foto, nombre del desarrollador, tagline personal
   - Links a GitHub, LinkedIn, Email
   - Componentes: ProfileHeader, SocialLinks, Badge

2. STACK TÉCNICO
   - Lista de tecnologías con nivel de dominio (escala 1–5)
   - Organizadas por categorías: Mobile, Frontend, Backend, Tools
   - Componentes: SkillCard, SectionHeader, Badge

3. EXPERIENCIA LABORAL
   - Timeline vertical de posiciones y empresas
   - Detalle por posición: logros y tecnologías usadas
   - Componentes: TimelineItem, SectionHeader

4. PROYECTOS
   - Grid de proyectos con cards (FlatList numColumns=2)
   - Tipos:
       web    → abre WebView interno con la URL del proyecto
       mobile → muestra pantalla de detalle con screenshots y descripción
       repo   → abre URL de GitHub en el browser con Linking.openURL
   - Proyectos con featured: true aparecen primero con badge destacado
   - Componentes: ProjectCard, ProjectWebView

5. TECH PLAYGROUND
   - Menú de demos navegables
   - Demo A — Animaciones (Reanimated 3):
       FadeIn / SlideIn al montar componentes
       Gesture Handler: arrastrar card con spring physics
       Interpolación de colores con useAnimatedStyle
   - Demo B — API Async:
       Fetch a jsonplaceholder.typicode.com
       Estados: Loading (skeleton) / Success (FlatList) / Error (retry)
       Hook personalizado: useFetch.ts
   - Demo C — Cámara:
       Verificar permiso (ya solicitado en onboarding)
       Preview en vivo con CameraView
       Capturar foto → mostrar thumbnail
       Botón retomar o confirmar

6. ROADMAP DE HABILIDADES
   - Checklist visual estático con 3 estados:
       ✅ Dominado / 🔄 En progreso / 📌 Próximo
   - Categorías: Core React, Navegación, Estado, APIs, Animaciones,
                 Storage, Testing, CI/CD Mobile
   - Hardcodeado en constants/roadmap.ts

--------------------------------------------------------------------------------
ESTRUCTURA DE CARPETAS COMPLETA
--------------------------------------------------------------------------------

aptus/
├── app/
│   ├── index.tsx                  # Entry point con lógica de redirección
│   ├── (auth)/
│   │   ├── _layout.tsx            # Layout del grupo auth (sin tabs)
│   │   ├── splash.tsx
│   │   ├── onboarding.tsx
│   │   ├── welcome.tsx
│   │   ├── otp.tsx
│   │   └── username.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx            # Bottom Tab Navigator config
│   │   ├── index.tsx              # Home / Perfil
│   │   ├── stack.tsx              # Stack Técnico
│   │   ├── experience.tsx         # Experiencia
│   │   ├── projects.tsx           # Proyectos
│   │   └── playground.tsx         # Playground Menu
│   ├── project/
│   │   └── [id].tsx               # Detalle proyecto + WebView
│   ├── experience/
│   │   └── [id].tsx               # Detalle experiencia
│   └── playground/
│       ├── animations.tsx
│       ├── async-api.tsx
│       └── camera.tsx
├── components/
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── SkillCard.tsx
│   │   ├── SectionHeader.tsx
│   │   └── StateHandler.tsx       # Componente Loading / Error / Empty
│   ├── auth/
│   │   ├── OnboardingSlide.tsx    # Slide individual del onboarding
│   │   ├── OTPInput.tsx           # Casilla individual OTP
│   │   └── PermissionModal.tsx    # Modal explicativo de permisos
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   └── SocialLinks.tsx
│   ├── experience/
│   │   └── TimelineItem.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   └── ProjectWebView.tsx
│   └── playground/
│       ├── AnimationDemo.tsx
│       ├── AsyncDemo.tsx
│       └── CameraDemo.tsx
├── constants/
│   ├── profile.ts
│   ├── skills.ts
│   ├── experience.ts
│   ├── projects.ts
│   ├── roadmap.ts
│   └── onboarding.ts              # Contenido de los 3 slides
├── hooks/
│   ├── useFetch.ts                # Hook genérico async con estados
│   ├── useCameraPermission.ts
│   └── useOnboarding.ts           # Lee/escribe AsyncStorage onboarding
├── types/
│   └── index.ts
└── theme/
    ├── colors.ts
    └── typography.ts

--------------------------------------------------------------------------------
TIPOS TYPESCRIPT CENTRALES (types/index.ts)
--------------------------------------------------------------------------------

export type SkillLevel = 1 | 2 | 3 | 4 | 5;
export type SkillCategory = 'mobile' | 'frontend' | 'backend' | 'tools';
export type ProjectType = 'web' | 'mobile' | 'repo';
export type RoadmapStatus = 'mastered' | 'in-progress' | 'upcoming';
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface OnboardingSlide {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface OTPState {
  code: string[];           // 4 dígitos generados (el código correcto)
  input: string[];          // lo que el usuario ingresó
  isValid: boolean;
  hasError: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  iconName: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;        // formato: 'YYYY-MM'
  endDate?: string;         // undefined = 'Presente'
  description: string;
  achievements: string[];
  techStack: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  url?: string;
  imageUrl?: string;
  techStack: string[];
  featured: boolean;
}

export interface RoadmapItem {
  id: string;
  categoryId: string;
  label: string;
  status: RoadmapStatus;
  resourceUrl?: string;
}

--------------------------------------------------------------------------------
VALIDACIONES CRÍTICAS POR PANTALLA
--------------------------------------------------------------------------------

SPLASH:        Sin validaciones. Duración fija con setTimeout + navegación auto.

ONBOARDING:    Sin validaciones. Botón Saltar disponible en todo momento.

WELCOME:       Permisos opcionales — nunca bloquear avance si son denegados.
               Solicitar en secuencia con await, no en paralelo.

OTP:           - Código: solo dígitos numéricos (1 por casilla)
               - Validación automática al llenar la 4ta casilla
               - Error: shake animation + limpiar + nuevo código random
               - El código correcto siempre se muestra en pantalla (es demo)

USERNAME:      - Mínimo 2 caracteres, máximo 30
               - Solo letras y espacios: /^[a-zA-ZÀ-ÿ\s]+$/
               - Botón deshabilitado hasta input válido
               - Error inline, nunca alert()

PERFIL:        - Avatar: fallback con iniciales si URL falla
               - Tagline: truncar con "..." si supera 120 caracteres
               - Links: validar apertura con Linking.openURL

EXPERIENCIA:   - endDate undefined → mostrar "Presente"
               - achievements[] vacío → ocultar sección sin romper layout

PROYECTOS:     - URL inválida en WebView → pantalla de error con Retry
               - imageUrl fallida → mostrar placeholder
               - featured: true → ordenar primero + badge destacado

PLAYGROUND CÁMARA:
               - Verificar permiso antes de abrir CameraView
               - Si fue denegado en onboarding → mostrar UI con botón a Settings

PLAYGROUND API:
               - Estado Error → mensaje descriptivo + botón Retry
               - Nunca dejar UI bloqueada en Loading sin salida

--------------------------------------------------------------------------------
PATRÓN DE ESTADOS DE UI (aplicado globalmente)
--------------------------------------------------------------------------------

  Idle → Loading (usuario ejecuta acción)
       → Success (datos disponibles)
       → Error   (falla o timeout) → Loading (usuario presiona Retry)
  Success → Idle (usuario navega atrás)

Implementado en el componente reutilizable: components/ui/StateHandler.tsx
Usado en: AsyncDemo, ProjectWebView, y cualquier pantalla con datos asincrónicos.

--------------------------------------------------------------------------------
LIBRERÍAS CLAVE ANTICIPADAS (Fase 4 pendiente)
--------------------------------------------------------------------------------

  expo-router                        Navegación file-based
  expo-camera                        Demo cámara + permiso
  expo-location                      Permiso de ubicación
  expo-notifications                 Permiso de notificaciones
  @react-native-async-storage        Persistencia onboarding + nombre usuario
  react-native-reanimated            Splash, OTP shake, animaciones playground
  react-native-gesture-handler       Swipe onboarding + drag demo
  react-native-webview               Proyectos web en pantalla interna
  expo-status-bar                    Control de barra de estado

--------------------------------------------------------------------------------
PENDIENTE — FASE 4 (no desarrollada aún)
--------------------------------------------------------------------------------

La Fase 4 cubrirá:
- Stack tecnológico detallado con versiones exactas
- Configuración inicial del proyecto con Expo (app.json, plugins)
- Roadmap de ejecución paso a paso (orden de desarrollo recomendado)
- Convenciones de código, naming y mejores prácticas
- Estrategia de theming (dark/light mode)

--------------------------------------------------------------------------------
INSTRUCCIÓN PARA EL AGENTE
--------------------------------------------------------------------------------

Este documento es el contexto completo del proyecto Aptus. Al recibir este
contexto, el agente debe:

1.  Asumir todas las decisiones técnicas ya tomadas (sin backend, Expo Router,
    TypeScript, datos en /constants, AsyncStorage para persistencia mínima).
2.  Respetar estrictamente la estructura de carpetas definida.
3.  Respetar los tipos TypeScript como contrato de datos inamovible.
4.  El flujo de entrada SIEMPRE es:
      Splash → Onboarding → Welcome → OTP → Username → Home
    Solo se omite el flujo (auth) completo si AsyncStorage tiene
    'onboarding_completed' = 'true', en cuyo caso redirige directo al Home.
5.  Aplicar el patrón de estados (Idle/Loading/Success/Error) en cualquier
    componente que maneje datos o acciones asíncronas.
6.  El OTP es completamente mocked: genera código random de 4 dígitos,
    lo muestra en pantalla y valida contra ese mismo código.
    No hay backend, no hay SMS real.
7.  Los permisos (Cámara, Ubicación, Notificaciones) se solicitan en Welcome
    en secuencia con await. Su denegación nunca bloquea el flujo.
8.  El nombre ingresado en Username se guarda en AsyncStorage con la key
    'user_name' y se consume en el saludo del Home.
9.  Las validaciones críticas listadas por pantalla son obligatorias
    y no pueden omitirse.
10. Orden de implementación recomendado (MVP first):
      a) Flujo (auth) completo: splash → onboarding → welcome → otp → username
      b) Tab Navigator base con las 5 tabs vacías
      c) Home / Perfil
      d) Stack Técnico
      e) Experiencia
      f) Proyectos + WebView
      g) Tech Playground (3 demos)
      h) Roadmap

================================================================================
FIN DEL DOCUMENTO
================================================================================