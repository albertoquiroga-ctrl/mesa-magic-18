

## Plan: Rating antes del pago con lógica condicional de propina

### Concepto

Mover la calificación de experiencia de PaymentSuccess a la parte superior de SplitTip. La sección de dividir cuenta + propina empieza deshabilitada (greyed out) hasta que el comensal califique. Si califica 1-2 estrellas, la propina se reemplaza por un mensaje de disculpa + textarea obligatorio. Si califica 3-5 estrellas, se muestra la propina normal.

### Flujo

```text
SplitTip (Dividir y propina)
┌─────────────────────────────┐
│  ⭐ Califica tu experiencia  │  ← Siempre visible arriba
│  [1] [2] [3] [4] [5]        │
└─────────────────────────────┘
         │
    rating = 0 → Todo abajo greyed out + overlay
    rating 1-2 → Habilitar dividir, sin propina, mostrar textarea obligatorio
    rating 3-5 → Habilitar dividir + propina normal
```

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/stores/paymentStore.ts` | Agregar `rating: number`, `feedback: string`, `setRating`, `setFeedback` |
| `src/pages/guest/SplitTip.tsx` | Agregar sección de rating arriba, lógica de greyed out, condicional propina vs disculpa+textarea, validación de textarea obligatorio para rating 1-2 |
| `src/pages/guest/PaymentSuccess.tsx` | Eliminar la sección de rating (ya no vive aquí) |

### Detalles de implementacion

**paymentStore**: Nuevos campos `rating` (default 0) y `feedback` (default ''), con sus setters.

**SplitTip**:
- Arriba del contenido actual: card con estrellas interactivas (reusar el diseño existente de PaymentSuccess).
- `const isUnlocked = rating > 0` controla si el resto de la página está activo.
- Si `!isUnlocked`: todo debajo del rating se renderiza con `opacity-40 pointer-events-none` y un mensaje "Califica tu experiencia para continuar".
- Si `rating <= 2`: la sección de propina se reemplaza por un card con mensaje de disculpa y un `<Textarea>` con placeholder "¿Cómo podemos mejorar?". El botón "Continuar al pago" se deshabilita si el textarea está vacío (para evitar ratings falsos de 1 estrella). La propina se fija en 0.
- Si `rating >= 3`: propina normal como está actualmente.

**PaymentSuccess**: Eliminar el bloque de estrellas y el estado asociado. Solo mostrar resumen de pago + botón volver al menú.

