const images = [
  "/assets/images/bidisha-hero-v2.webp",
  "/assets/images/bidisha-welspun-program.webp",
  "/assets/images/bidisha-hero.webp",
  "/assets/images/bidisha-hero-moible.webp",
  "/assets/images/bidisha-corporate-session.webp",
  "/assets/images/bidisha-executive-coaching.webp",
];

const articles = [
  ["Why Executive Presence Is a Business Skill, Not a Personality Trait", "Executive Presence", "Presence becomes practical when leaders can translate credibility, clarity, and conviction into better decisions.", "Insight Series"],
  ["From HiPo to Enterprise Leader: What Actually Changes", "Leadership Development", "The shift from functional excellence to enterprise readiness requires new judgement, visibility, and ownership.", "Leadership Notes"],
  ["AI Adoption Fails Without Leadership Behaviour Change", "AI & Future Skills", "Tools do not transform work on their own. Leaders set the permission, governance, and habits that make adoption real.", "Future Skills"],
  ["Psychological Safety as a Performance System", "Culture", "High standards and human trust are not opposites. The strongest teams design for both.", "Culture Fieldnote"],
  ["The New Rules of Influence Without Authority", "Influence", "Matrix organisations reward leaders who can create alignment before they ask for action.", "Executive Brief"],
  ["What Women Leaders Need Beyond Generic Leadership Training", "Women in Leadership", "Meaningful development addresses visibility, sponsorship, power dynamics, and the real choices women leaders face.", "Programme View"],
];

function slugify(value) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const defaultBlogs = articles.map(([title, category, excerpt, date], index) => {
  const slug = slugify(title);
  return {
    id: `blog-${slug}`,
    title,
    slug,
    categoryId: `category-${slugify(category)}`,
    category,
    excerpt,
    body: `<p>${excerpt}</p><h2>Why this matters now</h2><p>Leadership capability becomes valuable when it changes decisions, conversations, and everyday behaviour. RYSEN connects each idea to the business context so leaders can practise it where the stakes are real.</p><h2>From insight to action</h2><p>Start with one visible behaviour, create a repeatable opportunity to practise it, and use feedback to improve. Sustainable growth is built through deliberate application, reinforcement, and reflection.</p>`,
    author: "Bidisha Banerjee",
    date,
    status: "Published",
    featuredImage: images[index],
    featuredImageAlt: `${category} leadership insight`,
    videoUrl: "",
    videoFile: "",
    seoTitle: title,
    seoDescription: excerpt,
    seoKeywords: category,
    canonicalUrl: `/resources/${slug}`,
    ogTitle: title,
    ogDescription: excerpt,
    ogImage: images[index],
  };
});
