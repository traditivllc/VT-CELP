"use client";
import { useEffect, useRef, useState } from "react";
import Equalizer from "./Equalizer";

interface EqualizerContainerProps {
  isRecording: boolean;
}

export default function EqualizerContainer({
  isRecording,
}: EqualizerContainerProps) {
  const [eqBars, setEqBars] = useState([8, 12, 16, 20, 12]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Dynamic Equalizer animation
  const startEqualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      analyserRef.current = analyser;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let lastBars = [8, 12, 16, 20, 12];
      function animate() {
        analyser.getByteFrequencyData(dataArray);
        // Map 5 bars to frequency bins
        const bars = [
          dataArray[1],
          dataArray[3],
          dataArray[5],
          dataArray[7],
          dataArray[9],
        ].map((v) => Math.max(8, Math.min(32, v / 4)));
        // Only update if bars change significantly
        if (bars.some((v, i) => Math.abs(v - lastBars[i]) > 2)) {
          setEqBars(bars);
          lastBars = bars;
        }
        // Lower frame rate for less CPU usage
        animationFrameRef.current = window.setTimeout(animate, 50); // ~20fps
      }
      animate();
    } catch {
      // ignore errors
    }
  };

  const stopEqualizer = () => {
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close();
    analyserRef.current = null;
    animationFrameRef.current = null;
    audioCtxRef.current = null;
    setEqBars([8, 12, 16, 20, 12]);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (isRecording) {
      startEqualizer();
    } else {
      stopEqualizer();
    }
    return () => {
      stopEqualizer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  return <Equalizer eqBars={eqBars} />;
}
