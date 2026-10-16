/**
 * Studio-wide copy for Home and About, taken from brandinggate.com.
 * Project content lives in projects.ts; careers and posts have their own files.
 */

export type Service = { id: string; title: string };

export const services: Service[] = [
  { id: "events", title: "Event Management" },
  { id: "media", title: "Media Production" },
  { id: "digital", title: "Digital Marketing" },
  { id: "3d", title: "3D Designs" },
  { id: "giveaways", title: "Giveaways" },
  { id: "web", title: "Web Development" },
];

export const home = {
  eyebrow: "At Branding Gate",
  headline: "We Unleash Creativity",
  servicesIntro: "Events, media, digital, 3D, giveaways and web: six disciplines, one studio.",
  intro:
    "We infuse vitality into every project, delivering customized creative solutions that make each endeavor truly extraordinary.",
} as const;

/** The six values, in the order the About page lists them. */
export type ValueId = "exceed" | "part" | "beyond" | "people" | "thrive" | "courage";

export const values: { id: ValueId; title: string }[] = [
  { id: "exceed", title: "Exceed customer expectations" },
  { id: "part", title: "Everyone has a part" },
  { id: "beyond", title: "Look beyond today" },
  { id: "people", title: "It’s the people" },
  { id: "thrive", title: "Thrive together" },
  { id: "courage", title: "Courage to act" },
];

export const about = {
  title: "Welcome to Branding Gate.",
  body: "Our company is driven by a passion for storytelling and a commitment to delivering exceptional results. We take pride in our team of creative minds who are dedicated to pushing boundaries and exceeding expectations. At Branding Gate, we believe in the power of unique narratives to elevate brands and create lasting impressions.",
  team: {
    src: "/work/studio/team.jpg",
    alt: "The Branding Gate team standing together on a seaside promenade at sunset",
  },
} as const;

/** Every client shown on the live site's client wall, in its order. */
export const clientWall = [
  "EVA Pharma",
  "Redcon Steel",
  "Nawy",
  "Palm Hills Developments",
  "Fawry",
  "Hero Baby",
  "SODIC",
  "Fire Castle",
  "MBG Development",
  "Limitless Naturals",
  "Emirates NBD",
  "BCG",
  "Mas Tech Industries",
  "Olea Valley",
  "Apex Pharma",
  "EG Properties",
  "IDG",
  "DevartLab",
  "Hefny Pharma Group",
  "Al Wefaq Developments",
  "Teriak Group",
  "SAK Developments",
  "Catalyst",
  "Adwia",
  "National Bank of Egypt",
  "Chemipharm",
  "EIPICO",
  "Marcyrl",
  "HSO",
  "Rameda",
  "Tabuk Pharmaceuticals",
  "OPPO",
  "Solyphar",
  "Dynamic Sound Studio",
  "Cinfa",
  "Pukka New Capital",
  "MT Ikar",
  "Parkville Pharmaceuticals",
  "First Start",
  "DENSO",
  "Alesraa Pharmaceuticals",
  "Mash Premiere",
  "Minapharm",
  "Globe Pharmaceuticals",
  "Utopia",
  "EGEMAC",
  "Emirates Logistics",
  "vcloud",
  "Orion Digital Solutions",
  "DC Industries",
  "AMS",
  "Bosta",
  "Concrete",
  "Valeurs",
  "Amanleek",
  "Teckman",
  "El Moughrabi",
] as const;
