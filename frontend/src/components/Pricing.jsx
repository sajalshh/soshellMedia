import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import api from "../api/axiosConfig";

// --- A. Fallback Data ---
const fallbackMonthly = [
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

const fallbackAnnual = [
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

// --- B. Checkmark ---
const Checkmark = () => (
  <svg
    width="14"
    height="10"
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

// --- C. Pricing Page ---
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
        {/* === HEADER === */}
        <div className="section-title-area">
          <div className="section-title ml-200">
            <h6>
              <img src="/assets/img/star.png" alt="" /> popular package
            </h6>
            <h2>
              Competitive package <br />
              <span>
                best AI <b>expertise</b>
              </span>
            </h2>
          </div>

          <div className="tw-p-1 tw-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-[rgba(207,208,212,0.25)]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`tw-px-5 tw-py-2 tw-rounded-full tw-font-semibold ${
                billingCycle === "monthly"
                  ? "tw-bg-[#EFFB53] tw-text-black"
                  : "tw-text-[#CDCDCD]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`tw-px-5 tw-py-2 tw-rounded-full tw-font-semibold ${
                billingCycle === "annual"
                  ? "tw-bg-[#EFFB53] tw-text-black"
                  : "tw-text-[#CDCDCD]"
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* === PRICING CARDS === */}
        <div className="tw-mt-12">
          <div className="row">
            {loading ? (
              <p>Loading plans...</p>
            ) : (
              plans.map((plan, index) => (
                <div
                  key={plan.name || index}
                  className="col-xxl-3 col-xl-4 col-lg-4 col-md-6"
                >
                  <div
                    className={`pricing-box-items tw-relative tw-overflow-hidden tw-transition-all hover:-tw-translate-y-2 ${
                      plan.highlighted
                        ? "tw-border-2 tw-border-[var(--tp-theme-primary)]"
                        : ""
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="tw-absolute tw-top-[25px] tw-right-[-45px] tw-w-48 tw-rotate-45 tw-bg-[var(--tp-theme-primary)] tw-py-2 tw-text-center">
                        <span className="tw-text-xs tw-font-bold tw-uppercase tw-text-black">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* HEADER */}
                    <div className="pricing-header">
                      <h3 className="tw-text-[22px] tw-font-semibold tw-text-[var(--tp-theme-primary)] tw-drop-shadow-[0_0_8px_rgba(0,255,200,0.6)]">
                        {plan.name}
                      </h3>

                      <p className="tw-text-sm tw-text-[#bdbdbd] tw-mt-1">
                        {plan.description}
                      </p>

                      <h2 className="tw-mt- tw-text-4xl tw-font-bold tw-text-white">
                        {plan.price}
                      </h2>
                    </div>

                    {/* FEATURES */}
                    <ul className="pricing-list tw-mt-0">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="tw-flex tw-items-start tw-gap-2 tw-text-[12px] tw-text-[#ffffff]"
                        >
                          <span className="tw-scale-90 tw-mt-[2px]">
                            <Checkmark />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* BUTTON */}
                    <div className="pricing-button tw-mt-8">
                      <a href="/appointment" className="theme-btn">
                        Start Now
                        <ArrowRight size={16} className="tw-ml-1 tw-inline" />
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
