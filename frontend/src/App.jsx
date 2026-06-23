import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, MessageSquare, IndianRupee, Handshake, ShieldAlert, Activity, User, Send, BarChart3, TrendingUp, Mic, Database, X, Bell, Volume2, VolumeX, Rocket } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AGENTS = [
  { id: 'EMPATH', role: 'Emotion Detection', emoji: '🎭', color: '#ef4444' },
  { id: 'ORACLE', role: 'Churn Prediction', emoji: '🔮', color: '#8b5cf6' },
  { id: 'SUPPORT', role: 'Customer Response', emoji: '💬', color: '#3b82f6' },
  { id: 'CLOSER', role: 'Sales & Upselling', emoji: '💰', color: '#10b981' },
  { id: 'GUARDIAN', role: 'Complaint Resolution', emoji: '🛡️', color: '#f59e0b' },
  { id: 'ANALYST', role: 'Live Analytics', emoji: '📊', color: '#fcd34d' },
];

const DEMO_SCENARIOS = [
  { name: 'Priya', id: 'C001', text: 'My order is 5 days late! I want a full refund immediately this is pathetic!' },
  { name: 'Rahul', id: 'C002', text: 'I love your product! It has been amazing. What premium plans do you offer?' },
  { name: 'Amit', id: 'C003', text: 'How do I track my order? I placed it 2 days ago.' },
  { name: 'Neha', id: 'C004', text: 'The device is completely broken out of the box. Terrible experience, refund me!' },
  { name: 'Vikram', id: 'C005', text: 'Wow, excellent customer service last time. I want to buy 10 more licenses.' },
  { name: 'Riya', id: 'C006', text: 'Why was I double charged on my credit card?! Fix this now!' }
];

export default function App() {
  const [stats, setStats] = useState({ active_conversations: 0, revenue_saved: 0, deals_closed: 0, complaints_resolved: 0, emotion_alerts: { red: 0, green: 0 } });
  const [messages, setMessages] = useState([{ id: 1, text: '👋 War Room is live. All 6 agents ready. Send a customer message to begin demo.', sender: 'NEURODESK AI', type: 'ai' }]);
  const [inputData, setInputData] = useState({ name: 'Priya Sharma', id: 'C001', text: '' });
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const [isListening, setIsListening] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [customerVault, setCustomerVault] = useState(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  
  // New God-Tier Features State
  const [isTTSActive, setIsTTSActive] = useState(true);
  const [isAutoPilot, setIsAutoPilot] = useState(false);

  const chatRef = useRef(null);
  const recognitionRef = useRef(null);
  const autoPilotInterval = useRef(null);

  // Add a toast notification
  const addToast = (msg, color) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard`);
        const data = await res.json();
        setStats(data.stats);
        
        // Update Chart Data
        const red = data.stats.emotion_alerts?.red || 0;
        const green = data.stats.emotion_alerts?.green || 0;
        setChartData(prev => {
          const newPt = { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), angry: red, happy: green };
          const next = [...prev, newPt];
          if(next.length > 7) next.shift();
          return next;
        });

      } catch (e) {}
    };
    fetchStats();
    const int = setInterval(fetchStats, 3000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Cleanup auto-pilot on unmount
  useEffect(() => {
    return () => clearInterval(autoPilotInterval.current);
  }, []);

  const speakText = (text) => {
    if (!isTTSActive || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Make it sound a bit more professional/robotic by tweaking voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Samantha') || v.lang === 'en-GB');
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListen = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast("Browser does not support Voice API", "#ef4444");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    const originalText = inputData.text ? inputData.text + ' ' : '';

    recognition.onstart = () => { 
      setIsListening(true); 
      addToast("Microphone active... start speaking", "#3b82f6"); 
    };
    
    recognition.onresult = (e) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        } else {
          interimTranscript += e.results[i][0].transcript;
        }
      }
      setInputData(prev => ({ ...prev, text: originalText + finalTranscript + interimTranscript }));
    };
    
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const toggleAutoPilot = () => {
    if (isAutoPilot) {
      clearInterval(autoPilotInterval.current);
      setIsAutoPilot(false);
      addToast("Auto-Pilot Deactivated", "#ef4444");
    } else {
      setIsAutoPilot(true);
      addToast("Auto-Pilot Activated. Simulating live traffic...", "#10b981");
      
      const triggerRandom = async () => {
        const scenario = DEMO_SCENARIOS[Math.floor(Math.random() * DEMO_SCENARIOS.length)];
        await sendBotMessage(scenario.name, scenario.id, scenario.text);
      };

      triggerRandom(); // Fire immediately
      autoPilotInterval.current = setInterval(triggerRandom, 15000); // Every 15 seconds
    }
  };

  const loadCustomerVault = async (id) => {
    try {
      const res = await fetch(`${API_URL}/customers`);
      const data = await res.json();
      const customer = data.find(c => c.id === id);
      if(customer) {
        setCustomerVault(customer);
        setIsVaultOpen(true);
      } else {
        addToast(`Customer ${id} not found in Memory.`, "#ef4444");
      }
    } catch(e) {}
  };

  const sendBotMessage = async (name, id, text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), text: text, sender: `👤 ${name}`, type: 'customer' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: id, customer_name: name, message: text })
      });
      const data = await res.json();
      setIsTyping(false);
      
      if (data.error) {
        setMessages(prev => [...prev, { id: Date.now(), text: '❌ Error: ' + data.error, sender: 'SYSTEM', type: 'ai' }]);
        return;
      }
      
      const agentLabel = { GUARDIAN: '🛡️ GUARDIAN', CLOSER: '💰 CLOSER', SUPPORT: '💬 SUPPORT' };
      setMessages(prev => [...prev, { id: Date.now(), text: data.response, sender: agentLabel[data.winning_agent] || 'NEURODESK', type: 'ai' }]);
      
      // Speak the response if TTS is on
      speakText(data.response);
      
      if (data.compensation) {
        setMessages(prev => [...prev, { id: Date.now()+1, text: data.compensation, sender: '🎁 AUTO-ACTION', type: 'compensation' }]);
        addToast(`GUARDIAN Auto-Action: ${data.action_taken}`, "#f59e0b");
      } else if (data.winning_agent === 'CLOSER') {
        addToast(`CLOSER successfully executed upsell protocol!`, "#10b981");
      }
      
      setAnalysis(data);
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), text: '❌ Cannot connect to backend (port 5000).', sender: 'SYSTEM', type: 'ai' }]);
    }
  };

  const handleSend = () => {
    if(!inputData.text.trim()) return;
    sendBotMessage(inputData.name, inputData.id, inputData.text);
    setInputData(prev => ({ ...prev, text: '' }));
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1800px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 10 }}>
      
      {/* TOASTS */}
      <div style={{ position: 'fixed', top: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:50}}
              style={{ background:'rgba(15,15,35,0.9)', backdropFilter:'blur(10px)', border:`1px solid ${t.color}`, borderLeft:`4px solid ${t.color}`, padding:'16px 20px', borderRadius:'12px', color:'#fff', display:'flex', alignItems:'center', gap:'12px', boxShadow:`0 10px 30px rgba(0,0,0,0.5), 0 0 15px ${t.color}33`, fontWeight:600 }}>
              <Bell size={18} color={t.color} />
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER */}
      <header className="glass-panel" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <BrainCircuit size={36} color="#3b82f6" />
          <h1 style={{ fontSize:'28px', fontWeight:900, margin:0, letterSpacing:'-0.5px' }}>
            Neuro<span style={{color:'#3b82f6'}}>Desk</span> AI
            <span style={{color:'#94a3b8', fontSize:'14px', marginLeft:'16px', fontWeight:500, letterSpacing:'1px', textTransform:'uppercase'}}>Autonomous Workforce Platform</span>
          </h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
          <button onClick={() => setIsTTSActive(!isTTSActive)} style={{ padding:'8px 16px', borderRadius:'99px', background: isTTSActive ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)', border: isTTSActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.1)', color: isTTSActive ? '#60a5fa' : '#94a3b8', display:'flex', alignItems:'center', gap:'8px', fontWeight:700, fontSize:'12px', transition:'all 0.2s' }}>
            {isTTSActive ? <Volume2 size={16}/> : <VolumeX size={16}/>}
            {isTTSActive ? "TTS ON" : "TTS OFF"}
          </button>
          <button onClick={toggleAutoPilot} className={isAutoPilot ? "animate-pulse" : ""} style={{ padding:'8px 16px', borderRadius:'99px', background: isAutoPilot ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', border: isAutoPilot ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.1)', color: isAutoPilot ? '#34d399' : '#94a3b8', display:'flex', alignItems:'center', gap:'8px', fontWeight:800, fontSize:'12px', transition:'all 0.2s', letterSpacing:'1px' }}>
            <Rocket size={16}/>
            {isAutoPilot ? "AUTO-PILOT ACTIVE" : "START SIMULATOR"}
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 20px', borderRadius:'99px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)' }}>
            <div className="live-dot" />
            <span style={{ color:'#10b981', fontWeight:800, fontSize:'13px', letterSpacing:'1.5px' }}>SYSTEM LIVE</span>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'24px' }}>
        {[
          { label: 'Conversations', value: stats.active_conversations, icon: MessageSquare, color: '#3b82f6' },
          { label: 'Revenue Saved', value: `₹${(stats.revenue_saved || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: '#10b981' },
          { label: 'Deals Closed', value: stats.deals_closed, icon: Handshake, color: '#f59e0b' },
          { label: 'Complaints Resolved', value: stats.complaints_resolved, icon: ShieldAlert, color: '#ef4444' }
        ].map((stat, i) => (
          <motion.div key={i} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i*0.1}} className="glass-panel" style={{ padding:'24px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'4px', background:stat.color, boxShadow:`0 0 15px ${stat.color}` }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <p style={{ color:'#94a3b8', fontSize:'13px', fontWeight:700, letterSpacing:'2px', marginBottom:'6px', textTransform:'uppercase' }}>{stat.label}</p>
                <h3 style={{ fontSize:'42px', fontWeight:900, letterSpacing:'-1px', color:stat.color, margin:0 }}>{stat.value}</h3>
              </div>
              <div style={{ background:`${stat.color}15`, borderRadius:'14px', padding:'14px', border:`1px solid ${stat.color}33` }}>
                <stat.icon size={28} color={stat.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AGENTS */}
      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'20px' }}>
          {AGENTS.map((agent, i) => {
            const isActive = analysis && (analysis.winning_agent === agent.id || ['EMPATH','ORACLE','ANALYST'].includes(agent.id));
            return (
              <motion.div key={agent.id} 
                animate={isActive ? { scale: [1, 1.05, 1], boxShadow: [`0 0 0px ${agent.color}`, `0 0 25px ${agent.color}55`, `0 0 0px ${agent.color}`] } : {}}
                transition={{ duration: 1 }}
                className="glass-panel" style={{ padding:'16px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'10px', borderColor: isActive ? agent.color : 'rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize:'36px' }}>{agent.emoji}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  <span style={{ fontSize:'13px', fontWeight:800, letterSpacing:'1.5px', color:agent.color }}>{agent.id}</span>
                  <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:500 }}>{agent.role}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'24px', flex:1 }}>
        
        {/* COL 1: CHAT PANEL */}
        <div className="glass-panel" style={{ padding:'30px', display:'flex', flexDirection:'column', height:'700px' }}>
          <h2 style={{ fontSize:'15px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase', color:'#60a5fa', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'20px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', margin:0 }}>
            <MessageSquare size={18} /> Live Customer Chat
          </h2>
          
          <div ref={chatRef} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'20px', paddingRight:'10px', marginBottom:'20px' }}>
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div key={m.id} initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} className="chat-message" style={{ padding:'18px', borderRadius:'18px', maxWidth:'90%', fontSize:'15px', lineHeight:'1.6', marginLeft: m.type === 'customer' ? 'auto' : '0', background: m.type === 'customer' ? 'rgba(37,99,235,0.15)' : m.type === 'compensation' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)', border: m.type === 'customer' ? '1px solid rgba(59,130,246,0.3)' : m.type === 'compensation' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)', backdropFilter:'blur(5px)' }}>
                  <div style={{ fontSize:'11px', fontWeight:800, letterSpacing:'1px', color:'#94a3b8', marginBottom:'8px' }}>{m.sender}</div>
                  <div style={{ color:'#f8fafc' }}>{m.text}</div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ padding:'18px', borderRadius:'18px', maxWidth:'90%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', fontSize:'15px', color:'#60a5fa', fontStyle:'italic' }}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <div className="live-dot" style={{background:'#60a5fa'}}/> Analyzing intent...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
            <div style={{ display:'flex', gap:'15px' }}>
              <input type="text" value={inputData.name} onChange={e=>setInputData(prev=>({...prev, name: e.target.value}))} placeholder="Customer Name" style={{ width:'40%', padding:'14px 20px', borderRadius:'14px', fontSize:'15px' }} />
              <input type="text" value={inputData.id} onChange={e=>setInputData(prev=>({...prev, id: e.target.value}))} placeholder="ID" style={{ width:'30%', padding:'14px 20px', borderRadius:'14px', fontSize:'15px' }} />
              <button onClick={() => loadCustomerVault(inputData.id)} style={{ flex:1, background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)', borderRadius:'14px', color:'#c084fc', fontWeight:700, fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase' }}>
                Open Vault
              </button>
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={toggleListen} style={{ padding:'14px', background: isListening ? '#ef4444' : 'rgba(255,255,255,0.1)', color:'white', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', border: isListening ? '1px solid #fca5a5' : '1px solid rgba(255,255,255,0.2)', transition:'all 0.3s', boxShadow: isListening ? '0 0 15px rgba(239,68,68,0.5)' : 'none' }}>
                <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
              </button>
              <input type="text" value={inputData.text} onChange={e=>setInputData(prev=>({...prev, text: e.target.value}))} onKeyPress={e=>e.key==='Enter' && handleSend()} placeholder="Type or speak a message..." style={{ flex:1, padding:'14px 20px', borderRadius:'14px', fontSize:'15px' }} />
              <button onClick={handleSend} disabled={isTyping || isAutoPilot} style={{ padding:'14px 24px', background: isTyping || isAutoPilot ? '#1e3a8a' : '#2563eb', color:'white', borderRadius:'14px', fontWeight:800, letterSpacing:'1px', display:'flex', alignItems:'center', gap:'10px', opacity: isTyping || isAutoPilot ? 0.7 : 1 }}>
                <Send size={18} />
              </button>
            </div>
            
            <div style={{ marginTop:'5px', display:'flex', gap:'10px', overflowX:'auto', paddingBottom:'10px' }}>
              {DEMO_SCENARIOS.slice(0,3).map((demo, i) => (
                <button key={i} onClick={() => setInputData({name:demo.name, id:demo.id, text:demo.text})} style={{ padding:'8px 16px', fontSize:'13px', fontWeight:600, borderRadius:'10px', border:'1px solid rgba(255,255,255,0.1)', whiteSpace:'nowrap', background:'rgba(255,255,255,0.03)' }}>
                  {demo.text.includes('refund') ? '😡 Refund' : demo.text.includes('plans') ? '😊 Upgrade' : '😐 Track'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COL 2: VAULT & CHARTS */}
        <div className="glass-panel" style={{ padding:'30px', display:'flex', flexDirection:'column', height:'700px', overflowY:'auto' }}>
          
          <h2 style={{ fontSize:'15px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase', color:'#10b981', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'20px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', margin:0 }}>
            <Database size={18} /> Customer Memory Vault
          </h2>

          {isVaultOpen && customerVault ? (
            <AnimatePresence>
              <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} style={{ padding:'20px', borderRadius:'16px', background:'rgba(16,185,129,0.05)', border:'1px solid rgba(16,185,129,0.3)', marginBottom:'24px', position:'relative' }}>
                <button onClick={()=>setIsVaultOpen(false)} style={{position:'absolute', top:'15px', right:'15px', color:'#94a3b8'}}><X size={18}/></button>
                <h3 style={{ fontSize:'20px', fontWeight:900, color:'#34d399', marginBottom:'4px' }}>{customerVault.name || 'Unknown'}</h3>
                <p style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'16px', fontWeight:600 }}>ID: {customerVault.id}</p>
                
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
                  <div style={{ background:'rgba(0,0,0,0.3)', padding:'12px', borderRadius:'12px' }}>
                    <p style={{fontSize:'11px', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Interactions</p>
                    <p style={{fontSize:'20px', fontWeight:800, color:'#f8fafc'}}>{customerVault.interactions || 0}</p>
                  </div>
                  <div style={{ background:'rgba(0,0,0,0.3)', padding:'12px', borderRadius:'12px' }}>
                    <p style={{fontSize:'11px', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Complaints</p>
                    <p style={{fontSize:'20px', fontWeight:800, color:'#ef4444'}}>{customerVault.complaints || 0}</p>
                  </div>
                </div>

                <div style={{ background:'rgba(0,0,0,0.3)', padding:'12px', borderRadius:'12px', marginBottom:'16px' }}>
                  <p style={{fontSize:'11px', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px'}}>Emotion History</p>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                    {(customerVault.emotion_history || []).slice(-6).map((em, i) => (
                      <span key={i} style={{ padding:'4px 10px', borderRadius:'99px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', 
                        background: em==='angry'?'rgba(239,68,68,0.2)' : em==='sad'?'rgba(245,158,11,0.2)' : em==='happy'?'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)',
                        color: em==='angry'?'#fca5a5' : em==='sad'?'#fcd34d' : em==='happy'?'#6ee7b7' : '#93c5fd', border:'1px solid rgba(255,255,255,0.1)'
                      }}>
                        {em}
                      </span>
                    ))}
                  </div>
                </div>

                {customerVault.compensation_given && customerVault.compensation_given.length > 0 && (
                  <div style={{ background:'rgba(0,0,0,0.3)', padding:'12px', borderRadius:'12px' }}>
                    <p style={{fontSize:'11px', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px'}}>Compensations Issued</p>
                    <ul style={{ margin:0, paddingLeft:'20px', color:'#f8fafc', fontSize:'13px', lineHeight:1.6 }}>
                      {customerVault.compensation_given.map((comp, i) => <li key={i}>{comp}</li>)}
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div style={{ padding:'30px', textAlign:'center', color:'#64748b', fontSize:'14px', border:'1px dashed rgba(255,255,255,0.1)', borderRadius:'16px', marginBottom:'24px' }}>
              Click "OPEN VAULT" in the chat panel to reveal a customer's hidden lifetime memory.
            </div>
          )}

          <h2 style={{ fontSize:'15px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase', color:'#fcd34d', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'20px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', margin:0, marginTop:'auto' }}>
            <Activity size={18} /> Live Emotion Telemetry
          </h2>
          <div style={{ height:'250px', width:'100%', padding:'10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                <RechartsTooltip contentStyle={{backgroundColor:'#0f0f23', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px'}} />
                <Line type="monotone" dataKey="angry" stroke="#ef4444" strokeWidth={3} dot={{r:4}} name="Angry Alerts" />
                <Line type="monotone" dataKey="happy" stroke="#10b981" strokeWidth={3} dot={{r:4}} name="Happy Alerts" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COL 3: ANALYSIS PANEL */}
        <div className="glass-panel" style={{ padding:'30px', display:'flex', flexDirection:'column', height:'700px', overflowY:'auto' }}>
          <h2 style={{ fontSize:'15px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase', color:'#c084fc', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'20px', marginBottom:'24px', display:'flex', alignItems:'center', gap:'10px', margin:0 }}>
            <BrainCircuit size={18} /> Agent Intelligence
          </h2>

          {!analysis ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px', color:'#64748b' }}>
              <Activity size={64} style={{ opacity: 0.2 }} />
              <p style={{ fontSize:'15px', fontWeight:500 }}>Awaiting routing decision...</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              
              {/* Winner */}
              <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} style={{ padding:'24px', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'space-between', background: 'rgba(255,255,255,0.03)', border: `1px solid ${AGENTS.find(a=>a.id===analysis.winning_agent)?.color || '#fff'}`, boxShadow:`0 0 20px ${AGENTS.find(a=>a.id===analysis.winning_agent)?.color}22` }}>
                <div>
                  <p style={{ fontSize:'11px', fontWeight:800, letterSpacing:'2px', color:'#94a3b8', textTransform:'uppercase', marginBottom:'6px' }}>Winning Agent</p>
                  <h3 style={{ fontSize:'28px', fontWeight:900, letterSpacing:'-0.5px', color: AGENTS.find(a=>a.id===analysis.winning_agent)?.color, margin:0 }}>{analysis.winning_agent}</h3>
                </div>
                <div style={{ fontSize:'42px' }}>🏆</div>
              </motion.div>

              {/* Grid 2x2 for Emotion & Action */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'20px' }}>
                <div style={{ padding:'20px', borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize:'11px', fontWeight:800, letterSpacing:'2px', color:'#94a3b8', textTransform:'uppercase', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px' }}><User size={14}/> EMPATH: Emotion</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                    <span style={{ fontSize:'36px' }}>{analysis.emotion.emoji}</span>
                    <div>
                      <div style={{ fontWeight:800, textTransform:'uppercase', fontSize:'16px', color:'#f8fafc' }}>{analysis.emotion.emotion}</div>
                      <div style={{ fontSize:'12px', color:'#94a3b8', fontWeight:500, marginTop:'4px' }}>{Math.round(analysis.emotion.score*100)}% Confidence</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Churn Risk */}
              <div style={{ padding:'24px', borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize:'11px', fontWeight:800, letterSpacing:'2px', color:'#94a3b8', textTransform:'uppercase', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}><TrendingUp size={14}/> ORACLE: Churn Prediction</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'12px' }}>
                  <div>
                    <span style={{ fontSize:'36px', fontWeight:900, color: analysis.churn_risk_after >= 70 ? '#ef4444' : analysis.churn_risk_after >= 40 ? '#f59e0b' : '#10b981' }}>{analysis.churn_risk_after}%</span>
                    {analysis.churn_risk_before !== analysis.churn_risk_after && (
                      <span style={{ fontSize:'14px', color:'#94a3b8', marginLeft:'12px', fontWeight:500 }}>(was {analysis.churn_risk_before}%)</span>
                    )}
                  </div>
                  <span style={{ fontSize:'12px', fontWeight:800, padding:'6px 12px', borderRadius:'6px', background:'rgba(255,255,255,0.1)', letterSpacing:'1px' }}>{analysis.oracle_level}</span>
                </div>
                <div style={{ height:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'99px', overflow:'hidden', marginBottom:'12px' }}>
                  <motion.div initial={{width:0}} animate={{width:`${analysis.churn_risk_after}%`}} style={{ height:'100%', borderRadius:'99px', background: analysis.churn_risk_after >= 70 ? '#ef4444' : analysis.churn_risk_after >= 40 ? '#f59e0b' : '#10b981' }} />
                </div>
                <div style={{ fontSize:'14px', color:'#94a3b8', fontStyle:'italic', fontWeight:500 }}>"{analysis.prediction}"</div>
              </div>

              {/* Voting */}
              <div style={{ padding:'24px', borderRadius:'16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize:'11px', fontWeight:800, letterSpacing:'2px', color:'#94a3b8', textTransform:'uppercase', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px' }}><BarChart3 size={14}/> Agent Voting Results</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  {Object.entries(analysis.votes).map(([agent, score]) => {
                    const maxScore = Math.max(...Object.values(analysis.votes));
                    const pct = maxScore > 0 ? (score/maxScore)*100 : 0;
                    const aColor = AGENTS.find(a=>a.id===agent)?.color || '#fff';
                    return (
                      <div key={agent} style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                        <div style={{ width:'90px', fontSize:'13px', fontWeight:800, color: aColor, letterSpacing:'0.5px' }}>{agent}</div>
                        <div style={{ flex:1, height:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'99px', overflow:'hidden' }}>
                          <motion.div initial={{width:0}} animate={{width:`${pct}%`}} style={{ height:'100%', borderRadius:'99px', background: aColor }} />
                        </div>
                        <div style={{ width:'30px', textAlign:'right', fontSize:'14px', fontWeight:900, color:'#f8fafc' }}>{score}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
