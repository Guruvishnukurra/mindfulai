import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Kept for potential future use


type SoundType = {
  name: string;
  url: string;
  volume: number;
  playing: boolean;
  audio?: HTMLAudioElement;
};

export function SoundscapeGenerator() {
  const { toast } = useToast(); // Kept for potential future use
  const [masterVolume, setMasterVolume] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sounds, setSounds] = useState<SoundType[]>([
    { name: "Rain", url: "https://freesound.org/data/previews/346/346170_5121236-lq.mp3", volume: 50, playing: true },
    { name: "Thunder", url: "https://freesound.org/data/previews/102/102806_649468-lq.mp3", volume: 30, playing: true },
    { name: "Forest", url: "https://freesound.org/data/previews/573/573578_1015240-lq.mp3", volume: 60, playing: true },
    { name: "Ocean", url: "https://freesound.org/data/previews/617/617320_2393272-lq.mp3", volume: 40, playing: true },
    { name: "Cafe", url: "https://freesound.org/data/previews/369/369154_5596872-lq.mp3", volume: 30, playing: true },
  ]);

  // Setup audio elements
  useEffect(() => {
    const setupAudio = async () => {
      const newSounds = sounds.map(sound => {
        if (!sound.audio) {
          const audio = new Audio(sound.url);
          audio.loop = true;
          audio.volume = (sound.volume / 100) * (masterVolume / 100);
          return { ...sound, audio };
        }
        return sound;
      });

      setSounds(newSounds);
    };

    setupAudio();

    return () => {
      // Cleanup audio elements when component unmounts
      sounds.forEach(sound => {
        if (sound.audio) {
          sound.audio.pause();
          sound.audio.src = "";
        }
      });
    };
  }, []);

  // Update all audio volumes when master volume changes
  useEffect(() => {
    sounds.forEach(sound => {
      if (sound.audio) {
        sound.audio.volume = (sound.volume / 100) * (masterVolume / 100);
      }
    });
  }, [masterVolume, sounds]);

  // Play or pause all sounds
  useEffect(() => {
    sounds.forEach(sound => {
      if (!sound.audio) return;

      if (isPlaying && sound.playing) {
        sound.audio.play().catch(err => console.error("Error playing audio:", err));
      } else {
        sound.audio.pause();
      }
    });
  }, [isPlaying, sounds]);

  const toggleSound = (index: number) => {
    const newSounds = [...sounds];
    newSounds[index].playing = !newSounds[index].playing;

    if (newSounds[index].audio) {
      if (isPlaying && newSounds[index].playing) {
        newSounds[index].audio!.play().catch(err => console.error("Error playing audio:", err));
      } else {
        newSounds[index].audio!.pause();
      }
    }

    setSounds(newSounds);
  };

  const handleVolumeChange = (index: number, value: number[]) => {
    const newSounds = [...sounds];
    newSounds[index].volume = value[0];

    if (newSounds[index].audio) {
      newSounds[index].audio!.volume = (value[0] / 100) * (masterVolume / 100);
    }

    setSounds(newSounds);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Soundscape Generator</h1>
      <p className="mb-6">Create your perfect ambient environment with our customizable soundscape generator. Mix and match sounds to help you focus, relax, or sleep better.</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Master Controls</CardTitle>
          <CardDescription>Control your entire soundscape experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={togglePlayPause} 
              variant="default" 
              size="lg"
              className="w-32"
            >
              {isPlaying ? <><Pause className="mr-2" /> Pause</> : <><Play className="mr-2" /> Play</>}
            </Button>

            <div className="flex items-center gap-4 max-w-xs w-full">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <Slider
                value={[masterVolume]}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={(value) => setMasterVolume(value[0])}
              />
              <span className="text-sm text-muted-foreground w-8 text-right">{masterVolume}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sounds.map((sound, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{sound.name}</CardTitle>
                <Switch 
                  checked={sound.playing}
                  onCheckedChange={() => toggleSound(index)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[sound.volume]}
                  max={100}
                  step={1}
                  className="flex-1"
                  onValueChange={(value) => handleVolumeChange(index, value)}
                  disabled={!sound.playing}
                />
                <span className="text-sm text-muted-foreground w-8 text-right">{sound.volume}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground">Sound credits: Freesound.org</p>
      </div>
    </div>
  );
}