import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { mockMenuItems, mockCategories, mockRestaurant } from '@/data/mockData';
import { MenuItemCard } from '@/components/guest/MenuItemCard';
import { CartBar } from '@/components/guest/CartBar';

const categoryEmojis: Record<string, string> = {
  Bebidas: '🥤',
  Entradas: '🥗',
  'Platos Fuertes': '🥩',
};

const Menu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(mockCategories[0]);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToCategory = useCallback((cat: string) => {
    setActiveCategory(cat);
    sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky header */}
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

        {/* Category pills */}
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

      {/* Menu sections */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
        {mockCategories.map((cat) => {
          const items = mockMenuItems.filter((i) => i.category === cat);
          return (
            <div
              key={cat}
              ref={(el) => { sectionRefs.current[cat] = el; }}
              className="mb-6"
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
            </div>
          );
        })}
      </div>

      {/* Cart bar */}
      <CartBar />
    </div>
  );
};

export default Menu;
