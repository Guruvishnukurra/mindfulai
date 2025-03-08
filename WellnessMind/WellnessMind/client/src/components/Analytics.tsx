import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export function Analytics() {
  const { data: moodData } = useQuery({
    queryKey: ["/api/mood"],
    queryFn: async () => {
      const response = await fetch("/api/mood");
      const data = await response.json();
      return data.map((entry: any) => ({
        ...entry,
        timeAgo: formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })
      }));
    }
  });

  const { data: journalData } = useQuery({
    queryKey: ["/api/journal"],
    queryFn: async () => {
      const response = await fetch("/api/journal");
      return response.json();
    }
  });

  const moodChartConfig = {
    mood: {
      label: "Mood Level",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))"
      }
    }
  };

  return (
    <div className="space-y-8 p-8">
      <motion.h1 
        className="text-3xl font-bold mb-8 gradient-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Analytics Dashboard
      </motion.h1>

      <motion.div 
        className="grid gap-8 md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>
          <div className="h-[300px]">
            <ChartContainer config={moodChartConfig}>
              <LineChart data={moodData || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="timeAgo"
                  className="text-sm text-muted-foreground"
                />
                <YAxis
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  className="text-sm text-muted-foreground"
                />
                <ChartTooltip>
                  <ChartTooltipContent />
                </ChartTooltip>
                <Line
                  type="monotone"
                  dataKey="mood"
                  strokeWidth={2}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Journal Activity</h2>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold gradient-text">
                {journalData?.length || 0}
              </p>
              <p className="text-muted-foreground mt-2">Total Entries</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
