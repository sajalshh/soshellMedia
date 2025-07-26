import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

// Reusable Accordion Item Component
const AccordionItem = ({ id, title, content, isOpen, onClick }) => (
  <div className="accordion-item wow fadeInUp">
    <h5 className="accordion-header">
      <button
        className={`accordion-button ${!isOpen ? "collapsed" : ""}`}
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        {title}
      </button>
    </h5>
    <div className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}>
      <div className="accordion-body">{content}</div>
    </div>
  </div>
);

export default function FaqPage() {
  // State for the first accordion (General Questions)
  const [openGeneral, setOpenGeneral] = useState("faq1");
  // State for the second accordion
  const [openFinancial, setOpenFinancial] = useState("faq7");

  const generalFaqs = [
    {
      id: "faq1",
      title: "Is my data safe when using the chatbot?",
      content:
        "I love how easy it is to use this chatbot. Whether I’m looking for product recommendations or just need help with a task...",
    },
    {
      id: "faq2",
      title: "How does the chatbot improve over time?",
      content:
        "The chatbot improves through continuous machine learning algorithms and user feedback analysis...",
    },
    {
      id: "faq3",
      title: "What languages does chatbot support?",
      content:
        "Currently, the chatbot supports English, Spanish, and French, with more languages being added soon...",
    },
  ];

  const financialFaqs = [
    {
      id: "faq7",
      title: "How does the chatbot improve over time?",
      content:
        "I love how easy it is to use this chatbot. Whether I’m looking for product recommendations or just need help with a task...",
    },
    {
      id: "faq8",
      title: "What makes your AI different from others?",
      content:
        "Our AI is built on a proprietary model that focuses on contextual understanding and user intent...",
    },
    {
      id: "faq9",
      title: "Do I need any skills to use the platform?",
      content:
        "No, our platform is designed to be user-friendly for beginners and experts alike...",
    },
  ];

  return (
    <>
      {/* FAQ Banner Section */}
      <section
        className="faq-banner bg-cover"
        style={{ backgroundImage: "url('assets/img/service/Pattern.png')" }}
      >
        <div className="container">
          {/* ... Banner content from faq.html ... */}
        </div>
      </section>

      {/* FAQ Wrapper Section */}
      <section className="faq-wrapper style-inner-page section-padding">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="faq-sidebar">
                {/* ... Sidebar content from faq.html ... */}
              </div>
            </div>
            <div className="col-lg-8">
              <div className="faq-content">
                <h2>General questions</h2>
                <div className="faq-accordion">
                  <div className="accordion">
                    {generalFaqs.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        {...faq}
                        isOpen={openGeneral === faq.id}
                        onClick={() =>
                          setOpenGeneral(openGeneral === faq.id ? null : faq.id)
                        }
                      />
                    ))}
                  </div>
                </div>

                <h2 className="mb-3 mt-5">Financial questions</h2>
                <div className="faq-accordion">
                  <div className="accordion">
                    {financialFaqs.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        {...faq}
                        isOpen={openFinancial === faq.id}
                        onClick={() =>
                          setOpenFinancial(
                            openFinancial === faq.id ? null : faq.id,
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
