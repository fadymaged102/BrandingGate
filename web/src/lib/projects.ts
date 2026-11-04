export type Discipline = "events" | "media" | "digital" | "3d" | "giveaways";

export const DISCIPLINES: { id: Discipline | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "events", label: "Events" },
  { id: "media", label: "Media" },
  { id: "digital", label: "Digital" },
  { id: "3d", label: "3D" },
  { id: "giveaways", label: "Giveaways" },
];

export const isDiscipline = (id: string): id is Discipline =>
  DISCIPLINES.some((d) => d.id === id && id !== "all");

/** The portfolio, pre-filtered to a discipline when there is work in it. */
export const portfolioHref = (id?: string) =>
  id && isDiscipline(id) ? `/portfolio?filter=${id}#work` : "/portfolio#work";

export type Frame = "screen" | "phone" | "plain";

export type Still = {
  src: string;
  alt: string;
  /** Intrinsic orientation; drives how the still is framed. */
  orientation: "landscape" | "portrait" | "square";
};

export type Step = {
  label: string;
  caption: string;
  still: Still;
};

export type Fact = { label: string; value: string };

type Base = {
  slug: string;
  title: string;
  client: string;
  disciplines: Discipline[];
  /** Short line shown on tiles and in the expansion view. */
  kicker: string;
  summary: string;
  cover: Still;
  /** Muted loop used on hover and in the expansion view. */
  loop?: string;
  frame: Frame;
  /** Grid footprint in whole cells on a 12-column unit grid. */
  span: { c: number; r: number };
  /** Aspect ratio used for the single-column mobile layout. */
  mobileRatio: string;
  /** Atmosphere accent; tints the page while this work is in focus. */
  accent: string;
  /** Optional page base for projects with their own palette. */
  base?: string;
  /** Focal point for object-position when the cover is cropped. */
  focus?: string;
};

export type CaseProject = Base & {
  kind: "case";
  facts: Fact[];
  headline: string;
  body: string[];
  scope: string[];
  secondaryAccent?: string;
  steps: Step[];
  gallery: Still[];
  film?: { youtubeId: string; title: string };
  reel?: string;
  compare?: {
    before: Still;
    after: Still;
    beforeLabel: string;
    afterLabel: string;
    caption: string;
  };
};

export type PieceProject = Base & {
  kind: "piece";
  discipline: string;
  /** A set of social posts, shown as a swipeable row when the piece opens. */
  posts?: Still[];
};

export type Project = CaseProject | PieceProject;

const still = (
  src: string,
  alt: string,
  orientation: Still["orientation"] = "landscape",
): Still => ({ src, alt, orientation });

const rahn: CaseProject = {
  kind: "case",
  slug: "rahn-schulen-graduation",
  title: "Rahn Schulen Graduation",
  client: "Rahn Schulen Kairo",
  disciplines: ["events"],
  kicker: "IB Diploma graduation, Class of 2025",
  summary:
    "A graduation night for Rahn Schulen in Cairo, staged in the school garden from the afternoon reception to the evening ceremony.",
  cover: still(
    "/work/rahn/class.jpg",
    "The Class of 2025 in black gowns and red stoles on stage under blue light beams",
  ),
  focus: "50% 60%",
  loop: "/work/rahn/loop.mp4",
  frame: "screen",
  span: { c: 8, r: 5 },
  mobileRatio: "16 / 10",
  accent: "#1fa3a0",
  secondaryAccent: "#d2453b",
  facts: [
    { label: "Client", value: "Rahn Schulen Kairo" },
    { label: "Date", value: "September 2025" },
    { label: "Location", value: "Cairo, Egypt" },
    { label: "Format", value: "Graduation ceremony" },
  ],
  headline: "A night of growth, dreams and new beginnings.",
  body: [
    "Branding Gate brought Rahn Schulen's graduation celebration to life in the heart of Cairo: a night of pride, laughter and memories that the graduates will keep. The venue was turned into a bright, warm setting that reflected both the elegance of the school and the excitement of its graduates.",
    "From the stage setup and lighting design to the entertainment and visual storytelling, every detail was built to mark the milestone. The night blended sophistication with joy, a tribute to the students, families and teachers who made the journey.",
  ],
  scope: ["Stage setup", "Lighting design", "Entertainment", "Visual storytelling"],
  steps: [
    {
      label: "Arrival",
      caption:
        "Branded signage and a garden path lead guests from the school building to the reception.",
      still: still(
        "/work/rahn/f02.jpg",
        "Graduation signage on a garden path lined with greenery",
      ),
    },
    {
      label: "The garden",
      caption:
        "Gold-framed seating set in clusters across the lawn, facing a single stage.",
      still: still(
        "/work/rahn/f04.jpg",
        "Rows of gold chairs and glass tables across the lawn, with the stage and LED screen in the distance",
      ),
    },
    {
      label: "Lighting",
      caption:
        "After sunset the trees in the garden take on teal and red.",
      still: still(
        "/work/rahn/f08.jpg",
        "Guests seated under trees lit in teal and red at night",
      ),
    },
    {
      label: "Live music",
      caption: "A violin and band set carries the evening between speeches.",
      still: still(
        "/work/rahn/music.jpg",
        "A violinist and guitarist performing on stage beside seated graduates",
      ),
    },
    {
      label: "The ceremony",
      caption: "The Class of 2025 takes the stage together under the beams.",
      still: still(
        "/work/rahn/class.jpg",
        "The graduating class standing together on stage under blue light beams",
      ),
    },
  ],
  gallery: [
    still("/work/rahn/f01.jpg", "IB graduation banner outside the school at golden hour"),
    still("/work/rahn/speech.jpg", "A speaker at the lectern with the stage screen lit behind her"),
    still("/work/rahn/families.jpg", "Two guests seated under trees uplit in green"),
    still("/work/rahn/stage.jpg", "Graduates in red stoles lined up on stage to receive their diplomas"),
    still("/work/rahn/f06.jpg", "Stage screen welcoming the graduates of the Class of 2025"),
    still("/work/rahn/f10.jpg", "Families at the evening ceremony beside a Rahn Education banner"),
  ],
  compare: {
    before: still(
      "/work/rahn/f03.jpg",
      "The garden in daylight during setup, with the pavilion and ceremony banner behind",
    ),
    after: still(
      "/work/rahn/f09.jpg",
      "The same garden at night, the pavilion and trees lit in teal and red",
    ),
    beforeLabel: "Afternoon",
    afterLabel: "Evening",
    caption: "Same garden, same pavilion. Drag to see what light does to a venue.",
  },
  film: { youtubeId: "DaNBXV7_d0E", title: "Rahn Schulen im Kairo graduation 2025" },
};

const eva: CaseProject = {
  kind: "case",
  slug: "eva-saudi-cluster-kickoff-2025",
  title: "EVA Saudi Cluster Kickoff 2025",
  client: "EVA Pharma",
  disciplines: ["events", "media"],
  kicker: "Regional kickoff for EVA Pharma's next phase in Saudi Arabia",
  summary:
    "The event that launched EVA Pharma's next phase of expansion in the Kingdom, bringing regional leaders, partners and teams under one roof.",
  cover: still(
    "/work/eva/group.jpg",
    "The EVA Pharma Saudi cluster team gathered for a group photo in the green-lit ballroom",
  ),
  loop: "/work/eva/loop.mp4",
  frame: "screen",
  span: { c: 12, r: 5 },
  mobileRatio: "16 / 10",
  accent: "#2fb36b",
  focus: "50% 45%",
  facts: [
    { label: "Client", value: "EVA Pharma" },
    { label: "Date", value: "September 2025" },
    { label: "Location", value: "Dubai" },
    { label: "Format", value: "Corporate kickoff" },
  ],
  headline: "More than a launch. The start of a journey in the Kingdom.",
  body: [
    "Branding Gate executed EVA Pharma's Saudi Cluster Kickoff 2025, the milestone that marked the official launch of EVA's next phase of expansion in the Kingdom of Saudi Arabia. Regional leaders, partners and teams gathered to celebrate EVA's growing footprint and its vision for the Gulf market.",
    "We designed the complete experience, from the thematic concept and stage design to lighting, multimedia and on-ground coordination, so that every moment reflected EVA's spirit of innovation, unity and purpose. The kickoff set the tone for a shared mission: high-quality healthcare made accessible across the region.",
  ],
  scope: [
    "Thematic concept",
    "Stage design",
    "Lighting",
    "Multimedia",
    "On-ground coordination",
  ],
  steps: [
    {
      label: "Concept",
      caption:
        "A clean, EVA-branded identity carried from the step-and-repeat to every badge and lanyard.",
      still: still(
        "/work/eva/f04.jpg",
        "EVA Pharma team in dark suits and green ties in front of the branded backdrop",
      ),
    },
    {
      label: "Lighting",
      caption: "Green uplighting takes the ballroom into EVA's colour before guests arrive.",
      still: still(
        "/work/eva/f01.jpg",
        "Hotel ballroom with round tables and green uplighting before the doors open",
      ),
    },
    {
      label: "Stage",
      caption: "A low stage, a wide screen and a branded lectern keep the focus on the speaker.",
      still: still(
        "/work/eva/podium.jpg",
        "A speaker at the branded lectern in front of a wide presentation screen",
      ),
    },
    {
      label: "Recognition",
      caption: "Awards handed out on stage, in front of the whole cluster.",
      still: still(
        "/work/eva/awards.jpg",
        "EVA leaders on stage presenting award plaques",
      ),
    },
    {
      label: "The room",
      caption: "A full house of regional teams, coordinated on the ground from first badge to last session.",
      still: still(
        "/work/eva/f09.jpg",
        "Wide view of the ballroom filled with attendees at round tables",
      ),
    },
  ],
  gallery: [
    still("/work/eva/f02.jpg", "Saudi leaders in conversation by the branded backdrop"),
    still("/work/eva/teambuilding.jpg", "Team members in chef hats around a table during a hands-on team activity"),
    still("/work/eva/f07.jpg", "A speaker presenting on stage beside an illuminated EVA totem"),
    still("/work/eva/flag.jpg", "The cluster team gathered around the Saudi flag"),
    still("/work/eva/f08.jpg", "Attendees seated at a round table during a session"),
    still("/work/eva/f03.jpg", "EVA leaders in thobes and suits at the branded step-and-repeat"),
  ],
  film: { youtubeId: "nrkxdZwf20g", title: "EVA Saudi Cluster Kickoff 2025" },
};

const limitless: CaseProject = {
  kind: "case",
  slug: "limitless-pharmacist",
  title: "I Am Limitless Pharmacist",
  client: "Limitless Naturals",
  disciplines: ["events", "media"],
  kicker: "Five years of Limitless Naturals, celebrated with its pharmacists",
  summary:
    "An open-air night for Limitless Naturals and the pharmacists behind the brand: arrival moments, a main LED stage and a full-house finale, filmed for vertical.",
  cover: still(
    "/work/limitless/f08.jpg",
    "The full team gathered on the lit I Am Limitless stage at night",
    "portrait",
  ),
  loop: "/work/limitless/loop.mp4",
  frame: "phone",
  span: { c: 4, r: 7 },
  mobileRatio: "9 / 16",
  accent: "#f8f8ff",
  base: "#0a0a0b",
  facts: [
    { label: "Client", value: "Limitless Naturals" },
    { label: "Occasion", value: "Fifth anniversary" },
    { label: "Format", value: "Open-air brand event" },
    { label: "Film", value: "Vertical, 9:16" },
  ],
  headline: "A brand that dresses in black and white, lit for one night.",
  body: [
    "Limitless Naturals marked five years with the people who carry the brand every day: pharmacists. The night ran from photo moments at arrival to a main stage of wide LED screens and a finale that brought the whole team up together.",
    "The film was shot vertical from the start, so the night reads the way most of its audience would see it: on a phone.",
  ],
  scope: ["Event production", "Stage and LED", "Vertical film"],
  steps: [
    {
      label: "Arrival",
      caption: "A 360 platform and the I Am Limitless arch greet guests at the door.",
      still: still(
        "/work/limitless/f01.jpg",
        "A guest on a rotating 360 camera platform at the entrance",
        "portrait",
      ),
    },
    {
      label: "Welcome",
      caption: "A hostess at the lit I Am Limitless sign welcomes each guest.",
      still: still(
        "/work/limitless/f02.jpg",
        "Hostess at the welcome desk in front of the illuminated I Am Limitless sign",
        "portrait",
      ),
    },
    {
      label: "Main stage",
      caption: "Wide LED screens carry the five-year identity across the stage.",
      still: still(
        "/work/limitless/f06.jpg",
        "Speaker on the main stage in front of a large LED product screen",
        "portrait",
      ),
    },
    {
      label: "Finale",
      caption: "The whole team on stage together for the finale.",
      still: still(
        "/work/limitless/f07.jpg",
        "The team celebrating on stage under the I Am Limitless sign",
        "portrait",
      ),
    },
  ],
  gallery: [
    still("/work/limitless/f03.jpg", "The audience under violet light facing the stage", "portrait"),
    still("/work/limitless/f04.jpg", "The stage and five-years graphic seen from the back of the crowd", "portrait"),
    still("/work/limitless/f08.jpg", "The team gathered on the lit stage at the finale", "portrait"),
  ],
  reel: "/work/limitless/reel.mp4",
};

const nightEvent: PieceProject = {
  kind: "piece",
  slug: "open-air-evening",
  title: "Open-air evening event",
  client: "Event management",
  discipline: "Event management",
  disciplines: ["events"],
  kicker: "Long tables, LED screens and a lit skyline",
  summary:
    "An open-air evening event: long communal tables, a central stage with LED screens and architectural lighting on the buildings behind.",
  cover: still(
    "/work/services/night-event.jpg",
    "Aerial view of an open-air evening event with long tables, LED screens and a lit mosque behind",
  ),
  frame: "plain",
  span: { c: 7, r: 4 },
  mobileRatio: "4 / 3",
  accent: "#3e6e8e",
};

const nawy: PieceProject = {
  kind: "piece",
  slug: "nawy-executive-interview",
  title: "Nawy executive interview",
  client: "Nawy",
  discipline: "Media production",
  disciplines: ["media"],
  kicker: "Corporate interview with Nawy's CEO",
  summary:
    "A corporate interview with Mostafa El Beltagy, Chief Executive Officer of Nawy, shot and finished with branded lower thirds.",
  cover: still(
    "/work/services/nawy.jpg",
    "Mostafa El Beltagy, Chief Executive Officer of Nawy, during a filmed interview",
  ),
  frame: "screen",
  span: { c: 4, r: 2 },
  mobileRatio: "16 / 10",
  accent: "#3a8fd6",
  focus: "50% 30%",
};

const bcg: PieceProject = {
  kind: "piece",
  slug: "bcg-stationery",
  title: "BCG stationery set",
  client: "BCG",
  discipline: "Giveaways",
  disciplines: ["giveaways"],
  kicker: "Notebooks and pens in BCG green",
  summary:
    "A branded giveaway set for BCG: hardcover and spiral notebooks with a matching pen, finished in the firm's green.",
  cover: still(
    "/work/services/bcg.jpg",
    "BCG-branded green and white notebooks with a black pen on a dark surface",
  ),
  frame: "plain",
  span: { c: 4, r: 2 },
  mobileRatio: "4 / 3",
  accent: "#29ba74",
};

const axa: PieceProject = {
  kind: "piece",
  slug: "axa-back-to-school",
  title: "AXA Back to School",
  client: "AXA",
  discipline: "Digital marketing",
  disciplines: ["digital"],
  kicker: "Arabic social campaign for the school season",
  summary:
    "An Arabic back-to-school creative for AXA, promoting its protection and savings plans to parents at the start of the school year.",
  cover: still(
    "/work/services/axa.jpg",
    "AXA Back to School campaign creative with Arabic headline and a smiling man in front of a red diagonal",
    "square",
  ),
  frame: "plain",
  span: { c: 5, r: 7 },
  mobileRatio: "1 / 1",
  accent: "#3d5bff",
  focus: "60% 50%",
};

const manara: PieceProject = {
  kind: "piece",
  slug: "manara-exhibition-stand",
  title: "Manara exhibition stand",
  client: "Manara",
  discipline: "3D design",
  disciplines: ["3d"],
  kicker: "3D concept for a stone-and-greenery stand",
  summary:
    "A 3D design for Manara's exhibition stand: curved stone walls, planted parapets, a lounge and a reception counter under an open truss ceiling.",
  cover: still(
    "/work/services/manara.jpg",
    "3D render of the Manara exhibition stand with curved stone walls, planters and lounge seating",
  ),
  frame: "plain",
  span: { c: 7, r: 3 },
  mobileRatio: "12 / 5",
  accent: "#b59a72",
};

// Client briefs supplied in the November 2026 edits (slide 12); images from
// the client's Drive folder (slide 11).
const tarzi: PieceProject = {
  kind: "piece",
  slug: "tarzi-social-media",
  title: "TARZI social media",
  client: "TARZI",
  discipline: "Digital marketing",
  disciplines: ["digital"],
  kicker: "Social media management for a tailoring brand",
  summary:
    "TARZI is a tailoring brand offering customized clothing and professional alteration services. Branding Gate worked with TARZI to promote its services, announce its store opening, and build its social media presence. The project focused on increasing brand awareness, highlighting its tailoring expertise, and connecting the brand with potential customers through engaging social media content.",
  cover: still(
    "/work/tarzi/post-05.jpg",
    "TARZI opening-day post: a purple gown on a mannequin in the shop, crossed by orange We Are Open tape, with the Hala Mall address",
    "portrait",
  ),
  posts: [
    still(
      "/work/tarzi/post-01.jpg",
      "TARZI post headlined Tailored to Your Style, showing a mannequin draped in purple satin with a yellow tape measure",
      "portrait",
    ),
    still(
      "/work/tarzi/post-02.jpg",
      "TARZI post headlined Step Up Your Style, with purple satin on a mannequin against a purple arch",
      "portrait",
    ),
    still(
      "/work/tarzi/post-03.jpg",
      "TARZI post headlined Perfect Tailoring for every piece of your suit, showing a basted suit jacket on a stand: suits, jackets, trousers, we fix them all",
      "portrait",
    ),
    still(
      "/work/tarzi/post-04.jpg",
      "TARZI post reading Pick the design you love and leave the tailoring to us, with blue silk draped on a dress form",
      "portrait",
    ),
    still(
      "/work/tarzi/post-05.jpg",
      "TARZI opening-day post: a purple gown on a mannequin in the shop, crossed by orange We Are Open tape, with the Hala Mall address",
      "portrait",
    ),
  ],
  frame: "plain",
  span: { c: 4, r: 5 },
  mobileRatio: "3 / 4",
  accent: "#5b2d8e",
};

const bridgePoint: PieceProject = {
  kind: "piece",
  slug: "bridge-point-properties-social-media",
  title: "Bridge Point Properties",
  client: "Bridge Point Properties",
  discipline: "Digital marketing",
  disciplines: ["digital"],
  kicker: "Social media for UAE real estate",
  summary:
    "For Bridge Point Properties, Branding Gate created social media content showcasing luxury properties, iconic destinations, and investment opportunities across the UAE. The project focused on presenting real estate developments in an engaging way while building a stronger connection with potential buyers.",
  cover: still(
    "/work/bridge-point/post-01.jpg",
    "Bridge Point Properties post for Bashayer: villas along a rocky shoreline under the line Your Villa Era Starts on the Water",
    "portrait",
  ),
  posts: [
    still(
      "/work/bridge-point/post-01.jpg",
      "Bridge Point Properties post for Bashayer: villas along a rocky shoreline under the line Your Villa Era Starts on the Water",
      "portrait",
    ),
    still(
      "/work/bridge-point/post-02.jpg",
      "Post for Hudayriyat Surf on Al Hudayriyat Island, with a young surfer riding a wave",
      "portrait",
    ),
    still(
      "/work/bridge-point/post-03.jpg",
      "Welcome to Al Reem Island post, showing the island's towers above the water and mangroves",
      "portrait",
    ),
    still(
      "/work/bridge-point/post-04.jpg",
      "Fahid Island post announcing a 5% down payment and waived ADM fee, with a cartoon mouse surfing in front of beachfront towers",
      "portrait",
    ),
    still(
      "/work/bridge-point/post-05.jpg",
      "Post reading Where Bold Design Becomes a Way of Living, over twin waterfront towers at dusk",
      "portrait",
    ),
    still(
      "/work/bridge-point/post-06.jpg",
      "A Waterfront Destination post, showing an aerial night view of a marina development",
      "portrait",
    ),
    still(
      "/work/bridge-point/post-07.jpg",
      "Brabus Al Raha Beach, Abu Dhabi post listing apartments, duplex penthouses and a 10% down payment over an aerial view of the beach",
      "portrait",
    ),
  ],
  frame: "plain",
  span: { c: 4, r: 5 },
  mobileRatio: "3 / 4",
  accent: "#2a6db0",
};

/** Grid order. Dense auto-placement fills the 12-column unit grid in this sequence. */
export const projects: Project[] = [
  rahn,
  limitless,
  nawy,
  bcg,
  eva,
  axa,
  nightEvent,
  manara,
  // Digital social sets close the grid in a row of portrait tiles.
  tarzi,
  bridgePoint,
];

export const caseProjects = projects.filter(
  (p): p is CaseProject => p.kind === "case",
);

export function getCase(slug: string): CaseProject | undefined {
  return caseProjects.find((p) => p.slug === slug);
}

export function getNextCase(slug: string): CaseProject {
  const i = caseProjects.findIndex((p) => p.slug === slug);
  return caseProjects[(i + 1) % caseProjects.length];
}

const FOUNDED = 2018;
const EVENTS = 1200;

export const studio = {
  name: "Branding Gate",
  founded: FOUNDED,
  city: "Cairo",
  events: EVENTS,
  stats: [
    { value: 120, label: "Clients" },
    { value: EVENTS, label: "Events" },
    { value: 60, label: "Creatives" },
    // A year, not a count: a "years" figure would go stale and differ
    // between the static build and the visitor's clock.
    { value: FOUNDED, label: "Founded", raw: true },
  ],
  clients: [
    "EVA Pharma",
    "Palm Hills",
    "SODIC",
    "Nawy",
    "Fawry",
    "BCG",
    "Emirates NBD",
    "Limitless Naturals",
    "OPPO",
    "DENSO",
    "Minapharm",
    "Bosta",
    "Utopia",
    "Teckman",
  ],
  contact: {
    address: "14 El-Zahraa St, Maadi, Cairo",
    phone: "+20 10 62321144",
    phoneHref: "tel:+201062321144",
    email: "info@branding-gate.com",
  },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/64644652/" },
    { label: "Instagram", href: "https://www.instagram.com/branding_gateadv/" },
    { label: "Facebook", href: "https://www.facebook.com/brandinggateadv/" },
    { label: "X", href: "https://x.com/branding_gate" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/portfolio" },
    { label: "Career", href: "/career" },
    { label: "Blog", href: "/blog" },
  ],
} as const;
