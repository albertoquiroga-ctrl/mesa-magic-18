

## Plan: Agregar fotos de stock a los platillos del menú

### Concepto

Usar imágenes de Unsplash (gratuitas, alta calidad) para cada platillo del mock data. Las URLs de Unsplash se agregan directamente al campo `image` que ya existe en la interfaz `MenuItem`.

### Cambios

**1. `src/data/mockData.ts`**
- Agregar una URL de Unsplash a cada platillo en el campo `image` (ya definido en el tipo). Buscaré fotos que se vean bien para: margarita, guacamole, tacos, agua de jamaica, mezcal, entrecot, pasta trufa, ensalada.

**2. `src/components/guest/MenuItemCard.tsx`**
- Reemplazar el emoji placeholder por una imagen real usando `<img>` con `object-cover` dentro del `aspect-square`.
- Fallback al emoji si no hay imagen.

**3. `src/pages/guest/ItemDetail.tsx`**
- Reemplazar el emoji del hero por la imagen del platillo con `object-cover`.
- Fallback al emoji si no hay imagen.

### Resultado
El menú se verá profesional y atractivo para la demo con inversionistas, usando fotos reales de comida.

