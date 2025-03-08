import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Calendar, Medal, Trophy, Star, CheckCircle2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Habit, HabitLog, Reward } from "@shared/schema";

export function HabitTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: habits } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
    queryFn: async () => {
      const response = await fetch("/api/habits");
      return response.json();
    }
  });

  const { data: rewards } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
    queryFn: async () => {
      const response = await fetch("/api/rewards");
      return response.json();
    }
  });

  const { mutate: completeHabit } = useMutation({
    mutationFn: async (habitId: number) => {
      await apiRequest("POST", "/api/habit-logs", {
        habitId,
        userId: 1, // Using default user ID
        completedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      toast({
        title: "Habit completed!",
        description: "Keep up the great work!",
      });
    },
  });

  const calculateProgress = (habit: Habit) => {
    // In a real app, this would calculate based on habitLogs
    return (habit.currentStreak / habit.targetFrequency) * 100;
  };

  return (
    <div className="space-y-8">
      <motion.div 
        className="grid gap-6 md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {habits?.map((habit) => (
          <Card key={habit.id} className="p-6 glass-card glass-card-hover">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold gradient-text">{habit.name}</h3>
                <p className="text-sm text-purple-200/80">{habit.description}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => completeHabit(habit.id)}
                className="h-10 w-10"
              >
                <CheckCircle2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <Progress value={calculateProgress(habit)} />
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Medal className="h-4 w-4" />
                  <span>Current Streak: {habit.currentStreak}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Best Streak: {habit.bestStreak}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {rewards && rewards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 gradient-text">Your Achievements</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {rewards.map((reward) => (
              <Card key={reward.id} className="p-4 glass-card">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{reward.name}</h3>
                    <p className="text-sm text-purple-200/80">{reward.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
