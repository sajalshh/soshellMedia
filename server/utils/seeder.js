// server/utils/seeder.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

// Load models
const TeamMember = require("../models/TeamMember");
const CounterStat = require("../models/CounterStat");
const AboutPage = require("../models/AboutPage");
const HeroContent = require("../models/HeroContent");
const AboutTab = require("../models/AboutTab");
const ServiceCard = require("../models/ServiceCard");
const Project = require("../models/Project");
const SeoData = require("../models/SeoData");
const AboutSectionContent = require("../models/AboutSectionContent");
const PortfolioItem = require("../models/PortfolioItem");
// Load env vars
dotenv.config({ path: "./.env" });

// --- YOUR ORIGINAL DATA ---
const teamMembers = [
  {
    name: "Rosa Compton",
    title: "Creative Designer",
    imgSrc: "/assets/img/team/01.jpg",
  },
  {
    name: "Clifford Barron",
    title: "Chief Executive",
    imgSrc: "/assets/img/team/02.jpg",
  },
  {
    name: "Shikhon Islam",
    title: "Project Manager",
    imgSrc: "/assets/img/team/03.jpg",
  },
  {
    name: "Ritu Islam",
    title: "Chief Engineer",
    imgSrc: "/assets/img/team/04.jpg",
  },
];

const stats = [
  { label: "Views Generated", end: 250, suffix: "M+", icon: "FaEye" },
  { label: "Growth Partner", end: 6, suffix: "+ years", icon: "FaHandshake" },
  { label: "Videos Created", end: 5000, suffix: "+", icon: "FaVideo" },
];

const aboutContent = {
  paragraphs: [
    "At Soshell Media, we’re more than just a creative agency we’re a team of thinkers, makers, and storytellers with an unshakable commitment to doing meaningful work. Our foundation is built on clarity of purpose, discipline in execution, and boldness in creativity.",
    "We believe that great brands aren’t built overnight. They’re shaped through relentless focus, intentional choices, and the courage to stand out especially when it’s easier to blend in.",
    "Every project we take on is treated with respect for your vision, your time, and your audience. Whether we’re crafting a video campaign, fine tuning a brand story, or engineering a moment of connection, we lead with thoughtfulness and finish with impact.",
    "We're not here to follow trends. We’re here to create work that lasts, inspires, and performs with depth, not just dazzle. Welcome to Soshell Media. Let’s build something worth remembering.",
  ],
};

const heroContent = {
  headingLine1: "We *Don't* Just *Post*",
  headingLine2: "We Create *Content*",
  headingLine3: "That *Converts*",
  subheading:
    "Performance-driven content studio for bold brands ready to scale, not settle",
  buttonText: "Book a discovery call",
  buttonLink: "/contact",
};


const aboutTabsData = [
  {
    tabId: "mission",
    tabTitle: "Content Ideas",
    heading: "DONT KNOW WHAT TO POST ANYMORE",
    paragraph:
      "Many business owners start strong on social media but hit a wall when they run out of content ideas. They aren’t sure what their audience wants and what to post.",
    listItems: [
      "Custom content calendars based on your goals and audience",
      "Weekly content prompts that align with current trends and brand values.",
      "Strategic pillars to organize your content around storytelling, value, and sales.",
    ],
    // imageSrc: "/assets/img/about/01.jpg",
  },
  {
    tabId: "vision",
    tabTitle: "Growth Strategy",
    heading: "POSTING CONSISTENTLY, BUT NO RESULTS",
    paragraph:
      "They post consistently but without a proper strategy or no direction. Due to lack of alignment between content and their business goals- their may be likes but no leads",
    listItems: [
      "Content audit to identify what’s not converting and why.",
      "Strategy-first posting that aligns with your funnel.",
      "CTAs, hooks, and formats designed for engagement and lead generation.",
    ],
    // imageSrc: "/assets/img/about/01.jpg",
  },
  {
    tabId: "feature",
    tabTitle: "Following trends",
    heading: "FACING ALGORITHM ISSUES AND CONSTANT CHANGES",
    paragraph:
      "They feel lost in the ever-changing world of social media. One day it’s reels, the next it’s carousels, then trending audio. They don’t know what to prioritize.",
    listItems: [
      "Trend tracking + updates done for you weekly.",
      "Evergreen content strategies that work beyond algorithm shifts.",
      "Clear content plans so you never have to guess what’s next.",
    ],
    // imageSrc: "/assets/img/about/01.jpg",
  },
];

const aboutSectionContent = {
  videoUrl: "https://fast.wistia.net/embed/iframe/djiv5ywnyy",
};

const serviceCardsData = [
  {
    title: "Creative Content & Storytelling",
    description: [
      {
        heading: "Content Audit",
        text: "Identify what’s not converting and why.",
      },
      {
        heading: "Strategy-First Posting",
        text: "Aligns with your business goals and funnel.",
      },
      {
        heading: "CTAs, Hooks & Formats",
        text: "Designed for engagement and lead generation.",
      },
    ],
    image: "/assets/img/cards/card1.png",
    floatingTitle: "0 hours",
    floatingSub: "All our magic",
    displayOrder: 1,
  },
  {
    title: "Growth & Performance Marketing",
    description: [
      {
        heading: "Ad Campaign Strategy",
        text: "Data‑driven campaigns that perform.",
      },
      { heading: "SEO", text: "Get found, stay ahead, and grow organically." },
      {
        heading: "Reporting & Analysis",
        text: "Data that drives smarter decisions.",
      },
    ],
    image: "/assets/img/cards/card1.png",
    floatingTitle: "100%",
    floatingSub: "On-brand visuals",
    displayOrder: 2,
  },
  {
    title: "Digital Experience & Development",
    description: [
      {
        heading: "Custom Design & Branding",
        text: "Websites that reflect your unique brand and identity.",
      },
      {
        heading: "Responsive & Fast",
        text: "Seamless experience across all devices with optimized load speeds.",
      },
      {
        heading: "Conversion-Focused Builds",
        text: "Designed to turn visitors into leads, subscribers, or customers.",
      },
    ],
    image: "/assets/img/cards/card1.png",
    floatingTitle: "24/7",
    floatingSub: "Lead generation",
    displayOrder: 3,
  },
];

const portfolioItemsData = [
  {
    title: "Creative Campaign A",
    category: "Creative",
    videoUrl: "https://fast.wistia.net/embed/iframe/djiv5ywnyy", // Replace with a real link
    displayOrder: 1,
  },
  {
    title: "Marketing Strategy B",
    category: "Marketing",
    videoUrl: "https://fast.wistia.net/embed/iframe/djiv5ywnyy",
    displayOrder: 2,
  },
  {
    title: "Development Project C",
    category: "Development",
    videoUrl: "https://fast.wistia.net/embed/iframe/djiv5ywnyy",
    displayOrder: 3,
  },
];


const projectsData = [
  {
    title: "Creative Content &|Storytelling",
    date: "25 july, 2024",
    description:
      "Duise sagettise rosend acum oneste curos adipiscine contacting the everyday agency secondar overseas",
    image: "/assets/img/project/01.jpg",
    projectLink: "/project-details/1",
    displayOrder: 1,
  },
  {
    title: "Growth &|Performance Marketing",
    date: "25 july, 2024",
    description:
      "Duise sagettise rosend acum oneste curos adipiscine contacting the everyday agency secondar overseas",
    image: "/assets/img/project/02.jpg",
    projectLink: "/project-details/2",
    displayOrder: 2,
  },
  {
    title: "Creative Content &|Storytelling",
    date: "25 july, 2024",
    description:
      "Duise sagettise rosend acum oneste curos adipiscine contacting the everyday agency secondar overseas",
    image: "/assets/img/project/03.jpg",
    projectLink: "/project-details/3",
    displayOrder: 3,
  },
];

const seoData = [
  {
    pageUrl: "/",
    title: "Soshell Media | Performance-Driven Content Studio",
    metaDescription:
      "Performance-driven content studio for bold brands ready to scale, not settle. We create content that converts.",
    ogTitle: "Soshell Media | We Create Content That Converts",
    ogDescription:
      "A performance-driven content studio for bold brands ready to scale.",
    ogImage: "/assets/img/social-share-home.jpg", 
  },
  {
    pageUrl: "/about",
    title: "About Our Creative Agency | Soshell Media",
    metaDescription:
      "Learn about Soshell Media, a team of thinkers, makers, and storytellers committed to doing meaningful work with clarity, discipline, and boldness in creativity.",
    ogTitle: "About Our Creative Agency | Soshell Media",
    ogDescription:
      "Discover the vision and purpose behind Soshell Media's performance-driven content.",
    ogImage: "/assets/img/social-share-about.jpg", 
  },
  {
    pageUrl: "/news",
    title: "Latest News & Insights | Soshell Media",
    metaDescription:
      "Stay updated with the latest news, trends, and insights from the team at Soshell Media.",
    ogTitle: "Latest News & Insights | Soshell Media",
    ogDescription: "The latest from the Soshell Media blog.",
    ogImage: "/assets/img/social-share-news.jpg",
  },
  {
    pageUrl: "/projects",
    title: "Our Creative Work & Portfolio | Soshell Media",
    metaDescription:
      "Explore a selection of our creative projects and see how we deliver performance-driven content for bold brands.",
    ogTitle: "Our Creative Work & Portfolio | Soshell Media",
    ogDescription: "A showcase of our best work in content and marketing.",
    ogImage: "/assets/img/social-share-projects.jpg",
  },
  {
    pageUrl: "/services",
    title: "Our Services | Soshell Media",
    metaDescription:
      "Discover our range of services, from creative content and storytelling to performance marketing and web development.",
    ogTitle: "Our Services | Soshell Media",
    ogDescription: "Learn how Soshell Media can help your brand scale.",
    ogImage: "/assets/img/social-share-services.jpg",
  },
  {
    pageUrl: "/contact",
    title: "Contact Us | Soshell Media",
    metaDescription:
      "Get in touch with the Soshell Media team to discuss your project or book a discovery call.",
    ogTitle: "Contact Us | Soshell Media",
    ogDescription: "Let's build something worth remembering together.",
    ogImage: "/assets/img/social-share-contact.jpg",
  },
];
// --- END OF DATA ---

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await TeamMember.deleteMany();
    await CounterStat.deleteMany();
    await AboutPage.deleteMany();
    await HeroContent.deleteMany();
    await AboutTab.deleteMany();
    await ServiceCard.deleteMany();
    await Project.deleteMany();
    await SeoData.deleteMany();
    await AboutSectionContent.deleteMany();
    await PortfolioItem.deleteMany();

    // Insert new data
    await TeamMember.insertMany(teamMembers);
    await CounterStat.insertMany(stats);
    await AboutPage.create(aboutContent);
    await HeroContent.create(heroContent);
    await AboutTab.insertMany(aboutTabsData);
    await ServiceCard.insertMany(serviceCardsData);
    await Project.insertMany(projectsData);
    await SeoData.insertMany(seoData);
    await AboutSectionContent.create(aboutSectionContent);
    await PortfolioItem.insertMany(portfolioItemsData);

    
    console.log("✅ Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  } else {
    importData();
  }
