import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["😢", "😕", "😐", "🙂", "😊"];
const MOOD_LABELS = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];

export function MoodTracker() {
  const [mood, setMood] = useState(2);
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: saveMood, isPending } = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/mood", {
        userId: 1, // Using default user ID
        mood,
        note,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
      toast({
        title: "Mood saved",
        description: "Your mood has been recorded successfully."
      });
      setNote("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save mood entry",
        variant: "destructive"
      });
    }
  });

  return (
    <Card className="glass-card glass-card-hover p-8">
      <motion.h2 
        className="text-3xl font-bold mb-8 text-center gradient-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        How are you feeling today?
      </motion.h2>

      <AnimatePresence mode="wait">
        <motion.div 
          key={mood}
          className="relative flex flex-col items-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-7xl mb-4">{EMOJIS[mood]}</div>
          <div className="text-xl text-purple-200/90">{MOOD_LABELS[mood]}</div>
        </motion.div>
      </AnimatePresence>

      <div className="space-y-6">
        <div className="px-4">
          <Slider
            value={[mood]}
            onValueChange={([value]) => setMood(value)}
            max={4}
            step={1}
            className="mb-8"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Textarea
            placeholder="Add a note about your mood... (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px] bg-white/5 border-white/20 placeholder:text-white/40 focus:border-purple-400/50 transition-colors"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            onClick={() => saveMood()}
            disabled={isPending}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isPending ? "Saving..." : "Save Mood"}
          </Button>
        </motion.div>
      </div>
    </Card>
  );
}