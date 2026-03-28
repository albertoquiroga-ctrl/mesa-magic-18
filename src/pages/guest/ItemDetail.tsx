import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { mockMenuItems } from '@/data/mockData';

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const item = mockMenuItems.find((i) => i.id === itemId);

  useEffect(() => {
    setQuantity(1);
    setNotes('');
    setAdded(false);
  }, [itemId]);

  if (!item) {
    return (
      <div className="p-5 text-center text-muted-foreground">
        Producto no encontrado
      </div>
    );
  }

  const total = item.price * quantity;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: item.id, name: item.name, price: item.price, notes });
    }
    setAdded(true);
    setTimeout(() => {
      navigate('/guest/menu');
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero photo area */}
      <div className="w-full aspect-[4/3] bg-muted relative flex items-center justify-center">
        <span className="text-7xl">
          {item.category === 'Bebidas' ? '🥤' : item.category === 'Entradas' ? '🥗' : '🍽️'}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate('/guest/menu')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center min-w-touch min-h-touch"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Sold out badge */}
        {item.soldOut && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground bg-muted px-4 py-2 rounded-chip">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-4 pb-32">
        {/* Name */}
        <h1 className="font-heading text-[28px] leading-tight font-semibold">{item.name}</h1>

        {/* Price */}
        <p className="font-mono text-xl text-primary mt-2 tabular-nums">
          ${item.price} <span className="text-sm text-muted-foreground">MXN</span>
        </p>

        {/* Description */}
        {item.description && (
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-chip"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

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
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-6 pt-3 bg-background border-t border-border z-30">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            disabled={added}
            className={`w-full h-[52px] rounded-button font-bold text-base transition-colors ${
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
