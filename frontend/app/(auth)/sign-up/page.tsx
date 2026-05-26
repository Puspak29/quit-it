'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { request as api } from '@/lib/request';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Activity, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';

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
                
                await refreshUser(); // Refresh user data in context
                toast.dismiss(); // Dismiss loading toast

                router.push('/');
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
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950 p-4">
            {/* Animated Background Gradients */}
            <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/20 blur-[120px] mix-blend-screen pointer-events-none" />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="p-8 space-y-8 bg-white/3 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">

                    <div className="text-center space-y-2">
                        {/* <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className="w-12 h-12 mx-auto bg-linear-to-tr from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4"
                        >
                            <Activity className="w-6 h-6 text-white" />
                        </motion.div> */}
                        <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                        <p className="text-zinc-400">Start your journey to recovery today</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            {/* <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-zinc-300 ml-1">Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-white placeholder-zinc-500 transition-all outline-none backdrop-blur-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div> */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-zinc-300 ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-white placeholder-zinc-500 transition-all outline-none backdrop-blur-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-zinc-300 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-white placeholder-zinc-500 transition-all outline-none backdrop-blur-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-violet-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-zinc-300 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-white placeholder-zinc-500 transition-all outline-none backdrop-blur-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-violet-400 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full py-6 text-base font-semibold shadow-lg shadow-violet-500/25 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0" loading={loading}>
                            Create Account
                        </Button>
                    </form>
                    <p className="text-center text-sm text-zinc-400 mt-8">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="font-semibold text-white hover:text-violet-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}