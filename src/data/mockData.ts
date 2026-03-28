export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  soldOut?: boolean;
  tags?: string[];
}

export const mockMenuItems: MenuItem[] = [
  {
    id: 'margarita',
    name: 'Margarita Clásica',
    price: 120,
    category: 'Bebidas',
    description: 'Tequila, limón fresco, triple sec y sal de gusano',
    tags: ['popular'],
  },
  {
    id: 'guacamole',
    name: 'Guacamole',
    price: 95,
    category: 'Entradas',
    description: 'Aguacate molcajeteado con cilantro, cebolla y chile serrano',
    tags: ['vegetariano'],
  },
  {
    id: 'tacos-asada',
    name: 'Tacos de Asada',
    price: 160,
    category: 'Platos Fuertes',
    description: 'Tres tacos de arrachera en tortilla de maíz con guarniciones',
    tags: ['popular'],
  },
  {
    id: 'agua-jamaica',
    name: 'Agua de Jamaica',
    price: 65,
    category: 'Bebidas',
    description: 'Agua fresca de jamaica natural',
    tags: ['sin alcohol'],
  },
  {
    id: 'mezcal',
    name: 'Mezcal Oaxaqueño',
    price: 95,
    category: 'Bebidas',
    description: 'Mezcal artesanal de Oaxaca con naranja y sal de chapulín',
    soldOut: true,
  },
  {
    id: 'entrecot',
    name: 'Entrecot a las Brasas',
    price: 295,
    category: 'Platos Fuertes',
    description: 'Corte de res premium a la parrilla con papas rústicas',
    tags: ['premium'],
  },
  {
    id: 'pasta-trufa',
    name: 'Pasta con Trufa',
    price: 245,
    category: 'Platos Fuertes',
    description: 'Fettuccine al huevo con crema de trufa negra y parmesano',
    tags: ['vegetariano'],
  },
  {
    id: 'ensalada',
    name: 'Ensalada Mixta',
    price: 130,
    category: 'Entradas',
    description: 'Mezcla de lechugas, tomate cherry, aguacate y vinagreta cítrica',
    tags: ['vegetariano', 'ligero'],
  },
];

export const mockCategories = ['Bebidas', 'Entradas', 'Platos Fuertes'];

export const mockRestaurant = {
  name: 'La Piazza',
  table: 4,
};

export const mockGuests = ['Tú', 'Ana', 'Carlos'];
