import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import TimelineEntry from './models/TimelineEntry.js';

const seedTimeline = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/salah-portfolio';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Timeline Seeding');

    // Clear existing timeline entries
    await TimelineEntry.deleteMany({});
    console.log('Cleared existing timeline entries.');

    // Timeline entries representing Salah's professional journey
    const timelineData = [
      {
        year: "2019 - 2021",
        title: "Foundations & Self-Taught Exploration",
        subtitle: "Visual Design & Early Scripting",
        description: "Began coding journey learning HTML5, CSS3, ES6 JavaScript, and responsive layouts. Started digital arts and visual design assets under the handle 'salahuddingfx'.",
        icon: "graduation",
        order: 1
      },
      {
        year: "2021 - 2022",
        title: "Front-End Specialization & Creative UX",
        subtitle: "Interactive Interfaces & React",
        description: "Deep-dived into React, modern component libraries, and creative animations using GSAP, Framer Motion, and early Canvas/Three.js render blocks to construct visually engaging user flows.",
        icon: "graduation",
        order: 2
      },
      {
        year: "2022 - 2023",
        title: "Freelance Creative Developer",
        subtitle: "Global Digital Agency Collaborations",
        description: "Partnered with global clients and product agencies to deliver interactive portfolio portals, sleek brutalist designs, and optimized search and conversion workflows.",
        icon: "work",
        order: 3
      },
      {
        year: "2023 - 2024",
        title: "Full-Stack Software Engineering",
        subtitle: "MERN Stack & Systems Architecture",
        description: "Mastered Node.js, Express, MongoDB database schema designs, scalable RESTful APIs, secure session management, and microservice communication structures.",
        icon: "work",
        order: 4
      },
      {
        year: "2024 - Present",
        title: "Senior Full Stack & Digital Architect",
        subtitle: "salahuddin.codes — Enterprise Architectures",
        description: "Developing modern ultra-premium editorial layouts, incorporating robust Express rate-limit abuse defense, ironclad schema validation layers, and custom token-based invitation controls.",
        icon: "work",
        order: 5
      }
    ];

    // Seed the database
    const created = await TimelineEntry.create(timelineData);
    console.log(`Seeded ${created.length} Timeline Entries successfully!`);

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding timeline:', error);
    process.exit(1);
  }
};

seedTimeline();
