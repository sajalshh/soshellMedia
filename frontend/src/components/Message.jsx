import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Message() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Glow motion
  const glowY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={sectionRef}
      className="
        message-section
        tw-relative
        tw-overflow-hidden
        tw-flex
        tw-items-center
        tw-justify-center
        tw-min-h-[520px]
      "
    >
      {/* === GLOWING SEMICIRCLE BG === */}
      <motion.div
        style={{ y: glowY, scale: glowScale }}
        animate={{
          opacity: [0.45, 0.7, 0.45],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          tw-absolute
          tw-bottom-[-260px]
          tw-left-1/2
          -tw-translate-x-1/2
          tw-w-[900px]
          tw-h-[450px]
          tw-rounded-t-full
          tw-bg-[var(--tp-theme-primary)]
          tw-blur-[160px]
          tw-opacity-60
        "
      />

      {/* === CONTENT === */}
      <div className="tw-relative tw-z-10 tw-text-center tw-px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="
            tw-text-4xl
            md:tw-text-5xl
            tw-font-bold
            tw-text-white
          "
        >
          Start With One Recording.
          <span className="tw-block tw-text-[var(--tp-theme-primary)] tw-font-medium">
            We Handle The Rest.
          </span>
        </motion.h2>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="tw-mt-14 tw-flex tw-justify-center"
        >
          <Link
            to="/appointment"
            className="
              tw-group
              tw-w-24
              tw-h-24
              tw-rounded-full
              tw-flex
              tw-flex-col
              tw-items-center
              tw-justify-center
              tw-bg-[var(--tp-theme-primary)]
              tw-text-black
              tw-font-semibold
              tw-transition-all
              tw-duration-300
              hover:tw-shadow-[0_0_30px_rgba(0,255,204,0.8)]
            "
          >
            <span className="tw-text-sm">Let’s talk</span>
            <ArrowUpRight
              size={18}
              className="
                tw-transition-transform
                group-hover:tw-translate-x-1
                group-hover:-tw-translate-y-1
              "
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
