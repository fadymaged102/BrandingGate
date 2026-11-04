/**
 * Roles from brandinggate.com/career. Open roles apply through the Google
 * Form each listing already uses; closed and upcoming internships are listed
 * without one (client edits, November 2026, slide 16).
 */

export type Team = "creative" | "clients" | "marketing" | "finance" | "internship";

export const TEAMS: { id: Team | "all"; label: string }[] = [
  { id: "all", label: "All roles" },
  { id: "creative", label: "Creative" },
  { id: "clients", label: "Clients & sales" },
  { id: "marketing", label: "Marketing" },
  { id: "finance", label: "Finance" },
  { id: "internship", label: "Internship" },
];

type RoleBase = {
  slug: string;
  title: string;
  team: Team;
  location: string;
};

export type OpenRole = RoleBase & { status: "open"; summary: string; applyUrl: string };
export type ListedRole = RoleBase & { status: "closed" | "soon" };
export type Role = OpenRole | ListedRole;

export const STATUS_LABEL: Record<ListedRole["status"], string> = {
  closed: "Closed",
  soon: "Coming soon",
};

export const HEAD_OFFICE = "Head office, Maadi";

export const roles: Role[] = [
  {
    slug: "senior-2d-3d-designer",
    title: "Senior 2D / 3D Designer",
    team: "creative",
    status: "open",
    location: HEAD_OFFICE,
    summary:
      "We are looking for a Creative Designer to conceptualize and execute compelling visuals across various digital and print platforms. The ideal candidate should have a strong sense of design, creativity, and attention to detail, along with proficiency in design software and the ability to work in a fast-paced environment.",
    applyUrl: "https://forms.gle/GcBqn4sHQCXFPqmp8",
  },
  {
    slug: "senior-account-manager",
    title: "Senior Account Manager",
    team: "clients",
    status: "open",
    location: HEAD_OFFICE,
    summary:
      "Our Senior Account Manager is not just a liaison — they are a strategic partner. They combine analytical thinking with creative problem-solving to turn client goals into measurable success. Their proactive approach, excellent communication skills, and ability to lead under pressure make them an essential part of our client-focused culture.",
    applyUrl: "https://forms.gle/avym6ut1rM5HmhJg9",
  },
  {
    slug: "sales-consultant",
    title: "Sales Consultant",
    team: "clients",
    status: "open",
    location: HEAD_OFFICE,
    summary:
      "We are seeking a highly motivated and experienced Senior Sales Consultant to join our team. The ideal candidate will have a proven track record in sales, strong business acumen, and the ability to build lasting client relationships. As a Senior Sales Consultant, you will play a key role in driving revenue growth, identifying new business opportunities, and providing tailored solutions to meet client needs.",
    applyUrl: "https://forms.gle/tFg1aVuXNwJad37u8",
  },
  {
    slug: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    team: "marketing",
    status: "open",
    location: HEAD_OFFICE,
    summary:
      "We are looking for a Digital Marketing Specialist to develop, implement, track, and optimize our digital marketing campaigns across all digital channels. The ideal candidate should have a strong grasp of current marketing tools and strategies and be able to lead integrated digital marketing campaigns from concept to execution.",
    applyUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScWWZL3wQM2TETMm0aDHHo6S5Vcr1OmF2jubAMSwIa8CNq16g/viewform?usp=header",
  },
  {
    slug: "accountant",
    title: "Accountant",
    team: "finance",
    status: "open",
    location: HEAD_OFFICE,
    summary:
      "We are looking for detail-oriented, analytical, and motivated accounting professionals to join our growing team. If you are passionate about numbers, accuracy, and financial organization, we would love to hear from you.",
    applyUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSfTmRWiGL_DqapobN0KSAGBnPnxo80qFQIVs9PZVkoienUwIg/viewform?usp=send_form",
  },
  {
    slug: "summer-internship-2025",
    title: "Summer Internship 2025",
    team: "internship",
    status: "closed",
    location: HEAD_OFFICE,
  },
  {
    slug: "summer-internship-2026",
    title: "Summer Internship 2026",
    team: "internship",
    status: "closed",
    location: HEAD_OFFICE,
  },
  {
    slug: "next-internship-program",
    title: "Next internship program",
    team: "internship",
    status: "soon",
    location: HEAD_OFFICE,
  },
];

export const openRoles = roles.filter((r): r is OpenRole => r.status === "open");
