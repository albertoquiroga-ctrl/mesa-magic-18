/**
 * Mock Data
 * 
 * All demo/hardcoded data used throughout the app.
 * In production this would come from an API. Centralizing it here
 * makes it easy to swap for real data later.
 */

// ---------------------------------------------------------------------------
// Modifier types — used for item customization (e.g. meat temp, tortilla type)
// ---------------------------------------------------------------------------

export interface ModifierOption {
  id: string;
  label: string;
  /** Extra cost on top of the base price (0 if free) */
  extraPrice?: number;
}

export interface ModifierGroup {
  id: string;
  label: string;
  /** If true, the guest must pick exactly one option before adding to cart */
  required: boolean;
  /** Allow selecting more than one option (e.g. "extras") */
  multiSelect?: boolean;
  options: ModifierOption[];
}

// ---------------------------------------------------------------------------
// Allergens — standard set used across the industry
// ---------------------------------------------------------------------------

export type Allergen =
  | 'gluten'
  | 'lacteos'
  | 'huevo'
  | 'mariscos'
  | 'pescado'
  | 'cacahuate'
  | 'soya'
  | 'frutos-secos'
  | 'apio'
  | 'mostaza'
  | 'sesamo'
  | 'sulfitos';

/** Emoji + Spanish label for each allergen */
export const ALLERGEN_META: Record<Allergen, { emoji: string; label: string }> = {
  gluten:         { emoji: '🌾', label: 'Gluten' },
  lacteos:        { emoji: '🥛', label: 'Lácteos' },
  huevo:          { emoji: '🥚', label: 'Huevo' },
  mariscos:       { emoji: '🦐', label: 'Mariscos' },
  pescado:        { emoji: '🐟', label: 'Pescado' },
  cacahuate:      { emoji: '🥜', label: 'Cacahuate' },
  soya:           { emoji: '🫘', label: 'Soya' },
  'frutos-secos': { emoji: '🌰', label: 'Frutos secos' },
  apio:           { emoji: '🥬', label: 'Apio' },
  mostaza:        { emoji: '🟡', label: 'Mostaza' },
  sesamo:         { emoji: '🫓', label: 'Sésamo' },
  sulfitos:       { emoji: '🍷', label: 'Sulfitos' },
};

// ---------------------------------------------------------------------------
// Nutritional info (per serving)
// ---------------------------------------------------------------------------

export interface NutritionalInfo {
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  soldOut?: boolean;
  tags?: string[];
  /** Estimated preparation time in minutes */
  prepTime?: number;
  /** Customisation groups available for this item */
  modifiers?: ModifierGroup[];
  /** Allergens present in this dish */
  allergens?: Allergen[];
  /** Nutritional info per serving */
  nutrition?: NutritionalInfo;
}

export const mockMenuItems: MenuItem[] = [
  {
    id: 'margarita',
    name: 'Margarita Clásica',
    price: 120,
    category: 'Bebidas',
    description: 'Tequila, limón fresco, triple sec y sal de gusano',
    image: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85?w=600&h=600&fit=crop',
    tags: ['popular'],
    prepTime: 3,
    modifiers: [
      {
        id: 'sal',
        label: 'Borde del vaso',
        required: true,
        options: [
          { id: 'sal-gusano', label: 'Sal de gusano' },
          { id: 'sal-normal', label: 'Sal normal' },
          { id: 'sin-sal', label: 'Sin sal' },
        ],
      },
    ],
    allergens: ['sulfitos'],
    nutrition: { calories: 180, carbs: 12, fat: 0, protein: 0 },
  },
  {
    id: 'agua-jamaica',
    name: 'Agua de Jamaica',
    price: 65,
    category: 'Bebidas',
    description: 'Agua fresca de jamaica natural',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop',
    tags: ['sin alcohol'],
    prepTime: 2,
    modifiers: [
      {
        id: 'dulzura',
        label: 'Nivel de dulzor',
        required: false,
        options: [
          { id: 'sin-azucar', label: 'Sin azúcar' },
          { id: 'poco-azucar', label: 'Poca azúcar' },
          { id: 'normal-azucar', label: 'Normal' },
        ],
      },
    ],
    nutrition: { calories: 45, carbs: 11, fat: 0, protein: 0 },
  },
  {
    id: 'mezcal',
    name: 'Mezcal Oaxaqueño',
    price: 95,
    category: 'Bebidas',
    description: 'Mezcal artesanal de Oaxaca con naranja y sal de chapulín',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=600&fit=crop',
    soldOut: true,
    prepTime: 3,
  },
  {
    id: 'guacamole',
    name: 'Guacamole',
    price: 95,
    category: 'Entradas',
    description: 'Aguacate molcajeteado con cilantro, cebolla y chile serrano',
    image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=600&h=600&fit=crop',
    tags: ['vegetariano'],
    prepTime: 7,
    modifiers: [
      {
        id: 'picor',
        label: 'Nivel de picante',
        required: false,
        options: [
          { id: 'sin-picante', label: 'Sin picante' },
          { id: 'medio', label: 'Medio' },
          { id: 'picoso', label: 'Bien picoso' },
        ],
      },
    ],
  },
  {
    id: 'ensalada',
    name: 'Ensalada Mixta',
    price: 130,
    category: 'Entradas',
    description: 'Mezcla de lechugas, tomate cherry, aguacate y vinagreta cítrica',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop',
    tags: ['vegetariano', 'ligero'],
    prepTime: 8,
    modifiers: [
      {
        id: 'aderezo',
        label: 'Aderezo',
        required: false,
        options: [
          { id: 'vinagreta', label: 'Vinagreta cítrica' },
          { id: 'ranch', label: 'Ranch' },
          { id: 'sin-aderezo', label: 'Sin aderezo' },
        ],
      },
      {
        id: 'extras-ensalada',
        label: 'Extras',
        required: false,
        multiSelect: true,
        options: [
          { id: 'pollo', label: 'Pollo grillé', extraPrice: 35 },
          { id: 'queso', label: 'Queso panela', extraPrice: 20 },
        ],
      },
    ],
  },
  {
    id: 'tacos-asada',
    name: 'Tacos de Asada',
    price: 160,
    category: 'Platos Fuertes',
    description: 'Tres tacos de arrachera en tortilla de maíz con guarniciones',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=600&fit=crop',
    tags: ['popular'],
    prepTime: 15,
    modifiers: [
      {
        id: 'tortilla',
        label: 'Tipo de tortilla',
        required: true,
        options: [
          { id: 'maiz', label: 'Maíz' },
          { id: 'harina', label: 'Harina' },
          { id: 'nopal', label: 'Nopal', extraPrice: 10 },
        ],
      },
      {
        id: 'sin-ingredientes',
        label: 'Sin ingredientes',
        required: false,
        multiSelect: true,
        options: [
          { id: 'sin-cebolla', label: 'Sin cebolla' },
          { id: 'sin-cilantro', label: 'Sin cilantro' },
          { id: 'sin-salsa', label: 'Sin salsa' },
        ],
      },
    ],
  },
  {
    id: 'entrecot',
    name: 'Entrecot a las Brasas',
    price: 295,
    category: 'Platos Fuertes',
    description: 'Corte de res premium a la parrilla con papas rústicas',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=600&fit=crop',
    tags: ['premium'],
    prepTime: 22,
    modifiers: [
      {
        id: 'termino',
        label: 'Término de la carne',
        required: true,
        options: [
          { id: 'rojo', label: 'Rojo' },
          { id: 'medio-rojo', label: 'Medio rojo' },
          { id: 'medio', label: 'Medio' },
          { id: 'tres-cuartos', label: 'Tres cuartos' },
          { id: 'bien-cocido', label: 'Bien cocido' },
        ],
      },
    ],
  },
  {
    id: 'pasta-trufa',
    name: 'Pasta con Trufa',
    price: 245,
    category: 'Platos Fuertes',
    description: 'Fettuccine al huevo con crema de trufa negra y parmesano',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=600&fit=crop',
    tags: ['vegetariano'],
    prepTime: 18,
    modifiers: [
      {
        id: 'extras-pasta',
        label: 'Extras',
        required: false,
        multiSelect: true,
        options: [
          { id: 'extra-trufa', label: 'Extra trufa', extraPrice: 45 },
          { id: 'extra-parmesano', label: 'Extra parmesano', extraPrice: 15 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Categories (ordered as they appear in the menu)
// ---------------------------------------------------------------------------

export const mockCategories = ['Bebidas', 'Entradas', 'Platos Fuertes'];

// ---------------------------------------------------------------------------
// Restaurant & table
// ---------------------------------------------------------------------------

export const mockRestaurant = {
  name: 'La Piazza',
  table: 4,
};

// ---------------------------------------------------------------------------
// Guests at the table (used in payment success breakdown)
// ---------------------------------------------------------------------------

export const mockGuests = ['Tú', 'Ana', 'Carlos'];

// ---------------------------------------------------------------------------
// Personalized recommendations (shown to logged-in users)
// ---------------------------------------------------------------------------

export const mockRecommendations: MenuItem[] = [
  mockMenuItems.find((i) => i.id === 'margarita')!,
  mockMenuItems.find((i) => i.id === 'tacos-asada')!,
  mockMenuItems.find((i) => i.id === 'pasta-trufa')!,
];
