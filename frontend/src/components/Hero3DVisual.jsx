import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Code, Cpu, Database, Cloud, CheckCircle, TrendingUp, Zap } from 'lucide-react';

export default function Hero3DVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // -10deg to 10deg
      const y = (e.clientY / innerHeight - 0.5) * -20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="hero-3d-stage">
      <div 
        className="hero-3d-scene"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 0.7}deg) rotateX(${mousePos.y * 0.7}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
      >
        {/* Glowing Central AI Intelligence Orb */}
        <div className="ai-orb-core">
          <div className="orb-inner-pulse" />
          <div className="orb-ring ring-1" />
          <div className="orb-ring ring-2" />
          <div className="orb-ring ring-3" />
          <div className="orb-icon-wrapper">
            <Bot size={36} className="orb-bot-icon" />
          </div>
        </div>

        {/* Floating Skill Badges */}
        <div className="floating-badge badge-top-left float-anim-1">
          <Cpu size={16} className="badge-icon icon-cyan" />
          <span>AI / Machine Learning</span>
        </div>

        <div className="floating-badge badge-top-right float-anim-2">
          <Code size={16} className="badge-icon icon-blue" />
          <span>Python & React</span>
        </div>

        <div className="floating-badge badge-mid-right float-anim-3">
          <Database size={16} className="badge-icon icon-purple" />
          <span>Data Science</span>
        </div>

        <div className="floating-badge badge-bottom-left float-anim-4">
          <Cloud size={16} className="badge-icon icon-sky" />
          <span>Cloud & DevOps</span>
        </div>

        {/* Floating Glass Job Offer Card #1 */}
        <div className="hero-glass-card hero-card-1 float-anim-slow">
          <div className="card-top-row">
            <div className="company-logo-avatar avatar-google">G</div>
            <div>
              <h5 className="hero-card-title">AI Research Intern</h5>
              <p className="hero-card-subtitle">Google DeepMind • Remote</p>
            </div>
            <span className="match-pill-hero">98% Match</span>
          </div>
          <div className="card-tags-row">
            <span className="hero-tag">Python</span>
            <span className="hero-tag">PyTorch</span>
            <span className="hero-tag">LLMs</span>
          </div>
        </div>

        {/* Floating Glass Job Offer Card #2 */}
        <div className="hero-glass-card hero-card-2 float-anim-medium">
          <div className="card-top-row">
            <div className="company-logo-avatar avatar-meta">M</div>
            <div>
              <h5 className="hero-card-title">Software Engineer Intern</h5>
              <p className="hero-card-subtitle">Meta • Menlo Park, CA</p>
            </div>
            <span className="match-pill-hero">95% Match</span>
          </div>
          <div className="card-stats-row">
            <span><CheckCircle size={12} className="text-green" /> Eligible</span>
            <span><TrendingUp size={12} className="text-cyan" /> High Priority</span>
          </div>
        </div>

        {/* Floating Metric Pill */}
        <div className="hero-metric-pill float-anim-fast">
          <Zap size={14} className="text-amber" />
          <span>50+ Internships Scanned</span>
        </div>

        {/* Connected Node Lines Canvas Visual Effect */}
        <svg className="hero-network-svg" viewBox="0 0 500 400">
          <line x1="250" y1="200" x2="120" y2="80" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="250" y1="200" x2="380" y2="100" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="250" y1="200" x2="410" y2="280" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="250" y1="200" x2="90" y2="300" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}
