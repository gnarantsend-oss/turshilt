"use client";

import { useState, useCallback, useRef } from "react";
import { extractDominantColor } from "@/lib/extractColor";

export function useAmbientColor() {
  const [color, setColor] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Зургаас өнгө гаргаж аваад state-д тавина
  const setFromImage = useCallback(async (src: string | undefined | null) => {
    if (!src) return;
    const extracted = await extractDominantColor(src);
    if (extracted) setColor(extracted);
  }, []);

  // Hover дуусахад өнгийг аажмаар буцааж reset хийнэ
  const scheduleReset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setColor(null), 800);
  }, []);

  const cancelReset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { color, setFromImage, scheduleReset, cancelReset };
}
