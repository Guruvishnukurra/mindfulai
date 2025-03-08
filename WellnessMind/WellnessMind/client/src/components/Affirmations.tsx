import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

const AFFIRMATIONS = [
  "I am capable of achieving great things",
  "Every day, I'm growing stronger mentally and emotionally",
  "I choose to be confident and self-assured",
  "I am worthy of love, respect, and happiness",
  "My potential to succeed is infinite",
  "I trust in my ability to make positive changes",
  "I am resilient and can overcome any challenge",
  "My mind is full of brilliant ideas",
  "I am becoming better every day",
  "I radiate positivity and attract goodness"
];

export function Affirmations() {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  const getRandomAffirmation = () => {
    const newIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    setCurrentAffirmation(newIndex);
  };

  useEffect(() => {
    getRandomAffirmation();
  }, []);

  return (
    <Card className="glass-card glass-card-hover p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold gradient-text">Daily Affirmation</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={getRandomAffirmation}
          className="hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <motion.p
        key={currentAffirmation}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl text-center text-purple-200/90 leading-relaxed"
      >
        {AFFIRMATIONS[currentAffirmation]}
      </motion.p>
    </Card>
  );
}
