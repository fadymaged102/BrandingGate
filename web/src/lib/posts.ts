/**
 * Blog posts migrated from brandinggate.com/blog. Text is as published;
 * only the editor's stray formatting marks and emoji bullets were removed.
 */

export type Category = "social" | "digital" | "events";

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All posts" },
  { id: "social", label: "Social media" },
  { id: "digital", label: "Digital marketing" },
  { id: "events", label: "Events" },
];

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "facts"; items: { label: string; value: string }[] }
  | { type: "link"; label: string; href: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  /** ISO date as published. */
  date: string;
  category: Category;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "the-magic-behind-disney-on-ice-who-brings-it-to-life",
    title: "The Magic Behind Disney On Ice: Who Brings It to Life?",
    excerpt:
      "Disney On Ice is a globally renowned ice-skating show produced by Feld Entertainment in collaboration with The Walt Disney Company.",
    author: "Mira Maher",
    date: "2025-02-16",
    category: "events",
    body: [
      {
        type: "p",
        text: "Disney On Ice is a globally renowned ice-skating show produced by Feld Entertainment in collaboration with The Walt Disney Company. Since its debut in 1981, the show has captivated millions worldwide, transforming classic Disney stories into spectacular performances on ice.",
      },
      {
        type: "p",
        text: "With world-class skaters, breathtaking choreography, and stunning visual effects, each production brings Disney magic to life in a way that mesmerizes audiences of all ages. The shows continuously evolve, featuring beloved characters from classics like Mickey & Minnie to modern favorites like Elsa, Moana, and Buzz Lightyear.",
      },
      {
        type: "p",
        text: "From set design to choreography, Disney On Ice is a true celebration of creativity, teamwork, and storytelling—ensuring every performance is a magical, unforgettable experience!",
      },
      { type: "link", label: "Tickets on Tazkarti", href: "https://tazkarti.com/#/events/category/59" },
    ],
  },
  {
    slug: "the-best-time-to-post-on-social-media-for-maximum-engagement",
    title: "The Best Time to Post on Social Media for Maximum Engagement",
    excerpt:
      "In today's digital world, timing is everything when it comes to social media marketing. Posting at the right time can make a huge difference in reach, engagement, and conversions.",
    author: "saviokero",
    date: "2025-02-10",
    category: "social",
    body: [
      {
        type: "p",
        text: "In today's digital world, timing is everything when it comes to social media marketing. Posting at the right time can make a huge difference in reach, engagement, and conversions. But when exactly should you post?",
      },
      {
        type: "p",
        text: "At Branding Gate, we use data-driven insights to determine the best posting times across different platforms. Here’s what you need to know:",
      },
      { type: "h2", text: "Best Times to Post on Each Platform" },
      {
        type: "p",
        text: "Each social media platform has its own peak activity times based on user behavior. Here's a general guide:",
      },
      { type: "h3", text: "Facebook" },
      {
        type: "facts",
        items: [
          { label: "Best time", value: "9 AM – 12 PM & 6 PM – 9 PM" },
          { label: "Best days", value: "Tuesday, Wednesday, Thursday" },
          { label: "Why", value: "Most users check Facebook in the morning before work and in the evening after work." },
        ],
      },
      { type: "h3", text: "Instagram" },
      {
        type: "facts",
        items: [
          { label: "Best time", value: "11 AM – 1 PM & 7 PM – 9 PM" },
          { label: "Best days", value: "Monday, Wednesday, Friday" },
          {
            label: "Why",
            value:
              "Instagram engagement is highest during lunch breaks and after work hours when people scroll through their feeds.",
          },
        ],
      },
      { type: "h3", text: "LinkedIn" },
      {
        type: "facts",
        items: [
          { label: "Best time", value: "8 AM – 10 AM & 5 PM – 7 PM" },
          { label: "Best days", value: "Tuesday, Wednesday, Thursday" },
          {
            label: "Why",
            value:
              "LinkedIn is a professional network, so activity peaks before work, during lunch breaks, and after work hours.",
          },
        ],
      },
      { type: "h3", text: "X (Twitter)" },
      {
        type: "facts",
        items: [
          { label: "Best time", value: "8 AM – 10 AM & 6 PM – 9 PM" },
          { label: "Best days", value: "Monday – Friday" },
          {
            label: "Why",
            value: "Twitter is used for real-time updates, so morning and evening hours see the highest activity.",
          },
        ],
      },
      { type: "h3", text: "TikTok" },
      {
        type: "facts",
        items: [
          { label: "Best time", value: "7 PM – 10 PM" },
          { label: "Best days", value: "Thursday – Sunday" },
          { label: "Why", value: "TikTok users are most active at night, when they have time to watch and engage with videos." },
        ],
      },
      { type: "h2", text: "How to Choose the Best Time for Your Brand" },
      {
        type: "p",
        text: "While these are general best practices, your audience may have different habits. Here’s how to find the perfect posting time for your brand:",
      },
      {
        type: "list",
        items: [
          "Analyze Insights: Use Facebook Insights, Instagram Analytics, and LinkedIn Analytics to see when your followers are most active.",
          "Test Different Times: Post at different hours and track engagement.",
          "Know Your Audience: Are they professionals? Night owls? Students? Adjust accordingly.",
        ],
      },
      { type: "h2", text: "Maximize Your Social Media Strategy" },
      {
        type: "p",
        text: "Posting at the right time is just one piece of the puzzle. To truly boost engagement, make sure your content is:",
      },
      {
        type: "list",
        items: [
          "Relevant – Know what your audience wants.",
          "Visually Appealing – High-quality images/videos perform best.",
          "Engaging – Ask questions, use calls to action, and interact with followers.",
        ],
      },
      {
        type: "p",
        text: "Want to take your brand’s social media to the next level? Let Branding Gate help! Contact us today.",
      },
    ],
  },
  {
    slug: "10-essential-tips-for-digital-marketing-success",
    title: "10 Essential Tips for Digital Marketing Success",
    excerpt:
      "In today’s fast-paced digital world, marketing strategies must evolve to keep up with technological advancements and changing consumer behavior.",
    author: "saviokero",
    date: "2025-02-09",
    category: "digital",
    body: [
      {
        type: "p",
        text: "In today’s fast-paced digital world, marketing strategies must evolve to keep up with technological advancements and changing consumer behavior. Whether you’re a seasoned marketer or just starting out, these 10 tips will help you maximize your digital marketing efforts and achieve success.",
      },
      { type: "h2", text: "1. Define Your Target Audience" },
      {
        type: "p",
        text: "Understanding your audience is the foundation of any successful marketing strategy. Use analytics tools to identify demographics, preferences, and online behavior. Tailor your content and campaigns to address their specific needs and interests.",
      },
      { type: "h2", text: "2. Leverage Social Media Effectively" },
      {
        type: "p",
        text: "Social media platforms are powerful tools for engaging with your audience. Choose the right platforms based on your target audience, create engaging content, and interact with followers to build a loyal community.",
      },
      { type: "h2", text: "3. Invest in High-Quality Content" },
      {
        type: "p",
        text: "Content is king in digital marketing. Whether it’s blog posts, videos, infographics, or podcasts, ensure your content is valuable, informative, and engaging. Consistency and quality will help you establish authority in your industry.",
      },
      { type: "h2", text: "4. Optimize for SEO" },
      {
        type: "p",
        text: "Search Engine Optimization (SEO) helps improve your website’s visibility on search engines. Use relevant keywords, optimize website speed, and create high-quality backlinks to enhance your search rankings.",
      },
      { type: "h2", text: "5. Utilize Email Marketing" },
      {
        type: "p",
        text: "Email marketing remains one of the most effective ways to nurture leads and convert them into customers. Personalize emails, segment your audience, and use compelling subject lines to improve open rates.",
      },
      { type: "h2", text: "6. Embrace Video Marketing" },
      {
        type: "p",
        text: "Videos are highly engaging and can significantly boost conversions. Use platforms like YouTube, Instagram, and TikTok to share tutorials, testimonials, and behind-the-scenes content to connect with your audience.",
      },
      { type: "h2", text: "7. Use Paid Advertising Strategically" },
      {
        type: "p",
        text: "Invest in paid advertising such as Google Ads, Facebook Ads, and Instagram promotions to reach a broader audience. Ensure you target the right demographics and continuously analyze performance metrics for optimization.",
      },
      { type: "h2", text: "8. Monitor Analytics and Adjust Strategies" },
      {
        type: "p",
        text: "Regularly track your digital marketing performance using tools like Google Analytics, Facebook Insights, and HubSpot. Understanding what works and what doesn’t will help you refine your strategy and improve results.",
      },
      { type: "h2", text: "9. Engage with Influencers" },
      {
        type: "p",
        text: "Partnering with influencers in your niche can help you reach a wider audience. Choose influencers who align with your brand values and have an engaged following to maximize your marketing efforts.",
      },
      { type: "h2", text: "10. Stay Updated with Trends" },
      {
        type: "p",
        text: "The digital marketing landscape is constantly evolving. Keep up with the latest trends, algorithm changes, and new marketing tools to stay ahead of the competition.",
      },
      {
        type: "p",
        text: "By implementing these 10 tips, you can build a strong digital marketing strategy that drives traffic, engagement, and conversions. Stay adaptable, test different approaches, and always focus on delivering value to your audience.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/** Reading time from the text itself, at 220 words a minute. */
export function readingMinutes(post: Post) {
  const words = post.body
    .flatMap((b) => {
      switch (b.type) {
        case "list":
          return b.items;
        case "facts":
          return b.items.map((i) => i.value);
        case "link":
          return [b.label];
        default:
          return [b.text];
      }
    })
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
