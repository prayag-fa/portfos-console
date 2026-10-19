import { useState, type FormEvent } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, ShieldCheck, TrendingUp, User, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/cn';
import { BrandMatrixIcon } from '../components/common/BrandMatrixIcon';

const inputClass =
  'w-full rounded-xl border bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:bg-white focus:ring-4';

const HIGHLIGHTS = [
  { icon: Users, text: 'User adoption and journey conversion at a glance' },
  { icon: ShieldCheck, text: 'ReBIT consent lifecycle and retention alerts' },
  { icon: TrendingUp, text: 'Linked-account distribution across asset classes' },
];

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const expired = searchParams.get('expired') === 'true';
  const { loginMutation } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [submitted, setSubmitted] = useState(false);

  if (sessionStorage.getItem('accessToken') && !loginMutation.isPending) {
    return <Navigate to="/" replace />;
  }

  const usernameMissing = (submitted || touched.username) && !username.trim();
  const passwordMissing = (submitted || touched.password) && !password;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!username.trim() || !password) return;
    loginMutation.mutate({ username: username.trim(), password });
  };

  const error = loginMutation.error;
  const apiError = error
    ? isAxiosError(error) && error.response?.status === 401
      ? 'Invalid username or password. Please try again.'
      : 'Unable to sign in right now. Please try again later.'
    : null;

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#0D1912] border-r border-[#172B1F] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#D2F865]/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14231A] ring-1 ring-[#1E3326] shadow-sm">
            <BrandMatrixIcon className="h-6 w-6" dotClassName="rounded-[2.5px] bg-[#D2F865]" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">Portfos</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">Tenant analytics, built for clarity.</h2>
          <p className="mt-3 text-[#8FA396]">
            Monitor adoption, consent health and linked accounts across your Account Aggregator journeys.
          </p>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-[#D7E2DC]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#14231A] ring-1 ring-[#1E3326] text-[#D2F865]">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-[#7E9587]">© Finarkein Analytics</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D1912] ring-1 ring-[#1E3326] shadow-sm">
              <BrandMatrixIcon className="h-5 w-5" dotClassName="rounded-[2.5px] bg-[#D2F865]" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">Portfos</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to the Tenant Console to continue.</p>

          {expired && (
            <div role="status" className="mt-6 animate-pop rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
              Your session has expired. Please sign in again.
            </div>
          )}

          {apiError && (
            <div role="alert" className="mt-6 flex animate-pop items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">
                Username / Email
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="superadmin"
                  value={username}
                  aria-invalid={usernameMissing}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  className={cn(
                    inputClass,
                    usernameMissing
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                      : 'border-slate-200 focus:border-[#0D1912] focus:ring-[#D2F865]/40'
                  )}
                />
              </div>
              {usernameMissing && <p className="mt-1 text-xs text-rose-600">Username is required.</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  aria-invalid={passwordMissing}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className={cn(
                    inputClass,
                    'pr-10',
                    passwordMissing
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                      : 'border-slate-200 focus:border-[#0D1912] focus:ring-[#D2F865]/40'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordMissing && <p className="mt-1 text-xs text-rose-600">Password is required.</p>}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D2F865] px-4 py-2.5 text-sm font-bold text-[#0D1912] shadow-md shadow-[#D2F865]/20 transition hover:bg-[#C2ED4B] active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
            >
              {loginMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-[#0D1912]" />}
              {loginMutation.isPending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
