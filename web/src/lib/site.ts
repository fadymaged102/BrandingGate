/**
 * Studio-wide copy for Home and About, taken from brandinggate.com.
 * Project content lives in projects.ts; careers and posts have their own files.
 */

export type Service = { id: string; title: string };

export const services: Service[] = [
  { id: "events", title: "Event Management" },
  { id: "media", title: "Media Production" },
  { id: "digital", title: "Digital Marketing" },
  { id: "3d", title: "Exhibition Stands" },
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


/**
 * Client logos, recoloured to one off-white so they sit on navy. Ten come from
 * the files the client supplied (Drive, November 2026 edits) and 43 are cut
 * from the logo wall on the live brandinggate.com. Their wall versions are solid
 * boxes, so Emirates NBD is the bank's own SVG (emiratesnbd.com), DENSO and OPPO
 * are the Wikimedia Commons SVGs, and Fawry is a one-colour version of the
 * supplied logo without its yellow box.
 */
export const clientLogos: Record<(typeof clientWall)[number], { src: string; width: number; height: number }> = {
  "EVA Pharma": { src: "/clients/eva-pharma.webp", width: 306, height: 171 },
  "Redcon Steel": { src: "/clients/redcon-steel.webp", width: 223, height: 194 },
  Nawy: { src: "/clients/nawy.webp", width: 161, height: 194 },
  "Palm Hills Developments": { src: "/clients/palm-hills.webp", width: 628, height: 106 },
  Fawry: { src: "/clients/fawry.webp", width: 458, height: 131 },
  "Hero Baby": { src: "/clients/hero-baby.webp", width: 257, height: 141 },
  SODIC: { src: "/clients/sodic.webp", width: 507, height: 123 },
  "Fire Castle": { src: "/clients/fire-castle.webp", width: 286, height: 133 },
  "MBG Development": { src: "/clients/mbg-development.webp", width: 236, height: 105 },
  "Limitless Naturals": { src: "/clients/limitless-naturals.webp", width: 448, height: 133 },
  "Emirates NBD": { src: "/clients/emirates-nbd.webp", width: 473, height: 129 },
  BCG: { src: "/clients/bcg.webp", width: 370, height: 151 },
  "Mas Tech Industries": { src: "/clients/mas-tech.webp", width: 194, height: 155 },
  "Olea Valley": { src: "/clients/olea-valley.webp", width: 200, height: 140 },
  "Apex Pharma": { src: "/clients/apex-pharma.webp", width: 312, height: 90 },
  "EG Properties": { src: "/clients/eg-properties.webp", width: 224, height: 130 },
  IDG: { src: "/clients/idg.webp", width: 229, height: 114 },
  DevartLab: { src: "/clients/devartlab.webp", width: 245, height: 143 },
  "Hefny Pharma Group": { src: "/clients/hefny-pharma.webp", width: 133, height: 144 },
  "Al Wefaq Developments": { src: "/clients/al-wefaq.webp", width: 122, height: 189 },
  "Teriak Group": { src: "/clients/teriak.webp", width: 252, height: 181 },
  "SAK Developments": { src: "/clients/sak.webp", width: 331, height: 95 },
  Catalyst: { src: "/clients/catalyst.webp", width: 388, height: 78 },
  Adwia: { src: "/clients/adwia.webp", width: 302, height: 125 },
  "National Bank of Egypt": { src: "/clients/nbe.webp", width: 333, height: 82 },
  Chemipharm: { src: "/clients/chemipharm.webp", width: 309, height: 81 },
  EIPICO: { src: "/clients/eipico.webp", width: 157, height: 137 },
  Marcyrl: { src: "/clients/marcyrl.webp", width: 163, height: 154 },
  HSO: { src: "/clients/hso.webp", width: 194, height: 102 },
  Rameda: { src: "/clients/rameda.webp", width: 136, height: 150 },
  "Tabuk Pharmaceuticals": { src: "/clients/tabuk.webp", width: 354, height: 93 },
  OPPO: { src: "/clients/oppo.webp", width: 514, height: 122 },
  Solyphar: { src: "/clients/solyphar.webp", width: 262, height: 152 },
  "Dynamic Sound Studio": { src: "/clients/dynamic-sound.webp", width: 132, height: 184 },
  Cinfa: { src: "/clients/cinfa.webp", width: 255, height: 89 },
  "Pukka New Capital": { src: "/clients/pukka.webp", width: 219, height: 172 },
  "MT Ikar": { src: "/clients/mt-ikar.webp", width: 197, height: 169 },
  "Parkville Pharmaceuticals": { src: "/clients/parkville.webp", width: 282, height: 68 },
  "First Start": { src: "/clients/first-start.webp", width: 169, height: 125 },
  DENSO: { src: "/clients/denso.webp", width: 583, height: 112 },
  "Alesraa Pharmaceuticals": { src: "/clients/alesraa.webp", width: 157, height: 163 },
  "Mash Premiere": { src: "/clients/mash-premiere.webp", width: 313, height: 71 },
  Minapharm: { src: "/clients/minapharm.webp", width: 617, height: 107 },
  "Globe Pharmaceuticals": { src: "/clients/globe.webp", width: 313, height: 101 },
  Utopia: { src: "/clients/utopia.webp", width: 443, height: 135 },
  EGEMAC: { src: "/clients/egemac.webp", width: 334, height: 86 },
  "Emirates Logistics": { src: "/clients/emirates-logistics.webp", width: 494, height: 76 },
  vcloud: { src: "/clients/vcloud.webp", width: 350, height: 71 },
  "Orion Digital Solutions": { src: "/clients/orion.webp", width: 315, height: 99 },
  "DC Industries": { src: "/clients/dc-industries.webp", width: 526, height: 90 },
  AMS: { src: "/clients/ams.webp", width: 247, height: 142 },
  Bosta: { src: "/clients/bosta.webp", width: 413, height: 141 },
  Concrete: { src: "/clients/concrete.webp", width: 273, height: 57 },
  Valeurs: { src: "/clients/valeurs.webp", width: 319, height: 83 },
  Amanleek: { src: "/clients/amanleek.webp", width: 405, height: 86 },
  Teckman: { src: "/clients/teckman.webp", width: 537, height: 62 },
  "El Moughrabi": { src: "/clients/el-moughrabi.webp", width: 448, height: 133 },
};
