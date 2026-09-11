import React, { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import ResultsList from './components/ResultsList';
import CareerScraper from './components/CareerScraper';
import BackgroundParticles from './components/BackgroundParticles';
import Hero3DVisual from './components/Hero3DVisual';
import { getRecommendations } from './api';
import { 
  Sparkles, 
  Search, 
  Kanban, 
  Bot, 
  Zap, 
  Building2, 
  CheckCircle2, 
  Award, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  Compass,
  Sliders,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('finder'); // 'finder' or 'tracker' or 'scraper'
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Original form inputs (saved to run simulator overrides)
  const [lastFormInput, setLastFormInput] = useState({
    skills: ["Python", "Machine Learning", "SQL"],
    interests: ["AI/ML", "Data Science"],
    programme: "B.Tech CSE",
    year: "III",
    cgpa: 8.2
  });

  // What-If Simulator States
  const [simulatorActive, setSimulatorActive] = useState(false);
  const [simCgpa, setSimCgpa] = useState(8.2);
  const [simYear, setSimYear] = useState('III');
  const [simSkills, setSimSkills] = useState('Python, Machine Learning, SQL');
  const [simInterests, setSimInterests] = useState('AI/ML, Data Science');

  // Kanban Application Tracker state
  const [trackedApplications, setTrackedApplications] = useState(() => {
    const saved = localStorage.getItem('campus_agent_tracked_applications');
    return saved ? JSON.parse(saved) : [];
  });

  // Save tracked applications to local storage on changes
  useEffect(() => {
    localStorage.setItem('campus_agent_tracked_applications', JSON.stringify(trackedApplications));
  }, [trackedApplications]);

  // Hook to run recommendations when simulator values change
  useEffect(() => {
    if (!simulatorActive) return;

    const triggerSimulatedRecommend = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const parsedSkills = simSkills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        const parsedInterests = simInterests
          .split(',')
          .map((i) => i.trim())
          .filter((i) => i.length > 0);

        const payload = {
          skills: parsedSkills,
          interests: parsedInterests,
          programme: lastFormInput.programme,
          year: simYear,
          cgpa: parseFloat(simCgpa),
          max_duration_weeks: lastFormInput.max_duration_weeks || 8,
          preferred_start_date: lastFormInput.preferred_start_date || "15 Sept"
        };

        const data = await getRecommendations(payload);
        setResults(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading simulated recommendations.');
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce simulation requests slightly
    const timer = setTimeout(() => {
      triggerSimulatedRecommend();
    }, 400);

    return () => clearTimeout(timer);
  }, [simCgpa, simYear, simSkills, simInterests, simulatorActive]);

  const handleFormSubmit = async (studentProfile) => {
    setIsLoading(true);
    setError(null);
    setLastFormInput(studentProfile);
    
    // Initialize simulator states to match submitted profile
    setSimCgpa(studentProfile.cgpa);
    setSimYear(studentProfile.year);
    setSimSkills(studentProfile.skills.join(', '));
    setSimInterests(studentProfile.interests.join(', '));

    try {
      const data = await getRecommendations(studentProfile);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while finding recommendations.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackOpportunity = (job) => {
    const isAlreadyTracked = trackedApplications.some(app => app.title === job.title && app.organization === job.organization);
    if (isAlreadyTracked) {
      alert(`"${job.title}" is already in your application tracker.`);
      return;
    }

    const newApp = {
      id: `${job.title}-${job.organization || 'Cell'}-${Date.now()}`,
      title: job.title,
      organization: job.organization || 'TBD - Placement Cell',
      deadline: job.deadline,
      application_link: job.application_link,
      status: 'Interested',
      addedAt: new Date().toISOString()
    };

    setTrackedApplications(prev => [...prev, newApp]);
    alert(`Added "${job.title}" to your Application Tracker as "Interested"!`);
  };

  const handleUpdateTrackedStatus = (id, newStatus) => {
    setTrackedApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const handleRemoveTracked = (id) => {
    if (window.confirm("Are you sure you want to remove this internship from your application tracker?")) {
      setTrackedApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  // Helper lists for Kanban Columns
  const columns = [
    { label: 'Interested', status: 'Interested', icon: Compass, badgeColor: 'rgba(56, 189, 248, 0.2)' },
    { label: 'Applied', status: 'Applied', icon: ArrowRight, badgeColor: 'rgba(139, 92, 246, 0.2)' },
    { label: 'Interviewing', status: 'Interviewing', icon: Zap, badgeColor: 'rgba(245, 158, 11, 0.2)' },
    { label: 'Offers', status: 'Offers', icon: Award, badgeColor: 'rgba(16, 185, 129, 0.2)' }
  ];

  return (
    <div className="app-container">
      {/* Background Cyber Canvas & Particles */}
      <BackgroundParticles />

      {/* Floating Glass Navbar */}
      <header className="app-navbar-sticky">
        <nav className="app-navbar">
          <div className="brand-logo-wrapper" onClick={() => setActiveTab('finder')}>
            <div className="brand-orb-icon">
              <Bot size={24} />
            </div>
            <div className="brand-text-container">
              <h1>Campus Agent</h1>
              <span className="brand-badge">
                <ShieldCheck size={12} /> AI Career Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="nav-tabs-wrapper">
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'finder' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('finder')}
            >
              <Search size={16} /> Opportunities Finder
            </button>
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'tracker' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('tracker')}
            >
              <Kanban size={16} /> Application Tracker ({trackedApplications.length})
            </button>
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'scraper' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('scraper')}
            >
              <Bot size={16} /> AI Scraper Portals
            </button>
          </div>

          <div className="nav-status-pill">
            <span className="status-dot" /> Engine Active
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill-tag">
            <Sparkles size={14} /> Deterministic AI Matching Platform
          </div>
          <h2 className="hero-title">
            Your AI-Powered <br />Career Agent
          </h2>
          <p className="hero-subtitle">
            Discover opportunities that match your skills, ambitions and career goals. Real-time eligibility grading, automated resume extraction, and multi-agent portal crawlers.
          </p>

          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <span className="hero-stat-value">50+</span>
              <span className="hero-stat-label">Live Campus Internships</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">100%</span>
              <span className="hero-stat-label">Deterministic Verification</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">Instant</span>
              <span className="hero-stat-label">What-If Simulation</span>
            </div>
          </div>
        </div>

        {/* 3D Hero Graphic Visual */}
        <Hero3DVisual />
      </section>

      {/* Main Tab Content Views */}
      {activeTab === 'finder' ? (
        <main className="app-main">
          <div className="form-column">
            <StudentForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
          
          <div className="results-column">
            {/* What-If Simulator Switch Panel */}
            {results && (
              <div className="simulator-toggle-panel">
                <div className="panel-header">
                  <h3>
                    <Sliders size={20} className="text-cyan" /> Real-Time "What-If" Eligibility Simulator
                  </h3>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={simulatorActive}
                      onChange={(e) => setSimulatorActive(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                
                {simulatorActive && (
                  <div className="simulator-controls">
                    <p className="sim-desc">
                      Slide controls to simulate new parameters. The system re-grades and re-matches jobs immediately in real-time.
                    </p>
                    <div className="sim-grid">
                      <div className="sim-control-group">
                        <label>Simulated CGPA: <strong className="text-cyan">{simCgpa}</strong></label>
                        <input 
                          type="range" 
                          min="0" 
                          max="10" 
                          step="0.05"
                          value={simCgpa}
                          onChange={(e) => setSimCgpa(parseFloat(e.target.value))}
                        />
                      </div>

                      <div className="sim-control-group">
                        <label>Simulated Year:</label>
                        <select value={simYear} onChange={(e) => setSimYear(e.target.value)}>
                          <option value="I">Year I</option>
                          <option value="II">Year II</option>
                          <option value="III">Year III</option>
                          <option value="IV">Year IV</option>
                        </select>
                      </div>

                      <div className="sim-control-group full-width">
                        <label>Simulated Skills (comma-separated):</label>
                        <input 
                          type="text" 
                          value={simSkills} 
                          onChange={(e) => setSimSkills(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isLoading && (
              <div className="glass-card loader-container" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Campus Agent is finding opportunities...</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>Analyzing dataset criteria & matching skill alignments in real time...</p>
              </div>
            )}

            {error && (
              <div className="error-alert" style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '16px', padding: '1.25rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <AlertCircle size={22} className="text-rose" />
                <div>
                  <strong style={{ display: 'block', color: '#f43f5e' }}>Execution Error</strong>
                  <span style={{ fontSize: '0.9rem' }}>{error}</span>
                </div>
              </div>
            )}

            {!isLoading && !error && !results && (
              <div className="glass-card welcome-placeholder" style={{ padding: '5rem 3rem', textAlignment: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--accent-cyan)' }}>
                  <Search size={32} />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Ready to find internships?</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', fontSize: '1rem' }}>
                  Fill out your details in the AI Career Profile on the left, or upload your PDF resume to parse skills automatically.
                </p>
              </div>
            )}

            {!isLoading && !error && results && (
              <ResultsList results={results} onTrackOpportunity={handleTrackOpportunity} />
            )}
          </div>
        </main>
      ) : activeTab === 'tracker' ? (
        <main className="tracker-main">
          {/* Kanban Tracker Tab Header */}
          <div className="glass-card tracker-header" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Kanban size={22} className="text-cyan" /> Personal Application Kanban Board
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
              Manage and track the progress of your internship applications. (Data is stored locally in browser cache).
            </p>
          </div>

          <div className="kanban-board">
            {columns.map(col => {
              const colApps = trackedApplications.filter(app => app.status === col.status);
              const ColIcon = col.icon;
              return (
                <div key={col.status} className="kanban-column">
                  <div className="column-header">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <ColIcon size={16} className="text-cyan" /> {col.label}
                    </h4>
                    <span className="column-count" style={{ background: col.badgeColor }}>{colApps.length}</span>
                  </div>
                  
                  <div className="column-body">
                    {colApps.length === 0 ? (
                      <div className="column-empty" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-subtle)', fontSize: '0.85rem', border: '1px dashed rgba(255, 255, 255, 0.08)', borderRadius: '12px' }}>
                        No items in {col.label}
                      </div>
                    ) : (
                      colApps.map(app => (
                        <div key={app.id} className="kanban-card">
                          <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)' }}>{app.title}</h5>
                          <p className="card-org" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '0.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Building2 size={13} /> {app.organization}
                          </p>
                          <p className="card-deadline" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                            📅 Deadline: {app.deadline}
                          </p>
                          
                          {/* Kanban Card Actions */}
                          <div className="kanban-card-actions" style={{ marginTop: '0.85rem' }}>
                            <select 
                              value={app.status} 
                              onChange={(e) => handleUpdateTrackedStatus(app.id, e.target.value)}
                              className="kanban-move-select"
                            >
                              <option value="Interested">Move to: Interested</option>
                              <option value="Applied">Move to: Applied</option>
                              <option value="Interviewing">Move to: Interviewing</option>
                              <option value="Offers">Move to: Offers</option>
                            </select>

                            <div className="action-row-mini" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
                              {app.application_link && (
                                <a href={app.application_link} target="_blank" rel="noopener noreferrer" className="btn-link-action mini-action" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                  Apply <ExternalLink size={12} />
                                </a>
                              )}
                              <button 
                                type="button" 
                                className="btn-link-action mini-action action-delete"
                                onClick={() => handleRemoveTracked(app.id)}
                                style={{ color: '#f43f5e', marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      ) : (
        <main className="scraper-main" style={{ maxWidth: '1400px', width: '92%', margin: '2.5rem auto', padding: '0 1rem' }}>
          <CareerScraper studentSkills={lastFormInput?.skills || []} />
        </main>
      )}

      {/* Modern Dark Glass Footer */}
      <footer className="app-footer">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="brand-logo-wrapper">
            <div className="brand-orb-icon" style={{ width: '32px', height: '32px' }}>
              <Bot size={18} />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>Campus Agent</span>
          </div>
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} Campus Agent • Built on deterministic AI matching algorithms & multi-agent crawler engines.
          </p>
        </div>
      </footer>
    </div>
  );
}
