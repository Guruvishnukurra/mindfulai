import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/firebase";
import { SiGoogle } from "react-icons/si";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg">
        <CardHeader>
          <h1 className="text-3xl font-bold text-center">Welcome to MindfulMe</h1>
          <p className="text-center text-muted-foreground">
            Your personal mental wellness companion
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full"
          >
            <SiGoogle className="mr-2" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
