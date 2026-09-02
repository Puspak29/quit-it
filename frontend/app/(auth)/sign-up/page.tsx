'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import Cookies from 'js-cookie';

export default function SignUpPage() {
    // const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { refreshUser } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            toast.loading('Creating account...');
            const response = await authService.register({ email, password });
            // console.log("Register response:", response);
            if (response.data.success) {
                toast.success('Account created successfully!');
                
                Cookies.set('frontend-token', response.data.data.token, { 
                    expires: 7
                });

                await new Promise(r => setTimeout(r, 200));
                await refreshUser(); // Refresh user data in context
                toast.dismiss(); // Dismiss loading toast

                router.push('/dashboard');
            } else {
                toast.error(response.data.message || 'Failed to sign up');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'An error occurred during sign up');
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background p-4">
            {/* Animated Background Gradients */}
            <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/25 blur-[120px] pointer-events-none" />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="p-8 space-y-8 bg-surface/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/40 border border-foreground/15 relative overflow-hidden">

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h2>
                        <p className="text-foreground/70">Start your journey to recovery today</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-foreground/80 ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-foreground/15 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary/50 text-foreground placeholder-foreground/40 transition-all outline-none backdrop-blur-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-foreground/80 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 bg-white/5 border border-foreground/15 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary/50 text-foreground placeholder-foreground/40 transition-all outline-none backdrop-blur-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/40 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-foreground/80 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 bg-white/5 border border-foreground/15 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary/50 text-foreground placeholder-foreground/40 transition-all outline-none backdrop-blur-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/40 hover:text-primary transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full py-6 text-base font-semibold shadow-lg shadow-primary/30 bg-primary hover:bg-primary-dark border-0" loading={loading}>
                            Create Account
                        </Button>
                    </form>
                    <p className="text-center text-sm text-foreground/70 mt-8">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="font-semibold text-primary hover:text-accent transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}