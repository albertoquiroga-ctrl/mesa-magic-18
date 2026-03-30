

## Plan: Sistema de login opcional, perfil, lealtad y nudges

### Concepto

Agregar un sistema de autenticación opcional que incentive al comensal a iniciar sesión mediante: recomendaciones personalizadas bloqueadas en el menú, nudges de ahorro del programa de lealtad en puntos clave del journey, un tab de perfil en el bottom nav, y una página de perfil con historial y progreso de lealtad.

### Cambios

#### 1. Auth Store (`src/stores/authStore.ts` — nuevo)
Store Zustand con estado de autenticación mock: `isLoggedIn`, `user` (nombre, email, puntos de lealtad, historial de visitas), `login()`, `logout()`. Demo con toggle para simular login/logout.

#### 2. Bottom Nav — Tab de Perfil (`GuestBottomNav.tsx`)
Agregar un 4to tab `👤 Perfil` que lleve a `/guest/profile`. Si no está logueado, lleva a `/guest/login`.

#### 3. Página de Login (`src/pages/guest/Login.tsx` — nueva)
Pantalla simple con formulario de email/contraseña (mock), botón de Google, y un CTA que explique el beneficio: "Ahorra $50 en tu próxima visita con nuestro programa de lealtad". Botón de "Continuar sin cuenta" para volver al menú.

#### 4. Página de Perfil (`src/pages/guest/Profile.tsx` — nueva)
Solo visible si logueado. Secciones:
- **Datos**: nombre, email, botón editar (mock)
- **Programa de lealtad**: barra de progreso con puntos acumulados, próxima recompensa, nivel actual
- **Historial de compras**: lista de visitas pasadas (mock) con fecha, sucursal, total
- **Cerrar sesión**

#### 5. Sección de Recomendaciones en Menú (`Menu.tsx`)
Antes de las categorías, insertar un bloque "Recomendado para ti":
- **Si logueado**: muestra 2-3 items personalizados (mock basado en historial)
- **Si no logueado**: bloque con blur/lock overlay + CTA "Inicia sesión para ver recomendaciones personalizadas" que lleva a `/guest/login`

#### 6. Nudges en puntos clave del journey
- **Onboarding** (slide final): agregar un botón secundario "¿Ya tienes cuenta? Inicia sesión" debajo del CTA principal
- **Cart** (antes de enviar orden): banner sutil "Ahorra $50 — únete al programa de lealtad" si no está logueado
- **SplitTip / Checkout**: banner "Gana puntos por esta compra — inicia sesión" si no está logueado
- **PaymentSuccess**: si no logueado, card "¿Sabías que pudiste ganar X puntos? Crea tu cuenta para la próxima"

#### 7. Rutas (`App.tsx`)
Agregar rutas: `/guest/login`, `/guest/profile` dentro del GuestLayout.

#### 8. Layout (`GuestLayout.tsx`)
Agregar `/guest/login` a `hideNavRoutes` para una experiencia limpia de login.

### Archivos a crear
- `src/stores/authStore.ts`
- `src/pages/guest/Login.tsx`
- `src/pages/guest/Profile.tsx`

### Archivos a modificar
- `src/components/shared/GuestBottomNav.tsx` — 4to tab
- `src/pages/guest/Menu.tsx` — sección recomendaciones
- `src/pages/guest/Onboarding.tsx` — nudge login
- `src/pages/guest/Cart.tsx` — banner lealtad
- `src/pages/guest/SplitTip.tsx` — banner puntos
- `src/pages/guest/PaymentSuccess.tsx` — card post-pago
- `src/App.tsx` — nuevas rutas
- `src/layouts/GuestLayout.tsx` — hideNavRoutes
- `src/data/mockData.ts` — datos mock de historial y recomendaciones

