import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const phoneNumber = "16478970671";
  const message = "Hi! I want to know more about your services.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      className="tw-fixed tw-bottom-6 tw-right-6 tw-z-[9999] tw-w-14 tw-h-14 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-bg-[#20ba9c] hover:tw-scale-105 tw-transition"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="tw-text-white" size={26} />
    </a>
  );
}
