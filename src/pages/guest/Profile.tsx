import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Gift, Trophy, Phone } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/i18n/useTranslation';

const levelColors = {
  Bronce: 'text-orange-600',
  Plata: 'text-gray-500',
  Oro: 'text-yellow-500',
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  if (!user) {
    navigate('/guest/login');
    return null;
  }

  const progressPercent = (user.loyalty.points / user.loyalty.nextRewardAt) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate('/guest/menu')}
            className="min-w-touch min-h-touch flex items-center justify-center -ml-2"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">{t('profile.title')}</h1>
          <LanguageToggle className="ml-auto" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-28 space-y-6">
        {/* User info */}
        <div className="bg-card border border-border rounded-card p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{user.phone}</span>
              </div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Loyalty */}
        <div className="bg-card border border-border rounded-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className={`w-5 h-5 ${levelColors[user.loyalty.level]}`} />
            <h3 className="text-sm font-semibold text-foreground">{t('profile.loyalty')}</h3>
            <span className={`ml-auto text-xs font-bold ${levelColors[user.loyalty.level]}`}>
              {t('profile.level', { level: user.loyalty.level })}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>{t('profile.points', { pts: user.loyalty.points })}</span>
              <span>{t('profile.nextReward', { pts: user.loyalty.nextRewardAt })}</span>
            </div>
            <Progress value={progressPercent} className="h-2.5" />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {t('profile.remaining', { pts: user.loyalty.nextRewardAt - user.loyalty.points })}
            </p>
          </div>

          {user.loyalty.savingsAvailable > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Gift className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs text-foreground">
                {t('profile.discountAvailable', { amount: user.loyalty.savingsAvailable })}
              </span>
            </div>
          )}
        </div>

        {/* History */}
        <div className="bg-card border border-border rounded-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">{t('profile.visitHistory')}</h3>
          </div>
          {user.history.map((visit) => (
            <div key={visit.id} className="px-5 py-3 border-b border-border last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{visit.branch}</span>
                <PriceDisplay amount={visit.total} size="sm" className="font-semibold" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{visit.date}</span>
                <span className="text-[11px] text-primary font-medium">+{visit.pointsEarned} pts</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 truncate">
                {visit.items.join(', ')}
              </p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-button text-sm text-destructive border-destructive/30 gap-2"
          onClick={() => {
            logout();
            navigate('/guest/menu');
          }}
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};

export default Profile;
