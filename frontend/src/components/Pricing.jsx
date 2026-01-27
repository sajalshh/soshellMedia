import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import api from "../api/axiosConfig";

// --- Fallback Data ---
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
    ],
    highlighted: false,
  },
  {
    name: "Automated Founder",
    price: "$1497",
    description: "The Complete Growth Loop",
    features: [
      "15 AI Avatar Videos Monthly (Hyper-Realistic)",
      "3 Custom AI Twins (Multiple Outfits)",
      "Full Social Media Management",
      "Strategic Content Pillars",
      "Engagement & Growth Hack",
    ],
    highlighted: true,
  },
  {
    name: "Market Dominator",
    price: "$2497",
    description: "Total Ecosystem Authority",
    features: [
      "25 AI Avatar Videos Monthly (Hyper-Realistic)",
      "5+ Custom AI Twins (Multiple Outfits)",
      "Premium Ad Creation & Optimization",
      "Weekly Strategic Consulting",
      "Priority Support & Fast-Track Production",
    ],
    highlighted: false,
  },
];

const fallbackAnnual = [
  {
    name: "Digital Twin",
    price: "$7970",
    description: "Save $1,594 per year",
    features: ["Everything in Monthly", "2 Months Free", "Priority Onboarding"],
    highlighted: false,
  },
  {
    name: "Automated Founder",
    price: "$14970",
    description: "Save $2,994 per year",
    features: ["Everything in Monthly", "2 Months Free", "Custom Brand Bible"],
    highlighted: true,
  },
  {
    name: "Market Dominator",
    price: "$24970",
    description: "Save $4,994 per year",
    features: [
      "Everything in Monthly",
      "2 Months Free",
      "Dedicated Account Manager",
    ],
    highlighted: false,
  },
];

// --- Checkmark Component ---
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
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function PricingPage() {
  const [monthlyPlans, setMonthlyPlans] = useState(fallbackMonthly);
  const [annualPlans, setAnnualPlans] = useState(fallbackAnnual);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/pricing");
        const data = res.data?.data;
        if (data && data.length) {
          setMonthlyPlans(data.filter((p) => p.billingCycle === "monthly"));
          setAnnualPlans(data.filter((p) => p.billingCycle === "annual"));
        }
      } catch (err) {
        console.error("Using fallback pricing data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const plans = billingCycle === "monthly" ? monthlyPlans : annualPlans;

  return (
    <section className="pricing-section fix section-padding pt-0">
      <div className="container">
        {/* HEADER */}
        <div className="section-title-area tw-text-center tw-mb-12">
          <div className="section-title">
            <h6 className="tw-justify-center">
              <img src="/assets/img/star.png" alt="" /> popular package
            </h6>
            <h2 className="tw-text-white">
              Choose your package <br />
              <span>
                best AI <b className="tw-text-[#00ffcc]">expertise</b>
              </span>
            </h2>
          </div>

          <div className="tw-mt-8 tw-inline-flex tw-p-1 tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-[rgba(207,208,212,0.25)] tw-bg-[#151518]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`tw-px-8 tw-py-2 tw-rounded-full tw-font-bold tw-transition-all ${
                billingCycle === "monthly"
                  ? "tw-bg-[#00ffcc] tw-text-black"
                  : "tw-text-[#CDCDCD]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`tw-px-8 tw-py-2 tw-rounded-full tw-font-bold tw-transition-all ${
                billingCycle === "annual"
                  ? "tw-bg-[#00ffcc] tw-text-black"
                  : "tw-text-[#CDCDCD]"
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="tw-mt-12">
          <div className="row tw-justify-center">
            {loading ? (
              <p className="tw-text-white">Loading plans...</p>
            ) : (
              plans.map((plan, index) => (
                <div key={index} className="col-xl-4 col-lg-4 col-md-6 tw-mb-8">
                  <div
                    className={`pricing-box-items custom-pricing-card ${
                      plan.highlighted ? "highlighted-card" : ""
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="popular-badge">
                        <span>Most Popular</span>
                      </div>
                    )}

                    <div className="pricing-header">
                      <h3 className="plan-name">{plan.name}</h3>
                      <p className="plan-description">{plan.description}</p>
                      <h2 className="plan-price">{plan.price}</h2>
                    </div>

                    <ul className="pricing-feature-list">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="feature-item">
                          <span className="feature-icon">
                            <Checkmark />
                          </span>
                          <span className="feature-text">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pricing-button tw-mt-auto">
                      <a
                        href="/appointment"
                        className="theme-btn tw-w-full tw-flex tw-justify-center"
                      >
                        Start Now
                        <ArrowRight size={18} className="tw-ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
