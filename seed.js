require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Review = require('./models/Review');
const Admin = require('./models/Admin');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Project.deleteMany();
    await Review.deleteMany();
    await Admin.deleteMany();

    // Create Admin
    await Admin.create({
      username: 'admin',
      password: 'adminpassword',
      email: 'admin@example.com'
    });

    // Create Projects
    await Project.create([
      {
        title: "Vortex OS",
        desc: "A high-performance cloud infrastructure dashboard with real-time telemetry and neural threat detection.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
        tags: ["React", "Three.js", "Node.js", "AWS"],
        links: { live: "#", source: "#" }
      },
      {
        title: "Nexus Intelligence",
        desc: "Enterprise-grade AI integration platform for automated logistics and supply chain optimization.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
        tags: ["Next.js", "Python", "TensorFlow", "Redis"],
        links: { live: "#", source: "#" }
      },
      {
        title: "Aether Engine",
        desc: "A 3D rendering engine for the web capable of handling complex lighting and material physics.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
        tags: ["WebGL", "GLSL", "TypeScript", "WASM"],
        links: { live: "#", source: "#" }
      }
    ]);

    // Create Reviews
    await Review.create([
      {
        name: "Alex Rivera",
        role: "CTO @ TechFlow",
        company: "TechFlow",
        text: "Salah is a visionary developer. He didn't just build our platform — he engineered an experience that boosted our conversion by 40%. The attention to interaction detail was extraordinary.",
        avatar: "https://i.pravatar.cc/150?u=alex",
        rating: 5,
      },
      {
        name: "Sarah Chen",
        role: "Product Manager @ Nexus",
        company: "Nexus",
        text: "The level of craft Salah puts into his code and 3D interactions is simply unmatched. A true 'Digital Architect' in every sense of the word. I'll work with him again without hesitation.",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 5,
      },
      {
        name: "Marcus Thorne",
        role: "Founder @ S-Corp",
        company: "S-Corp",
        text: "Reliable, strategic, and technically brilliant. Salah's ability to simplify complex engineering problems while keeping the UI absolutely premium is rare. An invaluable partner.",
        avatar: "https://i.pravatar.cc/150?u=marcus",
        rating: 5,
      }
    ]);

    console.log('Database Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
