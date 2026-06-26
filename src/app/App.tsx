import { useState, useEffect, useRef, useCallback } from "react";
import { motion, px, useInView } from "motion/react";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Menu,
  X,
  Code2,
  Shield,
  Award,
  ChevronRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = ["Home", "About", "Skills", "Projects", "Certifications", "Education", "Contact"];

const SKILLS: Record<string, string[]> = {
  Programming: ["Java", "JavaScript", "Python", "C", "SQL"],
  Frontend: ["HTML", "CSS", "React", "Tailwind CSS"],
  Backend: ["Node.js", "Express.js", "REST APIs"],
  Database: ["MongoDB", "MySQL"],
  "Computer Science": [
    "Data Structures",
    "Algorithms",
    "Object-Oriented Programming",
    "Operating Systems",
    "Problem Solving",
    "Networking",
  ],
  Tools: ["Git", "GitHub", "Postman", "VS Code", "IntelliJ IDEA"],
};

const CURRENTLY_BUILDING = [
  { icon: "🛡", label: "DPI Engine", desc: "Developing DPI Engine in Java", tag: "Active Development" },
  { icon: "📚", label: "Data Structures & Algorithms", desc: "Daily problem solving practice", tag: "Ongoing" },
  { icon: "⚙", label: "System Design & Backend", desc: "Architecture & scalability patterns", tag: "Learning" },
  { icon: "🎯", label: "SWE Internships", desc: "Summer 2027 preparation", tag: "Preparing" },
];

const CERTS = [
  {
    title: "Electronic Arts Software Engineering Job Simulation",
    org: "Forage",
    link: "src\\Certificates\\Screenshot 2026-06-26 232839.png",
  },
  {
    title: "J.P. Morgan Software Engineering Job Simulation",
    org: "Forage",
    link: "src\\Certificates\\Screenshot 2026-06-26 233035.png",
  },
  {
    title: "Full Stack Web Development with MERN Stack",
    org: "Udemy",
    link: "src\\Certificates\\Screenshot 2026-06-26 232719.png",
  },
  {
    title: "Java Fundamentals",
    org: "Scaler Academy",
    link: "src\\Certificates\\Java Fundamentals.png",
  }
];

const PROFILES = [
  { name: "GitHub", url: "https://github.com/Satyam0010", Icon: Github, desc: "Code repositories & projects" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/satyam-516384334",
    Icon: Linkedin,
    desc: "Professional network",
  },
  { name: "LeetCode", url: "https://leetcode.com/u/Satyam_me/", Icon: Code2, desc: "Algorithm solutions" },
];

const EDUCATION = [
  {
    degree: "B.Tech — Computer Science & Engineering",
    institution: "G.L. Bajaj Institute of Technology & Management",
    period: "2024 – 2028",
    tags: ["CGPA: 8.06"],
  },
  {
    degree: "ISC — Class XII",
    institution: "Senior Secondary",
    period: "2024",
    tags: ["92.5%", "School Topper", "District Top Performer"],
  },
  {
    degree: "ICSE — Class X",
    institution: "Secondary School",
    period: "2022",
    tags: ["94.25%", "Among School Toppers"],
  },
];

// ─── Hero Visualization ────────────────────────────────────────────────────────

function HeroViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let t = 0;

    type Node = { x: number; y: number; phase: number; speed: number; active: boolean };
    const nodes: Node[] = Array.from({ length: 16 }, (_, i) => ({
      x: 50 + (i % 4) * 120,
      y: 50 + Math.floor(i / 4) * 110,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
      active: Math.random() > 0.45,
    }));

    const connections: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 170) connections.push([i, j]);
      }
    }

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();

    function draw() {
      if (!canvas) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      const scaleX = W / 500;
      const scaleY = H / 480;

      // Dot grid
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      const dotStep = 40;
      for (let x = dotStep / 2; x < W; x += dotStep * scaleX) {
        for (let y = dotStep / 2; y < H; y += dotStep * scaleY) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Connections
      connections.forEach(([i, j]) => {
        const a = nodes[i], b = nodes[j];
        const pulse = (Math.sin(t * 0.6 + a.phase) + 1) / 2;
        ctx.strokeStyle = `rgba(59,130,246,${0.04 + pulse * 0.1})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x * scaleX, a.y * scaleY);
        ctx.lineTo(b.x * scaleX, b.y * scaleY);
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((n) => {
        const pulse = (Math.sin(t * n.speed + n.phase) + 1) / 2;
        const nx = n.x * scaleX;
        const ny = n.y * scaleY;
        const r = 2.5 + pulse * 1.5;

        if (n.active) {
          const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 5);
          grd.addColorStop(0, `rgba(59,130,246,${0.35 + pulse * 0.2})`);
          grd.addColorStop(1, "rgba(59,130,246,0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(nx, ny, r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = n.active
          ? `rgba(59,130,246,${0.7 + pulse * 0.3})`
          : `rgba(255,255,255,${0.1 + pulse * 0.08})`;
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fill();
      });

      t += 0.016;
      raf = requestAnimationFrame(draw);
    }

    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// ─── Reusable Components ───────────────────────────────────────────────────────

function FadeSection({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`py-28 px-6 max-w-6xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="h-px w-6 bg-blue-500/60" />
      <span className="text-[11px] tracking-[0.14em] uppercase text-blue-400 font-medium">{children}</span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-[2.5rem] font-bold text-white mb-14 leading-tight tracking-tight">
      {children}
    </h2>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <motion.span
      whileHover={{ y: -2, boxShadow: "0 0 16px rgba(59,130,246,0.2)" }}
      transition={{ duration: 0.15 }}
      className="inline-block px-3.5 py-1.5 text-sm text-[#a1a1aa] bg-[#111] border border-white/[0.07] rounded-full cursor-default hover:text-white hover:border-blue-500/25 transition-colors duration-150"
    >
      {label}
    </motion.span>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -2000, y: -2000 });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const scrollY = window.scrollY + 120;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].toLowerCase());
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(NAV_ITEMS[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-[#050505] text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
      onMouseMove={onMouseMove}
    >
      {/* Mouse glow */}
      <div
        className="pointer-events-none fixed z-0 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.035) 0%, transparent 65%)",
          left: mousePos.x - 350,
          top: mousePos.y - 350,
          transition: "left 0.2s ease, top 0.2s ease",
        }}
      />

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#050505]/75 backdrop-blur-2xl border-b border-white/[0.05]" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <span
            className="font-bold text-lg tracking-tight text-white"
            style={{ fontFamily: "'Onest', sans-serif", fontSize: "30px" }}
          >
            Satyam
          </span>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`px-3.5 py-1.5 text-[13px] rounded-lg transition-all duration-200 ${
                  activeSection === item
                    ? "text-white bg-white/[0.07]"
                    : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-[#a1a1aa] hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0b0b0b] border-b border-white/[0.06] px-6 pb-4 pt-2 flex flex-col gap-0.5"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === item ? "text-white bg-white/[0.07]" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </motion.nav>

      {/* ── HERO ── */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 pt-28 pb-20 w-full grid md:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/[0.06] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] text-blue-400 font-medium tracking-wide">
                Open to Work & Internship Opportunities
              </span>
            </div>

            <h1
              className="text-[2.6rem] md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.08] mb-6 tracking-tight"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Building Secure Software &{" "}
              <span className="text-[#a1a1aa] font-semibold">Scalable Web Applications.</span>
            </h1>

            <p className="text-[#a1a1aa] text-[15px] font-medium mb-5 tracking-wide">
              Computer Science Student&nbsp;•&nbsp;Full Stack Developer&nbsp;•&nbsp;Problem Solver
            </p>

            <p className="text-[#666] text-[15px] leading-[1.75] mb-10 max-w-[480px]">
              Passionate about building scalable full-stack applications, solving challenging algorithmic problems, and
              exploring cybersecurity. I enjoy creating secure, maintainable software while continuously improving my
              engineering skills.
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("Projects")}
                className="px-6 py-2.5 bg-white text-[#050505] text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                View Projects
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("Contact")}
                className="px-6 py-2.5 border border-white/[0.12] text-white text-sm font-medium rounded-lg hover:bg-white/[0.05] hover:border-white/[0.22] transition-all"
              >
                Contact Me
              </motion.button>
            </div>
          </motion.div>

          {/* Right — geometric viz */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block"
          >
            <div className="relative aspect-square max-w-[440px] ml-auto rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0b0b0b]">
              <HeroViz />
              <div className="absolute top-4 left-4 text-[9px] font-mono text-white/[0.15] tracking-[0.18em] uppercase">
                Network
              </div>
              <div className="absolute bottom-4 right-4 text-[9px] font-mono text-white/[0.15] tracking-[0.18em]">
                v2.0.1
              </div>
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[80px] border-b border-l border-blue-500/10" />
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/[0.18]">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/[0.18] to-transparent"
          />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <FadeSection id="about">
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-16 items-start mb-20">
          <div>
            <SectionEyebrow>About Me</SectionEyebrow>
            <h2
              className="text-3xl md:text-[2.5rem] font-bold text-white leading-tight tracking-tight"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              The person behind the code.
            </h2>
          </div>
          <div className="space-y-5 text-[#a1a1aa] leading-[1.8] text-[15px]">
            <p>
              I am a Computer Science undergraduate at G.L. Bajaj Institute of Technology & Management with a strong
              interest in software engineering, backend development, and cybersecurity.
            </p>
            <p>
              I enjoy designing secure, scalable applications while continuously strengthening my understanding of data
              structures, algorithms, operating systems, networking, object-oriented programming, and full-stack
              development.
            </p>
            <p>
              I believe great software is built through curiosity, consistency, and continuous learning. Every project
              I work on is an opportunity to improve my technical skills and solve meaningful problems.
            </p>
          </div>
        </div>

        {/* Currently Building */}
        <div>
          <SectionEyebrow>Currently Building</SectionEyebrow>
          <h3
            className="text-xl font-semibold text-white mb-8 tracking-tight"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            What I'm actively focused on
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {CURRENTLY_BUILDING.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.14)" }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-xl bg-[#111] border border-white/[0.07] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl leading-none">{item.icon}</span>
                  <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    {item.tag}
                  </span>
                </div>
                <div className="font-semibold text-white text-sm mb-1">{item.label}</div>
                <div className="text-[#666] text-xs">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ── SKILLS ── */}
      <FadeSection id="skills">
        <SectionEyebrow>Skills</SectionEyebrow>
        <SectionHeading>Technologies & Concepts</SectionHeading>
        <div className="space-y-10">
          {Object.entries(SKILLS).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-[11px] tracking-[0.14em] uppercase text-[#a1a1aa] mb-4 font-medium">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <Chip key={skill} label={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* ── PROJECTS ── */}
      <FadeSection id="projects">
        <SectionEyebrow>Featured Project</SectionEyebrow>
        <SectionHeading>What I've built</SectionHeading>

        {/* SecureScan card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0b0b0b] overflow-hidden mb-6">
          {/* Header bar */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Shield size={16} className="text-blue-400" />
              </div>
              <div>
                <div
                  className="font-semibold text-white text-sm"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  SecureScan
                </div>
                <div className="text-[11px] text-[#666]">Full Stack Web Security Auditing Platform</div>
              </div>
            </div>
            <motion.a
              href="https://github.com/Satyam0010/SecureScan.git"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-3.5 py-1.5 border border-white/[0.1] rounded-lg text-xs text-[#a1a1aa] hover:text-white hover:border-white/[0.2] transition-all"
            >
              <Github size={13} />
              GitHub
            </motion.a>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-10">
            <div>
              <div className="mb-7">
                <h4 className="text-[11px] tracking-[0.14em] uppercase text-[#666] mb-3 font-medium">
                  Problem
                </h4>
                <p className="text-[#a1a1aa] text-sm leading-[1.75]">
                  Organizations lack accessible tools to quickly audit their web application security posture —
                  identifying misconfigurations, weak headers, and SSL vulnerabilities before attackers exploit them.
                </p>
              </div>
              <div className="mb-7">
                <h4 className="text-[11px] tracking-[0.14em] uppercase text-[#666] mb-3 font-medium">
                  Solution
                </h4>
                <p className="text-[#a1a1aa] text-sm leading-[1.75]">
                  SecureScan automates website security assessments — analyzing HTTP headers, cookies, SSL
                  configuration, and security policies to calculate risk scores and generate comprehensive audit
                  reports.
                </p>
              </div>
              <div>
                <h4 className="text-[11px] tracking-[0.14em] uppercase text-[#666] mb-3 font-medium">Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS", "REST APIs"].map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-xs bg-[#111] border border-white/[0.07] rounded-md text-[#a1a1aa]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.14em] uppercase text-[#666] mb-4 font-medium">
                Key Features
              </h4>
              <div className="space-y-2.5 mb-8">
                {[
                  "Authentication System",
                  "Automated Website Scanner",
                  "Risk Score Calculation",
                  "Security Findings Dashboard",
                  "Audit History Tracking",
                  "PDF Report Generation",
                  "Fully Responsive Interface",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-[#a1a1aa]">
                    <ChevronRight size={13} className="text-blue-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <h4 className="text-[11px] tracking-[0.14em] uppercase text-[#666] mb-3 font-medium">
                Architecture
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { layer: "Frontend", tech: "React + Tailwind" },
                  { layer: "Backend", tech: "Node + Express" },
                  { layer: "Database", tech: "MongoDB Atlas" },
                ].map((a) => (
                  <div
                    key={a.layer}
                    className="p-3 rounded-xl bg-[#111] border border-white/[0.07] text-center"
                  >
                    <div className="text-[10px] text-blue-400 font-medium mb-1">{a.layer}</div>
                    <div className="text-[10px] text-[#666] leading-snug">{a.tech}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder */}
        <div className="p-8 rounded-xl border border-dashed border-white/[0.07] text-center">
          <div className="text-[#555] text-sm mb-1">More projects in progress</div>
          <div className="text-[#333] text-xs">Check back soon</div>
        </div>
      </FadeSection>

      {/* ── CERTIFICATIONS ── */}
      <FadeSection id="certifications">
  <SectionEyebrow>Certifications</SectionEyebrow>
  <SectionHeading>Recognition & Learning</SectionHeading>

  <div className="grid sm:grid-cols-2 gap-4">
    {CERTS.map((cert) => (
      <motion.div
        key={cert.title}
        whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.14)" }}
        transition={{ duration: 0.2 }}
        className="p-5 rounded-xl bg-[#111] border border-white/[0.07] transition-colors flex flex-col"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
          <Award size={14} className="text-blue-400" />
        </div>

        <div className="font-medium text-white text-sm leading-snug mb-1.5">
          {cert.title}
        </div>

        <div className="text-[#666] text-xs mb-5">
          {cert.org}
        </div>

        <a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-all hover:bg-white hover:text-black"
        >
          View Certificate
        </a>
      </motion.div>
    ))}
  </div>
</FadeSection>

      {/* ── EDUCATION ── */}
      <FadeSection id="education">
        <SectionEyebrow>Education</SectionEyebrow>
        <SectionHeading>Academic Background</SectionHeading>

        <div className="relative">
          <div className="absolute left-[15px] top-3 bottom-3 w-px bg-white/[0.05]" />
          <div className="space-y-6 pl-10">
            {EDUCATION.map((edu) => (
              <motion.div
                key={edu.degree}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="absolute -left-[2.6rem] top-4 w-[10px] h-[10px] rounded-full border-2 border-blue-500 bg-[#050505]" />
                <div className="p-5 rounded-xl bg-[#111] border border-white/[0.07] hover:border-white/[0.12] transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <div
                        className="font-semibold text-white text-sm leading-snug"
                        style={{ fontFamily: "'Onest', sans-serif" }}
                      >
                        {edu.degree}
                      </div>
                      <div className="text-[#666] text-xs mt-0.5">{edu.institution}</div>
                    </div>
                    <span className="text-[11px] text-[#a1a1aa] font-mono shrink-0">{edu.period}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[#a1a1aa]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ── CODING PROFILES ── */}
      <FadeSection id="profiles">
        <SectionEyebrow>Coding Profiles</SectionEyebrow>
        <SectionHeading>Find me online</SectionHeading>
        <div className="grid sm:grid-cols-3 gap-4">
          {PROFILES.map(({ name, url, Icon, desc }) => (
            <motion.a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.16)" }}
              transition={{ duration: 0.2 }}
              className="group p-6 rounded-xl bg-[#111] border border-white/[0.07] block transition-colors"
            >
              <Icon size={22} className="text-[#a1a1aa] group-hover:text-white transition-colors mb-5" />
              <div
                className="font-semibold text-white text-sm mb-1"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                {name}
              </div>
              <div className="text-[#666] text-xs mb-5">{desc}</div>
              <div className="flex items-center gap-1.5 text-xs text-blue-400">
                <span>Visit profile</span>
                <ExternalLink size={11} />
              </div>
            </motion.a>
          ))}
        </div>
      </FadeSection>

      {/* ── CONTACT ── */}
      <FadeSection id="contact">
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-16">
          <div>
            <SectionEyebrow>Contact</SectionEyebrow>
            <h2
              className="text-3xl md:text-[2.25rem] font-bold text-white leading-tight tracking-tight mb-10"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Let's Build Something Great Together.
            </h2>
            <div className="space-y-5">
              <a
                href="mailto:iamsatyam0010@gmail.com"
                className="flex items-center gap-3 text-sm text-[#a1a1aa] hover:text-white transition-colors"
              >
                <Mail size={16} className="text-blue-400 shrink-0" />
                iamsatyam0010@gmail.com
              </a>
              <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                <Phone size={16} className="text-blue-400 shrink-0" />
                7052905222
              </div>
              <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                <MapPin size={16} className="text-blue-400 shrink-0" />
                Greater Noida, India
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            {[
              { label: "Name", key: "name", type: "text", placeholder: "Your name" },
              { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-[11px] text-[#a1a1aa] mb-1.5 font-medium tracking-wide">
                  {label}
                </label>
                <input
                  type={type}
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 bg-[#111] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-blue-500/35 transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-[11px] text-[#a1a1aa] mb-1.5 font-medium tracking-wide">
                Message
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="What's on your mind?"
                className="w-full px-4 py-2.5 bg-[#111] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-blue-500/35 transition-colors resize-none"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-2.5 bg-white text-[#050505] text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
            >
              Send Message
            </motion.button>
          </form>
        </div>
      </FadeSection>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[#555] text-xs">
          <span
            className="font-semibold text-[#a1a1aa] text-sm"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Satyam
          </span>
          <span>Never give up on your dreams.</span>
          <span>© 2026 All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
