"use client";

import { useEffect } from "react";

/**
 * Overlay (modal, drawer, search) нээлттэй байх үед body-н scroll-ийг
 * хааж, хэд хэдэн overlay нэгэн зэрэг нээлттэй байсан ч зөвхөн
 * бүгд хаагдсаны дараа scroll-ийг тайлдаг.
 *
 * Асуудал шийдсэн: MovieModal + DiscoverFeed + SearchOverlay нэгэн
 * зэрэг нээлттэй үед нэг нь хаагдахад бусдын scroll блок алдагддаг
 * байсан. Энэ hook тоолуур (lockCount) ашиглан энэ асуудлыг шийднэ.
 */

// Module-level counter — хэдэн overlay нээлттэйг тоолно
let lockCount = 0;

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockCount++;
    document.body.style.overflow = "hidden";

    return () => {
      lockCount--;
      // Бүх overlay хаагдсаны дараа л scroll-ийг тайлна
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = "";
      }
    };
  }, [active]);
}
