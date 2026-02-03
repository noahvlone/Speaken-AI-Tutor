import { useState, useEffect, useRef } from 'react';
import {
  User,
  Globe,
  Target,
  Volume2,
  Palette,
  Settings as SettingsIcon,
  Loader2,
  CheckCircle2,
  Camera,
  X,
  Bell,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import {
  updateProfile,
  UserProfile,
  saveUserSettings,
  getUserSettings,
  UserSettings as DBUserSettings,
  FrontendSettings,
  frontendToDBSettings,
  dbToFrontendSettings
} from '../utils/supabase/client';
import { toast } from 'sonner';

interface SettingsPageProps {
  userProfile: UserProfile | null;
  onProfileUpdate?: (profile: UserProfile) => void;
  onSettingsUpdate?: () => void;
}

export function SettingsPage({ userProfile, onProfileUpdate, onSettingsUpdate }: SettingsPageProps) {
  // Profile state
  const [fullName, setFullName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  // Settings state
  const [settings, setSettings] = useState<FrontendSettings>({
    learningGoal: 'general',
    currentLevel: 'b1',
    dailyGoal: '30',
    accent: 'american',
    voiceSpeed: 'normal',
    dailyReminder: true,
    achievementNotifications: true,
    weeklyReport: false,
    tipsSuggestions: true,
    theme: 'light',
    reduceAnimations: false,
    language: 'id',
  });

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<FrontendSettings | null>(null);
  const [originalName, setOriginalName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs untuk mencegah double execution
  const hasLoadedRef = useRef(false);

  // SINGLE INITIALIZATION EFFECT
  useEffect(() => {
    return () => {
      hasLoadedRef.current = false;
    };
  }, []);

  // Initialize profile data dan load settings
  useEffect(() => {
    if (!userProfile || hasLoadedRef.current) {
      return;
    }

    console.log('🚀 INIT SettingsPage for user:', userProfile.id);
    hasLoadedRef.current = true;

    // Set profile data
    setFullName(userProfile.full_name || '');
    setOriginalName(userProfile.full_name || '');
    if (userProfile.avatar_url && userProfile.avatar_url.startsWith('data:image')) {
      console.log('📸 Skipping base64 avatar from DB to prevent large payload');
      setAvatarPreview('');
    } else if (userProfile.avatar_url) {
      setAvatarPreview(userProfile.avatar_url);
    }

    // Load settings
    const loadSettingsFromDB = async () => {
      console.log('🔍 Loading settings for user:', userProfile.id);
      setIsLoadingSettings(true);
      try {
        const savedSettings = await getUserSettings(userProfile.id);
        const frontendSettings = dbToFrontendSettings(savedSettings);
        console.log('✅ Settings loaded from DB:', frontendSettings);
        setSettings(frontendSettings);
        setOriginalSettings(frontendSettings);
      } catch (error) {
        console.error('❌ Error loading settings:', error);
        if (error instanceof Error && error.message.includes('Network error')) {
          console.log('🌐 Network error, using default settings');
        } else {
          toast.error('Failed to load settings from database');
        }
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettingsFromDB();
  }, [userProfile?.id]);

  // Check for changes
  useEffect(() => {
    if (originalSettings) {
      const settingsChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      const nameChanged = fullName !== originalName;
      setHasChanges(settingsChanged || nameChanged);
    }
  }, [settings, originalSettings, fullName, originalName]);

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const compressImage = (imgFile: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const MAX_WIDTH = 200;
              const MAX_HEIGHT = 200;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;

              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedBase64);
              } else {
                reject(new Error('Could not get canvas context'));
              }
            };
            img.onerror = reject;
            img.src = event.target?.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(imgFile);
        });
      };

      const compressedAvatar = await compressImage(file);
      setAvatarPreview(compressedAvatar);
      setHasChanges(true);
      toast.info('Avatar preview updated. Save changes to update profile.');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to process avatar image');
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setHasChanges(true);
    toast.info('Avatar removed. Save changes to update profile.');
  };

  // Update settings function
  const updateSetting = <K extends keyof FrontendSettings>(key: K, value: FrontendSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save all changes
  const handleSaveAll = async () => {
    if (!hasChanges || !userProfile) {
      toast.info('No changes to save');
      return;
    }

    setIsSaving(true);

    try {
      // Save profile if name changed
      if (fullName !== originalName || avatarPreview) {
        let avatarUrlToSave = avatarPreview;
        if (avatarPreview && avatarPreview.startsWith('data:image') && avatarPreview.length > 100000) {
          toast.warning('Avatar is too large. Please use a smaller image.');
          setIsSaving(false);
          return;
        }

        await updateProfile(fullName, avatarUrlToSave || undefined);

        if (onProfileUpdate) {
          onProfileUpdate({
            ...userProfile,
            full_name: fullName,
            avatar_url: avatarUrlToSave || userProfile.avatar_url,
          });
        }
        setOriginalName(fullName);
      }

      // Save settings
      if (originalSettings && JSON.stringify(settings) !== JSON.stringify(originalSettings)) {
        const dbSettings = frontendToDBSettings(settings);
        await saveUserSettings(dbSettings);
        setOriginalSettings(settings);

        if (onSettingsUpdate) {
          onSettingsUpdate();
        }
      }

      setHasChanges(false);
      toast.success('Settings saved successfully! ✅');
    } catch (error) {
      console.error('❌ Save error:', error);
      if (error instanceof Error && error.message.includes('Network error')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to save');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (originalSettings) {
      setSettings(originalSettings);
    }
    setFullName(originalName);
    if (userProfile?.avatar_url) {
      setAvatarPreview(userProfile.avatar_url);
    } else {
      setAvatarPreview('');
    }
    setHasChanges(false);
    toast.info('Changes discarded');
  };

  // Loading state
  if (!userProfile || isLoadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/30">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <SettingsIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Account Settings</h1>
              <p className="text-muted-foreground">Manage your profile and learning preferences</p>
            </div>
          </div>
        </div>

        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <h3 className="text-lg font-semibold mb-6">Profile Picture</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                <AvatarImage 
                  src={avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName || userProfile.email}`} 
                  alt="Profile" 
                />
                <AvatarFallback className="text-2xl">
                  {fullName.split(' ').map(n => n[0]).join('') || userProfile.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploadingAvatar}
              />
              
              {avatarPreview && (
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h4 className="font-medium mb-2">Upload your photo</h4>
              <p className="text-muted-foreground text-sm mb-4">
                JPG, PNG or GIF. Max size 2MB.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  onClick={handleAvatarClick}
                  variant="outline"
                  className="rounded-xl"
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Choose Image'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    const randomSeed = Math.random().toString(36).substring(7);
                    setAvatarPreview(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
                    setHasChanges(true);
                    toast.info('Avatar updated. Save changes to update profile.');
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  Generate Random
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName" className="mb-2 block">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-12 rounded-xl"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                disabled
                className="rounded-xl bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-2">Email cannot be changed</p>
            </div>
          </div>
        </motion.div>

        {/* Learning Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Learning Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="learningGoal" className="mb-2 block">Learning Goal</Label>
              <Select
                value={settings.learningGoal}
                onValueChange={(value: string) => updateSetting('learningGoal', value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General English</SelectItem>
                  <SelectItem value="toefl">TOEFL Preparation</SelectItem>
                  <SelectItem value="ielts">IELTS Academic</SelectItem>
                  <SelectItem value="business">Business Communication</SelectItem>
                  <SelectItem value="travel">Travel & Lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentLevel" className="mb-2 block">Proficiency Level</Label>
              <Select
                value={settings.currentLevel}
                onValueChange={(value: string) => updateSetting('currentLevel', value)}
              >
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

            <div>
              <Label htmlFor="dailyGoal" className="mb-2 block">Daily Practice Time</Label>
              <Select
                value={settings.dailyGoal}
                onValueChange={(value: string) => updateSetting('dailyGoal', value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Casual - 15 min/day</SelectItem>
                  <SelectItem value="30">Regular - 30 min/day</SelectItem>
                  <SelectItem value="45">Serious - 45 min/day</SelectItem>
                  <SelectItem value="60">Intensive - 1 hour/day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Voice Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Volume2 className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold">Voice Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="accent" className="mb-2 block">Accent Preference</Label>
              <Select
                value={settings.accent}
                onValueChange={(value: string) => updateSetting('accent', value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="american">American English</SelectItem>
                  <SelectItem value="british">British English</SelectItem>
                  <SelectItem value="australian">Australian English</SelectItem>
                  <SelectItem value="neutral">Neutral Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="voiceSpeed" className="mb-2 block">Speech Speed</Label>
              <Select
                value={settings.voiceSpeed}
                onValueChange={(value: string) => updateSetting('voiceSpeed', value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow - Easy to follow</SelectItem>
                  <SelectItem value="normal">Normal - Natural pace</SelectItem>
                  <SelectItem value="fast">Fast - Native speed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-100 rounded-xl">
              <Bell className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <Label className="font-medium">Daily Reminder</Label>
                <p className="text-muted-foreground text-sm">Get reminded to practice daily</p>
              </div>
              <Switch
                checked={settings.dailyReminder}
                onCheckedChange={(checked: boolean) => updateSetting('dailyReminder', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <Label className="font-medium">Achievement Notifications</Label>
                <p className="text-muted-foreground text-sm">Celebrate learning milestones</p>
              </div>
              <Switch
                checked={settings.achievementNotifications}
                onCheckedChange={(checked: boolean) => updateSetting('achievementNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <Label className="font-medium">Weekly Report</Label>
                <p className="text-muted-foreground text-sm">Receive weekly progress summary</p>
              </div>
              <Switch
                checked={settings.weeklyReport}
                onCheckedChange={(checked: boolean) => updateSetting('weeklyReport', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <Label className="font-medium">Tips & Suggestions</Label>
                <p className="text-muted-foreground text-sm">Get personalized learning tips</p>
              </div>
              <Switch
                checked={settings.tipsSuggestions}
                onCheckedChange={(checked: boolean) => updateSetting('tipsSuggestions', checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Palette className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold">Appearance</h3>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="mb-3 block">Theme Mode</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateSetting('theme', 'light')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    settings.theme === 'light'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="w-full aspect-video bg-white rounded-lg border shadow-sm p-2 space-y-1.5">
                    <div className="h-1.5 w-3/4 bg-muted rounded-full" />
                    <div className="h-1.5 w-1/2 bg-muted rounded-full" />
                  </div>
                  <span className={`text-sm font-medium ${settings.theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`}>
                    Light Mode
                  </span>
                </button>
                <button
                  onClick={() => updateSetting('theme', 'dark')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    settings.theme === 'dark'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="w-full aspect-video bg-slate-900 rounded-lg border border-slate-700 shadow-sm p-2 space-y-1.5">
                    <div className="h-1.5 w-3/4 bg-slate-700 rounded-full" />
                    <div className="h-1.5 w-1/2 bg-slate-700 rounded-full" />
                  </div>
                  <span className={`text-sm font-medium ${settings.theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`}>
                    Dark Mode
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <Label className="font-medium">Reduce Animations</Label>
                <p className="text-muted-foreground text-sm">Improve performance on older devices</p>
              </div>
              <Switch
                checked={settings.reduceAnimations}
                onCheckedChange={(checked: boolean) => updateSetting('reduceAnimations', checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* Language Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-md p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Globe className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold">Language</h3>
          </div>

          <div>
            <Label htmlFor="language" className="mb-2 block">Interface Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value: string) => updateSetting('language', value)}
            >
              <SelectTrigger className="rounded-xl max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                <SelectItem value="en">🇺🇸 English (US)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-sm mt-3">
              💡 This only changes the app's interface language. Your learning target language is always English.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={handleSaveAll}
            disabled={!hasChanges || isSaving}
            className="flex-1 py-6 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
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
                  <h4 className="text-orange-800 font-medium mb-1">Unsaved Changes</h4>
                  <p className="text-orange-700 text-sm">
                    You have unsaved changes. Don't forget to save before leaving this page.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SettingsPage;