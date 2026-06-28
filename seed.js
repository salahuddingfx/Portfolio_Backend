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
   

    // Create Projects
    await Project.create([
      {
        title: "CoxIan TechForce",
        desc: "Developer community, technical workshop index, and open-source collaboration hub tailored for tech students and enthusiasts in Cox's Bazar.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649982/portfolio/screenshots/techforge_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649988/portfolio/screenshots/techforge_mobile.png",
        tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
        links: { live: "https://cmpitechforge.dev", source: "https://github.com/salahuddingfx/TechForge" },
        category: "Community",
        featured: true,
        order: 1
      },
      {
        title: "StudyFlow",
        desc: "A full-stack productivity and study-management application designed to help self-learners track progress, use Pomodoro timers, and build consistent study habits.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649913/portfolio/screenshots/studyflow_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649916/portfolio/screenshots/studyflow_mobile.png",
        tags: ["Vue.js", "Node.js", "Express", "MongoDB", "Socket.io"],
        links: { live: "https://studyflow.salahuddin.codes", source: "https://github.com/salahuddingfx/Study-Flow" },
        category: "Productivity",
        featured: true,
        order: 2
      },
      {
        title: "NoteSphere",
        desc: "A high-performance Academic Intelligence platform and note-sharing system designed for student resource indexing, search optimization, and academic collaboration.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649812/portfolio/screenshots/notespher_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649820/portfolio/screenshots/notespher_mobile.png",
        tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
        links: { live: "https://notesphere.salahuddin.codes", source: "https://github.com/salahuddingfx/NoteSphere" },
        category: "Education",
        featured: true,
        order: 3
      },
      {
        title: "Acharu",
        desc: "Premium e-commerce platform for Cox's Bazar specialty foods - chocolate, achar, nuts, and authentic Burmese items.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649682/portfolio/screenshots/acharu_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649697/portfolio/screenshots/acharu_mobile.png",
        tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
        links: { live: "https://acharu.com", source: "https://github.com/salahuddingfx/acharu" },
        category: "E-Commerce",
        featured: true,
        order: 4
      },
      {
        title: "Taja Shutki",
        desc: "Seafood distribution and premium dry-fish e-commerce marketplace connecting local fishermen of Cox's Bazar directly with consumers.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649949/portfolio/screenshots/tajashutki_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649965/portfolio/screenshots/tajashutki_mobile.png",
        tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
        links: { live: "https://tajashutki.com", source: "https://github.com/salahuddingfx/tajashutki" },
        category: "E-Commerce",
        featured: true,
        order: 5
      },
      {
        title: "DPIAN Alumni",
        desc: "Official alumni connectivity portal and student network hub built for Cox's Bazar Model Polytechnic Institute graduates.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649745/portfolio/screenshots/alumni_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649756/portfolio/screenshots/alumni_mobile.png",
        tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
        links: { live: "https://alumni.salahuddin.codes", source: "https://github.com/salahuddingfx/alumni" },
        category: "Web Platform",
        featured: true,
        order: 6
      },
      {
        title: "Sirat Boutique",
        desc: "High-fidelity modest fashion e-commerce storefront with complex filtration pipelines, live order status updates, and a responsive shopping ecosystem.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649887/portfolio/screenshots/sirat_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649891/portfolio/screenshots/sirat_mobile.png",
        tags: ["React", "Node.js", "Prisma", "MySQL", "Socket.io", "Tailwind CSS"],
        links: { live: "https://sirat.me", source: "https://github.com/salahuddingfx/sirat" },
        category: "E-Commerce",
        featured: false,
        order: 7
      },
      {
        title: "Steam-X Pro",
        desc: "Cinematic media streaming and information platform integrated with TMDB API, featuring dynamic category rows, video preview popups, and user watchlist curation.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649897/portfolio/screenshots/steam_x_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649901/portfolio/screenshots/steam_x_mobile.png",
        tags: ["React", "TypeScript", "Tailwind CSS", "TMDB API", "Framer Motion"],
        links: { live: "https://steam-x-web.vercel.app", source: "https://github.com/salahuddingfx/steam-x" },
        category: "Media / AI",
        featured: false,
        order: 8
      },
      {
        title: "CMPI Portal",
        desc: "Comprehensive student results verification and academic dashboard system designed for Cox's Bazar Model Polytechnic Institute.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649763/portfolio/screenshots/cmpi_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649767/portfolio/screenshots/cmpi_mobile.png",
        tags: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
        links: { live: "https://cmpi.edu.bd", source: "https://github.com/salahuddingfx/CMPI" },
        category: "Full Stack",
        featured: false,
        order: 9
      },
      {
        title: "English StepUp",
        desc: "Interactive language learning platform offering step-by-step progress tracking, interactive quizzes, and speech training resources.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649771/portfolio/screenshots/english_stepup_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649773/portfolio/screenshots/english_stepup_mobile.png",
        tags: ["React", "Next.js", "Framer Motion", "Tailwind CSS", "Firebase"],
        links: { live: "https://englishstepup.com", source: "https://github.com/salahuddingfx/english-stepup" },
        category: "Education",
        featured: false,
        order: 10
      },
      {
        title: "Engr. Alam Ashik",
        desc: "Premium portfolio and professional consultancy website designed for a structural engineering professional, featuring elegant 3D animations.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649788/portfolio/screenshots/engralamashik_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649795/portfolio/screenshots/engralamashik_mobile.png",
        tags: ["React", "Tailwind CSS", "Framer Motion", "GSAP"],
        links: { live: "https://engralamashik.com", source: "https://github.com/salahuddingfx/engr-alam-ashik" },
        category: "Branding",
        featured: false,
        order: 11
      },
      {
        title: "RongRani",
        desc: "A luxury boutique e-commerce application focusing on traditional clothing, featuring real-time inventory management and seamless payment integrations.",
        image: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649872/portfolio/screenshots/rongrani_desktop.png",
        mobileImage: "https://res.cloudinary.com/dytwxf6ip/image/upload/v1782649881/portfolio/screenshots/rongrani_mobile.png",
        tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
        links: { live: "https://rongrani.com", source: "https://github.com/salahuddingfx/rongrani" },
        category: "E-Commerce",
        featured: false,
        order: 12
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
      },
      {
        title: "Database Optimization",
        description: "Designing high-performance, secure database schemas with optimized indexing, caching, and security hardening.",
        price: "Contact for pricing",
        icon: "Database",
        tags: ["PostgreSQL", "Mongoose", "Redis", "Security"]
      },
      {
        title: "AI & ML Integrations",
        description: "Integrating LLMs, training custom machine learning models, and building agentic AI workflows.",
        price: "Contact for pricing",
        icon: "BrainIcon",
        tags: ["OpenAI", "TensorFlow", "NLP", "LangChain"]
      },
      {
        title: "UI/UX & Prototyping",
        description: "Crafting beautiful, high-fidelity design systems and interactive interfaces focused on user engagement.",
        price: "Contact for pricing",
        icon: "Design",
        tags: ["Figma", "Design Systems", "Prototyping", "Aesthetics"]
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
        publishedAt: "Oct 24, 2023",
        order: 1
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
        publishedAt: "Nov 12, 2023",
        order: 2
      },
      {
        title: "Optimizing Next.js for Core Web Vitals",
        slug: "optimizing-nextjs-core-web-vitals",
        excerpt: "Deep dive into resource preloading, dynamic imports, font optimization, and image treatments to score a perfect 100 on Lighthouse.",
        content: "Performance is a feature. In this article, we outline advanced techniques for auditing next/image usage, configuring preconnect hints, and minimizing hydration delays in App Router applications...",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
        tags: ["Next.js", "Performance", "SEO"],
        category: "Engineering",
        readTime: "6 min read",
        publishedAt: "Jan 15, 2024",
        order: 3
      },
      {
        title: "The Power of Micro-Animations in UX Design",
        slug: "power-of-micro-animations-ux",
        excerpt: "How tiny, subtle micro-interactions keep users engaged, reduce cognitive load, and make websites feel responsive and alive.",
        content: "Great design is experienced, not just seen. Micro-animations guide the user's attention, signal successful state changes, and inject delight into daily interactions. We discuss implementing custom curves in CSS and GSAP...",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
        tags: ["GSAP", "UX", "Animation"],
        category: "Creative",
        readTime: "4 min read",
        publishedAt: "Feb 08, 2024",
        order: 4
      },
      {
        title: "Mastering State Synchronization with WebSockets",
        slug: "mastering-state-synchronization-websockets",
        excerpt: "A practical guide to building low-latency, real-time multiplayer systems using React, Node.js, and Socket.io with reliable packet handling.",
        content: "Real-time sync requires rigorous conflict resolution and packet queuing. In this post, we construct a resilient client-server message pipeline, resolve state drift, and handle reconnections gracefully...",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        tags: ["Node.js", "Socket.io", "React"],
        category: "Engineering",
        readTime: "7 min read",
        publishedAt: "Mar 12, 2024",
        order: 5
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
