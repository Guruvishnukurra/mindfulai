import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function Journal() {
  const [entry, setEntry] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: saveEntry, isPending } = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/journal", {
        userId: 1, // Using default user ID
        content: entry,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully."
      });
      setEntry("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    }
  });

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-lg">
      <h2 className="text-2xl font-semibold mb-4">Journal Entry</h2>
      <Textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts here..."
        className="min-h-[200px] mb-4"
      />
      <Button 
        onClick={() => saveEntry()}
        disabled={isPending || !entry.trim()}
        className="w-full"
      >
        Save Entry
      </Button>
    </Card>
  );
}