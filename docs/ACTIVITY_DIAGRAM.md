# 📊 SpeakenAI Tutor - Activity Diagrams

This document contains activity diagrams for the key features of the SpeakenAI Tutor application, represented using Mermaid syntax.

---

## 🚀 1. Main System Flow
This diagram illustrates the high-level flow from authentication to selecting different features.

```mermaid
activityDiagram
|User|
start
:Access SpeakenAI;
if (Authenticated?) then (no)
  :Register / Login;
  if (Success?) then (no)
    stop
  else (yes)
  endif
else (yes)
endif

:View Dashboard;
fork
  :Select AI Roleplay;
  :Choose Avatar;
  :Start Session;
  :Practice Speaking;
  :View Evaluation;
fork again
  :Select Text Chat;
  :Choose/Create Session;
  :Chat with AI Agent;
fork again
  :Select Daily Challenge;
  :Submit Answer;
  :Get Feedback;
fork again
  :View Progress & Stats;
  :Check Leaderboard;
end fork
:Logout;
stop
```

---

## 🎭 2. AI Roleplay Session (Voice)
This diagram details the interaction during a voice-based practice session with the AI Avatar.

```mermaid
activityDiagram
|User|
start
:Enter Roleplay Page;
:Select Scenario & Avatar;
:Click "Start Session";

|System|
:Initialize WebRTC;
:Obtain HeyGen Token;
:Avatar Ready;

repeat
  |User|
  :Speak into Microphone;
  
  |System|
  :Speech-to-Text (STT);
  :Send Text to OpenRouter (LLM);
  :Generate AI Response;
  :Text-to-Speech (TTS);
  :Lip-sync & Animate Avatar;
  
  |User|
  :Hear Response & See Avatar;
backward:Continue practice;
repeat while (User clicks "End Session"?) is (no)

|System|
:Calculate Metrics (Fluency, Grammar, Pronunciation);
:Save Session to Database;
:Generate Result Summary;

|User|
:Review Performance Feedback;
stop
```

---

## 🏆 3. Daily Challenge Flow
This diagram shows the gamified experience of completing daily challenges.

```mermaid
activityDiagram
|User|
start
:Open Daily Challenge Page;

|System|
:Fetch Today's Challenge from DB;

|User|
:Read Question/Prompt;
:Select Answer or Type Response;
:Click "Submit";

|System|
:Validate Answer;
if (Correct?) then (yes)
  :Award XP Points;
  :Update User Streak;
  :Show Success Animation;
else (no)
  :Show Correct Answer;
  :Provide Detailed Explanation;
endif

:Update Leaderboard;
:Return to Dashboard;
stop
```
