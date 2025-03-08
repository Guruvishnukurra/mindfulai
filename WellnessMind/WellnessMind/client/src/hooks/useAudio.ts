
import { useState, useEffect, useRef } from 'react';

type AudioOptions = {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
};

export function useAudio(url: string, options: AudioOptions = {}) {
  const { volume = 1, loop = false, autoplay = false } = options;
  
  const audio = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  useEffect(() => {
    const audioElement = new Audio(url);
    audio.current = audioElement;
    
    audioElement.loop = loop;
    audioElement.volume = volume;
    
    if (autoplay) {
      audioElement.play().catch(err => {
        console.error("Error autoplaying audio:", err);
        setIsPlaying(false);
      });
    }
    
    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };
    
    const handleEnded = () => {
      if (!loop) setIsPlaying(false);
    };
    
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('ended', handleEnded);
    
    return () => {
      audioElement.pause();
      audioElement.src = '';
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [url, loop, autoplay]);
  
  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volume;
    }
  }, [volume]);
  
  const play = () => {
    if (audio.current) {
      audio.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Error playing audio:", err);
      });
    }
  };
  
  const pause = () => {
    if (audio.current) {
      audio.current.pause();
      setIsPlaying(false);
    }
  };
  
  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  const seek = (time: number) => {
    if (audio.current) {
      audio.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  return {
    audio: audio.current,
    isPlaying,
    duration,
    currentTime,
    play,
    pause,
    toggle,
    seek
  };
}
