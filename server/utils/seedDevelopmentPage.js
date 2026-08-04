const DevPageContent = require("../models/DevPageContent");
const DevTechnology = require("../models/DevTechnology");
const DevProcessStep = require("../models/DevProcessStep");

const DEFAULT_TECHNOLOGIES = [
  { name: "Shopify", iconKey: "shopify", category: "Platforms", displayOrder: 1 },
  { name: "WordPress", iconKey: "wordpress", category: "Platforms", displayOrder: 2 },
  { name: "Webflow", iconKey: "webflow", category: "Platforms", displayOrder: 3 },
  { name: "WooCommerce", iconKey: "woocommerce", category: "Platforms", displayOrder: 4 },
  { name: "Wix", iconKey: "wix", category: "Platforms", displayOrder: 5 },
  { name: "BigCommerce", iconKey: "bigcommerce", category: "Platforms", displayOrder: 6 },

  { name: "Next.js", iconKey: "nextjs", category: "Frameworks", displayOrder: 1 },
  { name: "React", iconKey: "react", category: "Frameworks", displayOrder: 2 },
  { name: "Vue.js", iconKey: "vue", category: "Frameworks", displayOrder: 3 },
  { name: "Angular", iconKey: "angular", category: "Frameworks", displayOrder: 4 },
  { name: "Svelte", iconKey: "svelte", category: "Frameworks", displayOrder: 5 },
  { name: "Node.js", iconKey: "nodejs", category: "Frameworks", displayOrder: 6 },
  { name: "Laravel", iconKey: "laravel", category: "Frameworks", displayOrder: 7 },
  { name: "Flutter", iconKey: "flutter", category: "Frameworks", displayOrder: 8 },

  { name: "JavaScript", iconKey: "javascript", category: "Languages", displayOrder: 1 },
  { name: "TypeScript", iconKey: "typescript", category: "Languages", displayOrder: 2 },
  { name: "PHP", iconKey: "php", category: "Languages", displayOrder: 3 },
  { name: "Python", iconKey: "python", category: "Languages", displayOrder: 4 },
  { name: "Swift", iconKey: "swift", category: "Languages", displayOrder: 5 },

  { name: "Figma", iconKey: "figma", category: "Tools", displayOrder: 1 },
  { name: "Tailwind CSS", iconKey: "tailwind", category: "Tools", displayOrder: 2 },
  { name: "MongoDB", iconKey: "mongodb", category: "Tools", displayOrder: 3 },
  { name: "Firebase", iconKey: "firebase", category: "Tools", displayOrder: 4 },
  { name: "Vercel", iconKey: "vercel", category: "Tools", displayOrder: 5 },
  { name: "Docker", iconKey: "docker", category: "Tools", displayOrder: 6 },
  { name: "Stripe", iconKey: "stripe", category: "Tools", displayOrder: 7 },
  { name: "GitHub", iconKey: "github", category: "Tools", displayOrder: 8 },
];

const DEFAULT_PROCESS = [
  {
    title: "Discover",
    description:
      "We dig into your goals, users, and competitors to map out exactly what needs to be built.",
    displayOrder: 1,
  },
  {
    title: "Design",
    description:
      "Wireframes and high-fidelity UI in Figma, refined with you until every screen feels right.",
    displayOrder: 2,
  },
  {
    title: "Develop",
    description:
      "Clean, scalable code on the right stack for the job — Shopify, WordPress, or a custom build.",
    displayOrder: 3,
  },
  {
    title: "Test",
    description:
      "Cross-device QA, performance and speed checks, and real-user testing before anything ships.",
    displayOrder: 4,
  },
  {
    title: "Launch",
    description:
      "We deploy, monitor, and hand over a fully documented, production-ready product.",
    displayOrder: 5,
  },
];

async function seedDevelopmentPage() {
  try {
    const existingContent = await DevPageContent.findOne();
    if (!existingContent) {
      await DevPageContent.create({});
    }

    const techCount = await DevTechnology.countDocuments();
    if (techCount === 0) {
      await DevTechnology.insertMany(DEFAULT_TECHNOLOGIES);
    }

    const processCount = await DevProcessStep.countDocuments();
    if (processCount === 0) {
      await DevProcessStep.insertMany(DEFAULT_PROCESS);
    }

    console.log("Development page defaults seeded.");
  } catch (error) {
    console.error("Error seeding development page:", error);
  }
}

module.exports = seedDevelopmentPage;
