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
  /** The slogan (client edits, slide 3). */
  headline: "Your Gate For Branding",
  /** Client copy, supplied in the November 2026 edits (slide 3). */
  intro: [
    "At Branding Gate, we bring brands to life through creative strategies, innovative digital solutions, impactful events, and exceptional brand experiences.",
    "From concept to execution, we combine creativity, technology, and production expertise to help businesses stand out, connect with their audiences, and make a lasting impact.",
  ],
} as const;

/** The services heading and line, used on Home and About (client copy, slide 10). */
export const servicesCopy = {
  heading: "All Things Creative. All in One Place.",
  body: "From strategy and digital to production and unforgettable experiences, we bring everything your brand needs together under one roof.",
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
  /** Client copy, supplied in the November 2026 edits (slide 7). */
  sections: [
    {
      title: "Who We Serve",
      body: "We work with businesses, brands, and organizations across different industries, helping them achieve their marketing and business objectives.",
    },
    {
      title: "What We Deliver",
      body: "We provide 360° marketing and creative solutions, including event management, digital marketing, media production, 3D design, branded giveaways, and web development.",
    },
    {
      title: "Where We Operate",
      body: "We deliver projects across all governorates of Egypt, supporting brands wherever their projects and events take place.",
    },
    {
      title: "How Our Capabilities Work Together",
      body: "By bringing strategy, creativity, marketing, and production together, we provide clients with an integrated solution through one agency, ensuring consistency from the initial idea to the final execution.",
    },
    {
      title: "How We Work",
      body: "Every project starts with understanding the client's brief, objectives, and requirements. We then develop the concept, plan the strategy, coordinate the creative and production process, and execute the project to deliver a solution tailored to the client's needs.",
    },
  ],
  team: {
    src: "/work/studio/team-2026.jpg",
    /** The team sits in the lower two-thirds of a 4:3 frame. */
    focus: "50% 62%",
    alt: "The Branding Gate team in matching white T-shirts, standing and seated on the edge of an outdoor stage under a lighting truss at night",
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
