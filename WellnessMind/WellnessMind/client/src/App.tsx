import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/home";
import { Journal } from "@/components/Journal";
import { Chat } from "@/components/Chat";
import { Meditation } from "@/components/Meditation";
import { Analytics } from "@/components/Analytics";
import { SoundscapeGenerator } from "@/components/SoundscapeGenerator";
import { EmotionalGames } from "@/components/EmotionalGames";
import { Achievements } from "@/components/Achievements";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/journal" component={Journal} />
      <Route path="/chat" component={Chat} />
      <Route path="/meditation" component={Meditation} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/soundscape" component={SoundscapeGenerator} />
      <Route path="/games" component={EmotionalGames} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/emergency" component={EmergencyContacts} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Navbar />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;