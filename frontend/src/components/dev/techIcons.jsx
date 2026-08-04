import {
  SiShopify,
  SiWordpress,
  SiWebflow,
  SiWix,
  SiWoocommerce,
  SiSquarespace,
  SiBigcommerce,
  SiNextdotjs,
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiNodedotjs,
  SiExpress,
  SiLaravel,
  SiDjango,
  SiPhp,
  SiPython,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiBootstrap,
  SiFigma,
  SiFramer,
  SiGraphql,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiSupabase,
  SiVercel,
  SiNetlify,
  SiDocker,
  SiGithub,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiStripe,
} from "react-icons/si";
import { Globe } from "lucide-react";

// key -> { icon component, brand color, human label }
// `key` is what gets stored on DevTechnology.iconKey
export const TECH_ICON_MAP = {
  shopify: { icon: SiShopify, color: "#95BF47", label: "Shopify" },
  wordpress: { icon: SiWordpress, color: "#21759B", label: "WordPress" },
  webflow: { icon: SiWebflow, color: "#4363EC", label: "Webflow" },
  wix: { icon: SiWix, color: "#0C6EFC", label: "Wix" },
  woocommerce: { icon: SiWoocommerce, color: "#96588A", label: "WooCommerce" },
  squarespace: { icon: SiSquarespace, color: "#ffffff", label: "Squarespace" },
  bigcommerce: { icon: SiBigcommerce, color: "#34313F", label: "BigCommerce" },

  nextjs: { icon: SiNextdotjs, color: "#ffffff", label: "Next.js" },
  react: { icon: SiReact, color: "#61DAFB", label: "React" },
  vue: { icon: SiVuedotjs, color: "#4FC08D", label: "Vue.js" },
  angular: { icon: SiAngular, color: "#DD0031", label: "Angular" },
  svelte: { icon: SiSvelte, color: "#FF3E00", label: "Svelte" },
  nodejs: { icon: SiNodedotjs, color: "#5FA04E", label: "Node.js" },
  express: { icon: SiExpress, color: "#ffffff", label: "Express" },
  laravel: { icon: SiLaravel, color: "#FF2D20", label: "Laravel" },
  django: { icon: SiDjango, color: "#0C4B33", label: "Django" },
  flutter: { icon: SiFlutter, color: "#02569B", label: "Flutter" },

  php: { icon: SiPhp, color: "#777BB4", label: "PHP" },
  python: { icon: SiPython, color: "#3776AB", label: "Python" },
  typescript: { icon: SiTypescript, color: "#3178C6", label: "TypeScript" },
  javascript: { icon: SiJavascript, color: "#F7DF1E", label: "JavaScript" },
  swift: { icon: SiSwift, color: "#F05138", label: "Swift" },
  kotlin: { icon: SiKotlin, color: "#7F52FF", label: "Kotlin" },

  figma: { icon: SiFigma, color: "#F24E1E", label: "Figma" },
  framer: { icon: SiFramer, color: "#ffffff", label: "Framer" },
  tailwind: { icon: SiTailwindcss, color: "#38BDF8", label: "Tailwind CSS" },
  bootstrap: { icon: SiBootstrap, color: "#7952B3", label: "Bootstrap" },
  graphql: { icon: SiGraphql, color: "#E10098", label: "GraphQL" },
  mongodb: { icon: SiMongodb, color: "#47A248", label: "MongoDB" },
  postgresql: { icon: SiPostgresql, color: "#4169E1", label: "PostgreSQL" },
  mysql: { icon: SiMysql, color: "#4479A1", label: "MySQL" },
  firebase: { icon: SiFirebase, color: "#FFCA28", label: "Firebase" },
  supabase: { icon: SiSupabase, color: "#3ECF8E", label: "Supabase" },
  vercel: { icon: SiVercel, color: "#ffffff", label: "Vercel" },
  netlify: { icon: SiNetlify, color: "#00C7B7", label: "Netlify" },
  docker: { icon: SiDocker, color: "#2496ED", label: "Docker" },
  github: { icon: SiGithub, color: "#ffffff", label: "GitHub" },
  stripe: { icon: SiStripe, color: "#635BFF", label: "Stripe" },
};

export const TECH_ICON_OPTIONS = Object.entries(TECH_ICON_MAP).map(
  ([key, { label }]) => ({ key, label }),
);

export const TECH_CATEGORIES = ["Platforms", "Frameworks", "Languages", "Tools"];

// Renders the mapped brand icon, falling back to a generic globe icon
// if an iconKey doesn't (or no longer) resolve to anything.
export default function TechIcon({ iconKey, size = 32, className = "" }) {
  const entry = TECH_ICON_MAP[iconKey];
  const IconComponent = entry?.icon || Globe;
  const color = entry?.color || "#03DCB0";
  return <IconComponent size={size} color={color} className={className} />;
}
