import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Smile, Brain, Book, Heart, ArrowRight, Star } from "lucide-react";

interface Scenario {
  id: number;
  situation: string;
  emotions: string[];
  correctAnswer: string;
  explanation: string;
}

interface EmotionCard {
  emotion: string;
  description: string;
  example: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: "Your friend just received some bad news and is crying.",
    emotions: ["Excited", "Empathetic", "Annoyed", "Amused"],
    correctAnswer: "Empathetic",
    explanation: "Being empathetic shows emotional understanding and support when someone is distressed."
  },
  {
    id: 2,
    situation: "A colleague takes credit for your work during a meeting.",
    emotions: ["Furious", "Indifferent", "Understanding", "Grateful"],
    correctAnswer: "Understanding",
    explanation: "While frustration is natural, understanding the situation calmly allows for better conflict resolution."
  },
  // Add more scenarios as needed
];

const EMOTION_CARDS: EmotionCard[] = [
  {
    emotion: "Contentment",
    description: "A state of peaceful satisfaction",
    example: "Relaxing in a garden on a sunny day"
  },
  {
    emotion: "Anticipation",
    description: "Excitement about future events",
    example: "Looking forward to meeting an old friend"
  },
  // Add more emotion cards
];

export function EmotionalGames() {
  const { toast } = useToast();
  const [gameType, setGameType] = useState<"scenarios" | "vocabulary" | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  const handleAnswerSelection = (selectedEmotion: string) => {
    const isCorrect = selectedEmotion === SCENARIOS[currentScenario].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct! 🎉",
        description: "Great emotional intelligence!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Let's learn why...",
        variant: "destructive",
      });
    }
    
    setShowExplanation(true);
  };

  const nextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setShowExplanation(false);
    } else {
      toast({
        title: "Game Complete!",
        description: `You scored ${score} out of ${SCENARIOS.length}`,
      });
      setGameType(null);
      setCurrentScenario(0);
      setScore(0);
    }
  };

  const nextCard = () => {
    if (cardIndex < EMOTION_CARDS.length - 1) {
      setCardIndex(prev => prev + 1);
    } else {
      setCardIndex(0);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Card className="p-6 glass-card glass-card-hover">
          <h2 className="text-2xl font-semibold mb-6 gradient-text text-center">
            Emotional Intelligence Games
          </h2>

          {!gameType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                className="p-6 h-auto flex flex-col items-center gap-3"
                onClick={() => setGameType("scenarios")}
              >
                <Heart className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Empathy Scenarios</h3>
                  <p className="text-sm opacity-90">Practice emotional responses</p>
                </div>
              </Button>

              <Button
                className="p-6 h-auto flex flex-col items-center gap-3"
                onClick={() => setGameType("vocabulary")}
              >
                <Book className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Emotion Vocabulary</h3>
                  <p className="text-sm opacity-90">Learn emotional expressions</p>
                </div>
              </Button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {gameType === "scenarios" && (
              <motion.div
                key="scenarios"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="mb-4">
                  <p className="text-lg mb-4">{SCENARIOS[currentScenario].situation}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {SCENARIOS[currentScenario].emotions.map((emotion) => (
                      <Button
                        key={emotion}
                        onClick={() => handleAnswerSelection(emotion)}
                        disabled={showExplanation}
                        variant="outline"
                        className="h-auto py-3"
                      >
                        {emotion}
                      </Button>
                    ))}
                  </div>
                </div>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 p-4 rounded-lg"
                  >
                    <p className="text-sm mb-4">{SCENARIOS[currentScenario].explanation}</p>
                    <Button onClick={nextScenario} className="w-full">
                      Next Scenario <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {gameType === "vocabulary" && (
              <motion.div
                key="vocabulary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <motion.div
                  key={cardIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white/10 p-6 rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-2">{EMOTION_CARDS[cardIndex].emotion}</h3>
                  <p className="mb-4">{EMOTION_CARDS[cardIndex].description}</p>
                  <p className="text-sm opacity-80">Example: {EMOTION_CARDS[cardIndex].example}</p>
                </motion.div>

                <Button onClick={nextCard} className="w-full">
                  Next Card <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {gameType && (
            <Button
              variant="outline"
              onClick={() => setGameType(null)}
              className="mt-6 w-full"
            >
              Back to Games Menu
            </Button>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
