import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Gift, Star, Phone } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n/useTranslation';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { returnTo?: string; nudgeOrigin?: string } | null;
  const returnTo = state?.returnTo || '/guest/profile';
  const nudgeOrigin = state?.nudgeOrigin || 'general';
  const login = useAuthStore((s) => s.login);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');

  const handleSendCode = () => {
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerify = () => {
    // For demo: if name matches mock user, treat as returning user
    const isReturning = name.trim().toLowerCase() === 'maría garcía' || name.trim().toLowerCase() === 'maria garcia';
    login(!isReturning);
    navigate('/guest/post-registration', { replace: true, state: { nudgeOrigin, returnTo } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={() => step === 'otp' ? setStep('phone') : navigate(-1)}
          className="min-w-touch min-h-touch flex items-center justify-center -ml-2"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">
          {step === 'phone' ? 'Crear cuenta' : 'Verificar código'}
        </h1>
      </header>

      <div className="flex-1 px-6 pt-4 pb-8">
        {/* Value prop */}
        <div className="bg-primary/5 border border-primary/20 rounded-card p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Programa de lealtad</span>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span><strong className="text-foreground">Ahorra $50</strong> en tu próxima visita al inscribirte</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>Acumula puntos con cada compra y canjéalos por recompensas</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>Recibe recomendaciones personalizadas basadas en tus gustos</span>
            </li>
          </ul>
        </div>

        {step === 'phone' ? (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tu nombre</label>
                <Input
                  type="text"
                  placeholder="Ej: María García"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Número de teléfono</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 h-10 rounded-md border border-input bg-muted text-sm text-muted-foreground shrink-0">
                    🇲🇽 +52
                  </div>
                  <Input
                    type="tel"
                    placeholder="55 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s]/g, ''))}
                    className="flex-1"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Te enviaremos un código por SMS para verificar tu número
                </p>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-button text-base font-bold mb-3 gap-2"
              onClick={handleSendCode}
              disabled={phone.length < 10 || name.trim().length === 0}
            >
              <Phone className="w-4 h-4" />
              Enviar código
            </Button>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <Phone className="w-10 h-10 text-primary mx-auto mb-3" />
              <p className="text-sm text-foreground font-medium mb-1">
                Ingresa el código de 4 dígitos
              </p>
              <p className="text-xs text-muted-foreground">
                Enviado a +52 {phone}
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const newOtp = otp.split('');
                    newOtp[i] = val;
                    setOtp(newOtp.join(''));
                    if (val && e.target.nextElementSibling) {
                      (e.target.nextElementSibling as HTMLInputElement).focus();
                    }
                  }}
                  className="w-14 h-14 text-center text-2xl font-mono font-bold rounded-card border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ))}
            </div>

            <Button
              className="w-full h-12 rounded-button text-base font-bold mb-3"
              onClick={handleVerify}
              disabled={otp.length < 4}
            >
              Verificar y crear cuenta
            </Button>

            <button
              onClick={() => setStep('phone')}
              className="w-full text-center text-xs text-muted-foreground py-2"
            >
              ¿No recibiste el código? Reenviar
            </button>
          </>
        )}

        <button
          onClick={() => navigate('/guest/menu')}
          className="w-full text-center text-sm text-muted-foreground py-2 mt-4"
        >
          Continuar sin cuenta →
        </button>
      </div>
    </div>
  );
};

export default Login;
