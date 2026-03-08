export interface SkillCategory {
  title: string;
  index: string;
  skills: string[];
  code?: string;
}

export const skillCategories: SkillCategory[] = [
  {
    title: "FRONTEND",
    index: "01",
    skills: ["JavaScript", "React", "TypeScript", "React Native", "Redux", "TailwindCSS", "Expo", "Next.js"],
    code: `// Frontend Architecture
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Component = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="modern-ui-container"
    >
      {/* UI Implementation */}
    </motion.div>
  );
};`
  },
  {
    title: "BACKEND",
    index: "02",
    skills: ["Node.js", "Express", "REST APIs", "Python", "Flask", "Prisma", "Next Auth"],
    code: `// Express API Implementation
import express from 'express';
import { db } from './database';

const app = express();
app.use(express.json());

app.get('/api/resource', async (req, res) => {
  try {
    const data = await db.query('SELECT * FROM data');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`
  },
  {
    title: "DATABASE & AUTH",
    index: "03",
    skills: ["MongoDB", "SQL", "Firebase", "GCP", "Supabase", "Cognito"],
    code: `-- Database Schema Example
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);`
  },
  {
    title: "TOOLS & DEVOPS",
    index: "04",
    skills: ["Docker", "Github Actions", "Payment Gateways", "MERN Stack", "CI/CD"],
    code: `# Dockerfile Example
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`
  }
];

export const mobileSlideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.95,
  }),
};

export const experienceData = [
  {
    company: "Fluff Software",
    role: "Software Engineer",
    period: "2023 - 2025",
    desc: `I was responsible for designing, developing, and maintaining complex web and mobile applications.

Key Responsibilities:
• Developed responsive web interfaces using React.js, Next.js, and Tailwind CSS.
• Built cross-platform mobile applications with React Native, Expo, and Expo Go.
• Created and optimized RESTful APIs and GraphQL endpoints.
• Implemented efficient state management using Redux.
• Integrated secure authentication mechanisms using AWS Cognito, NextAuth, and OAuth protocols.
• Developed Multi-Factor Authentication (MFA) and Role-Based Access Control (RBAC) systems.
• Built custom CMS dashboards using React.
• Deployed applications on AWS, ensuring scalability and performance.
• Utilized tools like Postman, Browser DevTools, and Cursor IDE for thorough testing.`
  },
  {
    company: "GotBot",
    role: "Senior & Intern Software Engineer",
    period: "2022 - 2023",
    desc: `As part of the innovation team, I designed and developed conversational agents that communicate through text or speech.

Key Responsibilities:
• Built advanced NLP models to parse natural language and understand complex user intents.
• Designed and developed comprehensive conversational bots for various platform integrations.
• Engineered robust backend logic and APIs utilizing Python, GoLang, Flask, and Django.
• Created dynamic user interfaces and flows using Vanilla JavaScript, HTML, CSS, and Tailwind.
• Managed and maintained cloud infrastructures via AWS, Kubernetes, K9S, and Docker containers.
• Integrated and monitored systems using Open Search, Rabbit MQ, and Elastic Alerts.
• Implemented complex REST APIs and actively managed system Form Mode functionalities.
• Collaborated closely with cross-functional teams of data scientists and software developers.
• Handled technical support tickets, translating complex concepts for non-technical stakeholders.`
  },
  {
    company: "MfundoPedia",
    role: "Full Stack Web Developer",
    period: "2021 - 2022",
    desc: `Spearheaded end-to-end digital solutions spanning diverse front-end frameworks and visual design disciplines.

Key Responsibilities:
• Engineered scalable full-stack web applications utilizing React, Vue.js, Angular, and TypeScript.
• Built cross-platform mobile experiences employing Ionic, Flutter, Dart, and Android Studio.
• Architected and developed tailored WordPress ecosystems and custom website designs.
• Orchestrated database integration and management using MongoDB and Firebase backends.
• Crafted functional UI/UX interfaces and compelling Graphic/Digital Design assets.
• Designed responsive HTML & CSS templates specifically optimized for eMailers and websites.
• Produced high-quality motion graphics to elevate user engagement and brand identity.
• Executed strategic email marketing campaigns utilizing ActiveCampaign and custom HTML.
• Administered server configurations and ongoing maintenance via cPanel & KonsoleH.`
  },
  {
    company: "Digileads",
    role: "Frontend Web Developer",
    period: "2018 - 2021",
    desc: `Directed high-performance frontend solutions and managed daily operations for a portfolio of 11+ websites.

Key Responsibilities:
• Maintained and optimized over 11 distinct client websites on a daily operational basis.
• Designed and developed customized WordPress environments tailored to client specifications.
• Authored clean, responsive HTML and CSS codebases for web applications and email pipelines.
• Executed comprehensive UI/UX design research to deliver intuitive digital experiences.
• Produced top-tier Graphic and Digital Design collateral across a variety of client brands.
• Developed dynamic motion graphics to support marketing initiatives and interactive content.
• Structured and deployed effective email marketing strategies leveraging ActiveCampaign.
• Managed complex backend server deployments and hosting environments utilizing cPanel.
• Ensured uncompromising web compliance, cross-browser compatibility, and overall platform stability.`
  },
  {
    company: "Naspers Labs",
    role: "Print Designer",
    period: "2017 - 2018",
    desc: `Led diverse design initiatives focusing on high-quality visuals for print and digital ecosystems.

Key Responsibilities:
• Created compelling Graphic Design materials aligned with corporate branding and product goals.
• Architected intuitive UI/UX workflows to enhance user retention and software usability.
• Designed diverse Digital Design assets for web applications and online marketing campaigns.
• Prepared high-resolution layouts and typography for professional print distribution.
• Collaborated with product teams to translate conceptual ideas into polished visual assets.
• Established unified design systems to maintain visual consistency across all media formats.
• Prototyped interactive user interfaces to gather early feedback from project stakeholders.
• Balanced aesthetic appeal with functional requirements for seamless end-user experiences.
• Conducted visual audits to refine and elevate existing design language and deliverables.`
  }
];
