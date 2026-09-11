import React, { useState } from 'react';
import { sendEmailAlert } from '../api';
import { 
  Award, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink, 
  Calendar, 
  Bell, 
  Bookmark, 
  BookOpen, 
  GraduationCap, 
  Bot, 
  Send, 
  TrendingUp, 
  RefreshCw, 
  FileText, 
  Check, 
  X,
  Zap,
  Briefcase
} from 'lucide-react';

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
  ]
};

const DEFAULT_QUESTIONS = [
  { q: "Explain Object-Oriented Programming (OOP) principles.", keys: ["inheritance", "polymorphism", "encapsulation", "abstraction"] },
  { q: "What is the difference between Git Merge and Git Rebase?", keys: ["history", "commit", "linear", "branch"] },
  { q: "Explain what REST APIs are and their primary HTTP methods.", keys: ["stateless", "get", "post", "put", "delete", "server"] }
];

export default function ResultsList({ results, onTrackOpportunity }) {
  if (!results) return null;

  const { 
    ranked, 
    not_eligible, 
    top_recommendation, 
    message, 
    transition_table, 
    eligible_remaining_count,
    original_top_recommendation_changed,
    opportunities_removed,
    reasons_for_removal
  } = results;

  // State for skills gap toggles
  const [expandedGap, setExpandedGap] = useState({});
  // State for mock interview active panels
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewAnswers, setInterviewAnswers] = useState({ 0: '', 1: '', 2: '' });
  const [interviewFeedback, setInterviewFeedback] = useState(null);

  const getMatchLevelClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'badge-high';
      case 'medium':
        return 'badge-medium';
      case 'low':
        return 'badge-low';
      default:
        return '';
    }
  };

  const handleNotifyMe = async (job) => {
    const email = window.prompt("Enter your email to receive a deadline alert:", "student@campus.edu");
    if (!email) return;

    try {
      const result = await sendEmailAlert({
        email,
        title: job.title,
        deadline: job.deadline,
        organization: job.organization || 'TBD - Placement Cell'
      });
      alert(`Success: ${result.message}`);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  const toggleSkillsGap = (id) => {
    setExpandedGap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Generate 3 mock interview questions based on required skills
  const getQuestions = (requiredSkills) => {
    const list = [];
    if (requiredSkills) {
      for (const skill of requiredSkills) {
        const key = skill.toLowerCase().trim();
        if (SKILL_QUESTIONS[key]) {
          list.push(SKILL_QUESTIONS[key][0]);
        }
        if (list.length >= 3) break;
      }
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
        ? "Excellent! You have a solid grasp of these core concepts. Ready for the real interview!" 
        : averageScore >= 4 
        ? "Good attempt. Try expanding your answers by including key technical terms." 
        : "Requires revision. Study the missing key concepts in the curated learning paths."
    });
  };

  const resetInterview = () => {
    setInterviewAnswers({ 0: '', 1: '', 2: '' });
    setInterviewFeedback(null);
  };

  return (
    <div className="results-container">
      {/* Reassessment Transition Table */}
      {transition_table && transition_table.length > 0 && (
        <div className="reassessment-panel">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={20} className="text-cyan" /> Shortlist Reassessment & Adaptability
          </h3>
          <p className="reassessment-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Changes detected in internship status, academic criteria, and constraints.
          </p>

          {/* Summary Dashboard Cards */}
          <div className="reassessment-summary-grid">
            <div className="summary-card">
              <span className="summary-title">Opportunities Removed</span>
              <span className="summary-value" style={{ fontSize: '1rem' }}>
                {opportunities_removed && opportunities_removed.length > 0 
                  ? opportunities_removed.join(', ') 
                  : 'None'}
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-title">Reason for Removal</span>
              <span className="summary-value" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {reasons_for_removal && reasons_for_removal.length > 0 
                  ? reasons_for_removal.join(' / ') 
                  : 'N/A'}
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-title">Eligible Remaining</span>
              <span className="summary-value highlight-blue">{eligible_remaining_count}</span>
            </div>
            <div className="summary-card">
              <span className="summary-title">Original Top Changed?</span>
              <span className={`summary-value ${original_top_recommendation_changed === 'Yes' ? 'val-yes' : 'val-no'}`}>
                {original_top_recommendation_changed}
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="reassessment-table">
              <thead>
                <tr>
                  <th>Internship</th>
                  <th>Previous Status</th>
                  <th>Updated Status</th>
                  <th>Decision</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {transition_table.map((row, idx) => (
                  <tr key={idx} className={`row-decision-${row.decision.toLowerCase()}`}>
                    <td><strong>{row.title}</strong></td>
                    <td><span className="status-pill status-prev" style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{row.prev_status}</span></td>
                    <td><span className="status-pill" style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{row.updated_status}</span></td>
                    <td><span className="decision-pill" style={{ fontSize: '0.75rem', fontWeight: 800, color: row.decision.toLowerCase() === 'kept' ? '#34d399' : '#f43f5e' }}>{row.decision}</span></td>
                    <td className="reason-cell" style={{ color: 'var(--text-muted)' }}>{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="remaining-count-alert" style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} /> <strong>{eligible_remaining_count}</strong> eligible opportunities remaining.
          </div>
        </div>
      )}

      {/* Flagship Top Recommendation Card */}
      {top_recommendation && (
        <div className="top-recommendation-card">
          <div className="top-badge">
            <Award size={14} style={{ display: 'inline', marginRight: '4px' }} /> #1 TOP MATCH ENGINE
          </div>
          
          <div className="card-header-row">
            <div>
              <div className="header-meta" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="status-badge status-eligible" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={12} /> Eligible
                </span>
                <span className={`match-level-badge ${getMatchLevelClass(top_recommendation.match_level)}`} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                  {top_recommendation.match_level} Relevance
                </span>
              </div>
              <h2 className="title">{top_recommendation.title}</h2>
              <h4 className="organization" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={18} /> {top_recommendation.organization || 'TBD - Placement Cell'}
              </h4>
            </div>
            <div className="rank-display">#1 Ranked</div>
          </div>

          <div className="reason-text">
            <strong>
              <Sparkles size={16} /> Recommendation Insight & Why Recommended:
            </strong>
            <p className="why-paragraph">{top_recommendation.why_recommended}</p>
          </div>

          <div className="skills-row">
            {top_recommendation.matched_skills.length > 0 && (
              <div className="skill-group">
                <span className="skill-label">✓ Matched Skills:</span>
                <div className="chips">
                  {top_recommendation.matched_skills.map((skill, index) => (
                    <span key={index} className="chip chip-matched">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {top_recommendation.matched_interest && (
              <div className="skill-group">
                <span className="skill-label">🎯 Aligned Interest:</span>
                <div className="chips">
                  <span className="chip chip-interest">Domain: {top_recommendation.matched_interest}</span>
                </div>
              </div>
            )}

            {top_recommendation.missing_preferred_skills.length > 0 && (
              <div className="skill-group">
                <span className="skill-label">⚠️ Missing Preferred:</span>
                <div className="chips">
                  {top_recommendation.missing_preferred_skills.map((skill, index) => (
                    <span key={index} className="chip chip-missing">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Revised Application Plan Box */}
          <div className="revised-application-plan">
            <h3>📋 Revised Application Plan</h3>
            <div className="plan-grid">
              <div className="plan-item">
                <strong>New Top Recommendation:</strong>
                <span className="plan-val-title" style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>⭐ {top_recommendation.title}</span>
              </div>
              <div className="plan-item">
                <strong>Why:</strong>
                <span>Meets eligibility, skill/interest match, duration ({top_recommendation.duration}), and starts after exams (starts {top_recommendation.start_date}).</span>
              </div>
              <div className="plan-item">
                <strong>Application Priority:</strong>
                <span className="priority-badge priority-high">🔥 High Priority</span>
              </div>
              <div className="plan-item">
                <strong>Application Deadline:</strong>
                <span>{top_recommendation.deadline}</span>
              </div>
              <div className="plan-item">
                <strong>Missing Preferred Skills:</strong>
                <span>
                  {top_recommendation.missing_preferred_skills.length > 0 
                    ? top_recommendation.missing_preferred_skills.join(', ') 
                    : 'None! Perfect skills match.'}
                </span>
              </div>
              <div className="plan-item">
                <strong>Next Step:</strong>
                <span>
                  {top_recommendation.application_link ? (
                    <>Click the <strong>Apply Online</strong> link below to submit your application on the portal.</>
                  ) : (
                    <>Submit your updated resume to the Placement Cell coordinator before the deadline on <strong>{top_recommendation.deadline}</strong>.</>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons-row">
            <button 
              type="button" 
              className="btn btn-secondary btn-action"
              onClick={() => {
                setInterviewActive(!interviewActive);
                resetInterview();
              }}
            >
              <Bot size={16} /> {interviewActive ? 'Close Mock Interview ✕' : 'Practice Mock Interview'}
            </button>

            {top_recommendation.missing_preferred_skills.length > 0 && (
              <button 
                type="button" 
                className="btn btn-secondary btn-action"
                onClick={() => toggleSkillsGap('top')}
              >
                <GraduationCap size={16} /> {expandedGap['top'] ? 'Hide Learning Path' : 'View Learning Path'}
              </button>
            )}

            <button 
              type="button" 
              className="btn btn-secondary btn-action btn-alert"
              onClick={() => handleNotifyMe(top_recommendation)}
            >
              <Bell size={16} /> Email Alert
            </button>

            <button 
              type="button" 
              className="btn btn-primary btn-action"
              onClick={() => onTrackOpportunity(top_recommendation)}
            >
              <Bookmark size={16} /> Track Application
            </button>
          </div>

          {/* Learning Roadmap Drawer */}
          {expandedGap['top'] && top_recommendation.missing_preferred_skills.length > 0 && (
            <div className="skills-gap-panel">
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <GraduationCap size={18} /> Curated Learning Roadmap:
              </h4>
              <p className="panel-desc" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Bridge the skills gap with these free learning resources:
              </p>
              <div className="learning-links-grid">
                {top_recommendation.missing_preferred_skills.map((skill, i) => {
                  const res = CURATED_LEARNING_RESOURCES[skill.toLowerCase().trim()];
                  return res ? (
                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="btn-learning-link">
                      Learn <strong>{skill}</strong> on {res.name} →
                    </a>
                  ) : (
                    <div key={i} className="btn-learning-placeholder" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Learn {skill} (Search online tutorials)
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Mock Interview Drawer */}
          {interviewActive && (
            <div className="mock-interview-panel">
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bot size={18} /> Practice Mock Interview (Automated Evaluator)
              </h4>
              <p className="panel-desc" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Answer the questions below. The matching engine evaluates keywords inside your response.
              </p>
              
              {(() => {
                const questions = getQuestions(top_recommendation.matched_skills.concat(top_recommendation.missing_preferred_skills));
                return (
                  <div className="interview-body" style={{ marginTop: '1rem' }}>
                    {questions.map((q, idx) => (
                      <div key={idx} className="interview-question-block">
                        <label><strong>Question {idx + 1}:</strong> {q.q}</label>
                        <textarea
                          placeholder="Type your technical answer here..."
                          value={interviewAnswers[idx] || ''}
                          onChange={(e) => setInterviewAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                          disabled={!!interviewFeedback}
                        />
                      </div>
                    ))}

                    {!interviewFeedback ? (
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={() => handleGradeInterview(questions)}
                        style={{ width: 'auto' }}
                      >
                        <Send size={16} /> Submit answers & Grade
                      </button>
                    ) : (
                      <div className="feedback-result">
                        <div className="grade-score-banner">
                          Score: <span>{interviewFeedback.averageScore} / 10</span>
                        </div>
                        <p className="feedback-message"><strong>Evaluator Feedback:</strong> {interviewFeedback.feedbackMsg}</p>
                        
                        <div className="individual-grades" style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {interviewFeedback.grades.map((g, i) => (
                            <div key={i} className="q-grade-item" style={{ background: 'rgba(7, 10, 18, 0.6)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem' }}>
                              <p className="q-title"><strong>Q{i+1}:</strong> {g.question}</p>
                              <p className="q-points" style={{ color: '#34d399', fontWeight: 700 }}>Score: {g.score}/10</p>
                              <p className="q-keys">Matched keywords: {g.matched.length > 0 ? g.matched.join(', ') : 'None'}</p>
                              <p className="q-tips" style={{ color: 'var(--text-muted)' }}>Keywords expected: {g.expectedKeys.join(', ')}</p>
                            </div>
                          ))}
                        </div>

                        <button type="button" className="btn btn-secondary" onClick={resetInterview} style={{ marginTop: '1rem', width: 'auto' }}>
                          Retake Interview
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="card-instructions-row" style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(7, 10, 18, 0.6)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Application Instructions:</strong> {top_recommendation.application_instructions}</p>
          </div>

          <div className="card-footer-row">
            <span className="deadline-info" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={16} /> Deadline: <strong style={{ color: 'var(--text-main)' }}>{top_recommendation.deadline}</strong>
            </span>
            {top_recommendation.application_link ? (
              <a href={top_recommendation.application_link} target="_blank" rel="noopener noreferrer" className="btn btn-apply" style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Apply Online <ExternalLink size={14} />
              </a>
            ) : (
              <button disabled className="btn btn-apply-disabled" style={{ width: 'auto' }}>
                Contact Placement Cell
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Recommendations Section */}
      <div className="recommendations-section">
        <h3>
          <Briefcase size={20} className="text-cyan" /> Shortlisted Eligible Opportunities ({ranked.length})
        </h3>
        
        {ranked.length === 0 ? (
          <div className="no-matches-alert" style={{ textAlign: 'center', padding: '3.5rem', background: 'rgba(244, 63, 94, 0.1)', border: '2px dashed rgba(244, 63, 94, 0.3)', borderRadius: '20px', marginBottom: '2rem' }}>
            <h2 style={{ color: '#f43f5e', fontSize: '2rem', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>
              NO Opportunities Found
            </h2>
            <p style={{ color: '#fca5a5', marginTop: '0.5rem', fontWeight: '700', fontSize: '1rem' }}>
              {message || "No internships match your eligibility requirements."}
            </p>
          </div>
        ) : (
          <div className="cards-grid">
            {ranked.map((internship) => (
              <div key={internship.rank} className="internship-card">
                <div className="rank-badge">Rank #{internship.rank}</div>
                
                <div className="card-header-row" style={{ marginTop: 0 }}>
                  <div>
                    <div className="header-meta" style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                      <span className="status-badge status-eligible" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.15rem 0.5rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800 }}>
                        ✓ Eligible
                      </span>
                      <span className={`match-level-badge ${getMatchLevelClass(internship.match_level)}`} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.15rem 0.5rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800 }}>
                        {internship.match_level}
                      </span>
                    </div>
                    <h3 className="title">{internship.title}</h3>
                    <h5 className="organization" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={14} /> {internship.organization || 'TBD - Placement Cell'}
                    </h5>
                  </div>
                </div>

                <div className="reason-sentence">
                  <strong>💡 Reason for Recommendation:</strong>
                  <p>{internship.reason}</p>
                </div>

                <div className="skills-row">
                  {internship.matched_skills.length > 0 && (
                    <div className="skill-group-mini">
                      <span className="skill-label-mini">Matched:</span>
                      <div className="chips-mini">
                        {internship.matched_skills.map((skill, index) => (
                          <span key={index} className="chip-mini chip-matched">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {internship.matched_interest && (
                    <div className="skill-group-mini">
                      <span className="skill-label-mini">Interest:</span>
                      <div className="chips-mini">
                        <span className="chip-mini chip-interest">{internship.matched_interest}</span>
                      </div>
                    </div>
                  )}

                  {internship.missing_preferred_skills.length > 0 && (
                    <div className="skill-group-mini">
                      <span className="skill-label-mini">Missing:</span>
                      <div className="chips-mini">
                        {internship.missing_preferred_skills.map((skill, index) => (
                          <span key={index} className="chip-mini chip-missing">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub-actions */}
                <div className="ranked-item-actions">
                  {internship.missing_preferred_skills.length > 0 && (
                    <button 
                      type="button" 
                      className="btn-link-action"
                      onClick={() => toggleSkillsGap(internship.rank)}
                    >
                      {expandedGap[internship.rank] ? 'Hide Learning Path 🎓' : 'View Learning Path 🎓'}
                    </button>
                  )}

                  <button 
                    type="button"
                    className="btn-link-action action-alert"
                    onClick={() => handleNotifyMe(internship)}
                  >
                    🚨 Email Alert
                  </button>

                  <button 
                    type="button"
                    className="btn-link-action action-track"
                    onClick={() => onTrackOpportunity(internship)}
                  >
                    📁 Track Job
                  </button>
                </div>

                {/* Collapsible Learning Path */}
                {expandedGap[internship.rank] && internship.missing_preferred_skills.length > 0 && (
                  <div className="skills-gap-panel-mini" style={{ background: 'rgba(7, 10, 18, 0.6)', padding: '0.75rem', borderRadius: '8px', marginTop: '0.65rem' }}>
                    <strong style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>🎓 Free Learning Courses:</strong>
                    <div className="mini-learning-list" style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {internship.missing_preferred_skills.map((skill, i) => {
                        const res = CURATED_LEARNING_RESOURCES[skill.toLowerCase().trim()];
                        return res ? (
                          <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="mini-learning-link" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                            Learn {skill} ({res.name}) →
                          </a>
                        ) : (
                          <span key={i} className="mini-learning-placeholder" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Learn {skill} (Search guides)
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="card-instructions-row-mini" style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(7, 10, 18, 0.4)', borderRadius: '6px', border: '1px dashed rgba(255, 255, 255, 0.08)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <p style={{ margin: 0 }}><strong>Instructions:</strong> {internship.application_instructions}</p>
                </div>

                <div className="card-footer-row">
                  <span className="deadline-info" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    📅 Deadline: <strong style={{ color: 'var(--text-main)' }}>{internship.deadline}</strong>
                  </span>
                  {internship.application_link ? (
                    <a href={internship.application_link} target="_blank" rel="noopener noreferrer" className="btn btn-apply-sm">
                      Apply <ExternalLink size={12} />
                    </a>
                  ) : (
                    <button disabled className="btn btn-apply-disabled-sm">
                      Contact Cell
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Not Eligible Opportunities Section */}
      {not_eligible && not_eligible.length > 0 && (
        <div className="not-eligible-section" style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '1.75rem', border: '1px dashed rgba(244, 63, 94, 0.3)' }}>
          <h3 style={{ color: '#f43f5e' }}>
            <AlertCircle size={20} /> Not Eligible / Excluded Positions ({not_eligible.length})
          </h3>
          <p className="not-eligible-intro" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            These positions from the dataset did not pass your program, year, or CGPA checks, or they had 0 skill overlap.
          </p>
          <div className="not-eligible-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {not_eligible.map((item, index) => (
              <div key={index} className="not-eligible-item" style={{ background: 'rgba(7, 10, 18, 0.6)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', padding: '1rem' }}>
                <div className="not-eligible-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <h4 className="title" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    🏢 {item.organization || 'Placement Cell'} — {item.title}
                  </h4>
                  <span className="badge-not-eligible" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    ✕ Ineligible
                  </span>
                </div>
                <p className="not-eligible-reason" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  <strong>Reason:</strong> {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
