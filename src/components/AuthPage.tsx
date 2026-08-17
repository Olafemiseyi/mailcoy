import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { dbService } from '../lib/supabaseClient';
import { Mail, Lock, ArrowRight, Building, User, ArrowLeft, Loader2, Chrome, Eye, EyeOff, Sparkles, Shield } from 'lucide-react';

interface AuthPageProps {
  onSignUpSuccess: (name: string, email: string, companyName: string, password?: string) => void;
  onSignInSuccess: (email: string, password?: string) => void;
  onBackToLanding: () => void;
  initialTab?: 'login' | 'signup';
  isResettingPassword?: boolean;
  onResetPasswordSuccess?: () => void;
}

export default function AuthPage({ 
  onSignUpSuccess, 
  onSignInSuccess, 
  onBackToLanding, 
  initialTab = 'signup',
  isResettingPassword = false,
  onResetPasswordSuccess
}: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setError('');
  }, [activeTab]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (showForgotPassword) {
      if (!email) {
        setError('Please enter your email address.');
        return;
      }
      setLoading(true);
      try {
        await dbService.resetPasswordForEmail(email);
        setLoading(false);
        setResetEmailSent(true);
      } catch (err: any) {
        setLoading(false);
        const errMsg = err.message || '';
        if (errMsg.toLowerCase().includes('rate limit') || err.status === 429) {
          setError('Rate limit exceeded. Please wait a moment before trying again.');
        } else if (errMsg.toLowerCase().includes('invalid')) {
          setError('Invalid email address format. Please enter a valid email.');
        } else {
          setError(errMsg || 'Failed to send reset email. Please try again.');
        }
      }
      return;
    }

    if (activeTab === 'signup') {
      if (!name || !companyName || !email || !password || !confirmPassword) {
        setError('All fields are required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please enter your email and password.');
        return;
      }
    }

    setLoading(true);
    try {
      if (activeTab === 'signup') {
        await dbService.signUp(email, name, companyName, password);
      } else {
        await dbService.signIn(email, password);
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        if (activeTab === 'signup') {
          onSignUpSuccess(name, email, companyName, password);
        } else {
          onSignInSuccess(email, password);
        }
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('rate limit') || err.status === 429) {
        setError('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (errMsg.toLowerCase().includes('invalid email') || errMsg.toLowerCase().includes('email is invalid')) {
        setError('Invalid email address format. Please enter a valid email.');
      } else if (errMsg.toLowerCase().includes('confirm') || errMsg.toLowerCase().includes('not confirmed') || errMsg.toLowerCase().includes('email_not_confirmed')) {
        setError('Email address is not confirmed yet. Please verify your email via the link sent to your inbox.');
      } else if (errMsg.toLowerCase().includes('invalid credentials') || errMsg.toLowerCase().includes('incorrect password') || errMsg.toLowerCase().includes('not registered') || errMsg.toLowerCase().includes('invalid grant') || errMsg.toLowerCase().includes('invalid login credentials')) {
        setError('Invalid login credentials. Please check your email and password.');
      } else {
        setError(errMsg || 'Authentication failed. Please verify your credentials and network connection.');
      }
    }
  };

  const handleSetNewPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await dbService.updateUser({ password });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        if (onResetPasswordSuccess) {
          onResetPasswordSuccess();
        }
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to update password. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoadingGoogle(true);
    try {
      const { isSupabaseConfigured } = await import('../lib/supabaseClient');
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, falling back to local Google sign in demo');
        setTimeout(() => {
          setLoadingGoogle(false);
          onSignInSuccess('demo@example.com', 'Secure123!');
        }, 1200);
        return;
      }

      const { createClient } = await import('@supabase/supabase-js');
      const url = (import.meta as any).env.VITE_SUPABASE_URL || '';
      const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
      const supabaseClient = createClient(url, key);
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setLoadingGoogle(false);
      setError(err.message || 'Google Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-white dark:bg-zinc-950 antialiased font-sans">
      
      {/* Left Panel (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('/auth-panel.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-slate-900/90 to-slate-950/90" />
        
        <div className="relative z-10 p-12 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="font-extrabold text-sm text-white">L</span>
              </div>
              <span className="font-display text-lg font-semibold text-white tracking-tight">
                Mailcoy
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
              Professional email,<br />built for your team.
            </h2>
            <p className="text-emerald-100/80 text-lg max-w-md leading-relaxed mb-12">
              One platform to connect, monitor and manage every employee's email — all under your brand.
            </p>

            <ul className="space-y-6">
              {[
                { icon: Mail, text: "Sync every employee's Gmail in minutes" },
                { icon: Shield, text: "Domain verification & DKIM/SPF managed for you" },
                { icon: Sparkles, text: "Real-time email analytics across your whole team" },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-emerald-300" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Assurance Statement */}
          <div className="mt-12 rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold text-white">Enterprise-Grade Reliability</span>
            </div>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Mailcoy connects securely via Google's OAuth 2.0 API. We never store or read your employees' personal email contents. Your workspace is protected by end-to-end TLS 1.3 encryption.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex flex-col relative flex-1 overflow-y-auto">
        {/* Mobile Logo & Back Link */}
        <div className="p-6 lg:p-8 flex items-center justify-between z-10 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <span className="font-extrabold text-[10px] text-white">L</span>
            </div>
            <span className="font-bold text-sm dark:text-white">Mailcoy</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 pb-20">
          <div className="w-full max-w-[420px] space-y-6">
            
            {/* Header for Mobile */}
            <div className="lg:hidden text-center space-y-2 mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                Get Started
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Professional email for your team
              </p>
            </div>
            
            <div className="bg-white dark:bg-zinc-950 lg:bg-transparent lg:dark:bg-transparent border border-slate-200/80 dark:border-zinc-800 lg:border-none lg:shadow-none rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-zinc-950/40 p-8 lg:p-0 space-y-6">
          
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4"
              >
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/30">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">Success</h2>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    Initializing your secure workspace...
                  </p>
                </div>
              </motion.div>
            ) : isResettingPassword ? (
              <motion.div
                key="reset-new-password"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 text-left"
              >
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">Create New Password</h2>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    Please secure your account by selecting a strong, unique password.
                  </p>
                </div>

                <form onSubmit={handleSetNewPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none text-slate-800 dark:text-zinc-100 focus:border-emerald-500 font-semibold"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none text-slate-800 dark:text-zinc-100 focus:border-emerald-500 font-semibold"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-70 min-h-[44px]"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save New Password'}
                  </button>
                </form>
              </motion.div>
            ) : showForgotPassword ? (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 text-left"
              >
                <div className="space-y-1">
                  <button 
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                      setError('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer mb-2"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Sign In
                  </button>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">Reset Password</h2>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    We will transmit a recovery link to restore domain access.
                  </p>
                </div>

                {resetEmailSent ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                    <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400">
                      Link sent. Please check your inbox at <strong className="font-semibold">{email}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3.5 bg-slate-50/50 dark:bg-zinc-950 outline-none text-slate-800 dark:text-zinc-100 focus:border-emerald-500 font-semibold"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-70 min-h-[44px]"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Recovery Link'}
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 text-left"
              >
                {/* Minimal Tab Switcher */}
                <div className="flex bg-slate-50 dark:bg-zinc-950 p-1 rounded-xl border border-slate-150 dark:border-zinc-850">
                  <button 
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === 'signup' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs border border-slate-150/40 dark:border-zinc-800' : 'text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200'}`}
                  >
                    Create Account
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === 'login' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs border border-slate-150/40 dark:border-zinc-800' : 'text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200'}`}
                  >
                    Sign In
                  </button>
                </div>

                {/* Google Login (OAuth Button) */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loadingGoogle || loading}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-200 text-xs font-bold rounded-xl cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-75 min-h-[44px]"
                >
                  {loadingGoogle ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Chrome className="h-4 w-4 text-red-500" />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Autofill helper */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'signup') {
                      setName('Demo Admin');
                      setCompanyName('Example Corp');
                      setEmail('demo@example.com');
                      setPassword('Secure123!');
                      setConfirmPassword('Secure123!');
                    } else {
                      setEmail('demo@example.com');
                      setPassword('Secure123!');
                    }
                  }}
                  className="w-full py-2.5 border border-emerald-150 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-xl hover:bg-emerald-50/60 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Autofill Demo Credentials</span>
                </button>

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-150 dark:border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-500">
                    <span className="bg-white dark:bg-zinc-900 px-3 tracking-wider">or email</span>
                  </div>
                </div>

                {/* Actual Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {activeTab === 'signup' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
                          Company Name
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="pl-9 block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none font-semibold text-slate-800 dark:text-zinc-100 focus:border-emerald-500"
                            placeholder="Acme Inc"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
                          Your Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-9 block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none font-semibold text-slate-800 dark:text-zinc-100 focus:border-emerald-500"
                            placeholder="Jane Doe"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none font-semibold text-slate-800 dark:text-zinc-100 focus:border-emerald-500"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 pr-9 block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none font-semibold text-slate-800 dark:text-zinc-100 focus:border-emerald-500"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>

                    {activeTab === 'signup' ? (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-9 pr-9 block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none font-semibold text-slate-800 dark:text-zinc-100 focus:border-emerald-500"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-end justify-start pb-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(true);
                            setResetEmailSent(false);
                            setError('');
                          }}
                          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </div>

                  {activeTab === 'signup' && (
                    <div className="pt-1">
                      <label className="flex items-start gap-2 select-none cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 mt-0.5"
                        />
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 leading-normal font-semibold">
                          I agree to the{" "}
                          <a 
                            href="/terms" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a 
                            href="/privacy" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                          >
                            Privacy Policy
                          </a>.
                        </span>
                      </label>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 mt-2 min-h-[44px]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>{activeTab === 'signup' ? 'Create Account' : 'Sign In'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          
        </div>

          </div>
        </div>
      </div>
    </div>
  );
}
