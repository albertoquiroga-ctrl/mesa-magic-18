/**
 * Menu Page
 * 
 * The main browsing experience. Shows:
 * 1. Sticky header with restaurant name, table number, and search
 * 2. Horizontal category pills that scroll to sections
 * 3. AI-powered recommendations (locked behind login)
 * 4. Menu items grouped by category in a 2-column grid
 * 5. Sticky cart bar at the bottom
 */
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Lock, Sparkles } from 'lucide-react';
import { mockMenuItems, mockCategories, mockRestaurant, mockRecommendations } from '@/data/mockData';
import { MenuItemCard } from '@/components/guest/MenuItemCard';
import { CartBar } from '@/components/guest/CartBar';
import { useAuthStore } from '@/stores/authStore';

// ---------------------------------------------------------------------------
// Category emoji mapping for pills
// ---------------------------------------------------------------------------

const categoryEmojis: Record<string, string> = {
  Bebidas: '🥤',
  Entradas: '🥗',
  'Platos Fuertes': '🥩',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Menu = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [activeCategory, setActiveCategory] = useState(mockCategories[0]);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /** Scroll to a category section and update the active pill */
  const scrollToCategory = useCallback((cat: string) => {
    setActiveCategory(cat);
    sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <span className="text-base font-semibold truncate">{mockRestaurant.name}</span>
          <span className="font-mono text-xs bg-muted rounded-chip px-3 py-1">
            Mesa {mockRestaurant.table}
          </span>
          <button className="min-w-touch min-h-touch flex items-center justify-center" aria-label="Buscar">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Category pills (horizontally scrollable) */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
          {mockCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-chip text-sm font-medium whitespace-nowrap transition-colors min-h-touch ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <span>{categoryEmojis[cat]}</span>
                {cat}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Scrollable menu content ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
        {/* Personalized recommendations */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Recomendado para ti</h2>
          </div>

          {isLoggedIn ? (
            /* Logged in → show actual recommendations */
            <div className="grid grid-cols-2 gap-3">
              {mockRecommendations.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onTap={() => navigate(`/guest/menu/${item.id}`)}
                />
              ))}
            </div>
          ) : (
            /* Not logged in → teaser with login CTA */
            <button
              onClick={() => navigate('/guest/login', { state: { returnTo: '/guest/menu', nudgeOrigin: 'menu' } })}
              className="w-full relative rounded-card border border-border bg-card p-5 overflow-hidden"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-card/60 z-10 flex flex-col items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium text-foreground text-center px-4">
                  Inicia sesión para ver recomendaciones personalizadas
                </span>
                <span className="text-[11px] text-primary font-semibold">Crear cuenta →</span>
              </div>
              <div className="grid grid-cols-3 gap-2 opacity-30">
                {mockRecommendations.slice(0, 3).map((item) => (
                  <div key={item.id} className="h-16 rounded-lg bg-muted" />
                ))}
              </div>
            </button>
          )}
        </section>

        {/* Menu sections by category */}
        {mockCategories.map((cat) => {
          const items = mockMenuItems.filter((i) => i.category === cat);
          return (
            <section
              key={cat}
              ref={(el) => { sectionRefs.current[cat] = el; }}
              className="mb-6 scroll-mt-28"
            >
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {categoryEmojis[cat]} {cat}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onTap={() => navigate(`/guest/menu/${item.id}`)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Sticky cart bar */}
      <CartBar />
    </div>
  );
};

export default Menu;
