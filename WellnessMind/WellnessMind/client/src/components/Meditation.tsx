import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Square, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ExerciseType = "timer" | "box" | "478";

interface Exercise {
  name: string;
  description: string;
  duration: number;
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    postHold?: number;
  };
}

const EXERCISES: Record<ExerciseType, Exercise> = {
  timer: {
    name: "Simple Timer",
    description: "A basic meditation timer",
    duration: 300,
    pattern: { inhale: 4, exhale: 4 }
  },
  box: {
    name: "Box Breathing",
    description: "Equal duration for inhale, hold, exhale, and post-hold",
    duration: 240,
    pattern: { inhale: 4, hold: 4, exhale: 4, postHold: 4 }
  },
  "478": {
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    duration: 300,
    pattern: { inhale: 4, hold: 7, exhale: 8 }
  }
};

export function Meditation() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>("timer");
  const [time, setTime] = useState(EXERCISES[selectedExercise].duration);
  const [progress, setProgress] = useState(100);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "post-hold">("inhale");
  const [phaseProgress, setPhaseProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
        setProgress((prev) => (prev - (100 / EXERCISES[selectedExercise].duration)));

        // Update breathing phase
        const pattern = EXERCISES[selectedExercise].pattern;
        const totalCycleTime = pattern.inhale + (pattern.hold || 0) + pattern.exhale + (pattern.postHold || 0);
        const currentTime = time % totalCycleTime;

        if (currentTime <= pattern.inhale) {
          setBreathPhase("inhale");
          setPhaseProgress((currentTime / pattern.inhale) * 100);
        } else if (pattern.hold && currentTime <= pattern.inhale + pattern.hold) {
          setBreathPhase("hold");
          setPhaseProgress(((currentTime - pattern.inhale) / pattern.hold) * 100);
        } else if (currentTime <= pattern.inhale + (pattern.hold || 0) + pattern.exhale) {
          setBreathPhase("exhale");
          setPhaseProgress(((currentTime - pattern.inhale - (pattern.hold || 0)) / pattern.exhale) * 100);
        } else if (pattern.postHold) {
          setBreathPhase("post-hold");
          setPhaseProgress(((currentTime - pattern.inhale - (pattern.hold || 0) - pattern.exhale) / pattern.postHold) * 100);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time, selectedExercise]);

  const reset = () => {
    setIsRunning(false);
    setTime(EXERCISES[selectedExercise].duration);
    setProgress(100);
    setBreathPhase("inhale");
    setPhaseProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <Card className="p-8 glass-card glass-card-hover">
          <h2 className="text-3xl font-semibold mb-6 text-center gradient-text">
            Meditation & Breathing
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {(Object.keys(EXERCISES) as ExerciseType[]).map((type) => (
              <Button
                key={type}
                variant={selectedExercise === type ? "default" : "outline"}
                className={`w-full ${
                  selectedExercise === type 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : ''
                }`}
                onClick={() => {
                  setSelectedExercise(type);
                  reset();
                }}
              >
                {EXERCISES[type].name}
              </Button>
            ))}
          </div>

          <p className="text-purple-200/80 text-center mb-8">
            {EXERCISES[selectedExercise].description}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={breathPhase}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative flex justify-center mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: breathPhase === "inhale" ? 1.5 : 1,
                    opacity: breathPhase === "hold" ? 0.7 : 1
                  }}
                  transition={{ duration: 2 }}
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                >
                  <span className="text-white text-lg capitalize">{breathPhase}</span>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="text-4xl font-mono text-center mb-6">
            {formatTime(time)}
          </div>

          <Progress value={progress} className="mb-6" />

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsRunning(!isRunning)}
              className="w-12 h-12"
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={reset}
              className="w-12 h-12"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}