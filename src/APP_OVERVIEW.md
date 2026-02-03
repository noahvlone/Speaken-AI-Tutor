# Speaken.AI - Application Overview

## 🎯 Tentang Aplikasi

**Speaken.AI** adalah aplikasi pembelajaran bahasa Inggris berbasis AI dengan fokus pada interaksi, pronunciation, dan fluency. Aplikasi ini menggunakan desain minimalis futuristik dengan glassmorphism style, rounded corners, dan shadow lembut.

## 🎨 Design System

### Warna Utama
- **Primary Blue**: `#3B82F6` - Warna utama untuk tombol dan elemen interaktif
- **Purple**: `#9333EA` - Aksen untuk gradient dan highlight
- **Gradient**: Blue to Purple untuk branding logo dan elemen premium

### Skema Warna Evaluasi
- 🟢 **Hijau**: Untuk hasil baik/correct
- 🟠 **Oranye**: Untuk area yang butuh perbaikan
- 🔴 **Merah**: Untuk kesalahan besar

### Style Guidelines
- **Rounded Corners**: `rounded-xl` (12px) dan `rounded-3xl` (24px)
- **Shadows**: `shadow-md` untuk cards, `shadow-lg` untuk elevated elements
- **Glassmorphism**: `backdrop-blur-xl` dengan `bg-white/40`
- **Padding**: Luas dan responsif (p-6 hingga p-12)
- **Font**: System default dengan weight medium (500) untuk headings

## 📱 Struktur Halaman

### 1. Authentication Pages

#### Login Page (`/components/LoginPage.tsx`)
- Logo Speaken.AI dengan gradient
- Form login dengan email & password
- Social login (Google, GitHub)
- Remember me checkbox
- Link ke Register page
- 3D Avatar mascot di sisi kanan (desktop)

#### Register Page (`/components/RegisterPage.tsx`)
- Logo Speaken.AI dengan gradient
- Form registrasi (Full Name, Email, Password, Confirm Password)
- Checkbox Terms & Conditions
- Link ke Login page
- 3D Avatar mascot di sisi kanan (desktop)

#### Onboarding Page (`/components/OnboardingPage.tsx`)
- Tutorial untuk first-time users
- Penjelasan fitur Chat Mode & Roleplay Mode
- Skip dan Start Learning buttons

### 2. Main Application Pages

#### Home Page (`/components/HomePage.tsx`)
**Features:**
- Welcome banner dengan stats (Current Streak, Learning Time, Level)
- 2 Learning Mode cards:
  - **Chat Mode**: Grammar correction & suggestions
  - **Roleplay Mode**: Pronunciation & fluency analysis
- Daily Challenge card
- Features highlight section

#### Chat Page (`/components/ChatPage.tsx`)
**Features:**
- Chat interface dengan AI assistant
- Real-time grammar correction
- Highlight kesalahan dengan warna:
  - Merah: Grammar errors
  - Oranye: Spelling errors
  - Biru: Style suggestions
- Suggestion popover on click
- Input box dengan send button

#### Roleplay Page (`/components/RoleplayPage.tsx`)
**Features:**
- 3D video call interface dengan AI tutor
- Real-time pronunciation & fluency evaluation
- Live transcript dengan Speech-to-Text
- Evaluation panel dengan:
  - Overall score (0-100)
  - Individual metrics (Pronunciation, Fluency, Accuracy, Completeness)
  - Detailed phoneme feedback
- Start/Stop session buttons
- "View Result Summary" button

#### Progress Page (`/components/ProgressPage.tsx`)
**Features:**
- Overall progress stats
- Charts untuk:
  - Weekly progress (Line chart)
  - Skills breakdown (Bar chart)
  - Learning time distribution (Pie chart)
- Common mistakes identification
- Improvement trends
- Achievement badges

#### Daily Challenge Page (`/components/DailyChallengePage.tsx`)
**Features:**
- 5 questions quiz format
- Timer (5 minutes)
- Multiple choice questions
- Categories: Grammar, Vocabulary, Idioms
- Instant feedback dengan explanation
- Score tracking
- Retry option

#### Profile Page (`/components/ProfilePage.tsx`)
**Features:**
- Avatar upload dengan preview
- Personal information (Full Name, Email, Phone, Location)
- Bio section
- Date of Birth
- Learning preferences (Goal, Current Level)
- Change password modal
- Save/Cancel dengan unsaved changes warning
- Toast notifications untuk success/error
- Form validation

#### Settings Page (`/components/SettingsPage.tsx`)
**Features:**
- Profile information editing
- Learning preferences
- Notifications settings
- Language & region
- Audio settings
- Theme customization
- Save Changes button

#### Result Summary Page (`/components/ResultSummaryPage.tsx`)
**Features:**
- Overall score dengan visual rating
- Individual metrics breakdown
- Full speech transcript
- AI recommendations
- Try Again & Save Result buttons
- Success modal after saving

### 3. Additional Components

#### Navigation (`/components/Navigation.tsx`)
**Desktop:**
- Top bar dengan:
  - Logo Speaken.AI (clickable ke Home)
  - User name (clickable ke Profile)
  - Settings button
  - Logout button
- Main navigation: Home, Chat, Roleplay, Progress, Challenge

**Mobile:**
- Bottom navigation bar dengan:
  - Home, Chat, Roleplay, Progress, Challenge
  - Profile, Settings, Logout
  - Icons + Labels untuk semua items

#### Additional UI Components
- `AIMotivation.tsx` - Motivational messages dari AI
- `AIStatusIndicator.tsx` - Real-time AI status
- `Avatar3D.tsx` - 3D avatar untuk roleplay
- `Avatar3DMascot.tsx` - 3D mascot untuk auth pages
- `ChatMessage.tsx` - Chat bubble component
- `EvaluationPanel.tsx` - Pronunciation evaluation display
- `GrammarHighlight.tsx` - Grammar error highlighting
- `LiveTranscript.tsx` - Real-time speech transcript
- `VoiceButton.tsx` - Voice recording button
- `Leaderboard.tsx` - Competitive leaderboard
- `LoadingScreen.tsx` - Loading state dengan branding
- `LogoutModal.tsx` - Confirmation modal untuk logout
- `NotFoundPage.tsx` - 404 error page

## 🎯 Fitur Utama

### 1. Chat Mode
- ✅ Real-time grammar correction
- ✅ Vocabulary enhancement suggestions
- ✅ Error highlighting dengan warna
- ✅ Instant feedback
- ✅ Conversation history

### 2. Roleplay Mode
- ✅ 3D video call interface
- ✅ Speech-to-Text real-time
- ✅ Pronunciation scoring (SpeechAce-style)
- ✅ Fluency analysis
- ✅ Detailed phoneme feedback
- ✅ Speech replay & comparison
- ✅ Session recording

### 3. Progress Tracking
- ✅ Weekly/monthly charts
- ✅ Skills breakdown
- ✅ Learning time analytics
- ✅ Common mistakes identification
- ✅ Improvement trends
- ✅ Achievement system

### 4. Gamification
- ✅ Daily challenges
- ✅ Streak tracking
- ✅ Leaderboard
- ✅ Achievement badges
- ✅ Points system

## 🔧 Technical Stack

### Core Libraries
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Icons
- **Recharts** - Charts & graphs
- **Sonner** - Toast notifications

### UI Components (Shadcn/ui)
- Alert, Avatar, Badge, Button, Card
- Checkbox, Dialog, Input, Label
- Progress, Select, Switch, Tabs
- Textarea, Tooltip, dan banyak lagi

## 📂 File Structure

```
/
├── App.tsx                          # Main application
├── components/
│   ├── HomePage.tsx                 # Landing page
│   ├── ChatPage.tsx                 # Chat mode
│   ├── RoleplayPage.tsx             # Roleplay mode
│   ├── ProgressPage.tsx             # Progress dashboard
│   ├── DailyChallengePage.tsx       # Daily quiz
│   ├── ProfilePage.tsx              # User profile
│   ├── SettingsPage.tsx             # App settings
│   ├── ResultSummaryPage.tsx        # Session results
│   ├── LoginPage.tsx                # Authentication
│   ├── RegisterPage.tsx             # Registration
│   ├── OnboardingPage.tsx           # First-time tutorial
│   ├── Navigation.tsx               # Navigation system
│   ├── LoadingScreen.tsx            # Loading state
│   ├── LogoutModal.tsx              # Logout confirmation
│   ├── NotFoundPage.tsx             # 404 page
│   ├── [Other components]           # Supporting components
│   └── ui/                          # Shadcn/ui components
├── styles/
│   └── globals.css                  # Global styles & theme
└── [Documentation files]
```

## 🎨 Responsive Design

### Desktop (≥768px)
- Top navigation bar dengan logo dan user menu
- Main horizontal navigation
- Two-column layouts untuk forms
- Sidebar untuk additional content
- Full charts and visualizations

### Mobile (<768px)
- Bottom navigation bar
- Single-column layouts
- Compact cards
- Touch-friendly buttons (min 44px)
- Vertical labels untuk navigation items
- Responsive typography

## ✨ UX Features

### Feedback Visual
- ✅ Hover effects pada semua interactive elements
- ✅ Active states untuk navigation
- ✅ Loading states dengan skeleton/spinner
- ✅ Toast notifications untuk actions
- ✅ Modal confirmations untuk destructive actions
- ✅ Form validation dengan error messages
- ✅ Success animations

### Accessibility
- ✅ Semantic HTML
- ✅ Keyboard navigation support
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Readable font sizes
- ✅ High contrast ratios

## 🚀 Next Steps & Recommendations

1. **Backend Integration**
   - Connect to real AI API for grammar & pronunciation
   - User authentication system
   - Database untuk progress tracking
   - Cloud storage untuk audio recordings

2. **Advanced Features**
   - Voice recognition improvement
   - Multiple AI tutor personalities
   - Custom learning paths
   - Social features (share progress, compete)
   - Certificate generation

3. **Performance**
   - Code splitting
   - Image optimization
   - Caching strategies
   - PWA implementation

4. **Analytics**
   - User behavior tracking
   - Learning effectiveness metrics
   - A/B testing untuk features

## 📝 Notes

- Aplikasi ini adalah frontend-only prototype
- Mock data digunakan untuk demonstrasi
- API calls perlu diimplementasikan untuk production
- Form submissions saat ini hanya simulation
- Audio/video features memerlukan real implementation

---

**Last Updated**: November 2, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready (Frontend)
