import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Project from './models/Project.js';
import Review from './models/Review.js';
import Admin from './models/Admin.js';
import Service from './models/Service.js';
import BlogPost from './models/BlogPost.js';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Project.deleteMany();
    await Review.deleteMany();
    await Admin.deleteMany();
    await Service.deleteMany();
    await BlogPost.deleteMany();

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
        links: { live: "#", source: "#" },
        featured: true
      },
      {
        title: "Nexus Intelligence",
        desc: "Enterprise-grade AI integration platform for automated logistics and supply chain optimization.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
        tags: ["Next.js", "Python", "TensorFlow", "Redis"],
        links: { live: "#", source: "#" },
        featured: false
      },
      {
        title: "Aether Engine",
        desc: "A 3D rendering engine for the web capable of handling complex lighting and material physics.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
        tags: ["WebGL", "GLSL", "TypeScript", "WASM"],
        links: { live: "#", source: "#" },
        featured: true
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

    // Create Services
    await Service.create([
      {
        title: "Full Stack Engineering",
        description: "End-to-end development of scalable web applications using React, Next.js, and Node.js.",
        price: "Contact for pricing",
        icon: "Code2",
        tags: ["React", "Next.js", "Node", "MongoDB"]
      },
      {
        title: "Creative Development",
        description: "Building immersive, interactive experiences with WebGL, Three.js, and GSAP.",
        price: "Contact for pricing",
        icon: "Wand2",
        tags: ["Three.js", "GSAP", "WebGL", "Framer Motion"]
      },
      {
        title: "Systems Architecture",
        description: "Designing robust, high-performance system architectures for enterprise scale.",
        price: "Contact for pricing",
        icon: "Layers",
        tags: ["AWS", "Docker", "Microservices", "Redis"]
      }
    ]);

    // Create Blog Posts
    await BlogPost.create([
      {
        title: "The Future of Web Rendering: From Server to Edge",
        slug: "future-of-web-rendering",
        excerpt: "Exploring the evolution of rendering strategies and why Edge computing is changing how we build React applications.",
        content: "Detailed content about Edge rendering, Next.js App Router, and the shift away from monolithic servers...",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
        tags: ["Next.js", "Architecture", "Performance"],
        category: "Engineering",
        readTime: "5 min read",
        publishedAt: "Oct 24, 2023"
      },
      {
        title: "Crafting Spatial UI: A Guide to 3D on the Web",
        slug: "crafting-spatial-ui",
        excerpt: "How to integrate WebGL and Three.js seamlessly into modern brutalist user interfaces without sacrificing performance.",
        content: "An in-depth look at performance optimization, lighting techniques, and integrating Canvas with DOM elements...",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
        tags: ["Three.js", "WebGL", "Design"],
        category: "Creative",
        readTime: "8 min read",
        publishedAt: "Nov 12, 2023"
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
