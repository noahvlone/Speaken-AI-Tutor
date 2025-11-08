import { 
  Camera, Mail, User as UserIcon, Phone, MapPin, Calendar, 
  Lock, Eye, EyeOff, Shield, CheckCircle2, AlertCircle, X 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { UserProfile } from '../utils/supabase/client';

interface ProfilePageProps {
  userProfile: UserProfile | null;
}

export function ProfilePage({ userProfile }: ProfilePageProps) {
  // Form state - initialize with user profile data
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');
  const [bio, setBio] = useState('Passionate English learner focused on improving pronunciation and fluency.');
  const [dateOfBirth, setDateOfBirth] = useState('1995-06-15');
  const [learningGoal, setLearningGoal] = useState('general');
  const [currentLevel, setCurrentLevel] = useState('b1');
  
  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.full_name || 'User'}`);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setEmail(userProfile.email || '');
      setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.full_name || 'User'}`);
    }
  }, [userProfile]);

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation and UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Original values for comparison
  const originalValues = useRef({
    fullName: userProfile?.full_name || '',
    email: userProfile?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate English learner focused on improving pronunciation and fluency.',
    dateOfBirth: '1995-06-15',
    learningGoal: 'general',
    currentLevel: 'b1',
  });

  // Check if form has changes
  const checkForChanges = () => {
    const hasChanged = 
      fullName !== originalValues.current.fullName ||
      email !== originalValues.current.email ||
      phone !== originalValues.current.phone ||
      location !== originalValues.current.location ||
      bio !== originalValues.current.bio ||
      dateOfBirth !== originalValues.current.dateOfBirth ||
      learningGoal !== originalValues.current.learningGoal ||
      currentLevel !== originalValues.current.currentLevel ||
      avatarPreview !== null;
    
    setHasChanges(hasChanged);
  };

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setHasChanges(true);
        toast.success('Avatar preview updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    checkForChanges();
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update original values
    originalValues.current = {
      fullName,
      email,
      phone,
      location,
      bio,
      dateOfBirth,
      learningGoal,
      currentLevel,
    };

    // Apply avatar if changed
    if (avatarPreview) {
      setAvatarUrl(avatarPreview);
      setAvatarPreview(null);
    }

    setIsSaving(false);
    setHasChanges(false);
    setErrors({});
    toast.success('Profile updated successfully! ✅');
  };

  // Handle cancel
  const handleCancel = () => {
    setFullName(originalValues.current.fullName);
    setEmail(originalValues.current.email);
    setPhone(originalValues.current.phone);
    setLocation(originalValues.current.location);
    setBio(originalValues.current.bio);
    setDateOfBirth(originalValues.current.dateOfBirth);
    setLearningGoal(originalValues.current.learningGoal);
    setCurrentLevel(originalValues.current.currentLevel);
    setAvatarPreview(null);
    setErrors({});
    setHasChanges(false);
    toast.info('Changes discarded');
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsChangingPassword(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsChangingPassword(false);
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    toast.success('Password changed successfully! 🔒');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <h3 className="mb-6">Profile Picture</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                <AvatarImage src={avatarPreview || avatarUrl} alt="Profile" />
                <AvatarFallback className="text-2xl">
                  {fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h4 className="mb-2">Upload your photo</h4>
              <p className="text-muted-foreground text-sm mb-4">
                JPG, PNG or GIF. Max size 5MB. Recommended 400x400px.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  onClick={handleAvatarClick}
                  variant="outline"
                  className="rounded-xl"
                >
                  Choose Image
                </Button>
                {avatarPreview && (
                  <Button
                    onClick={handleRemoveAvatar}
                    variant="outline"
                    className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Remove Preview
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <h3 className="mb-6">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="mb-2 block">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    checkForChanges();
                    if (errors.fullName) {
                      setErrors({ ...errors, fullName: '' });
                    }
                  }}
                  className={`pl-12 rounded-xl ${errors.fullName ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    checkForChanges();
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  className={`pl-12 rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="mb-2 block">
                Phone Number
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    checkForChanges();
                    if (errors.phone) {
                      setErrors({ ...errors, phone: '' });
                    }
                  }}
                  className={`pl-12 rounded-xl ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </motion.p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dob" className="mb-2 block">
                Date of Birth
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    checkForChanges();
                  }}
                  className="pl-12 rounded-xl"
                />
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <Label htmlFor="location" className="mb-2 block">
                Location
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    checkForChanges();
                  }}
                  className="pl-12 rounded-xl"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <Label htmlFor="bio" className="mb-2 block">
                Bio
                <span className="text-muted-foreground ml-2">
                  ({bio.length}/500)
                </span>
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  checkForChanges();
                  if (errors.bio) {
                    setErrors({ ...errors, bio: '' });
                  }
                }}
                className={`rounded-xl min-h-[100px] ${errors.bio ? 'border-red-500' : ''}`}
                placeholder="Tell us about yourself and your learning goals..."
                maxLength={500}
              />
              {errors.bio && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.bio}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Learning Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <h3 className="mb-6">Learning Preferences</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Goal */}
            <div>
              <Label htmlFor="learningGoal" className="mb-2 block">
                Learning Goal
              </Label>
              <Select value={learningGoal} onValueChange={(value) => {
                setLearningGoal(value);
                checkForChanges();
              }}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General English</SelectItem>
                  <SelectItem value="toefl">TOEFL Preparation</SelectItem>
                  <SelectItem value="ielts">IELTS Preparation</SelectItem>
                  <SelectItem value="business">Business English</SelectItem>
                  <SelectItem value="travel">Travel English</SelectItem>
                  <SelectItem value="academic">Academic English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Level */}
            <div>
              <Label htmlFor="currentLevel" className="mb-2 block">
                Current Level
              </Label>
              <Select value={currentLevel} onValueChange={(value) => {
                setCurrentLevel(value);
                checkForChanges();
              }}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a1">A1 - Beginner</SelectItem>
                  <SelectItem value="a2">A2 - Elementary</SelectItem>
                  <SelectItem value="b1">B1 - Intermediate</SelectItem>
                  <SelectItem value="b2">B2 - Upper Intermediate</SelectItem>
                  <SelectItem value="c1">C1 - Advanced</SelectItem>
                  <SelectItem value="c2">C2 - Proficient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Security</h3>
              <p className="text-muted-foreground text-sm">Manage your password and account security</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <Button
            onClick={() => setShowPasswordModal(true)}
            variant="outline"
            className="w-full md:w-auto rounded-xl"
          >
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={handleSaveProfile}
            disabled={!hasChanges || isSaving}
            className="flex-1 py-6 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </motion.div>
                Saving Changes...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={!hasChanges || isSaving}
            variant="outline"
            className="flex-1 py-6 rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </Button>
        </motion.div>

        {/* Unsaved Changes Warning */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-orange-800 mb-1">Unsaved Changes</h4>
                  <p className="text-orange-700 text-sm">
                    You have unsaved changes. Don't forget to save before leaving this page.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new secure password
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Current Password */}
            <div>
              <Label htmlFor="currentPassword" className="mb-2 block">
                Current Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (errors.currentPassword) {
                      setErrors({ ...errors, currentPassword: '' });
                    }
                  }}
                  className={`pr-12 rounded-xl ${errors.currentPassword ? 'border-red-500' : ''}`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.currentPassword}
                </motion.p>
              )}
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="newPassword" className="mb-2 block">
                New Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) {
                      setErrors({ ...errors, newPassword: '' });
                    }
                  }}
                  className={`pr-12 rounded-xl ${errors.newPassword ? 'border-red-500' : ''}`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.newPassword}
                </motion.p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Password must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="mb-2 block">
                Confirm New Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  className={`pr-12 rounded-xl ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => {
                setShowPasswordModal(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setErrors({});
              }}
              variant="outline"
              className="flex-1 rounded-xl"
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              className="flex-1 rounded-xl"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <Lock className="w-4 h-4" />
                  </motion.div>
                  Changing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
