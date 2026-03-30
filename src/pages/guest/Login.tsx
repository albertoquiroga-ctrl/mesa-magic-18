import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Star, Mail } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login(email, password);
    navigate('/guest/profile');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={() => navigate(-1)}
          className="min-w-touch min-h-touch flex items-center justify-center -ml-2"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Iniciar sesión</h1>
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

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Contraseña</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full h-12 rounded-button text-base font-bold mb-3" onClick={handleLogin}>
          Iniciar sesión
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 rounded-button text-sm mb-6 gap-2"
          onClick={handleLogin}
        >
          <Mail className="w-4 h-4" />
          Continuar con Google
        </Button>

        <button
          onClick={() => navigate('/guest/menu')}
          className="w-full text-center text-sm text-muted-foreground py-2"
        >
          Continuar sin cuenta →
        </button>
      </div>
    </div>
  );
};

export default Login;
