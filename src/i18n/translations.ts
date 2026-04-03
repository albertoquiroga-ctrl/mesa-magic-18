/**
 * Translation dictionaries for ES / EN
 * 
 * Keys are dot-separated paths. The `t()` helper resolves them.
 * Menu item names/descriptions stay in Spanish (they come from the restaurant).
 */

const es = {
  // Common
  'common.back': 'Volver',
  'common.close': 'Cerrar',
  'common.cancel': 'Cancelar',
  'common.confirm': 'Confirmar',
  'common.total': 'Total',
  'common.subtotal': 'Subtotal',
  'common.table': 'Mesa',
  'common.search': 'Buscar',
  'common.MXN': 'MXN',

  // Onboarding
  'onboarding.slide1.title': 'Ordena desde tu cel',
  'onboarding.slide1.subtitle': 'Sin filas. Sin esperas.',
  'onboarding.slide2.title': 'Tu mesero siempre cerca',
  'onboarding.slide2.subtitle': 'Un toque y viene.',
  'onboarding.slide3.title': 'Paga cuando quieras',
  'onboarding.slide3.subtitle': 'Sin drama. Sin esperas.',
  'onboarding.skip': 'Saltar →',
  'onboarding.next': 'Siguiente →',
  'onboarding.enter': 'Entrar al menú →',
  'onboarding.hasAccount': '¿Ya tienes cuenta? Inicia sesión',

  // Menu
  'menu.search.placeholder': 'Buscar en el menú…',
  'menu.search.results': '{count} resultado{plural} para "{query}"',
  'menu.search.empty': 'No encontramos "{query}"',
  'menu.search.emptyHint': 'Intenta con otro término',
  'menu.recommendations': 'Recomendado para ti',
  'menu.loginForRecs': 'Inicia sesión para ver recomendaciones personalizadas',
  'menu.createAccount': 'Crear cuenta →',
  'menu.allergenFilterPrefix': 'Sin',

  // Item detail
  'item.soldOut': 'Agotado',
  'item.notFound': 'Producto no encontrado',
  'item.allergens': 'Alérgenos',
  'item.nutrition': 'Info nutricional',
  'item.nutrition.perServing': 'por porción',
  'item.nutrition.kcal': 'kcal',
  'item.nutrition.protein': 'Proteína',
  'item.nutrition.carbs': 'Carbos',
  'item.nutrition.fat': 'Grasa',
  'item.required': 'Requerido',
  'item.optional': 'Opcional',
  'item.specialInstructions': 'Instrucciones especiales',
  'item.specialPlaceholder': '¿Sin sal? ¿Extra limón? Cuéntanos...',
  'item.add': 'Agregar {qty} — ${total} MXN',
  'item.added': '✓ Agregado',
  'item.selectRequired': 'Selecciona las opciones requeridas para continuar',

  // Cart bar
  'cartBar.empty': 'Agrega algo para empezar 🍴',
  'cartBar.products': '{count} producto{plural}',
  'cartBar.viewCart': 'Ver carrito →',

  // Cart page
  'cart.title': 'Tu pedido',
  'cart.empty': 'Tu carrito está vacío',
  'cart.explore': 'Explorar menú',
  'cart.send': 'Enviar pedido al mesero',
  'cart.sent': '¡Orden enviada!',
  'cart.sentSub': 'Tu mesero la recibirá en un momento.',
  'cart.loyaltySave': 'Ahorra $50',
  'cart.loyaltyJoin': 'únete al programa de lealtad',
  'cart.discountAvailable': 'Tienes ${amount} de descuento disponible 🎉',

  // Bottom nav
  'nav.menu': 'Menú',
  'nav.myOrder': 'Mi orden',
  'nav.pay': 'Pagar',
  'nav.profile': 'Perfil',

  // Order tracking
  'tracking.title': 'Seguimiento de orden',
  'tracking.noOrders': 'No hay órdenes activas',
  'tracking.goToMenu': 'Ir al menú',
  'tracking.backToMenu': 'Volver al menú',
  'tracking.allDone': '¡Todos tus platillos están listos!',
  'tracking.next': 'Siguiente: {name} (~{min} min)',
  'tracking.calculating': 'Calculando...',
  'tracking.ready': 'de {total} listos',
  'tracking.preparing': '{count} platillos en preparación',
  'tracking.timeline': 'Timeline de tu orden',
  'tracking.round': 'Ronda {n}',
  'tracking.done': '✓ Listo',

  // My consumption
  'consumption.title': 'Mi consumo',
  'consumption.totalConsumption': 'Total consumo',
  'consumption.requestBill': 'Pedir la cuenta',
  'consumption.myDevice': 'Pedido desde tu dispositivo',
  'consumption.shared': 'Típicamente al centro',
  'consumption.others': 'Pedido por otros en la mesa',

  // Login
  'login.createAccount': 'Crear cuenta',
  'login.verifyCode': 'Verificar código',
  'login.loyaltyProgram': 'Programa de lealtad',
  'login.save50': 'Ahorra $50 en tu próxima visita al inscribirte',
  'login.earnPoints': 'Acumula puntos con cada compra y canjéalos por recompensas',
  'login.personalRecs': 'Recibe recomendaciones personalizadas basadas en tus gustos',
  'login.yourName': 'Tu nombre',
  'login.namePlaceholder': 'Ej: María García',
  'login.phone': 'Número de teléfono',
  'login.phonePlaceholder': '55 1234 5678',
  'login.smsNote': 'Te enviaremos un código por SMS para verificar tu número',
  'login.sendCode': 'Enviar código',
  'login.enterCode': 'Ingresa el código de 4 dígitos',
  'login.sentTo': 'Enviado a +52 {phone}',
  'login.verifyCreate': 'Verificar y crear cuenta',
  'login.resend': '¿No recibiste el código? Reenviar',
  'login.continueWithout': 'Continuar sin cuenta →',

  // Profile
  'profile.title': 'Mi perfil',
  'profile.loyalty': 'Programa de lealtad',
  'profile.level': 'Nivel {level}',
  'profile.points': '{pts} puntos',
  'profile.nextReward': 'Próxima recompensa: {pts} pts',
  'profile.remaining': 'Te faltan {pts} puntos para tu próxima recompensa',
  'profile.discountAvailable': 'Tienes ${amount} de descuento disponible',
  'profile.visitHistory': 'Historial de visitas',
  'profile.logout': 'Cerrar sesión',

  // FAB
  'fab.howCanWeHelp': '¿En qué te ayudamos?',
  'fab.requestBill': 'Pedir la cuenta',
  'fab.billRequested': 'Se ha solicitado la cuenta',
  'fab.moreWater': 'Más agua',
  'fab.waterRequested': 'Se ha pedido más agua',
  'fab.cutlery': 'Cubiertos / servilletas',
  'fab.cutleryRequested': 'Se han solicitado cubiertos y servilletas',
  'fab.other': 'Otra cosa',
  'fab.otherRequested': 'Un mesero vendrá en un momento',
  'fab.waiterNotified': 'Tu mesero fue notificado',

  // Reorder
  'reorder.added': '{name} agregado al carrito',

  // Language
  'lang.toggle': '🌐 EN',
};

const en: typeof es = {
  // Common
  'common.back': 'Back',
  'common.close': 'Close',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.total': 'Total',
  'common.subtotal': 'Subtotal',
  'common.table': 'Table',
  'common.search': 'Search',
  'common.MXN': 'MXN',

  // Onboarding
  'onboarding.slide1.title': 'Order from your phone',
  'onboarding.slide1.subtitle': 'No lines. No waiting.',
  'onboarding.slide2.title': 'Your waiter is one tap away',
  'onboarding.slide2.subtitle': 'Tap and they\'ll come.',
  'onboarding.slide3.title': 'Pay whenever you want',
  'onboarding.slide3.subtitle': 'No hassle. No waiting.',
  'onboarding.skip': 'Skip →',
  'onboarding.next': 'Next →',
  'onboarding.enter': 'Enter menu →',
  'onboarding.hasAccount': 'Already have an account? Log in',

  // Menu
  'menu.search.placeholder': 'Search the menu…',
  'menu.search.results': '{count} result{plural} for "{query}"',
  'menu.search.empty': 'We couldn\'t find "{query}"',
  'menu.search.emptyHint': 'Try a different term',
  'menu.recommendations': 'Recommended for you',
  'menu.loginForRecs': 'Log in to see personalized recommendations',
  'menu.createAccount': 'Create account →',
  'menu.allergenFilterPrefix': 'No',

  // Item detail
  'item.soldOut': 'Sold out',
  'item.notFound': 'Product not found',
  'item.allergens': 'Allergens',
  'item.nutrition': 'Nutritional info',
  'item.nutrition.perServing': 'per serving',
  'item.nutrition.kcal': 'kcal',
  'item.nutrition.protein': 'Protein',
  'item.nutrition.carbs': 'Carbs',
  'item.nutrition.fat': 'Fat',
  'item.required': 'Required',
  'item.optional': 'Optional',
  'item.specialInstructions': 'Special instructions',
  'item.specialPlaceholder': 'No salt? Extra lime? Let us know...',
  'item.add': 'Add {qty} — ${total} MXN',
  'item.added': '✓ Added',
  'item.selectRequired': 'Select required options to continue',

  // Cart bar
  'cartBar.empty': 'Add something to start 🍴',
  'cartBar.products': '{count} item{plural}',
  'cartBar.viewCart': 'View cart →',

  // Cart page
  'cart.title': 'Your order',
  'cart.empty': 'Your cart is empty',
  'cart.explore': 'Explore menu',
  'cart.send': 'Send order to waiter',
  'cart.sent': 'Order sent!',
  'cart.sentSub': 'Your waiter will receive it shortly.',
  'cart.loyaltySave': 'Save $50',
  'cart.loyaltyJoin': 'join the loyalty program',
  'cart.discountAvailable': 'You have ${amount} discount available 🎉',

  // Bottom nav
  'nav.menu': 'Menu',
  'nav.myOrder': 'My order',
  'nav.pay': 'Pay',
  'nav.profile': 'Profile',

  // Order tracking
  'tracking.title': 'Order tracking',
  'tracking.noOrders': 'No active orders',
  'tracking.goToMenu': 'Go to menu',
  'tracking.backToMenu': 'Back to menu',
  'tracking.allDone': 'All your dishes are ready!',
  'tracking.next': 'Next: {name} (~{min} min)',
  'tracking.calculating': 'Calculating...',
  'tracking.ready': 'of {total} ready',
  'tracking.preparing': '{count} dishes preparing',
  'tracking.timeline': 'Your order timeline',
  'tracking.round': 'Round {n}',
  'tracking.done': '✓ Ready',

  // My consumption
  'consumption.title': 'My tab',
  'consumption.totalConsumption': 'Total consumption',
  'consumption.requestBill': 'Request the bill',
  'consumption.myDevice': 'Ordered from your device',
  'consumption.shared': 'Typically shared',
  'consumption.others': 'Ordered by others at the table',

  // Login
  'login.createAccount': 'Create account',
  'login.verifyCode': 'Verify code',
  'login.loyaltyProgram': 'Loyalty program',
  'login.save50': 'Save $50 on your next visit when you sign up',
  'login.earnPoints': 'Earn points with every purchase and redeem for rewards',
  'login.personalRecs': 'Get personalized recommendations based on your tastes',
  'login.yourName': 'Your name',
  'login.namePlaceholder': 'E.g.: John Smith',
  'login.phone': 'Phone number',
  'login.phonePlaceholder': '55 1234 5678',
  'login.smsNote': 'We\'ll send you a code via SMS to verify your number',
  'login.sendCode': 'Send code',
  'login.enterCode': 'Enter the 4-digit code',
  'login.sentTo': 'Sent to +52 {phone}',
  'login.verifyCreate': 'Verify and create account',
  'login.resend': 'Didn\'t receive the code? Resend',
  'login.continueWithout': 'Continue without account →',

  // Profile
  'profile.title': 'My profile',
  'profile.loyalty': 'Loyalty program',
  'profile.level': 'Level {level}',
  'profile.points': '{pts} points',
  'profile.nextReward': 'Next reward: {pts} pts',
  'profile.remaining': 'You need {pts} more points for your next reward',
  'profile.discountAvailable': 'You have ${amount} discount available',
  'profile.visitHistory': 'Visit history',
  'profile.logout': 'Log out',

  // FAB
  'fab.howCanWeHelp': 'How can we help?',
  'fab.requestBill': 'Request the bill',
  'fab.billRequested': 'Bill has been requested',
  'fab.moreWater': 'More water',
  'fab.waterRequested': 'More water has been requested',
  'fab.cutlery': 'Cutlery / napkins',
  'fab.cutleryRequested': 'Cutlery and napkins requested',
  'fab.other': 'Something else',
  'fab.otherRequested': 'A waiter will come shortly',
  'fab.waiterNotified': 'Your waiter has been notified',

  // Reorder
  'reorder.added': '{name} added to cart',

  // Language
  'lang.toggle': '🌐 ES',
};

export const translations = { es, en } as const;
export type TranslationKey = keyof typeof es;
