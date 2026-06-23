import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BrainCircuit, MessageSquare, IndianRupee, ShieldAlert, TrendingUp, Sun, Moon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const AGENTS = [
  { id: 'EMPATH', role: 'Emotion Detection', emoji: '🎭', color: '#ef4444', desc: "Reads every message via HuggingFace NLP. Fires RED / YELLOW / GREEN / BLUE emotion alerts in real time." },
  { id: 'ORACLE', role: 'Churn Prediction', emoji: '🔮', color: '#8b5cf6', desc: "Scores churn risk 0–100% from complaint history, emotion patterns, and interaction count." },
  { id: 'SUPPORT', role: 'Customer Response', emoji: '💬', color: '#3b82f6', desc: "Handles general queries with clarity and patience using LLaMA 3.3 70B — sounds human, not scripted." },
  { id: 'CLOSER', role: 'Sales & Upselling', emoji: '💰', color: '#10b981', desc: "Detects buying intent and executes natural upsell sequences only when the customer is genuinely happy." },
  { id: 'GUARDIAN', role: 'Complaint Resolution', emoji: '🛡️', color: '#f59e0b', desc: "Auto-triggers refunds, loyalty coupons, and priority callbacks the moment anger is detected." },
  { id: 'ANALYST', role: 'Live Analytics', emoji: '📊', color: '#fcd34d', desc: "Streams live emotion charts, revenue metrics, and churn dashboards — updated every 3 seconds." },
];

const CanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let nodes = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      const numNodes = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1 + 1,
          baseRadius: Math.random() * 1 + 1,
          angle: Math.random() * Math.PI * 2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Pulse
        node.angle += 0.05;
        node.radius = node.baseRadius + Math.sin(node.angle) * 0.5;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.fill();

        // Connect
        for (let j = i + 1; j < nodes.length; j++) {
          let other = nodes[j];
          let dx = node.x - other.x;
          let dy = node.y - other.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            let opacity = 1 - (dist / 120);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.8})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" />;
};

const StatCounter = ({ end, label, icon: Icon, prefix = '', suffix = '', color }) => {
  const [count, setCount] = useState(0);
  const { scrollYProgress } = useScroll();
  const [hasAnimated, setHasAnimated] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      onViewportEnter={() => {
        if (!hasAnimated) {
          let startTimestamp = null;
          const duration = 2000;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutExpo
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
              setHasAnimated(true);
            }
          };
          window.requestAnimationFrame(step);
        }
      }}
      className="flex flex-col items-center justify-center p-8 relative"
    >
      <Icon size={32} color={color} className="mb-4" />
      <div className="stat-number mb-2" style={{ color: color }}>
        {prefix}{count.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-[14px] text-[#94a3b8] font-medium tracking-wide uppercase">{label}</div>
    </motion.div>
  );
};

const DemoLoopCard = () => {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 7);
    }, 1500); // Step every 1.5s, loop after 7
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel demo-card relative overflow-hidden rounded-[20px] p-6 h-[480px] w-full max-w-lg mx-auto flex flex-col gap-4">
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-blue-500/5 blur-3xl pointer-events-none" />
      
      <AnimatePresence mode="popLayout">
        {step >= 0 && (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="self-end demo-bubble">
            <p>My order is broken and I'm furious!!</p>
          </motion.div>
        )}

        {step >= 1 && (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="self-center mt-2 flex items-center gap-2 alert-pulse demo-alert">
            <span>😡</span> RED ALERT — ANGRY
          </motion.div>
        )}

        {step >= 2 && (
          <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="mt-2 w-full">
            <div className="flex justify-between text-xs font-bold mb-1" style={{color: '#fca5a5'}}>
              <span>Churn Risk: 72% — CRITICAL</span>
            </div>
            <div className="h-2 w-full overflow-hidden" style={{background: 'rgba(255,255,255,0.05)', borderRadius: '99px'}}>
              <motion.div initial={{width:0}} animate={{width:'72%'}} transition={{duration:1}} className="h-full" style={{background: '#ef4444'}} />
            </div>
          </motion.div>
        )}

        {step >= 3 && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-4 demo-vote-panel">
            <div className="flex justify-between items-center mb-2" style={{color: '#f59e0b'}}>
              <span>GUARDIAN: 6 pts</span> <span className="font-bold text-xs" style={{background: 'rgba(245,158,11,0.2)', padding: '2px 6px', borderRadius: '4px'}}>✅ WINNER</span>
            </div>
            <div className="flex justify-between items-center mb-2" style={{color: 'rgba(255,255,255,0.4)'}}>
              <span>SUPPORT: 2 pts</span>
            </div>
            <div className="flex justify-between items-center" style={{color: 'rgba(255,255,255,0.4)'}}>
              <span>CLOSER: 0 pts</span> <span>❌</span>
            </div>
          </motion.div>
        )}

        {step >= 4 && (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="self-start mt-4 demo-ai-response max-w-lg relative">
            <div className="text-xs font-bold mb-1 tracking-wider uppercase" style={{color: '#f59e0b'}}>🛡️ GUARDIAN</div>
            <p className="text-sm leading-relaxed" style={{color: '#e2e8f0'}}>I sincerely apologize — I'm escalating this right now and initiating a full refund immediately.</p>
          </motion.div>
        )}

        {step >= 5 && (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-4 mx-auto w-full demo-action flex items-center justify-center gap-2">
            <span>💳</span> Refund initiated + CARE20 coupon
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`landing-page${darkMode ? '' : ' light-mode'}`}>
      <CanvasBackground />
      
      <div className="content-wrapper">
        {/* NAVBAR */}
        <nav className={`sticky-nav flex justify-between items-center px-8 py-4 ${scrolled ? 'scrolled' : ''}`}>
          <div className="flex items-center gap-3">
            <BrainCircuit size={28} color="#3b82f6" />
            <div className="flex flex-col">
              <span className="font-['Inter'] font-[800] text-xl leading-none">
                Neuro<span style={{color: '#3b82f6'}}>Desk</span> AI
              </span>
              <span className="text-[11px] font-medium tracking-[1.5px] text-[#94a3b8] uppercase mt-1">Autonomous Workforce Platform</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="nav-link">Features</a>
            <a href="#agents" className="nav-link">Agents</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </div>
          <div className="flex items-center gap-6">
            <button
              className="theme-toggle-btn"
              onClick={() => setDarkMode(prev => !prev)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/dashboard" className="shimmer-btn inline-block">
              Get Early Access
            </Link>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8 py-20 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            
            <motion.div initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{duration:0.8, ease:[0.16,1,0.3,1]}} className="flex flex-col gap-6">
              <div className="self-start">
                <span className="pill-badge">🧠 6 AI AGENTS · VOTING SYSTEM · REAL-TIME MEMORY</span>
              </div>
              <h1 className="gradient-text pb-2">The AI Workforce That Thinks, Feels, and Decides — Autonomously</h1>
              <p className="text-xl text-[#94a3b8] leading-relaxed max-w-2xl">
                NeuroDesk AI deploys 6 specialized agents that detect customer emotion, predict churn risk, and pick the perfect response — in milliseconds. No scripts. No templates. Pure intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <a href="#demo" className="btn-primary">See It In Action <ArrowRight size={18}/></a>
                <Link to="/dashboard" className="btn-secondary">View Live Dashboard</Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-6 text-[13px] font-medium text-[#94a3b8]">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} color="#10b981"/> Free with Groq API</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} color="#10b981"/> No credit card</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} color="#10b981"/> Open source ready</span>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{duration:1, delay:0.2}} className="w-full">
              <DemoLoopCard />
            </motion.div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="w-full stats-bar relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5 border-l border-r border-white/5">
            <StatCounter end={12400} suffix="+" label="Conversations" icon={MessageSquare} color="#3b82f6" />
            <StatCounter end={4.2} prefix="₹" suffix=" Cr+" label="Revenue Saved" icon={IndianRupee} color="#10b981" />
            <StatCounter end={3800} suffix="+" label="Complaints Resolved" icon={ShieldAlert} color="#f59e0b" />
            <StatCounter end={960} suffix="+" label="Churn Prevented" icon={TrendingUp} color="#8b5cf6" />
          </div>
        </section>

        {/* AGENTS SECTION */}
        <section id="agents" className="py-32 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <span className="pill-badge">THE TEAM</span>
            <h2>Six Minds. One Goal.</h2>
            <p className="text-lg text-[#94a3b8]">Every message triggers a democratic vote. The right agent always wins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENTS.map((agent, i) => (
              <motion.div 
                key={agent.id}
                initial={{opacity:0, y:30}}
                whileInView={{opacity:1, y:0}}
                viewport={{once:true, margin:"-50px"}}
                transition={{delay: i * 0.1, duration: 0.6}}
                className="glass-panel agent-card p-8 flex flex-col gap-4 relative group"
                style={{ '--hover-color': agent.color }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = agent.color;
                  e.currentTarget.style.boxShadow = `0 0 20px ${agent.color}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.5)';
                }}
              >
                <div className="text-5xl">{agent.emoji}</div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{agent.id}</h3>
                  <div className="text-[12px] font-bold tracking-wider uppercase" style={{color: agent.color}}>{agent.role}</div>
                </div>
                <p className="text-[15px] text-[#94a3b8] leading-relaxed mt-2">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 px-8 relative overflow-hidden">
          <div className="absolute inset-0 radial-glow pointer-events-none" />
          <motion.div 
            initial={{opacity:0, scale:0.95}}
            whileInView={{opacity:1, scale:1}}
            viewport={{once:true}}
            className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 relative z-10"
          >
            <h2>Deploy Your AI Workforce Today.</h2>
            <p className="text-xl text-[#94a3b8] max-w-2xl">
              Connect your Groq API key, run the backend, and watch 6 agents handle your customers — completely free.
            </p>
            <Link to="/dashboard" className="btn-primary mt-4" style={{padding: '20px 48px', fontSize: '18px'}}>
              Get Started Free <ArrowRight size={20}/>
            </Link>
            <div className="flex gap-4 mt-2">
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[13px] text-[#94a3b8]">No credit card</span>
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[13px] text-[#94a3b8]">Open source</span>
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[13px] text-[#94a3b8]">5 min setup</span>
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/5 bg-[#030308]/80 backdrop-blur-xl px-8 py-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <BrainCircuit size={24} color="#3b82f6" />
              <div className="flex flex-col">
                <span className="font-['Inter'] font-[800] text-lg leading-none">
                  Neuro<span style={{color: '#3b82f6'}}>Desk</span> AI
                </span>
                <span className="text-[10px] font-medium tracking-widest text-[#94a3b8] uppercase mt-1">Autonomous Workforce Platform</span>
              </div>
            </div>
            
            <div className="flex gap-8 text-[14px] font-medium text-[#94a3b8]">
              <a href="#" className="hover:text-[#3b82f6] transition-colors">GitHub</a>
              <Link to="/dashboard" className="hover:text-[#3b82f6] transition-colors">Dashboard</Link>
              <a href="#" className="hover:text-[#3b82f6] transition-colors">Docs</a>
              <a href="#" className="hover:text-[#3b82f6] transition-colors">Contact</a>
            </div>

            <div className="text-[13px] text-[#94a3b8]">
              © 2025 NeuroDesk AI · Built with 🧠 + Groq
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
