import { useState } from 'react';
import { User, Bell, Globe, Target, Volume2, Palette, Settings as SettingsIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { updateProfile, UserProfile } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface SettingsPageProps {
  userProfile: UserProfile | null;
}

export function SettingsPage({ userProfile }: SettingsPageProps) {
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleNameChange = (value: string) => {
    setFullName(value);
    setHasChanges(value !== userProfile?.full_name);
  };

  const handleSaveProfile = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await updateProfile(fullName);
      toast.success('✅ Profile updated successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 p-6 pb-24 md:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1>Settings</h1>
          </div>
          <p className="text-muted-foreground">Customize your learning experience</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h3>Profile</h3>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.full_name || 'User'}`} />
                <AvatarFallback>
                  {userProfile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4>{userProfile?.full_name || 'User'}</h4>
                <p className="text-muted-foreground">{userProfile?.email || 'user@example.com'}</p>
              </div>
              {hasChanges && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                  Unsaved changes
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Full Name</Label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Your full name"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="mb-2 block">Email</Label>
                <Input
                  type="email"
                  value={userProfile?.email || ''}
                  disabled
                  className="rounded-xl bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
            </div>
            
            {hasChanges && (
              <div className="mt-4 pt-4 border-t">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full md:w-auto rounded-xl"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Save Profile Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          {/* Learning Preferences */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3>Learning Preferences</h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Learning Goal</Label>
                <Select defaultValue="general">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General English</SelectItem>
                    <SelectItem value="toefl">TOEFL Preparation</SelectItem>
                    <SelectItem value="ielts">IELTS Preparation</SelectItem>
                    <SelectItem value="business">Business English</SelectItem>
                    <SelectItem value="travel">Travel English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Current Level</Label>
                <Select defaultValue="b1">
                  <SelectTrigger className="w-full rounded-xl">
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
                <Label className="mb-2 block">Daily Goal (minutes)</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Voice & Accent */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-5 h-5 text-primary" />
              <h3>Voice & Accent</h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Preferred Accent</Label>
                <Select defaultValue="american">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="american">American English</SelectItem>
                    <SelectItem value="british">British English</SelectItem>
                    <SelectItem value="australian">Australian English</SelectItem>
                    <SelectItem value="canadian">Canadian English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">AI Voice Speed</Label>
                <Select defaultValue="normal">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (0.75x)</SelectItem>
                    <SelectItem value="normal">Normal (1.0x)</SelectItem>
                    <SelectItem value="fast">Fast (1.25x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h3>Notifications</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <Label>Daily Reminder</Label>
                  <p className="text-sm text-muted-foreground">Get reminded to practice daily</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <Label>Achievement Notifications</Label>
                  <p className="text-sm text-muted-foreground">Celebrate your milestones</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <Label>Weekly Progress Report</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly learning summary</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <Label>Tips & Suggestions</Label>
                  <p className="text-sm text-muted-foreground">Get personalized learning tips</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-5 h-5 text-primary" />
              <h3>Appearance</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <Label>Reduce Animations</Label>
                  <p className="text-sm text-muted-foreground">Minimize motion effects</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Language */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-primary" />
              <h3>Language</h3>
            </div>

            <div>
              <Label className="mb-2 block">Interface Language</Label>
              <Select defaultValue="id">
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button className="flex-1 py-6 rounded-xl shadow-md hover:shadow-lg">
              Save Changes
            </Button>
            <Button variant="outline" className="px-6 py-6 rounded-xl">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
