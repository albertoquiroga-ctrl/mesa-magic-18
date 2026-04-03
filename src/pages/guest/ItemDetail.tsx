/**
 * ItemDetail
 * 
 * Full-screen view for a single menu item. Shows photo, description,
 * modifier selectors, special instructions, quantity picker, and
 * a sticky "Add to cart" CTA.
 */
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, ArrowLeft, Clock, Check, AlertTriangle, Info } from 'lucide-react';
import { useCartStore, type SelectedModifier } from '@/stores/cartStore';
import { mockMenuItems, ALLERGEN_META, type ModifierGroup } from '@/data/mockData';
import { useTranslation } from '@/i18n/useTranslation';

// ---------------------------------------------------------------------------
// Modifier Group UI
// ---------------------------------------------------------------------------

interface ModifierGroupSectionProps {
  group: ModifierGroup;
  selected: string[];
  onToggle: (optionId: string) => void;
}

const ModifierGroupSection = ({ group, selected, onToggle }: ModifierGroupSectionProps) => {
  const { t } = useTranslation();
  return (
  <div className="mt-5">
    <div className="flex items-baseline gap-2 mb-2.5">
      <label className="text-sm font-medium">{group.label}</label>
      {group.required && (
      <span className="text-[10px] font-semibold text-destructive uppercase tracking-wide">
          {t('item.required')}
        </span>
      )}
      {!group.required && (
        <span className="text-[10px] text-muted-foreground">{t('item.optional')}</span>
      )}
    </div>
    <div className="flex flex-wrap gap-2">
      {group.options.map((opt) => {
        const isSelected = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onToggle(opt.id)}
            className={`
              flex items-center gap-1.5 px-3.5 py-2 rounded-chip border text-sm transition-colors
              ${isSelected
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:border-primary/40'
              }
            `}
          >
            {isSelected && <Check className="w-3.5 h-3.5" />}
            <span>{opt.label}</span>
            {(opt.extraPrice ?? 0) > 0 && (
              <span className={`font-mono text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                +${opt.extraPrice}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const { t } = useTranslation();

  const item = mockMenuItems.find((i) => i.id === itemId);

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);
  /** Map of groupId → selected optionId(s) */
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  // Reset when navigating to a different item
  useEffect(() => {
    setQuantity(1);
    setNotes('');
    setAdded(false);
    setSelections({});
  }, [itemId]);

  // Check that all required modifier groups have a selection
  const modifiers = item?.modifiers ?? [];
  const allRequiredSelected = useMemo(
    () => modifiers.filter((g) => g.required).every((g) => (selections[g.id] ?? []).length > 0),
    [modifiers, selections],
  );

  if (!item) {
    return (
      <div className="p-5 text-center text-muted-foreground">
        {t('item.notFound')}
      </div>
    );
  }

  // Build selected modifiers for cart
  const buildModifiers = (): SelectedModifier[] =>
    modifiers.flatMap((group) =>
      (selections[group.id] ?? []).map((optId) => {
        const opt = group.options.find((o) => o.id === optId)!;
        return {
          groupId: group.id,
          groupLabel: group.label,
          optionId: opt.id,
          optionLabel: opt.label,
          extraPrice: opt.extraPrice ?? 0,
        };
      }),
    );

  // Calculate total including modifier surcharges
  const modifierExtras = modifiers
    .flatMap((g) => (selections[g.id] ?? []).map((oId) => g.options.find((o) => o.id === oId)?.extraPrice ?? 0))
    .reduce((s, v) => s + v, 0);
  const unitPrice = item.price + modifierExtras;
  const total = unitPrice * quantity;

  const handleToggle = (group: ModifierGroup, optionId: string) => {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.multiSelect) {
        // Toggle on/off
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [group.id]: next };
      }
      // Single-select: toggle off if already selected, otherwise replace
      return { ...prev, [group.id]: current.includes(optionId) ? [] : [optionId] };
    });
  };

  const handleAdd = () => {
    const mods = buildModifiers();
    for (let i = 0; i < quantity; i++) {
      addItem({ id: item.id, name: item.name, price: item.price, notes, modifiers: mods.length > 0 ? mods : undefined });
    }
    setAdded(true);
    setTimeout(() => navigate('/guest/menu'), 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero photo */}
      <div className="w-full aspect-[4/3] bg-muted relative flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-7xl">
            {item.category === 'Bebidas' ? '🥤' : item.category === 'Entradas' ? '🥗' : '🍽️'}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />

        <button
          onClick={() => navigate('/guest/menu')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center min-w-touch min-h-touch"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {item.soldOut && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground bg-muted px-4 py-2 rounded-chip">
              {t('item.soldOut')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-4 pb-32">
        <h1 className="font-heading text-[28px] leading-tight font-semibold">{item.name}</h1>

        <div className="flex items-center gap-3 mt-2">
          <p className="font-mono text-xl text-primary tabular-nums">
            ${item.price} <span className="text-sm text-muted-foreground">MXN</span>
          </p>
          {item.prepTime && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-chip">
              <Clock className="w-3.5 h-3.5" />
              ~{item.prepTime} min
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">{item.description}</p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-chip">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="mt-5 p-3.5 rounded-card bg-destructive/5 border border-destructive/15">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-semibold text-destructive uppercase tracking-wide">{t('item.allergens')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.allergens.map((a) => {
                const meta = ALLERGEN_META[a];
                return (
                  <span key={a} className="inline-flex items-center gap-1 text-xs bg-background border border-border px-2.5 py-1 rounded-chip">
                    <span>{meta.emoji}</span>
                    <span>{meta.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Nutritional info */}
        {item.nutrition && (
          <div className="mt-4 p-3.5 rounded-card bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2.5">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Info nutricional</span>
              <span className="text-[10px] text-muted-foreground ml-auto">por porción</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="font-mono text-sm font-semibold tabular-nums">{item.nutrition.calories}</p>
                <p className="text-[10px] text-muted-foreground">kcal</p>
              </div>
              {item.nutrition.protein != null && (
                <div>
                  <p className="font-mono text-sm font-semibold tabular-nums">{item.nutrition.protein}g</p>
                  <p className="text-[10px] text-muted-foreground">Proteína</p>
                </div>
              )}
              {item.nutrition.carbs != null && (
                <div>
                  <p className="font-mono text-sm font-semibold tabular-nums">{item.nutrition.carbs}g</p>
                  <p className="text-[10px] text-muted-foreground">Carbos</p>
                </div>
              )}
              {item.nutrition.fat != null && (
                <div>
                  <p className="font-mono text-sm font-semibold tabular-nums">{item.nutrition.fat}g</p>
                  <p className="text-[10px] text-muted-foreground">Grasa</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modifier groups */}
        {modifiers.map((group) => (
          <ModifierGroupSection
            key={group.id}
            group={group}
            selected={selections[group.id] ?? []}
            onToggle={(optId) => handleToggle(group, optId)}
          />
        ))}

        {/* Special instructions */}
        <div className="mt-6">
          <label className="text-sm font-medium mb-2 block">Instrucciones especiales</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="¿Sin sal? ¿Extra limón? Cuéntanos..."
            className="w-full h-24 rounded-input bg-card border border-border px-4 py-3 text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Quantity selector */}
        {!item.soldOut && (
          <div className="flex items-center justify-center gap-8 mt-6">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center min-w-touch min-h-touch"
              aria-label="Menos"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="font-mono text-2xl w-10 text-center tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center min-w-touch min-h-touch"
              aria-label="Más"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      {!item.soldOut && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-3 pt-3 bg-background border-t border-border z-30">
          {/* Missing required modifiers warning */}
          {!allRequiredSelected && modifiers.some((g) => g.required) && (
            <p className="text-xs text-destructive text-center mb-2">
              Selecciona las opciones requeridas para continuar
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            disabled={added || !allRequiredSelected}
            className={`w-full h-[52px] rounded-button font-bold text-base transition-colors disabled:opacity-50 ${
              added
                ? 'bg-success text-primary-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {added ? (
              '✓ Agregado'
            ) : (
              <>
                Agregar {quantity} — <span className="font-mono">${total} MXN</span>
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
