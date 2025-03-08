import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Star,
  Heart,
  Flame,
  Brain,
  Book,
  Music,
  type LucideIcon,
} from "lucide-react";

interface Achievement {
  id: number;
  type: string;
  level: number;
  progress: number;
  targetValue: number;
  completedAt: string | null;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: string;
  earned?: boolean;
  earnedAt?: string;
}

const iconMap: Record<string, LucideIcon> = {
  trophy: Trophy,
  medal: Medal,
  star: Star,
  heart: Heart,
  flame: Flame,
  brain: Brain,
  book: Book,
  music: Music,
};

export function Achievements() {
  const [activeTab, setActiveTab] = useState("progress");

  const { data: achievements, isLoading: loadingAchievements } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const { data: badges, isLoading: loadingBadges } = useQuery({
    queryKey: ["/api/badges"],
  });

  if (loadingAchievements || loadingBadges) {
    return <div>Loading achievements...</div>;
  }

  return (
    <Card className="p-6 glass-card glass-card-hover">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold gradient-text">
          Achievements & Badges
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4 mt-4">
            {achievements?.map((achievement: Achievement) => (
              <div key={achievement.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {achievement.type} - Level {achievement.level}
                  </span>
                  <span className="text-sm opacity-80">
                    {achievement.progress} / {achievement.targetValue}
                  </span>
                </div>
                <Progress
                  value={(achievement.progress / achievement.targetValue) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="badges" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges?.map((badge: Badge) => {
                const Icon = iconMap[badge.icon.toLowerCase()] || Star;
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg border ${
                      badge.earned
                        ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <Icon
                        className={`w-8 h-8 ${
                          badge.earned ? "text-purple-400" : "text-gray-400"
                        }`}
                      />
                      <h3 className="font-medium">{badge.name}</h3>
                      <p className="text-sm opacity-80">{badge.description}</p>
                      {badge.earned && (
                        <Badge variant="outline" className="mt-2">
                          Earned{" "}
                          {new Date(badge.earnedAt!).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Card>
  );
}
