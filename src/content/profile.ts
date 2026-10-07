/*
 * Canonical content for AshwinOS.
 * Every visible string about the owner comes from this file.
 * Source: Resume (15).pdf. Items marked TBD need the owner's input.
 */
import type { IconName } from "@/lib/icons";

export type MetricStatus = "verified" | "client-reported" | "founder-reported" | "estimated" | "illustrative" | "private";

export interface Metric {
  value: string;
  label: string;
  status: MetricStatus;
  source: string;
  public: boolean;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: string;
  role: string;
  problem: string;
  intervention: string;
  outcome: string;
  outcomeStatus: MetricStatus;
  stack: string[];
  platforms: string[];
  links: { label: string; url: string }[];
  hue: number;
  glyph: IconName;
  featured: boolean;
}

export interface Milestone {
  date: string;
  title: string;
  org: string;
  story: string;
  bullets?: string[];
  upgrade: string;
  project?: string;
  current?: boolean;
}

export interface Profile {
  identity: {
    fullName: string;
    shortName: string;
    osName: string;
    domain: string;
    location: string;
    timezone: string;
    timezoneLabel: string;
    roles: string[];
    headline: string;
    intro: string;
    descriptors: string[];
    resumeUrl: string;
  };
  imageGeneration: {
    mode: "codex-native" | "external-api" | "approved-assets-only";
    provider: string;
    model: string;
    apiKeyEnvironmentVariable: string;
    approvedSourceImages: string[];
    likenessNotes: string;
    requiredOutputs: string[];
    finalApprovalBy: string;
  };
  conversion: {
    primaryLabel: string;
    secondaryLabel: string;
    bookingUrl: string;
    whatsappUrl: string;
    email: string;
    phone: string;
    phoneHref: string;
  };
  metrics: Metric[];
  projects: Project[];
  journey: Milestone[];
  skills: Record<string, string[]>;
  method: { step: string; detail: string; artifact: string }[];
  about: string[];
  transmissions: string[];
  socials: { network: string; handle: string; url: string; purpose: string }[];
  services: string[];
  legal: { copyrightOwner: string; metricDisclaimer: string };
}

export const profile: Profile = {
  identity: {
    fullName: "Ashwin Shrestha",
    shortName: "Ashwin",
    osName: "AshwinOS",
    domain: "", // TBD: production domain
    location: "Kathmandu, Nepal",
    timezone: "Asia/Kathmandu",
    timezoneLabel: "NPT",
    roles: ["Senior Mobile Engineer", "Flutter", "Kotlin", "Native bridges"],
    headline: "Mobile apps that keep working when the network doesn't.",
    intro:
      "Senior Mobile Engineer in Kathmandu with 4 years of shipping Flutter and Kotlin apps across e-banking, e-learning, e-commerce and workforce management.",
    descriptors: [
      "ASHWIN OS",
      "FLUTTER + KOTLIN",
      "OFFLINE-FIRST BUILDER",
      "NATIVE BRIDGE WRITER",
      "SHIPPING FROM KATHMANDU"
    ],
    resumeUrl: "/assets/Ashwin-Shrestha-Resume.pdf"
  },

  imageGeneration: {
    mode: "approved-assets-only",
    provider: "",
    model: "",
    apiKeyEnvironmentVariable: "",
    approvedSourceImages: [],
    likenessNotes: "No photo supplied. Companion and icons are original inline SVG.",
    requiredOutputs: [],
    finalApprovalBy: "Ashwin Shrestha"
  },

  conversion: {
    primaryLabel: "Enter the Portfolio",
    secondaryLabel: "Start a project",
    bookingUrl: "", // TBD: Calendly / Cal.com link
    whatsappUrl: "", // TBD: only if Ashwin wants WhatsApp public
    email: "ashwin.shrestha2258@gmail.com",
    phone: "+977-9810573847",
    phoneHref: "tel:+9779810573847"
  },

  metrics: [
    { value: "4 yrs", label: "shipping mobile apps", status: "founder-reported", source: "Résumé", public: true },
    { value: "6", label: "featured projects", status: "verified", source: "Store & GitHub links below", public: true },
    { value: "5", label: "teams worked with", status: "founder-reported", source: "Résumé", public: true },
    { value: "1st", label: "Class Honours, BSc Computing", status: "founder-reported", source: "Résumé", public: true }
  ],

  projects: [
    {
      id: "connect-shift",
      name: "Connect Shift",
      tagline: "Roster management system",
      category: "Workforce",
      role: "Mobile developer",
      problem: "Shift teams need to know where to be, when, and prove they were there.",
      intervention:
        "Role-based roster app with real-time notifications, deep linking and job tracking. Google Maps and geofencing gate clock-in and clock-out to the job site.",
      outcome: "Live on Google Play and the App Store.",
      outcomeStatus: "verified",
      stack: ["Flutter", "Google Maps", "Geofencing", "Push notifications", "Deep links"],
      platforms: ["Android", "iOS"],
      links: [
        { label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.connectshifts.connectshift&hl=en" },
        { label: "App Store", url: "https://apps.apple.com/np/app/connect-shifts/id6738048476" }
      ],
      hue: 205,
      glyph: "pin",
      featured: true
    },
    {
      id: "medhavhi",
      name: "Medhavhi",
      tagline: "Multi-tenant e-learning platform",
      category: "E-Learning",
      role: "Mobile developer",
      problem: "Students need lessons, quizzes and attendance to work on unreliable connections, and exams need to stay honest.",
      intervention:
        "Multi-tenant LMS with offline sync for videos and attendance, quizzes, assignments, gallery, community, doubts, events, lesson plans and downloads. Native Swift and Kotlin code blocks screenshots and screen recording during quizzes.",
      outcome: "Live on Google Play and the App Store.",
      outcomeStatus: "verified",
      stack: ["Flutter", "Bloc", "Offline sync", "Swift", "Kotlin", "Platform channels"],
      platforms: ["Android", "iOS"],
      links: [
        { label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.medhavhi.app&hl=en" },
        { label: "App Store", url: "https://apps.apple.com/np/app/medhavhi/id6450778976" }
      ],
      hue: 265,
      glyph: "book",
      featured: true
    },
    {
      id: "easy-school",
      name: "Easy School",
      tagline: "School management system",
      category: "E-Learning",
      role: "Junior Flutter developer",
      problem: "Many schools, one product: each needs its own branded app without forking the code.",
      intervention:
        "Role-based school management covering attendance, payments and academic tracking. Build flavours generate a separate app per school from one codebase.",
      outcome: "Live on Google Play and the App Store.",
      outcomeStatus: "verified",
      stack: ["Flutter", "Flavours", "Provider", "GetX", "SQLite", "REST"],
      platforms: ["Android", "iOS"],
      links: [
        { label: "Google Play", url: "https://play.google.com/store/apps/details?id=easysoft.com.easysoftwareschool&hl=en" },
        { label: "App Store", url: "https://apps.apple.com/np/app/easy-school-app/id1461107075" }
      ],
      hue: 150,
      glyph: "school",
      featured: true
    },
    {
      id: "pfitt",
      name: "Pfitt",
      tagline: "Personal fitness trainer",
      category: "Health & Fitness",
      role: "Mobile developer",
      problem: "Trainers and clients need separate views of the same fitness plan.",
      intervention: "Role-based fitness app built with Flutter, Firebase and BLoC architecture.",
      outcome: "Live on Google Play.",
      outcomeStatus: "verified",
      stack: ["Flutter", "Firebase", "BLoC"],
      platforms: ["Android"],
      links: [{ label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.arvan.pfitt&hl=en" }],
      hue: 15,
      glyph: "pulse",
      featured: true
    },
    {
      id: "dohans",
      name: "Dohans MTA",
      tagline: "E-commerce for mobile accessories",
      category: "E-Commerce",
      role: "Mobile developer",
      problem: "A Shopify store needed a native shopping app with fast, secure sign-in.",
      intervention: "E-commerce app on Firebase and Shopify with custom Shopify queries and biometric login.",
      outcome: "Live on Google Play.",
      outcomeStatus: "verified",
      stack: ["Flutter", "Shopify", "Firebase", "Biometrics"],
      platforms: ["Android"],
      links: [{ label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.dohans.dohansapp&hl=en&gl=US" }],
      hue: 330,
      glyph: "bag",
      featured: true
    },
    {
      id: "scrollable-tab-controller",
      name: "Scrollable Tab Controller",
      tagline: "Open-source Flutter library",
      category: "Open Source",
      role: "Author",
      problem: "Scrollable tab views with dynamic layouts take a lot of boilerplate in Flutter.",
      intervention: "A Flutter library that wraps scrollable tab views behind a simple controller.",
      outcome: "Source available on GitHub.",
      outcomeStatus: "verified",
      stack: ["Dart", "Flutter", "Package"],
      platforms: ["Flutter"],
      links: [{ label: "GitHub", url: "https://github.com/Ashwin1002/scrollable_tab_controller" }],
      hue: 45,
      glyph: "tabs",
      featured: true
    }
  ],

  journey: [
    {
      date: "Sept 2017 – Sept 2021",
      title: "BSc (Hons) in Computing",
      org: "The British College, Kathmandu",
      story: "Graduated with First Class Honours.",
      upgrade: "Computing fundamentals"
    },
    {
      date: "Jun 2022 – Feb 2023",
      title: "Junior Flutter Developer",
      org: "Easy Software Pvt. Ltd., Kathmandu",
      story: "Worked alongside senior developers on a school management system.",
      bullets: [
        "Push notifications, REST API integration and error handling.",
        "State management with Provider and GetX.",
        "Offline threading with SQLite."
      ],
      upgrade: "Shipping to real users",
      project: "easy-school"
    },
    {
      date: "Feb 2023 – Dec 2023",
      title: "Flutter Developer",
      org: "Skill Sewa Pvt. Ltd., Kathmandu",
      story: "Built in-house applications with custom components.",
      bullets: [
        "Multi-threading with isolates.",
        "State management with Bloc and Riverpod.",
        "Integrated Khalti and eSewa payment gateways."
      ],
      upgrade: "Performance and payments"
    },
    {
      date: "Dec 2023 – Feb 2025",
      title: "Lead App Developer",
      org: "Bhawani Infotech Pvt. Ltd., Kathmandu",
      story: "Led app development across e-learning, e-commerce and time management.",
      bullets: [
        "Clean architecture with Bloc, GraphQL and Isar.",
        "Reusable component libraries.",
        "CI/CD with GitHub Actions and Xcode Cloud."
      ],
      upgrade: "Architecture and release automation"
    },
    {
      date: "May 2025 – Oct 2025",
      title: "Mobile Developer (Part-time)",
      org: "Birsingh Technology Pvt. Ltd., Remote",
      story: "Built a fitness tracking application.",
      bullets: ["Flutter with Firebase and Firebase Cloud Functions."],
      upgrade: "Serverless back ends"
    },
    {
      date: "May 2025 – Present",
      title: "Senior Mobile Engineer",
      org: "Infodevelopers Pvt. Ltd., Lalitpur",
      story: "Working on banking and offline-first applications, and mentoring junior and mid-level developers.",
      bullets: [
        "Native Android and iOS features bridged into Flutter.",
        "Maintaining a React Native application.",
        "Automation scripts for APK generation, platform channels and flavour-wise builds."
      ],
      upgrade: "Mentoring and banking-grade apps",
      current: true
    }
  ],

  skills: {
    "Languages": ["Dart", "Kotlin", "JavaScript", "Python", "Swift (native modules)"],
    "Frameworks": ["Flutter", "Jetpack Compose", "React Native", "Next.js", "Nest.js"],
    "State & data": ["Bloc", "Riverpod", "Provider", "GetX", "GraphQL", "Isar", "SQLite", "Firebase"],
    "Tools": ["Git", "Android Studio", "Xcode", "Jira", "Jenkins", "GitHub Actions", "Xcode Cloud", "Cursor", "Antigravity"],
    "Spoken": ["English (proficient)", "Nepali (native)"]
  },

  method: [
    { step: "Shape the architecture", detail: "Clean architecture with Bloc so features can grow without tangling.", artifact: "Layered project skeleton" },
    { step: "Design for offline", detail: "Local stores (Isar, SQLite) and sync so the app works on bad networks.", artifact: "Sync strategy" },
    { step: "Go native where it matters", detail: "Swift and Kotlin through platform channels for things Flutter can't do alone, like blocking screen capture.", artifact: "Platform channel modules" },
    { step: "Automate the release", detail: "Scripts and CI/CD for flavours, APKs and app bundles so shipping is boring.", artifact: "GitHub Actions / Xcode Cloud pipelines" },
    { step: "Hand it on", detail: "Review and mentoring so the team can keep the code clean after I leave the file.", artifact: "Reviewed, documented code" }
  ],

  about: [
    "Hi, I'm Ashwin.",
    "",
    "WHO I AM",
    "A Senior Mobile Engineer in Kathmandu. I've spent four years building",
    "Flutter and Kotlin apps for banks, schools, shops and shift workers.",
    "",
    "WHAT I BUILD",
    "Apps that hold up on unreliable networks: offline sync, local storage,",
    "and native Android/iOS code when Flutter needs help.",
    "",
    "HOW I WORK",
    "Clean architecture first. Automate the boring parts of releasing.",
    "Leave code that the next developer can read.",
    "",
    "RIGHT NOW",
    "Banking and offline-first apps at Infodevelopers, and helping",
    "junior and mid-level developers write scalable code.",
    "",
    "STILL LEARNING",
    "Every project teaches me something new, and I like it that way.",
    "",
    "CONTACT",
    "ashwin.shrestha2258@gmail.com"
  ],

  transmissions: [
    "Ship the boring version first. Then make it fast.",
    "If it only works on office Wi-Fi, it doesn't work yet.",
    "Read the platform docs before the Stack Overflow answer.",
    "A clean pull request is a kindness to future you.",
    "Automate the release once, and stop dreading Fridays.",
    "Test on the cheapest phone you can find.",
    "Name things for the next reader, not for the compiler.",
    "Small commits, clear messages, calm deploys."
  ],

  socials: [
    { network: "GitHub", handle: "Ashwin1002", url: "https://github.com/Ashwin1002", purpose: "Open-source Flutter work" },
    { network: "LinkedIn", handle: "ashwin-shrestha", url: "https://www.linkedin.com/in/ashwin-shrestha-264110178/", purpose: "Career history" }
  ],

  services: [
    "Flutter apps for Android and iOS",
    "Native Android (Kotlin, Jetpack Compose)",
    "Offline-first data and sync",
    "Platform channels and native modules",
    "CI/CD and build-flavour automation"
  ],

  legal: {
    copyrightOwner: "Ashwin Shrestha",
    metricDisclaimer: "Figures come from Ashwin's résumé. Store links verify that each app is published."
  }
};
