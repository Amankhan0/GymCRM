import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User as UserIcon, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/aiService';
import { setAuth } from '../store/slices/authSlice';
import { Logo } from '../components/Logo';

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSignup = mode === 'signup';
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const finish = (data) => {
    dispatch(setAuth(data));
    toast.success(`Welcome${data.user?.name ? `, ${data.user.name.split(' ')[0]}` : ''} ✨`);
    navigate('/app');
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = isSignup
        ? await authApi.signup(form)
        : await authApi.login({ email: form.email, password: form.password });
      finish(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async (cred) => {
    setLoading(true);
    try {
      const data = await authApi.google(cred.credential);
      finish(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ae-app grid min-h-screen place-items-center px-4 py-10">
      <Link to="/" className="absolute left-5 top-5 flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 font-display text-2xl font-bold text-white">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1.5 text-sm text-white/45">
            {isSignup ? 'Start creating in seconds.' : 'Log in to continue creating.'}
          </p>
        </div>

        <div className="ae-card p-6 sm:p-7">
          <form onSubmit={submit} className="space-y-3.5">
            {isSignup && (
              <Field icon={UserIcon} placeholder="Full name" value={form.name} onChange={set('name')} required />
            )}
            <Field icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={set('email')} required />
            <Field icon={Lock} type="password" placeholder="Password" value={form.password} onChange={set('password')} required />

            <button type="submit" disabled={loading} className="ae-btn w-full !py-3.5">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSignup ? 'Create account' : 'Log in'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-white/30">
            <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex justify-center [color-scheme:light]">
            {GOOGLE_ID ? (
              <GoogleLogin onSuccess={onGoogle} onError={() => toast.error('Google login failed')} theme="filled_black" shape="pill" text={isSignup ? 'signup_with' : 'signin_with'} />
            ) : (
              <button
                type="button"
                onClick={() => toast.info('Add VITE_GOOGLE_CLIENT_ID to enable Google login')}
                className="ae-btn-ghost w-full"
              >
                <GoogleMark /> Continue with Google
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/45">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setMode(isSignup ? 'login' : 'signup')} className="font-semibold text-brand-soft hover:text-white">
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
      <input {...props} className="ae-input pl-10" />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
