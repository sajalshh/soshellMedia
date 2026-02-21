import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import api from "../api/axiosConfig";
import starIcon from "../assets/img/star.png";
/* ================= FALLBACK DATA ================= */

const fallbackMonthly = [
  {
    name: "Digital Twin",
    price: "$797",
    description: "Digital Presence on Autopilot",
    features: [
      "8 AI Avatar Videos Monthly",
      "1 Custom AI Twin (Hyper-Realistic)",
      "Precision Voice Cloning",
      "Done-For-You Scripting",
      "Performance Editing",
      "Brand Consistency Guaranteed",
      "Strategy Partnership: Onboarding + Monthly 1-on-1 growth strategy calls.",
      "24/7 Platform Access",
    ],
    highlighted: false,
  },
  {
    name: "Automated Founder",
    price: "$1497",
    description: "The Complete Growth Loop",
    features: [
      "15 AI Avatar Videos Monthly (Hyper-Realistic)",
      "3 Custom AI Twins (Multiple outfits)",
      "24/7 AI Calling Agent: Instant Call, SMS & Email response to every lead.",
      "Lead Qualification",
      "Auto-Booked Meetings to your calendar",
      "Intelligent Nurturing",
      "Priority 48hr Turnaround",
      "Strategy Partnership: Onboarding + biweekly 1-on-1 growth strategy calls.",
      "PLUS: Everything included in The Digital Twin plan.",
    ],
    highlighted: true,
  },
  {
    name: "Market Dominator",
    price: "$2497",
    description: "Total Ecosystem Authority",
    features: [
      "25 AI Avatar Videos Monthly (Hyper-Realistic)",
      "5+ Custom AI Twins (Multiple outfits)",
      "24/7 AI Calling Agent: Instant Call, SMS & Email response to every lead.",
      "Lead Qualification",
      "Performance Marketing ADS (1 Platform)",
      "Ad Creative Engineering",
      "Priority 24hr Turnaround",
      "Strategy Partnership: Onboarding + weekly 1-on-1 growth strategy calls.",
      "PLUS: Everything in Automated Founder Plan included.",
    ],
    highlighted: false,
  },
];

const fallbackAnnual = fallbackMonthly;

/* ================= CHECKMARK ================= */

const Checkmark = () => (
  <svg
    width="16"
    height="12"
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

/* ================= COMPONENT ================= */

export default function PricingPage() {
  const [monthlyPlans, setMonthlyPlans] = useState(fallbackMonthly);
  const [annualPlans, setAnnualPlans] = useState(fallbackAnnual);
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = billingCycle === "monthly" ? monthlyPlans : annualPlans;

  return (
    // Added tw-pt-32 (top padding) to prevent overlap with fixed header
    <section className="pricing-section section-padding tw-pt-32 lg:tw-pt-40">
      <div className="container-fluid">
        <div className="tw-max-w-[1400px] tw-mx-auto tw-px-6">
          {/* ================= HEADER (CENTERED) ================= */}
          {/* Changed tw-items-center and tw-text-center for alignment */}
          <div className="tw-flex tw-flex-col tw-items-center tw-text-center tw-gap-8">
            <div className="section-title">
              <h6 className="tw-justify-center">
                <img src={starIcon} alt="star icon" /> popular package
              </h6>
              <h2>
                Competitive package <br />
                <span>
                  best AI <b>expertise</b>
                </span>
              </h2>
            </div>

            <div className="tw-p-1 tw-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-[rgba(207,208,212,0.25)] tw-bg-black/20">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`tw-px-8 tw-py-2.5 tw-rounded-full tw-font-semibold tw-transition-all ${
                  billingCycle === "monthly"
                    ? "tw-bg-[#00ffcc] tw-text-black tw-shadow-lg"
                    : "tw-text-[#CDCDCD] hover:tw-text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`tw-px-8 tw-py-2.5 tw-rounded-full tw-font-semibold tw-transition-all ${
                  billingCycle === "annual"
                    ? "tw-bg-[#00ffcc] tw-text-black tw-shadow-lg"
                    : "tw-text-[#CDCDCD] hover:tw-text-white"
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          {/* ================= PRICING GRID ================= */}
          <div className="tw-mt-16 row g-4 tw-justify-center">
            {plans.map((plan, index) => (
              <div key={index} className="col-xxl-4 col-xl-4 col-lg-6 col-md-6">
                <div
                  className={`pricing-box-items tw-h-full tw-flex tw-flex-col tw-justify-between tw-relative tw-overflow-hidden tw-transition-all hover:-tw-translate-y-2
                  ${
                    plan.highlighted
                      ? "tw-border-2 tw-border-[var(--tp-theme-primary)] tw-shadow-[0_0_40px_rgba(0,255,200,0.15)]"
                      : "tw-border tw-border-white/10"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="tw-absolute tw-top-[22px] tw-right-[-48px] tw-w-48 tw-rotate-45 tw-bg-[var(--tp-theme-primary)] tw-py-2 tw-text-center">
                      <span className="tw-text-xs tw-font-bold tw-uppercase tw-text-black">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* CONTENT */}
                  <div>
                    <h3 className="tw-text-[24px] tw-font-bold tw-text-[var(--tp-theme-primary)]">
                      {plan.name}
                    </h3>
                    <p className="tw-text-sm tw-text-[#bdbdbd] tw-mt-1">
                      {plan.description}
                    </p>
                    <div className="tw-flex tw-items-baseline tw-gap-1 tw-mt-4">
                      <h2 className="tw-text-5xl tw-font-bold tw-text-white">
                        {plan.price}
                      </h2>
                      <span className="tw-text-[#bdbdbd] tw-text-sm">/mo</span>
                    </div>

                    <div className="tw-my-6 tw-h-px tw-bg-gradient-to-r tw-from-transparent tw-via-white/20 tw-to-transparent" />

                    {/* FEATURES */}
                    <ul className="pricing-list">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="tw-flex tw-items-start tw-gap-3 tw-text-[15px] tw-leading-relaxed tw-text-white/90 tw-mb-4"
                        >
                          <span className="tw-mt-[5px] tw-flex-shrink-0">
                            <Checkmark />
                          </span>
                          <span className="tw-flex-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="tw-mt-10">
                    <a
                      href="/appointment"
                      className="theme-btn tw-w-full tw-text-center tw-py-4 tw-rounded-xl"
                    >
                      Start Now
                      <ArrowRight size={18} className="tw-ml-2 tw-inline" />
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
