import React, { useState } from 'react';
import { runWebScraper, importScrapedOpportunities } from '../api';
import { 
  Bot, 
  Globe, 
  Building2, 
  CheckSquare, 
  Square, 
  Play, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Zap,
  Loader2,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Send
} from 'lucide-react';

const COMPANIES = [
  "Google", "Microsoft", "Meta", "Amazon", "Apple",
  "Netflix", "Stripe", "Uber", "Tesla", "Airbnb",
  "Nvidia", "Oracle", "Adobe", "Salesforce", "Intel",
  "Spotify", "X (Twitter)", "LinkedIn", "Zoom", "Coinbase"
];

const CURATED_LEARNING_RESOURCES = {
  'python': { name: 'Kaggle Python Course', url: 'https://www.kaggle.com/learn/python' },
  'machine learning': { name: 'Kaggle Intro to Machine Learning', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
  'deep learning': { name: 'Fast.ai Deep Learning Course', url: 'https://course.fast.ai/' },
  'pytorch': { name: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/' },
  'tensorflow': { name: 'TensorFlow Learn Guides', url: 'https://www.tensorflow.org/tutorials' },
  'sql': { name: 'W3Schools SQL Tutorial', url: 'https://www.w3schools.com/sql/' },
  'html': { name: 'MDN HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics' },
  'css': { name: 'MDN CSS Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics' },
  'javascript': { name: 'javascript.info Tutorial', url: 'https://javascript.info/' },
  'react': { name: 'React Official Documentation', url: 'https://react.dev/learn' },
  'node.js': { name: 'Node.js Official Guides', url: 'https://nodejs.org/en/docs/guides/' },
  'express': { name: 'Express MDN Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs' },
  'aws': { name: 'AWS Skill Builder', url: 'https://skillbuilder.aws/' },
  'linux': { name: 'Linux Journey Tutorial', url: 'https://linuxjourney.com/' },
  'docker': { name: 'Docker Handbook', url: 'https://docs.docker.com/get-started/' },
  'kubernetes': { name: 'Play with Kubernetes', url: 'https://labs.play-with-k8s.com/' },
  'git': { name: 'Pro Git Book (Free)', url: 'https://git-scm.com/book/en/v2' },
  'java': { name: 'Codecademy Learn Java', url: 'https://www.codecademy.com/learn/learn-java' },
  'kotlin': { name: 'Kotlin Bootcamp', url: 'https://kotlinlang.org/docs/kotlin-hands-on.html' },
  'swift': { name: 'Hacking with Swift', url: 'https://www.hackingwithswift.com/100' },
  'figma': { name: 'Figma Learn Tutorials', url: 'https://www.figma.com/resource-library/learn-figma/' },
  'adobe xd': { name: 'Adobe XD Learning Tutorials', url: 'https://helpx.adobe.com/support/xd.html' },
  'powerbi': { name: 'Microsoft Power BI Learn', url: 'https://learn.microsoft.com/en-us/power-bi/' },
  'tableau': { name: 'Tableau Training Videos', url: 'https://www.tableau.com/learn/training' },
  'excel': { name: 'Microsoft Excel Training', url: 'https://support.microsoft.com/en-us/excel' },
  'c#': { name: 'Microsoft C# Learn Paths', url: 'https://learn.microsoft.com/en-us/training/paths/csharp-first-steps/' },
  'c++': { name: 'LearnCpp.com Tutorials', url: 'https://www.learncpp.com/' },
  'go': { name: 'A Tour of Go', url: 'https://go.dev/tour/' },
  'mongodb': { name: 'MongoDB University', url: 'https://university.mongodb.com/' },
  'graphql': { name: 'How to GraphQL', url: 'https://www.howtographql.com/' },
  'transformers': { name: 'HuggingFace Course', url: 'https://huggingface.co/learn/nlp-course' },
  'nlp': { name: 'HuggingFace NLP Guides', url: 'https://huggingface.co/learn' },
  'd3.js': { name: 'D3.js Tutorials', url: 'https://d3js.org/getting-started' },
  'opencv': { name: 'OpenCV Tutorials', url: 'https://docs.opencv.org/master/d9/df8/tutorial_root.html' },
  'wireshark': { name: 'Wireshark Guides', url: 'https://www.wireshark.org/docs/' },
  'network security': { name: 'Cybrary Network Security', url: 'https://www.cybrary.it/' },
  'cryptography': { name: 'Coursera Cryptography Course', url: 'https://www.coursera.org/learn/crypto' },
  'metasploit': { name: 'Metasploit Unleashed', url: 'https://www.offensive-security.com/metasploit-unleashed/' },
  'product strategy': { name: 'Product School Guides', url: 'https://productschool.com/' },
  'r': { name: 'Kaggle R Course', url: 'https://www.kaggle.com/learn/r' },
  'spark': { name: 'Databricks Spark Guides', url: 'https://www.databricks.com/spark/about' },
  'hadoop': { name: 'Apache Hadoop Tutorial', url: 'https://hadoop.apache.org/' },
  'vue': { name: 'Vue.js Intro Guides', url: 'https://vuejs.org/guide/introduction.html' },
  'angular': { name: 'Angular Tour of Heroes', url: 'https://angular.dev/tutorials' },
  'flutter': { name: 'Flutter Codelabs', url: 'https://docs.flutter.dev/reference/codelabs' },
  'dart': { name: 'Dart Tutorials', url: 'https://dart.dev/guides' },
  'terraform': { name: 'HashiCorp Terraform Learn', url: 'https://developer.hashicorp.com/terraform/tutorials' },
};

const SKILL_QUESTIONS = {
  'python': [
    { q: "What is the difference between a list and a tuple in Python?", keys: ["mutable", "immutable", "change"] },
    { q: "Explain list comprehension in Python and give a brief example.", keys: ["bracket", "loop", "syntax", "generator"] }
  ],
  'machine learning': [
    { q: "What is the difference between supervised and unsupervised learning?", keys: ["labeled", "unlabeled", "target", "group"] },
    { q: "Explain the bias-variance tradeoff in Machine Learning.", keys: ["overfit", "underfit", "error", "complexity"] }
  ],
  'sql': [
    { q: "What is the difference between INNER JOIN and LEFT JOIN?", keys: ["matching", "all rows", "left table", "null"] },
    { q: "Explain when you would use GROUP BY vs HAVING.", keys: ["aggregate", "filter", "condition", "where"] }
  ],
  'javascript': [
    { q: "Explain closure in JavaScript.", keys: ["scope", "outer", "inner", "function", "lexical"] },
    { q: "What is the difference between let, const, and var?", keys: ["block", "reassign", "hoisting", "global"] }
  ],
  'react': [
    { q: "Explain the virtual DOM and how React reconciles changes.", keys: ["diff", "render", "update", "patch", "memory"] },
    { q: "What is the difference between useEffect and useState?", keys: ["state", "effect", "lifecycle", "cleanup"] }
  ],
  'aws': [
    { q: "What is the difference between S3 and EC2 in AWS?", keys: ["storage", "compute", "instance", "object", "server"] },
    { q: "Explain AWS IAM roles and policies.", keys: ["access", "permission", "security", "role", "identity"] }
  ],
  'git': [
    { q: "What is the difference between git fetch and git pull?", keys: ["merge", "remote", "download", "local", "branch"] },
    { q: "Explain how git rebase works compared to git merge.", keys: ["history", "linear", "commit", "branch"] }
  ],
  'java': [
    { q: "What is the difference between JDK, JRE, and JVM?", keys: ["compiler", "runtime", "virtual machine", "execute"] },
    { q: "Explain method overloading vs method overriding in Java.", keys: ["signature", "inheritance", "runtime", "compile"] }
  ],
  'c++': [
    { q: "What is a pointer vs a reference in C++?", keys: ["address", "memory", "null", "reassign"] },
    { q: "Explain object destructors and RAII in C++.", keys: ["memory", "resource", "cleanup", "constructor"] }
  ],
  'docker': [
    { q: "What is the difference between an image and a container in Docker?", keys: ["template", "running", "instance", "build"] },
    { q: "Explain Docker compose and when to use it.", keys: ["multi-container", "yaml", "service", "orchestrate"] }
  ]
};

const DEFAULT_QUESTIONS = [
  { q: "Explain Object-Oriented Programming (OOP) principles.", keys: ["inheritance", "polymorphism", "encapsulation", "abstraction"] },
  { q: "What is the difference between Git Merge and Git Rebase?", keys: ["history", "commit", "linear", "branch"] },
  { q: "Explain what REST APIs are and their primary HTTP methods.", keys: ["stateless", "get", "post", "put", "delete", "server"] }
];

export default function CareerScraper({ studentSkills }) {
  const [selectedCompanies, setSelectedCompanies] = useState(["Google", "Microsoft", "Meta", "Amazon"]);
  const [customUrl, setCustomUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedList, setScrapedList] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const [expandedLearningPaths, setExpandedLearningPaths] = useState({});
  const [activeInterviewIdx, setActiveInterviewIdx] = useState(null);
  const [interviewAnswers, setInterviewAnswers] = useState({ 0: '', 1: '', 2: '' });
  const [interviewFeedback, setInterviewFeedback] = useState(null);

  const toggleLearningPath = (idx) => {
    setExpandedLearningPaths(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleMockInterview = (idx) => {
    if (activeInterviewIdx === idx) {
      setActiveInterviewIdx(null);
      setInterviewAnswers({ 0: '', 1: '', 2: '' });
      setInterviewFeedback(null);
    } else {
      setActiveInterviewIdx(idx);
      setInterviewAnswers({ 0: '', 1: '', 2: '' });
      setInterviewFeedback(null);
    }
  };

  const getQuestionsForJob = (job) => {
    const list = [];
    const skills = job.required_skills || [];
    for (const skill of skills) {
      const key = skill.toLowerCase().trim();
      if (SKILL_QUESTIONS[key]) {
        list.push(SKILL_QUESTIONS[key][0]);
      }
      if (list.length >= 3) break;
    }
    while (list.length < 3) {
      const remaining = DEFAULT_QUESTIONS[list.length];
      if (remaining) {
        list.push(remaining);
      } else {
        break;
      }
    }
    return list.slice(0, 3);
  };

  const handleGradeInterview = (questions) => {
    const grades = [];
    let totalScore = 0;

    questions.forEach((q, idx) => {
      const answer = (interviewAnswers[idx] || "").toLowerCase().trim();
      const matched = [];
      q.keys.forEach(k => {
        if (answer.includes(k)) {
          matched.push(k);
        }
      });
      const score = Math.min(10, Math.round((matched.length / q.keys.length) * 10));
      totalScore += score;
      grades.push({
        question: q.q,
        score,
        matched,
        expectedKeys: q.keys
      });
    });

    const averageScore = Math.round(totalScore / 3);
    setInterviewFeedback({
      grades,
      averageScore,
      feedbackMsg: averageScore >= 7 
        ? "Excellent! You have a solid grasp of these core technical concepts. Ready for the real interview!" 
        : averageScore >= 4 
        ? "Good attempt. Try expanding your answers by including key technical terms." 
        : "Requires revision. Review missing key concepts in the learning roadmap!"
    });
  };

  const resetInterview = () => {
    setInterviewAnswers({ 0: '', 1: '', 2: '' });
    setInterviewFeedback(null);
  };

  const handleToggleCompany = (company) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(prev => prev.filter(c => c !== company));
    } else {
      setSelectedCompanies(prev => [...prev, company]);
    }
  };

  const handleSelectAll = () => {
    setSelectedCompanies(COMPANIES);
  };

  const handleSelectNone = () => {
    setSelectedCompanies([]);
  };

  const handleStartScraping = async () => {
    if (selectedCompanies.length === 0 && !customUrl.trim()) {
      alert("Please select at least one company or provide a custom career URL to scrape.");
      return;
    }

    setIsScraping(true);
    setScrapedList([]);
    setImportMessage('');

    try {
      // Call backend scraper sending selected companies list, custom url, and current student profile skills
      const result = await runWebScraper(selectedCompanies, customUrl, studentSkills, null);
      
      if (result && result.opportunities) {
        setScrapedList(result.opportunities);
      }
    } catch (err) {
      console.error(err);
      alert(`Scraping failed: ${err.message}`);
    } finally {
      setIsScraping(false);
    }
  };

  const handleImportToPool = async () => {
    if (scrapedList.length === 0) return;
    setImporting(true);
    setImportMessage('');
    try {
      const res = await importScrapedOpportunities(scrapedList);
      setImportMessage(res.message);
      alert(res.message);
    } catch (err) {
      console.error(err);
      setImportMessage(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="scraper-tab-container">
      <div className="glass-card scraper-header-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Bot size={24} className="text-cyan" /> Multi-Agent AI Career Scraper
        </h3>
        <p className="scraper-description" style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.4rem', lineHeight: '1.6' }}>
          Select target company portals or scrape a custom careers link. The crawler agents navigate pages, extract openings using Gemini LLM, and compute skill alignment dynamically against your active student profile.
        </p>

        {/* Company Selector Grid Section */}
        <div className="company-selection-section" style={{ marginTop: '1.5rem' }}>
          <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="selection-label" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              Select Portals to Scrape ({selectedCompanies.length}):
            </span>
            <div className="bulk-selection-buttons" style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={handleSelectAll} disabled={isScraping} className="btn-link-action">Select All</button>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
              <button type="button" onClick={handleSelectNone} disabled={isScraping} className="btn-link-action" style={{ color: '#f43f5e' }}>Clear All</button>
            </div>
          </div>
          
          <div className="company-selection-grid">
            {COMPANIES.map(company => (
              <label key={company} className={`company-checkbox-item ${selectedCompanies.includes(company) ? 'checkbox-active' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={selectedCompanies.includes(company)}
                  onChange={() => handleToggleCompany(company)}
                  disabled={isScraping}
                  style={{ display: 'none' }}
                />
                {selectedCompanies.includes(company) ? (
                  <CheckSquare size={14} className="text-cyan" />
                ) : (
                  <Square size={14} style={{ color: 'var(--text-subtle)' }} />
                )}
                <span>{company}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom URL Input Field */}
        <div className="custom-url-row" style={{ marginTop: '1.5rem' }}>
          <label htmlFor="custom-url" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            <Globe size={15} style={{ display: 'inline', marginRight: '4px', color: '#38bdf8' }} /> Or scrape a specific Custom Careers page URL:
          </label>
          <input 
            type="url" 
            id="custom-url" 
            placeholder="e.g. https://careers.netflix.com/jobs/intern-engineer" 
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            disabled={isScraping}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(7, 10, 18, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-main)', fontSize: '0.9rem' }}
          />
        </div>

        <div className="scraper-action-row" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            className="btn btn-primary btn-scrape-launch" 
            onClick={handleStartScraping}
            disabled={isScraping}
            style={{ width: 'auto', minWidth: '240px' }}
          >
            {isScraping ? (
              <>
                <Loader2 size={18} className="spinner" style={{ width: '18px', height: '18px' }} /> Crawling Portals...
              </>
            ) : (
              <>
                <Play size={18} /> Launch Scraper Agents 🚀
              </>
            )}
          </button>
        </div>
      </div>

      {isScraping && (
        <div className="glass-card loader-container" style={{ margin: '3rem auto', textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }} />
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Multi-Agent crawler in progress...</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>Extracting live job postings via LLM schema parser...</p>
        </div>
      )}

      {!isScraping && (
        <div className="scraped-results-panel">
          <div className="results-header-row" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.85rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Scraped Opportunities ({scrapedList.length})</h4>
            {scrapedList.length > 0 && (
              <button 
                type="button" 
                className="btn btn-primary btn-import" 
                onClick={handleImportToPool}
                disabled={importing}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', width: 'auto' }}
              >
                {importing ? 'Importing...' : 'Merge to Opportunities Pool 📥'}
              </button>
            )}
          </div>

          {importMessage && (
            <div className="import-success-alert" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', color: '#34d399', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {importMessage}
            </div>
          )}

          <div className="scraped-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {scrapedList.length === 0 ? (
              <div className="glass-card scraped-placeholder-card" style={{ gridColumn: '1 / -1', padding: '5rem 2rem', textAlign: 'center' }}>
                <Bot size={40} className="text-cyan" style={{ margin: '0 auto 1rem auto' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No scraped results yet. Select company portals above and click Launch to extract live internship opportunities.</span>
              </div>
            ) : (
              scrapedList.map((job, idx) => (
                <div key={idx} className="glass-card scraped-job-card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="scraped-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.65rem' }}>
                    <div>
                      <h5 className="title" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{job.title}</h5>
                      <span className="scraped-org" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <Building2 size={12} /> {job.organization}
                      </span>
                    </div>
                  </div>
                  <div className="scraped-card-details" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ margin: 0 }}><strong>Required Skills:</strong> {job.required_skills.join(', ')}</p>
                    
                    {/* Skills match matching block */}
                    {job.matched_skills && job.matched_skills.length > 0 && (
                      <div className="skill-group-mini">
                        <span className="skill-label-mini text-green-bold" style={{ color: '#34d399' }}>Matched Skills:</span>
                        <div className="chips-mini">
                          {job.matched_skills.map((s, i) => (
                            <span key={i} className="chip-mini chip-matched">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Skills preferred matching block */}
                    {job.preferred_skills && job.preferred_skills.length > 0 && (
                      <div className="skill-group-mini">
                        <span className="skill-label-mini text-orange-bold" style={{ color: '#fbbf24' }}>Preferred Skills:</span>
                        <div className="chips-mini">
                          {job.preferred_skills.map((s, i) => (
                            <span key={i} className="chip-mini chip-missing">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p style={{ margin: 0 }}><strong>Duration:</strong> {job.duration} | <strong>Starts:</strong> {job.start_date}</p>
                    <p style={{ margin: 0 }}><strong>Eligibility:</strong> {job.eligibility.programme} ({job.eligibility.years.join(', ')} year) | Min CGPA: {job.eligibility.min_cgpa || 'None'}</p>
                    <p className="scraped-instructions" style={{ margin: 0, fontSize: '0.78rem' }}><strong>Instructions:</strong> {job.application_instructions}</p>

                    {/* Action buttons row: Learning Path & AI Mock Interview */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      <button 
                        type="button" 
                        className="btn-link-action"
                        onClick={() => toggleLearningPath(idx)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}
                      >
                        <GraduationCap size={15} /> {expandedLearningPaths[idx] ? 'Hide Learning Path 🎓' : 'View Learning Path 🎓'}
                      </button>

                      <button 
                        type="button" 
                        className="btn-link-action"
                        onClick={() => toggleMockInterview(idx)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#38bdf8' }}
                      >
                        <Bot size={15} /> {activeInterviewIdx === idx ? 'Close AI Interview ✕' : 'AI Mock Interview 🤖'}
                      </button>
                    </div>

                    {/* Collapsible Learning Path Drawer */}
                    {expandedLearningPaths[idx] && (
                      <div className="skills-gap-panel-mini" style={{ background: 'rgba(7, 10, 18, 0.7)', padding: '0.75rem 0.85rem', borderRadius: '10px', marginTop: '0.35rem', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                        <h6 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <BookOpen size={14} /> Curated Learning Roadmap:
                        </h6>
                        
                        {job.preferred_skills && job.preferred_skills.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>Bridge Skill Gaps:</span>
                            {job.preferred_skills.map((skill, i) => {
                              const res = CURATED_LEARNING_RESOURCES[skill.toLowerCase().trim()];
                              return res ? (
                                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                  Learn <strong>{skill}</strong> on {res.name} <ExternalLink size={11} />
                                </a>
                              ) : (
                                <span key={i} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Learn {skill} (Search online tutorials)
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>✓ Perfect Skill Alignment! Recommended Mastery Paths:</span>
                            {job.required_skills.slice(0, 3).map((skill, i) => {
                              const res = CURATED_LEARNING_RESOURCES[skill.toLowerCase().trim()];
                              return res ? (
                                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                  Master <strong>{skill}</strong> on {res.name} <ExternalLink size={11} />
                                </a>
                              ) : (
                                <span key={i} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Master {skill} (Official Documentation)
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Collapsible AI Assistant Mock Interview Drawer */}
                    {activeInterviewIdx === idx && (
                      <div className="mock-interview-panel" style={{ background: 'rgba(7, 10, 18, 0.85)', padding: '1rem', borderRadius: '12px', marginTop: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.4rem 0' }}>
                          <Bot size={18} /> AI Assistant Mock Interview ({job.organization} — {job.title})
                        </h5>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.85rem 0' }}>
                          Answer the questions below to test your technical readiness. The AI evaluator checks key technical concepts in your response.
                        </p>

                        {(() => {
                          const questions = getQuestionsForJob(job);
                          return (
                            <div className="interview-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                              {questions.map((q, qIdx) => (
                                <div key={qIdx} className="interview-question-block" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                    <strong>Q{qIdx + 1}:</strong> {q.q}
                                  </label>
                                  <textarea
                                    placeholder="Type your answer here..."
                                    value={interviewAnswers[qIdx] || ''}
                                    onChange={(e) => setInterviewAnswers(prev => ({ ...prev, [qIdx]: e.target.value }))}
                                    disabled={!!interviewFeedback}
                                    style={{ width: '100%', minHeight: '60px', padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(7, 10, 18, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-main)', fontSize: '0.82rem' }}
                                  />
                                </div>
                              ))}

                              {!interviewFeedback ? (
                                <button 
                                  type="button" 
                                  className="btn btn-primary"
                                  onClick={() => handleGradeInterview(questions)}
                                  style={{ width: 'auto', alignSelf: 'flex-start', marginTop: '0.35rem', padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}
                                >
                                  <Send size={14} /> Submit & Evaluate Answers 🤖
                                </button>
                              ) : (
                                <div className="feedback-result" style={{ marginTop: '0.5rem', background: 'rgba(7, 10, 18, 0.6)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                                  <div className="grade-score-banner" style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                                    Score: <span style={{ color: interviewFeedback.averageScore >= 7 ? '#34d399' : '#fbbf24' }}>{interviewFeedback.averageScore} / 10</span>
                                  </div>
                                  <p className="feedback-message" style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: '0 0 0.65rem 0' }}>
                                    <strong>Evaluator Feedback:</strong> {interviewFeedback.feedbackMsg}
                                  </p>
                                  
                                  <div className="individual-grades" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {interviewFeedback.grades.map((g, i) => (
                                      <div key={i} className="q-grade-item" style={{ background: 'rgba(7, 10, 18, 0.8)', padding: '0.6rem', borderRadius: '6px', fontSize: '0.78rem' }}>
                                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>Q{i+1}:</strong> {g.question}</p>
                                        <p style={{ margin: '0 0 0.2rem 0', color: '#34d399', fontWeight: 700 }}>Score: {g.score}/10</p>
                                        <p style={{ margin: '0 0 0.2rem 0', color: 'var(--accent-cyan)' }}>Matched concepts: {g.matched.length > 0 ? g.matched.join(', ') : 'None'}</p>
                                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Key concepts expected: {g.expectedKeys.join(', ')}</p>
                                      </div>
                                    ))}
                                  </div>

                                  <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={resetInterview} 
                                    style={{ marginTop: '0.75rem', width: 'auto', padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                                  >
                                    Retake Interview 🔄
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  
                  {/* Scraped Job Card Link Footer */}
                  <div className="scraped-card-footer" style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      📅 Deadline: <strong style={{ color: 'var(--text-main)' }}>{job.deadline}</strong>
                    </span>
                    {job.application_link ? (
                      <a 
                        href={job.application_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-apply-sm" 
                        style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                      >
                        Apply / View Opening <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>No Link Available</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
