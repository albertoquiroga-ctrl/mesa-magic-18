

## Plan: División híbrida de cuenta — "Pago justo"

### Concepto

Agregar un tercer modo de división: **"Pago justo"**. Al seleccionarlo, se muestra la lista de todos los platillos de la mesa y el comensal marca cada uno como:

- **"Mío"** → paga el 100% del platillo
- **"Compartido"** → el costo se divide entre el número de comensales de la mesa

El total del comensal = suma de platillos "míos" + (suma de platillos "compartidos" ÷ número de comensales).

Por defecto todos los platillos inician como "Compartido" para que el usuario solo tenga que marcar los suyos.

### Cambios

**1. `src/stores/paymentStore.ts`**
- Agregar un nuevo estado `itemAssignments: Record<string, 'mine' | 'shared'>` para rastrear la asignación de cada platillo (key = `name+price`).
- Agregar acciones `setItemAssignment(key, value)` y `resetAssignments()`.

**2. `src/pages/guest/SplitTip.tsx`**
- Agregar un tercer botón en la sección "¿Cómo pagar?": **"Pago justo"** con icono `ScissorsLineDashed` o similar, subtítulo "Selecciona tus platillos".
- Usar `splitMode: 'custom'` (ya existe en el tipo).
- Cuando `splitMode === 'custom'`, mostrar automáticamente la lista de platillos consolidados con un toggle por cada uno: chip "Mío" / "Compartido".
- Recalcular `perPerson` dinámicamente:
  - Platillos marcados "mine" → suma completa
  - Platillos marcados "shared" → precio ÷ guestCount
- La propina se calcula sobre ese subtotal personal.

**3. UI de asignación de platillos** (inline en SplitTip)
- Cada fila muestra: cantidad, nombre, precio, y dos chips toggle ("Mío" en primary, "Compartido" en muted).
- Al fondo de la lista, un mini resumen: "Tus platillos: $X · Compartidos: $Y ÷ N = $Z".

### Flujo del usuario

```text
Mi consumo → Pedir la cuenta → [Pago justo]
                                  ↓
                        Lista de platillos con toggle
                        Mío / Compartido por cada uno
                                  ↓
                        Total calculado + propina
                                  ↓
                        Continuar al pago
```

### Archivos a modificar
| Archivo | Cambio |
|---|---|
| `src/stores/paymentStore.ts` | Agregar `itemAssignments` y acciones |
| `src/pages/guest/SplitTip.tsx` | Tercer botón + UI de asignación + lógica de cálculo |

