import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

// Normalizes whatever the user typed ("example.com", "www.example.com",
// "https://example.com/") into a fetchable absolute URL + a clean hostname.
export function normalizeUrl(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    return { href: parsed.href, hostname: parsed.hostname };
  } catch {
    return null;
  }
}

// Builds a live screenshot URL via thum.io — a free, keyless screenshot
// proxy. No backend rendering/API key required; the image is generated
// on the fly whenever the pasted link changes. Deliberately not using
// thum.io's `crop` option: that crops a tall full-page capture down to
// a fixed height (chopping most pages). Leaving it off returns a single
// above-the-fold viewport screenshot, which is what we want intact.
export function screenshotUrlFor(rawUrl, width = 1000) {
  const normalized = normalizeUrl(rawUrl);
  if (!normalized) return null;
  return `https://image.thum.io/get/width/${width}/noanimate/${normalized.href}`;
}

/**
 * Given a project URL, automatically renders a live thumbnail of that
 * site's front page. Shows a shimmer while loading and a graceful
 * fallback card (site initial + hostname) if the screenshot fails.
 */
export default function LinkThumbnail({
  url,
  alt = "",
  className = "",
  rounded = "tw-rounded-2xl",
  imgSrc,
  fit = "cover", // "cover" (fills the box, may crop) | "contain" (shows the whole image, may letterbox)
}) {
  const [status, setStatus] = useState("loading"); // loading | loaded | error
  const normalized = normalizeUrl(url);
  const src = imgSrc || screenshotUrlFor(url);

  useEffect(() => {
    setStatus(src ? "loading" : "error");
  }, [src]);

  return (
    <div
      className={`tw-relative tw-w-full tw-h-full tw-overflow-hidden ${rounded} tw-bg-[#151518] ${className}`}
    >
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="shimmer"
            className="tw-absolute tw-inset-0 tw-z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="dev-thumb-shimmer" />
          </motion.div>
        )}
      </AnimatePresence>

      {status === "error" || !src ? (
        <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2 tw-bg-gradient-to-br tw-from-[#151518] tw-to-[#0a0a0c]">
          <Globe size={28} className="tw-text-[var(--tp-theme-primary)] tw-opacity-70" />
          <span className="tw-text-white/50 tw-text-xs tw-tracking-wide">
            {normalized?.hostname || "No preview"}
          </span>
        </div>
      ) : (
        <motion.img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{
            opacity: status === "loaded" ? 1 : 0,
            scale: status === "loaded" ? 1 : 1.04,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={
            fit === "contain"
              ? "tw-box-border tw-w-full tw-h-full tw-object-contain tw-object-center tw-p-3 tw-drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
              : "tw-w-full tw-h-full tw-object-cover tw-object-top"
          }
        />
      )}
    </div>
  );
}
