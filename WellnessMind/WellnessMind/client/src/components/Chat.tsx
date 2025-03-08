import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type Message = {
  content: string;
  isAi: boolean;
};

export function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/chat", {
        userId: 1, // Using default user ID
        content,
        isAi: false,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: (_, userMessage) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
      setMessages([
        ...messages,
        { content: userMessage, isAi: false }
      ]);
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  });

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-lg h-[600px] flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">Message Board</h2>
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.isAi ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isAi
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex gap-2 mt-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => {
            if (e.key === "Enter" && message.trim() && !isPending) {
              sendMessage(message);
            }
          }}
        />
        <Button 
          onClick={() => sendMessage(message)}
          disabled={isPending || !message.trim()}
        >
          Send
        </Button>
      </div>
    </Card>
  );
}