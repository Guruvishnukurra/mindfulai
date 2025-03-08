import { MoodTracker } from "@/components/MoodTracker";
import { HabitTracker } from "@/components/HabitTracker";
import { Affirmations } from "@/components/Affirmations";
import { SelfCarePlanner } from "@/components/SelfCarePlanner";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900">
      <main className="container mx-auto p-4 md:pl-72 pb-20 md:pb-4">
        <motion.div 
          className="max-w-4xl mx-auto space-y-8 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <motion.h1 
              className="text-6xl font-bold mb-4 gradient-text"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to MindfulMe
            </motion.h1>
            <motion.p 
              className="text-xl text-purple-200/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Your personal mental wellness companion
            </motion.p>
          </div>
          <motion.div 
            className="max-w-xl mx-auto glow"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <MoodTracker />
          </motion.div>

          <div className="space-y-8">
            <Affirmations />
            <SelfCarePlanner />
            <HabitTracker />
          </div>
        </motion.div>
      </main>
      <Navbar />
    </div>
  );
}