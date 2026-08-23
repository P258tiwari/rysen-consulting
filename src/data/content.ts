import {
  Award,
  Brain,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Compass,
  Handshake,
  Lightbulb,
  MessagesSquare,
  Mic2,
  Network,
  Presentation,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  hero: string;
  image: string;
  imageAlt: string;
  description: string;
  icon: LucideIcon;
  shortDescription: string;
  signatureSolutions: string[];
  outcomes: string[];
};

export type CaseStudy = {
  id: string;
  title: string;
  practiceArea: string;
  challenge: string[];
  solution: string[];
  impact: string[];
  image: string;
  imageAlt: string;
};

export const contact = {
  email: "bidisha@rysencoaching.com",
  phone: "+91 74980 78920",
};

export const stats = [
  { value: 25, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+", label: "Leaders Coached" },
  { value: 50, suffix: "+", label: "Organisations Served" },
  { value: 4, suffix: "", label: "India, UK, US & Gulf Markets" },
];

export const edgeStages = [
  {
    title: "Diagnose",
    text: "Understand business context, leadership gaps, culture, and desired outcomes.",
  },
  {
    title: "Design",
    text: "Create bespoke journeys, assessments, simulations, and coaching architecture.",
  },
  {
    title: "Deliver",
    text: "Facilitate immersive workshops, labs, coaching, and action learning.",
  },
  {
    title: "Embed",
    text: "Reinforce learning through peer circles, leader sponsorship, tools, and practice.",
  },
  {
    title: "Measure",
    text: "Track behaviour change, readiness, engagement, adoption, and business impact.",
  },
];

export const services: Service[] = [
  {
    slug: "leadership-development",
    title: "Leadership Development",
    eyebrow: "Leadership journeys",
    hero: "Develop leaders who can navigate complexity, inspire teams, and drive business outcomes.",
    image: "/assets/images/services/leadership-development-ai.jpg",
    imageAlt: "Leadership facilitator guiding an interactive development programme",
    description:
      "Bespoke leadership programmes for every career stage, from early talent to C-suite acceleration.",
    icon: Compass,
    shortDescription:
      "Build leader capability across levels with immersive, business-linked programmes and measurable behaviour shifts.",
    signatureSolutions: [
      "Campus-to-Corporate",
      "First-Time Manager Bootcamp",
      "Manager Mastery Program",
      "HiPo Leadership Lab",
      "Senior Leadership Edge",
      "C-Suite Accelerator",
    ],
    outcomes: ["Readiness", "Ownership", "Execution", "Enterprise thinking"],
  },
  {
    slug: "executive-presence-influence",
    title: "Executive Presence & Influence",
    eyebrow: "Presence and communication",
    hero: "Helping leaders build credibility, gravitas, confidence, visibility, and strategic influence.",
    image: "/assets/images/services/executive-presence-influence-ai.jpg",
    imageAlt: "Senior leader presenting with confidence and executive presence",
    description:
      "Practical labs and coaching for leaders who need to hold a room, shape decisions, and communicate with authority.",
    icon: Presentation,
    shortDescription:
      "Strengthen gravitas, visibility, boardroom communication, storytelling, and influence without authority.",
    signatureSolutions: [
      "Executive Presence Lab",
      "Gravitas Blueprint",
      "Strategic Communication",
      "Leadership Brand",
      "Boardroom Presence",
      "Influence Without Authority",
      "Strategic Storytelling",
      "High-Stakes Conversations",
    ],
    outcomes: ["Credibility", "Gravitas", "Influence", "Strategic communication"],
  },
  {
    slug: "executive-coaching",
    title: "Executive Coaching",
    eyebrow: "Outcome-focused coaching",
    hero: "Outcome-focused coaching for leaders navigating growth, transition, and complexity.",
    image: "/assets/images/services/executive-coaching-ai.jpg",
    imageAlt: "Executive coach in a focused one-to-one leadership conversation",
    description:
      "Confidential coaching engagements that connect self-awareness, stakeholder impact, and business results.",
    icon: MessagesSquare,
    shortDescription:
      "Support senior leaders through transitions, stakeholder complexity, cross-cultural leadership, and growth moments.",
    signatureSolutions: [
      "Executive transition coaching",
      "Senior leadership coaching",
      "Cross-cultural leadership coaching",
      "360 feedback and leadership development planning",
      "Team alignment coaching",
      "Stakeholder influence coaching",
      "Career inflection coaching",
    ],
    outcomes: ["Self-awareness", "Transition", "Alignment", "Stakeholder impact"],
  },
  {
    slug: "ai-future-skills",
    title: "AI & Future Skills",
    eyebrow: "Future-ready capability",
    hero: "Preparing organisations and leaders to leverage AI responsibly and effectively.",
    image: "/assets/images/services/ai-future-skills-ai.jpg",
    imageAlt: "Business leaders applying AI in a practical future-skills workshop",
    description:
      "AI adoption journeys that help leaders and teams move from awareness to confident, governed application.",
    icon: Brain,
    shortDescription:
      "Build practical AI capability through leader education, productivity labs, prompt engineering, and adoption systems.",
    signatureSolutions: [
      "AI for Leaders",
      "AI Productivity",
      "Prompt Engineering",
      "AI for HR",
      "AI for Managers",
      "Responsible AI",
      "AI Adoption Journeys",
      "Future Skills Workshops",
    ],
    outcomes: ["Confidence", "Productivity", "Governance", "Adoption"],
  },
  {
    slug: "talent-strategy-organisational-effectiveness",
    title: "Talent Strategy & Organisational Effectiveness",
    eyebrow: "Talent systems",
    hero: "Helping organisations build robust talent systems that enable sustainable growth.",
    image: "/assets/images/services/talent-strategy-organisational-effectiveness-ai.jpg",
    imageAlt: "Leadership team collaborating on talent strategy and organisational effectiveness",
    description:
      "Assessment, succession, career architecture, and capability systems that make talent decisions sharper and fairer.",
    icon: Network,
    shortDescription:
      "Design talent systems that turn potential into succession strength, clear capability paths, and stronger performance.",
    signatureSolutions: [
      "Assessment Centres",
      "Succession Planning",
      "Talent Reviews",
      "Leadership Competency Frameworks",
      "Career Architecture",
      "Individual Development Plans",
      "Capability Academies",
      "Organisational Effectiveness Diagnostics",
    ],
    outcomes: ["Succession", "Capability", "Fairness", "Growth systems"],
  },
  {
    slug: "culture-deib-change",
    title: "Culture, DEIB & Change",
    eyebrow: "Culture and inclusion",
    hero: "Creating workplaces where inclusion, collaboration, and performance thrive together.",
    image: "/assets/images/services/culture-deib-change-ai.jpg",
    imageAlt: "Diverse leaders collaborating in an inclusion and culture workshop",
    description:
      "Human, practical change journeys that build psychological safety, inclusive leadership, and team effectiveness.",
    icon: UsersRound,
    shortDescription:
      "Enable cultures where inclusion, collaboration, trust, and performance strengthen each other.",
    signatureSolutions: [
      "Inclusive Leadership",
      "Women in Leadership",
      "Psychological Safety",
      "Generational Diversity",
      "Allyship",
      "Culture Transformation",
      "Change Leadership",
      "Team Effectiveness",
    ],
    outcomes: ["Inclusion", "Trust", "Change", "Team performance"],
  },
];

export const leadershipSteps = [
  {
    title: "Campus-to-Corporate",
    audience: "Newly hired or newly promoted professionals",
    shift: "Managing tasks to managing people",
    outcome:
      "Quick learners who speak with confidence, grasp business fast, and add value from day one.",
  },
  {
    title: "Individual Excellence Program",
    audience: "Experienced professionals, SMEs, senior specialists",
    shift: "Individual performer to valued expert and organisational contributor",
    outcome:
      "Experts who blend mastery with influence, drive outcomes, unite teams, and lead through expertise.",
  },
  {
    title: "Frontline Leader Foundation",
    audience: "Frontline leaders, team leads",
    shift: "Individual contributor to people supervisor",
    outcome:
      "Supervisors who lead with authority, set daily standards, build strong teams, and own frontline results.",
  },
  {
    title: "First-Time Manager Bootcamp",
    audience: "Newly promoted managers",
    shift: "Managing tasks to managing people",
    outcome:
      "Managers who shift identity with clarity, build trust through candor, and own team outcomes.",
  },
  {
    title: "Manager Mastery Program",
    audience: "Middle-level managers",
    shift: "People management to business and execution leadership",
    outcome:
      "Leaders who rise beyond operations, drive strategy, build strong teams, and lead with authority.",
  },
  {
    title: "HiPo Leadership Lab",
    audience: "High-potential leaders",
    shift: "Functional excellence to enterprise readiness",
    outcome:
      "Leaders who step up with conviction, think enterprise, build influence, and grow with business acumen.",
  },
  {
    title: "Senior Leadership Edge",
    audience: "GM / VP pipeline, senior functional leaders",
    shift: "Functional leadership to enterprise leadership",
    outcome:
      "Leaders who claim enterprise authority, set strategy, grow leaders, and own outcomes.",
  },
  {
    title: "C-Suite Accelerator",
    audience: "CXOs, founders",
    shift: "Running the business to shaping the future",
    outcome:
      "Leaders who shape industries, build cultures, and leave stronger organisations as legacy.",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: "hipo-leadership-journey",
    title: "HiPo Leadership Journey at a Leading Infrastructure Group",
    practiceArea: "Leadership Development",
    challenge: [
      "High-potential employees had no structured platform to stretch beyond functional roles.",
      "Leadership pipeline lacked enterprise thinkers.",
      "No cross-functional exposure or real-world problem-solving was embedded.",
      "Senior leaders had limited visibility into next-level readiness.",
    ],
    solution: [
      "Designed and delivered a 6-month HiPo Leadership Lab.",
      "Embedded 15 Action Learning Projects tied to strategic priorities.",
      "Facilitated peer coaching circles, 360 feedback debriefs, and capability reviews.",
      "Concluded with showcase to Executive Committee.",
    ],
    impact: [
      "8 of 15 ALPs implemented into live business operations.",
      "HiPo readiness index moved from 38% to 76%.",
      "18% participants elevated to senior roles.",
      "Engagement improved from 61% to 94%.",
    ],
    image: "/assets/images/case-studies/hipo-infrastructure-journey-ai.webp",
    imageAlt: "High-potential leaders reviewing an infrastructure action-learning project",
  },
  {
    id: "executive-presence-lab",
    title: "Executive Presence & Strategic Communication Transformation Lab",
    practiceArea: "Executive Presence & Influence",
    challenge: [
      "High-performing managers were passed over for senior roles due to lack of gravitas.",
      "Leaders struggled to hold a room and communicate strategy with conviction.",
      "Cross-functional collaboration was weak.",
      "Sales conversations lacked confidence and strategic framing.",
    ],
    solution: [
      "Delivered 2-day Executive Presence Lab with 60-day one-on-one coaching reinforcement.",
      "Cohort sessions on storytelling, boardroom communication, gravitas, and influence.",
      "Peer accountability structure.",
      "Cross-functional dialogues for shared high-performance team behaviours.",
    ],
    impact: [
      "8 of 15 participants gained role elevations within 12 months.",
      "Business unit revenue up 26%.",
      "Collaboration index rose from 34% to 71%.",
      "Teams hit sales targets in 3 out of 4 quarters.",
    ],
    image: "/assets/images/case-studies/executive-presence-lab-ai.jpg",
    imageAlt: "Senior manager rehearsing an executive presentation for structured feedback",
  },
  {
    id: "coaching-across-borders",
    title: "Coaching Across Borders - Rebuilding Leadership Effectiveness During a Global Transition",
    practiceArea: "Executive Coaching",
    challenge: [
      "Senior leader relocated internationally to head a new regional team.",
      "Cultural misalignment reduced morale.",
      "Command-and-control behaviours created attrition risk.",
      "360 feedback showed gaps in empathy, cross-cultural fluency, and inclusive decision-making.",
    ],
    solution: [
      "Designed 4-month executive coaching with fortnightly sessions.",
      "Conducted 360 debrief and personalised leadership development plan.",
      "Embedded cultural intelligence frameworks and adaptive communication tools.",
      "Facilitated team alignment sessions at midpoint and close.",
    ],
    impact: [
      "Engagement rose from 49% to 84%.",
      "Leadership effectiveness rose from 3.0 to 4.5 out of 5.",
      "Attrition intent dropped from 7 of 10 team members to 1.",
      "Team delivered 98% of quarterly targets.",
    ],
    image: "/assets/images/case-studies/coaching-across-borders-ai.jpg",
    imageAlt: "Senior leader aligning a multicultural regional team after a global transition",
  },
  {
    id: "ai-active-organisation",
    title: "From AI-Aware to AI-Active - Embedding Real-World AI Capability in a Technology Services Organisation",
    practiceArea: "AI & Future Skills",
    challenge: [
      "Employees knew AI tools in theory but lacked confidence applying them.",
      "Productivity stayed flat despite AI access.",
      "No governance, champions network, or adoption framework existed.",
      "Fear of redundancy blocked experimentation.",
    ],
    solution: [
      "Deployed 3-tier AI learning journey: Foundational, Intermediate, Advanced.",
      "Embedded prompt-engineering labs, AI sprint challenges, and simulations.",
      "Participants built functional AI agents and automation workflows.",
      "Established AI Champions community, prompt libraries, and AI office hours.",
    ],
    impact: [
      "14 AI agents built, 11 deployed into live business.",
      "Task completion time reduced by 37%.",
      "AI confidence improved from 2.6 to 4.7 out of 5.",
      "AI tool usage grew from 17% to 81% of trained employees.",
    ],
    image: "/assets/images/services/ai-future-skills-ai.jpg",
    imageAlt: "Corporate leaders building practical AI and future-ready skills",
  },
  {
    id: "assessment-centres",
    title: "Building a Future-Ready Talent Pipeline Through Assessment Centres at a Multinational Manufacturing Firm",
    practiceArea: "Talent Strategy & Organisational Effectiveness",
    challenge: [
      "Promotion decisions were subjective.",
      "Critical roles sat vacant due to absence of ready internal pipeline.",
      "High-potential employees lacked clarity on next-level expectations.",
      "Development investments were scattered.",
    ],
    solution: [
      "Designed role-specific Assessment Centres across three leadership bands.",
      "Deployed assessment toolkit with in-tray exercises, interviews, group discussions, and psychometrics.",
      "Trained 14 internal assessors.",
      "Linked outcomes to IDPs and succession tracking dashboard.",
    ],
    impact: [
      "Critical role pipeline expanded from 3 to 14 ready successors.",
      "Inter-rater reliability improved from 52% to 81%.",
      "100% of participants received IDPs within 6 months.",
      "Manager satisfaction with newly promoted leaders rose 46%.",
    ],
    image: "/assets/images/services/talent-strategy-organisational-effectiveness-ai.jpg",
    imageAlt: "Leadership team aligning talent strategy and organisational priorities",
  },
  {
    id: "generational-inclusion",
    title: "One Team, Many Generations - A Generational Inclusion Transformation at a Global Retail Conglomerate",
    practiceArea: "Culture, DEIB & Change",
    challenge: [
      "Four-generation workforce faced friction in communication and expectations.",
      "Senior employees felt sidelined; Gen Z and Millennial employees felt unheard.",
      "Intergenerational conflict affected reviews, projects, and meetings.",
      "Leadership lacked shared framework for generational differences.",
    ],
    solution: [
      "Facilitated 2-day Generational Inclusion workshop.",
      "Administered Generational Intelligence Assessment.",
      "Designed Reverse Mentoring program pairing Gen Z with senior leaders.",
      "Co-created cross-generational Team Charter adopted across five business units.",
    ],
    impact: [
      "Cross-generational teamwork rose from 3.1 to 4.6 out of 5.",
      "HR-reported intergenerational escalations dropped by 61%.",
      "100% of senior leaders found reverse mentoring directly relevant.",
      "Team engagement rose 34%.",
    ],
    image: "/assets/images/services/culture-deib-change-ai.jpg",
    imageAlt: "Cross-functional leaders collaborating in an inclusion workshop",
  },
];

export const testimonials = [
  {
    quote:
      "The leadership journey with RYSEN Leadership and Consulting was unlike any programme I have experienced. It was immersive, in-depth, and never theory from a slide deck. Application-based simulations and a structured action learning plan kept us putting concepts into practice. The Individual Development Plan gave each of us a clear, personalised roadmap, and the facilitation was exceptional.",
    attribution: "VP, Operations, Leading Telecom Company",
  },
  {
    quote:
      "The Women's Leadership Program by RYSEN stood out because it was built for us. The content was bespoke, designed around the real situations and ambitions women leaders navigate. The experience was immersive, practical, reflective, safe, and challenging.",
    attribution: "Plant HR Head, Leading Manufacturing Organisation",
  },
  {
    quote:
      "The Executive Presence program by Bidisha was one of the best professional development experiences I have had. We covered etiquette, communication, polished externals, authenticity, presence, and gravitas. Bidisha facilitated with remarkable skill.",
    attribution: "Head of Operations, Leading Bank in the UAE",
  },
  {
    quote:
      "I underwent eight coaching sessions with a RYSEN coach, and it was genuinely transformative. The process had clear goals, stakeholder input, complete freedom to express my views, and measurable progress by the end.",
    attribution: "Head of Sales MENA, Leading Pharma Company, Saudi Arabia",
  },
];

export const credentials = [
  "International Executive Masters in Design Thinking, SDA Bocconi Milan",
  "Certified PCC ICF and Mentor Coach",
  "Certified in Hogan Assessments",
  "CIPD Qualified",
  "Certified in Human Synergistics OCI/OEI",
  "Predictive Index Certified",
  "NLP Practitioner",
  "ATD Certified Facilitator",
  "ILM Level 5 Qualified",
];

export const speakingThemes = [
  { title: "Executive Presence in a Noisy World", icon: Mic2 },
  { title: "Future-Ready Leadership", icon: Sparkles },
  { title: "Women in Leadership", icon: Award },
  { title: "Leading Across Generations", icon: UsersRound },
  { title: "AI and the Human Edge", icon: Brain },
  { title: "Culture, Inclusion, and Change", icon: Handshake },
];

export const resources = [
  {
    title: "Why Executive Presence Is a Business Skill, Not a Personality Trait",
    category: "Executive Presence",
    excerpt:
      "Presence becomes practical when leaders can translate credibility, clarity, and conviction into better decisions.",
    date: "Insight Series",
  },
  {
    title: "From HiPo to Enterprise Leader: What Actually Changes",
    category: "Leadership Development",
    excerpt:
      "The shift from functional excellence to enterprise readiness requires new judgement, visibility, and ownership.",
    date: "Leadership Notes",
  },
  {
    title: "AI Adoption Fails Without Leadership Behaviour Change",
    category: "AI & Future Skills",
    excerpt:
      "Tools do not transform work on their own. Leaders set the permission, governance, and habits that make adoption real.",
    date: "Future Skills",
  },
  {
    title: "Psychological Safety as a Performance System",
    category: "Culture",
    excerpt:
      "High standards and human trust are not opposites. The strongest teams design for both.",
    date: "Culture Fieldnote",
  },
  {
    title: "The New Rules of Influence Without Authority",
    category: "Influence",
    excerpt:
      "Matrix organisations reward leaders who can create alignment before they ask for action.",
    date: "Executive Brief",
  },
  {
    title: "What Women Leaders Need Beyond Generic Leadership Training",
    category: "Women in Leadership",
    excerpt:
      "Meaningful development addresses visibility, sponsorship, power dynamics, and the real choices women leaders face.",
    date: "Programme View",
  },
];

export const industries = [
  "Manufacturing",
  "Retail",
  "BFSI",
  "ITES",
  "Technology",
  "Consumer Businesses",
];

export const valuePillars = [
  { title: "Bespoke by design", icon: Target },
  { title: "Business-linked outcomes", icon: ChartNoAxesCombined },
  { title: "Research-backed facilitation", icon: Lightbulb },
  { title: "Measured behaviour change", icon: ShieldCheck },
  { title: "International leadership context", icon: BriefcaseBusiness },
];
