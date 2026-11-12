import json
import os
from typing import List
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from models import StudentProfile, InternshipOpportunity, RecommendationResponse, EmailAlertRequest
from agent import get_recommendations

app = FastAPI(title="Campus Agent - Internship Opportunity Finder")

# Enable CORS for the frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load internships from the JSON data file
INTERNSHIPS_DATA: List[InternshipOpportunity] = []

@app.on_event("startup")
def load_internships():
    global INTERNSHIPS_DATA
    # Construct the path to data/internships.json
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, "..", "data", "internships.json")
    
    if not os.path.exists(json_path):
        # Fallback if run from a different CWD or relative structure
        json_path = os.path.abspath(os.path.join("data", "internships.json"))
        
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            INTERNSHIPS_DATA = [InternshipOpportunity(**item) for item in raw_data]
            print(f"Loaded {len(INTERNSHIPS_DATA)} internship opportunities successfully.")
    except Exception as e:
        print(f"Error loading internships data: {e}")
        raise RuntimeError(f"Could not load internships.json: {e}")

@app.post("/api/recommend", response_model=RecommendationResponse)
def recommend_internships(student: StudentProfile):
    if not INTERNSHIPS_DATA:
        raise HTTPException(status_code=500, detail="Internship opportunities data is not loaded.")
    
    try:
        response = get_recommendations(student, INTERNSHIPS_DATA)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing recommendations: {str(e)}")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "loaded_items": len(INTERNSHIPS_DATA)}

# List of common tech skills to detect in resume text
SKILL_KEYWORDS = [
    "Python", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow",
    "SQL", "HTML", "CSS", "JavaScript", "React", "Node.js", "Express",
    "AWS", "Linux", "Docker", "Kubernetes", "Git", "Java", "Kotlin", "Swift",
    "Figma", "Adobe XD", "PowerBI", "Tableau", "Excel", "C#", "C++", "Go",
    "MongoDB", "GraphQL", "Transformers", "NLP", "D3.js", "OpenCV",
    "Wireshark", "Network Security", "Cryptography", "Metasploit", "Product Strategy",
    "R", "Spark", "Hadoop", "Vue", "Angular", "Flutter", "Dart", "Terraform", "C"
]

# Domain/interest keywords to detect in resume text
DOMAIN_KEYWORDS = [
    ("AI/ML",           ["machine learning", "artificial intelligence", "ai/ml", "ai & ml", "deep learning", "nlp", "neural network"]),
    ("Data Science",    ["data science", "data analysis", "data analytics", "pandas", "numpy", "tableau", "powerbi", "power bi", "matplotlib"]),
    ("Web Development", ["web development", "web dev", "frontend", "backend", "full stack", "fullstack", "html", "css", "javascript", "react", "node.js", "express", "django", "flask"]),
    ("Cloud Computing", ["cloud computing", "aws", "azure", "gcp", "google cloud", "devops", "docker", "kubernetes", "terraform"]),
    ("Mobile Development", ["mobile development", "android", "ios", "flutter", "swift", "kotlin", "react native"]),
    ("UI/UX Design",    ["ui/ux", "ui ux", "user interface", "user experience", "figma", "adobe xd", "wireframe", "prototyping", "design"]),
    ("Cybersecurity",   ["cybersecurity", "network security", "ethical hacking", "penetration testing", "wireshark", "cryptography"]),
    ("Software Engineering", ["software engineering", "software development", "algorithms", "data structures", "system design"]),
]

# Programme patterns
PROGRAMME_PATTERNS = [
    (r"b\.?\s*tech\.?\s*cse",          "B.Tech CSE"),
    (r"b\.?\s*tech\.?\s*ece",          "B.Tech ECE"),
    (r"b\.?\s*tech\.?\s*it\b",         "B.Tech IT"),
    (r"b\.?\s*tech\.?\s*mech",         "B.Tech ME"),
    (r"b\.?\s*tech\.?\s*civil",        "B.Tech Civil"),
    (r"b\.?\s*tech",                   "B.Tech"),
    (r"b\.?\s*e\.?\s*cse",            "B.E CSE"),
    (r"b\.?\s*e\.?",                   "B.E"),
    (r"m\.?\s*tech",                   "M.Tech"),
    (r"m\.?\s*c\.?\s*a",              "MCA"),
    (r"b\.?\s*c\.?\s*a",              "BCA"),
    (r"m\.?\s*s\.?\s*c",              "M.Sc"),
    (r"b\.?\s*s\.?\s*c",              "B.Sc"),
]

# Year / semester patterns
YEAR_PATTERNS = [
    (r"\b4th\s*year\b|\bfourth\s*year\b|\biv\s*year\b|\byear\s*4\b|\bfinal\s*year\b", "IV"),
    (r"\b3rd\s*year\b|\bthird\s*year\b|\biii\s*year\b|\byear\s*3\b",                   "III"),
    (r"\b2nd\s*year\b|\bsecond\s*year\b|\bii\s*year\b|\byear\s*2\b",                   "II"),
    (r"\b1st\s*year\b|\bfirst\s*year\b|\bi\s*year\b|\byear\s*1\b",                     "I"),
    # semester fallbacks
    (r"\b(7|8)th\s*sem\b|\bsemester\s*[78]\b",   "IV"),
    (r"\b(5|6)th\s*sem\b|\bsemester\s*[56]\b",   "III"),
    (r"\b(3|4)th\s*sem\b|\bsemester\s*[34]\b",   "II"),
    (r"\b(1|2)th\s*sem\b|\bsemester\s*[12]\b",   "I"),
]

@app.post("/api/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    from io import BytesIO
    from pypdf import PdfReader
    import re
    
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")
    
    try:
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        if not text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from the PDF. The file may be scanned/image-based.")
            
        text_lower = text.lower()

        # ── 1. Skills ────────────────────────────────────────────────────────
        extracted_skills = []
        for skill in SKILL_KEYWORDS:
            skill_lower = skill.lower()
            if skill_lower == "c":
                if re.search(r'\b[cC]\b', text):
                    extracted_skills.append(skill)
            elif skill_lower == "r":
                if re.search(r'\b[rR]\b', text):
                    extracted_skills.append(skill)
            elif skill_lower == "go":
                if re.search(r'\b[gG]o\b', text):
                    extracted_skills.append(skill)
            elif skill_lower in text_lower:
                extracted_skills.append(skill)

        # ── 2. Interests / Domains ───────────────────────────────────────────
        extracted_interests = []
        for domain_name, keywords in DOMAIN_KEYWORDS:
            if any(kw in text_lower for kw in keywords):
                extracted_interests.append(domain_name)

        # ── 3. Programme ─────────────────────────────────────────────────────
        detected_programme = None
        for pattern, label in PROGRAMME_PATTERNS:
            if re.search(pattern, text_lower):
                detected_programme = label
                break

        # ── 4. Year of Study ─────────────────────────────────────────────────
        detected_year = None
        for pattern, label in YEAR_PATTERNS:
            if re.search(pattern, text_lower):
                detected_year = label
                break

        # ── 5. CGPA / GPA ────────────────────────────────────────────────────
        detected_cgpa = None
        # Match patterns like: CGPA: 8.5 / GPA: 3.8 / CGPA - 8.75 / 8.5/10
        cgpa_match = re.search(
            r'(?:cgpa|gpa|c\.g\.p\.a)[\s:\-–]*(\d{1,2}\.\d{1,2})',
            text_lower
        )
        if cgpa_match:
            val = float(cgpa_match.group(1))
            # Convert 4-point scale to 10-point if needed
            if val <= 4.0:
                val = round(val * 2.5, 2)
            if 0 < val <= 10:
                detected_cgpa = val
        else:
            # Fallback: look for "X.X / 10" or "X.X out of 10"
            scale10_match = re.search(r'(\d{1,2}\.\d{1,2})\s*/\s*10', text_lower)
            if scale10_match:
                val = float(scale10_match.group(1))
                if 0 < val <= 10:
                    detected_cgpa = val
                    
        return {
            "skills": extracted_skills,
            "interests": extracted_interests,
            "programme": detected_programme,
            "year": detected_year,
            "cgpa": detected_cgpa,
            "parsed_text_length": len(text)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF resume: {str(e)}")

@app.post("/api/alert")
def trigger_email_alert(payload: EmailAlertRequest):
    from alerts import send_deadline_alert
    try:
        res = send_deadline_alert(
            recipient_email=payload.email,
            job_title=payload.title,
            deadline=payload.deadline,
            organization=payload.organization
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to trigger email alert: {str(e)}")

from pydantic import BaseModel
from typing import Optional, List

class ScrapeRequest(BaseModel):
    selected_companies: List[str]
    custom_url: Optional[str] = None
    student_skills: Optional[List[str]] = None
    api_key: Optional[str] = None

@app.post("/api/scrape")
def scrape_tech_companies(payload: ScrapeRequest):
    from scraper_agent import run_multi_agent_scrape
    try:
        res = run_multi_agent_scrape(
            selected_companies=payload.selected_companies,
            custom_url=payload.custom_url,
            student_skills=payload.student_skills,
            api_key_override=payload.api_key
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run multi-agent scrape: {str(e)}")

@app.post("/api/import-scraped")
def import_scraped_opportunities(payload: List[InternshipOpportunity]):
    json_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'internships.json')
    try:
        existing_data = []
        if os.path.exists(json_path):
            with open(json_path, 'r') as f:
                existing_data = json.load(f)
        
        existing_keys = {f"{item['title']}-{item.get('organization', '')}" for item in existing_data}
        
        imported_count = 0
        for item in payload:
            key = f"{item.title}-{item.organization or ''}"
            if key not in existing_keys:
                existing_data.append(item.dict())
                existing_keys.add(key)
                imported_count += 1
                
        with open(json_path, 'w') as f:
            json.dump(existing_data, f, indent=2)
            
        return {
            "status": "success",
            "message": f"Successfully imported {imported_count} new scraped opportunities into the finder pool!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to import opportunities: {str(e)}")
# Trigger reload after fixing null variables in fallback dataset
