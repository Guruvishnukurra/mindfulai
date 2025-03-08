import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Clock, Sun, Moon, Coffee, BookOpen, Brain, Heart } from "lucide-react";
import type { MoodEntry, Habit } from "@shared/schema";

interface Activity {
  name: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  timeOfDay: "morning" | "afternoon" | "evening";
}

export function SelfCarePlanner() {
  const { toast } = useToast();
  const [recommendedActivities, setRecommendedActivities] = useState<Activity[]>([]);

  // Fetch user's mood and habit data
  const { data: moodData } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood"],
    queryFn: async () => {
      const response = await fetch("/api/mood");
      return response.json();
    }
  });

  const { data: habits } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
    queryFn: async () => {
      const response = await fetch("/api/habits");
      return response.json();
    }
  });

  useEffect(() => {
    if (moodData && habits) {
      // Get latest mood
      const latestMood = moodData[moodData.length - 1]?.mood || 2;
      
      // Generate personalized recommendations based on mood and habits
      const activities: Activity[] = [];
      
      // Morning activities
      activities.push({
        name: "Morning Meditation",
        description: "Start your day with a calm mind",
        duration: "10 minutes",
        icon: <Sun className="w-6 h-6" />,
        timeOfDay: "morning"
      });

      // Add journaling if mood is low
      if (latestMood < 2) {
        activities.push({
          name: "Reflective Journaling",
          description: "Express your thoughts and feelings",
          duration: "15 minutes",
          icon: <BookOpen className="w-6 h-6" />,
          timeOfDay: "morning"
        });
      }

      // Afternoon activities
      activities.push({
        name: "Mindful Break",
        description: "Take a moment to center yourself",
        duration: "5 minutes",
        icon: <Brain className="w-6 h-6" />,
        timeOfDay: "afternoon"
      });

      // Evening activities
      activities.push({
        name: "Gratitude Practice",
        description: "Reflect on positive moments",
        duration: "10 minutes",
        icon: <Heart className="w-6 h-6" />,
        timeOfDay: "evening"
      });

      setRecommendedActivities(activities);
    }
  }, [moodData, habits]);

  return (
    <Card className="glass-card glass-card-hover p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold gradient-text">Your Daily Self-Care Plan</h2>
        
        <div className="space-y-6">
          {["morning", "afternoon", "evening"].map((timeOfDay) => (
            <div key={timeOfDay} className="space-y-4">
              <h3 className="text-xl font-medium capitalize flex items-center gap-2">
                {timeOfDay === "morning" && <Sun className="w-5 h-5" />}
                {timeOfDay === "afternoon" && <Coffee className="w-5 h-5" />}
                {timeOfDay === "evening" && <Moon className="w-5 h-5" />}
                {timeOfDay}
              </h3>
              
              <div className="grid gap-4">
                {recommendedActivities
                  .filter((activity) => activity.timeOfDay === timeOfDay)
                  .map((activity, index) => (
                    <motion.div
                      key={activity.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.name}</h4>
                        <p className="text-sm text-purple-200/80">{activity.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-200/80">
                        <Clock className="w-4 h-4" />
                        {activity.duration}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Card>
  );
}
