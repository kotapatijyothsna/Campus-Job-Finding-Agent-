# Campus Agent — Internship Opportunity Finder

Campus Agent is a full-stack web application designed for students and placement cells to find and match internship opportunities. It evaluates a student's profile (skills, interests, programme, year, CGPA) against a deterministic rule-based matching engine and displays a ranked shortlist of eligible internships with comprehensive reasons, alongside a list of excluded opportunities with reasons for disqualification.

---

## Tech Stack

- **Frontend:** React (Vite, single-page app), custom plain CSS (responsive design)
- **Backend:** Python (FastAPI)
- **Matching Logic:** Plain Python module (deterministic, rule-based matching, no external LLM calls required)
- **Data Store:** In-memory dataset loaded from `data/internships.json`

---

## Folder Structure

```text
campus-agent/
├── backend/
│   ├── main.py              # FastAPI application server
│   ├── agent.py             # Core matching, ranking, and eligibility logic
│   ├── models.py            # Pydantic request and response schemas
│   ├── test_agent.py        # Python unit tests for the agent logic
│   └── requirements.txt     # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Coordinates form inputs and results list state
│   │   ├── components/
│   │   │   ├── StudentForm.jsx  # Input form for student profiles
│   │   │   └── ResultsList.jsx  # Grid cards for eligible positions and ineligible section
│   │   ├── api.js           # API wrapper calling backend endpoints
│   │   └── index.css        # Clean responsive styles
│   ├── package.json         # Node scripts & dependencies
│   └── index.html           # SPA entrypoint
├── data/
│   └── internships.json     # JSON database for internship opportunities
├── README.md
└── .gitignore
```

---

## Setup and Running

### 1. Prerequisites
- Python 3.8+
- Node.js (v16+) and npm

### 2. Run the Backend Server
Navigate to the `backend` directory, create a virtual environment, install dependencies, and start the FastAPI server:

```bash
cd backend
python -m venv .venv

# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run the unit tests to verify matching logic
python test_agent.py

# Start the development server
uvicorn main:app --reload
```
The backend server will start running at `http://127.0.0.1:8000`.

### 3. Run the Frontend Client
Open a new terminal window, navigate to the `frontend` directory, install packages, and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```
The frontend client will start running at `http://127.0.0.1:5173`. Open this URL in your web browser.

---

## Modifying the Opportunities Dataset

The system parses the internship dataset directly from `data/internships.json`. To add or update opportunities, simply edit `data/internships.json` using the following schema:

```json
{
  "title": "Internship Title",
  "organization": "Company or Placement Cell Name",
  "domain": "Field Area (e.g. AI/ML, Web Development)",
  "required_skills": ["Skill1", "Skill2"],
  "eligibility": {
    "programme": "Programme (e.g. B.Tech)",
    "years": ["III", "IV"],
    "min_cgpa": 7.5
  },
  "duration": "Duration description or null",
  "deadline": "Application deadline description",
  "application_link": "Link url or null"
}
```

The matching server automatically loads the updated file upon startup. If you are running the backend with `--reload`, it will automatically restart and parse the new data files.

---

## Architectural & Functional Deep Dive

This section provides an end-to-end explanation of the project's internal data flows, algorithms, and modules.

### 1. Executive System Flow

```text
Student Profile Input ────► [FastAPI Router] ────► [Matching Engine (agent.py)]
                                                          │
                                                          ├──► Checks Eligibility (Program, Year, CGPA)
                                                          ├──► Checks Constraints (Duration, Start Date)
                                                          └──► Computes Soft Score (Skill/Domain match)
                                                                  │
                                                                  ▼
HTML Client ◄────────────── [JSON Response] ◄─────────────── Sorts & Formats
```

### 2. Matching Engine Algorithm (`backend/agent.py`)

The core matching algorithm is deterministic and operates in two stages for every internship in the pool:

#### A. Hard Constraints Evaluation (Eligibility Filters)
An opportunity is immediately disqualified if:
1. **Status:** The internship status is `Closed` or `Applications Closed`.
2. **Academic Programme:** The student's academic programme (e.g., `"B.Tech CSE"`) does not match the required programme.
3. **Year of Study:** The student's year of study (e.g., `"III"`) is not in the allowed years list (e.g., `["III", "IV"]`).
4. **CGPA:** The student's CGPA falls below `min_cgpa`.
5. **Duration:** The internship duration exceeds the student's `max_duration_weeks` constraint.
6. **Start Date:** The internship start date occurs before the student's availability date (i.e. `preferred_start_date`).

#### B. Soft Matches & Relevance Scoring
If all eligibility filters pass, the engine assigns a relevance score:
* **Exact Skill Match (+2 pts):** The student possesses the exact skill required.
* **Partial Skill Match (+1 pt):** Substring overlap between student skills and required skills.
* **Domain Match (+2 pts):** The internship domain (e.g., `"AI/ML"`) matches one of the student's areas of interest.
* **Disqualification Fallback:** If the total score is `0` (meaning there's absolutely no skill overlap and no domain overlap), the internship is marked as ineligible.

#### C. Shortlist Reassessment Table
If a previously high-ranked opportunity becomes unavailable (e.g. `ML Intern` has status `"Closed"` or `Data Analytics Intern` has its minimum CGPA criteria updated to `8.5` while the student has `8.2`), the system logs it in a `transition_table` as `Removed` along with the specific reason, and flags alternatives under the decision `"Reconsider"`.

---

### 3. Core Modules & Endpoints (`backend/main.py`)

* **`/api/recommend` (POST):** Accepts a `StudentProfile` JSON body and returns a list of eligible ranked recommendations, ineligible positions with explanations, a featured top recommendation, and the shortlist reassessment transition table.
* **`/api/parse-resume` (POST):** Receives a multipart PDF upload, extracts the text using `pypdf`, and checks the content for keywords in `SKILL_KEYWORDS` to auto-populate the client-side profile.
* **`/api/alert` (POST):** Triggers a deadline alert. Attempts a real SMTP email transmission if `SMTP_USERNAME` and `SMTP_PASSWORD` environment variables are configured. Otherwise, writes a copy to `data/last_alert_email.txt` for simulation verification.
* **`/api/scrape` (POST):** Triggers the Multi-Agent scraper to crawl company pages or a custom URL. Uses Groq API (`llama-3.1-8b-instant`) to parse raw text into structured JSON. If the API key is not configured, it runs in **Smart Local NLP mode** with pre-seeded fallbacks.
* **`/api/import-scraped` (POST):** Merges scraped internship opportunities back into `data/internships.json`.

---

### 4. Interactive Frontend Utilities (`frontend/src/`)

* **What-If Eligibility Simulator (`App.jsx`):** Bound to real-time inputs. Adjusting parameter sliders (like CGPA) automatically debounces and submits API queries, updating the list dynamically.
* **Practice Mock Interview (`ResultsList.jsx`):** Generates 3 technical questions based on the required skills of the top recommended role. Analyzes user answers against expected keywords and outputs a grade out of 10.
* **Curated Learning Roadmaps (`ResultsList.jsx`):** Links students to free learning resources (e.g. Kaggle, Fast.ai, MDN) for skills required by the opportunity but missing from the student's profile.
* **Kanban Tracker (`App.jsx`):** A column-based board (`Interested`, `Applied`, `Interviewing`, `Offers`) for managing application states, persisted via local storage.
