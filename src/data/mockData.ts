export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  soldOut?: boolean;
  tags?: string[];
  prepTime?: number;
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
    id: 'entrecot',
    name: 'Entrecot a las Brasas',
    price: 295,
    category: 'Platos Fuertes',
    description: 'Corte de res premium a la parrilla con papas rústicas',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=600&fit=crop',
    tags: ['premium'],
    prepTime: 22,
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
  },
];

export const mockCategories = ['Bebidas', 'Entradas', 'Platos Fuertes'];

export const mockRestaurant = {
  name: 'La Piazza',
  table: 4,
};

export const mockGuests = ['Tú', 'Ana', 'Carlos'];

// Personalized recommendations for logged-in users (based on mock history)
export const mockRecommendations: MenuItem[] = [
  mockMenuItems.find((i) => i.id === 'margarita')!,
  mockMenuItems.find((i) => i.id === 'tacos-asada')!,
  mockMenuItems.find((i) => i.id === 'pasta-trufa')!,
];
