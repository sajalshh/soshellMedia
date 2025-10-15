import React, { useState } from "react";
import { ArrowRight } from "lucide-react"; // Lightweight icon for the button

// A custom Checkmark component styled to match your theme's primary color
const Checkmark = () => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.5 1.5L7 13L1.5 7.5"
      stroke="var(--tp-theme-primary)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Data for the pricing plans (no changes here) ---
const monthlyPlans = [
  {
    name: "Standard",
    price: "$25",
    description: "Ideal for personal project",
    features: [
      "Access AI tool",
      "Exclusive feature",
      "24/7 support",
      "Discord access",
    ],
    highlighted: false,
    delay: ".2s",
  },
  {
    name: "Professional",
    price: "$39",
    description: "Ideal for personal project",
    features: [
      "Access AI tool",
      "Exclusive feature",
      "24/7 support",
      "Discord access",
    ],
    highlighted: false,
    delay: ".4s",
  },
  {
    name: "Business",
    price: "$79",
    description: "Ideal for personal project",
    features: [
      "Access AI tool",
      "Exclusive feature",
      "24/7 support",
      "Discord access",
    ],
    highlighted: true,
    delay: ".6s",
  },
  {
    name: "Enterprise",
    price: "$149",
    description: "Ideal for personal project",
    features: [
      "Access AI tool",
      "Exclusive feature",
      "24/7 support",
      "Discord access",
    ],
    highlighted: false,
    delay: ".8s",
  },
];
const annualPlans = [
  {
    name: "Standard",
    price: "$250",
    description: "Save $50 a year",
    features: [
      "2 months free",
      "Access AI tool",
      "Exclusive feature",
      "24/7 support",
    ],
    highlighted: false,
    delay: ".2s",
  },
  {
    name: "Professional",
    price: "$390",
    description: "Save $78 a year",
    features: [
      "2 months free",
      "Access AI tool",
      "Exclusive feature",
      "24/7 support",
    ],
    highlighted: false,
    delay: ".4s",
  },
  {
    name: "Business",
    price: "$790",
    description: "Save $158 a year",
    features: [
      "2 months free",
      "Access AI tool",
      "Exclusive feature",
      "24/7 support",
    ],
    highlighted: true,
    delay: ".6s",
  },
  {
    name: "Enterprise",
    price: "$1490",
    description: "Save $298 a year",
    features: [
      "2 months free",
      "Access AI tool",
      "Exclusive feature",
      "24/7 support",
    ],
    highlighted: false,
    delay: ".8s",
  },
];

// --- The Main Pricing Page Component ---
export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const plans = billingCycle === "monthly" ? monthlyPlans : annualPlans;

  return (
    <section className="pricing-section fix section-padding pt-0">
      <div className="container">
        {/* === HEADING (no changes) === */}
        <div className="section-title-area">
          <div className="section-title ml-200">
            <h6 className="wow fadeInUp">
              <img src="/assets/img/star.png" alt="img" /> popular package
            </h6>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Competitive package <br />
              <span>
                best AI <b>expertise</b>
              </span>
            </h2>
          </div>

          {/* === TOGGLE (no changes) === */}
          <div className="tw-p-1 tw-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-[rgba(207,208,212,0.25)]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`tw-px-5 tw-py-2 tw-rounded-full tw-font-semibold tw-transition-colors tw-duration-300 ${
                billingCycle === "monthly"
                  ? "tw-bg-[#EFFB53] tw-text-black"
                  : "tw-text-[#CDCDCD] hover:tw-text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`tw-px-5 tw-py-2 tw-rounded-full tw-font-semibold tw-transition-colors tw-duration-300 ${
                billingCycle === "annual"
                  ? "tw-bg-[#EFFB53] tw-text-black"
                  : "tw-text-[#CDCDCD] hover:tw-text-white"
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* === PRICING CARDS === */}
        <div className="tw-mt-12">
          <div className="row">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay={plan.delay}
              >
                {/* Add relative and overflow-hidden for the ribbon effect */}
                <div
                  className={`pricing-box-items tw-relative tw-overflow-hidden tw-transition-all tw-duration-300 hover:-tw-translate-y-2 hover:tw-shadow-lg ${
                    plan.highlighted
                      ? "tw-border-2 tw-border-[var(--tp-theme-primary)]"
                      : ""
                  }`}
                >
                  {/* ✨ New: Corner Ribbon for Highlighted Plan */}
                  {plan.highlighted && (
                    <div className="tw-absolute tw-top-[25px] tw-right-[-45px] tw-w-48 tw-rotate-45 tw-bg-[var(--tp-theme-primary)] tw-py-2 tw-text-center tw-shadow-md">
                      <span className="tw-text-sm tw-font-bold tw-uppercase tw-text-black">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="icon">
                    <img src="/assets/img/icon/02.svg" alt="img" />
                  </div>
                  <div className="pricing-header">
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                    <h2>{plan.price}</h2>
                  </div>
                  <ul className="pricing-list">
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <Checkmark />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pricing-button">
                    <a href="/appointment" className="theme-btn">
                      Start Now{" "}
                      <ArrowRight className="tw-inline tw-ml-1" size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
