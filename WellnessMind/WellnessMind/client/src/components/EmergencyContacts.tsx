import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare } from "lucide-react";

const EMERGENCY_CONTACTS = [
  {
    name: "National Suicide Prevention Lifeline",
    phone: "1-800-273-8255",
    text: "988",
    available: "24/7"
  },
  {
    name: "Crisis Text Line",
    text: "HOME to 741741",
    available: "24/7"
  },
  {
    name: "SAMHSA's National Helpline",
    phone: "1-800-662-4357",
    available: "24/7"
  }
];

export function EmergencyContacts() {
  return (
    <Card className="p-6 bg-destructive/10 backdrop-blur-lg border-destructive">
      <h2 className="text-2xl font-semibold mb-4 text-destructive">Emergency Contacts</h2>
      <div className="space-y-4">
        {EMERGENCY_CONTACTS.map((contact, i) => (
          <div key={i} className="bg-background/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{contact.name}</h3>
            <div className="text-sm text-muted-foreground mb-2">
              Available: {contact.available}
            </div>
            <div className="flex gap-2">
              {contact.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `tel:${contact.phone}`}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {contact.phone}
                </Button>
              )}
              {contact.text && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `sms:${contact.text}`}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Text: {contact.text}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
