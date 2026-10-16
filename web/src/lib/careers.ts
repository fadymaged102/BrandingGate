/**
 * Open roles from brandinggate.com/career. Applications go through the
 * Google Form each listing already uses.
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

export type Role = {
  slug: string;
  title: string;
  team: Team;
  location: string;
  summary: string;
  applyUrl: string;
};

export const HEAD_OFFICE = "Head office, Maadi";

export const roles: Role[] = [
  {
    slug: "summer-internship-2026",
    title: "Summer Internship 2026",
    team: "internship",
    location: HEAD_OFFICE,
    summary:
      "Kickstart your career with Branding Gate’s Summer Internship Program! This hands-on experience is designed for passionate and driven individuals eager to explore the world of 360° marketing, branding, and event management.",
    applyUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSf07IPCVmQgIo8TDaw7uJgaFEwCALFkV-vhYOhsoticKa1JIQ/viewform",
  },
  {
    slug: "senior-2d-3d-designer",
    title: "Senior 2D / 3D Designer",
    team: "creative",
    location: HEAD_OFFICE,
    summary:
      "We are looking for a Creative Designer to conceptualize and execute compelling visuals across various digital and print platforms. The ideal candidate should have a strong sense of design, creativity, and attention to detail, along with proficiency in design software and the ability to work in a fast-paced environment.",
    applyUrl: "https://forms.gle/GcBqn4sHQCXFPqmp8",
  },
  {
    slug: "senior-account-manager",
    title: "Senior Account Manager",
    team: "clients",
    location: HEAD_OFFICE,
    summary:
      "Our Senior Account Manager is not just a liaison — they are a strategic partner. They combine analytical thinking with creative problem-solving to turn client goals into measurable success. Their proactive approach, excellent communication skills, and ability to lead under pressure make them an essential part of our client-focused culture.",
    applyUrl: "https://forms.gle/avym6ut1rM5HmhJg9",
  },
  {
    slug: "sales-consultant",
    title: "Sales Consultant",
    team: "clients",
    location: HEAD_OFFICE,
    summary:
      "We are seeking a highly motivated and experienced Senior Sales Consultant to join our team. The ideal candidate will have a proven track record in sales, strong business acumen, and the ability to build lasting client relationships. As a Senior Sales Consultant, you will play a key role in driving revenue growth, identifying new business opportunities, and providing tailored solutions to meet client needs.",
    applyUrl: "https://forms.gle/tFg1aVuXNwJad37u8",
  },
  {
    slug: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    team: "marketing",
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
    location: HEAD_OFFICE,
    summary:
      "We are looking for detail-oriented, analytical, and motivated accounting professionals to join our growing team. If you are passionate about numbers, accuracy, and financial organization, we would love to hear from you.",
    applyUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSfTmRWiGL_DqapobN0KSAGBnPnxo80qFQIVs9PZVkoienUwIg/viewform?usp=send_form",
  },
];
