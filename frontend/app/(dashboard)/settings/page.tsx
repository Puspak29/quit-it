'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/user.service';
import { motion, Variants } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User, Mail, Lock, Eye, EyeOff, Save, Shield, Loader2,
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } },
};

// ── Reusable field component ─────────────────────────────────────────────────
function Field({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  rightElement,
  disabled,
}: {
  label: string;
  icon: React.ElementType;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rightElement?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">{label}</label>
      <div className="relative flex items-center">
        <Icon size={16} className="absolute left-3.5 text-foreground/40 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="
            w-full bg-white/5 border border-foreground/15 rounded-xl
            pl-10 pr-10 py-3 text-sm text-foreground placeholder-foreground/40
            focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
        {rightElement && (
          <div className="absolute right-3 text-foreground/40">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

// ── Password field with visibility toggle ────────────────────────────────────
function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label}
      icon={Lock}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rightElement={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
    />
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, refreshUser } = useAuth();

  // Profile form
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Save profile ────────────────────────────────────────────────────────
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !email.trim()) return;

    setProfileLoading(true);
    try {
      const res = await userService.updateProfile({ name, email });
      if (res?.data?.success) {
        await refreshUser();
        toast.success('Profile updated!');
      } else {
        toast.error(res?.data?.message ?? 'Update failed');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? 'Something went wrong';
      toast.error(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Save password ───────────────────────────────────────────────────────
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await userService.updateProfile({ currentPassword, newPassword });
      if (res?.data?.success) {
        toast.success('Password changed!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res?.data?.message ?? 'Password change failed');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? 'Something went wrong';
      toast.error(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 max-w-2xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-foreground/70 text-sm mt-2">
          Manage your account information and security.
        </p>
      </motion.div>

      {/* ── Avatar + Name display ── */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
          <span className="text-2xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'U'}
          </span>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{user?.name || 'Anonymous'}</p>
          <p className="text-sm text-foreground/70">{user?.email}</p>
          <p className="text-xs text-foreground/40 mt-1">
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
          </p>
        </div>
      </motion.div>

      {/* ── Profile Section ── */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-foreground/10 pb-5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <User size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Profile Information</h2>
            <p className="text-xs text-foreground/50">Update your name and email address</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <Field
            label="Full Name"
            icon={User}
            value={name}
            onChange={setName}
            placeholder="Your full name"
          />
          <Field
            label="Email Address"
            icon={Mail}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />

          <div className="flex justify-end pt-2">
            <button
              id="save-profile-btn"
              type="submit"
              disabled={profileLoading}
              className="
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                bg-primary hover:bg-primary-dark active:scale-95
                text-white transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-lg shadow-primary/25
              "
            >
              {profileLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {profileLoading ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ── Password Section ── */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Shield size={18} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Change Password</h2>
            <p className="text-xs text-zinc-500">Must be at least 8 characters</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter current password"
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 8 characters"
          />
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repeat new password"
          />

          {/* Live match indicator */}
          {newPassword && confirmPassword && (
            <p
              className={`text-xs font-medium ${
                newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              id="save-password-btn"
              type="submit"
              disabled={passwordLoading}
              className="
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                bg-purple-600 hover:bg-purple-500 active:scale-95
                text-white transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-lg shadow-purple-500/20
              "
            >
              {passwordLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Lock size={15} />
              )}
              {passwordLoading ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
