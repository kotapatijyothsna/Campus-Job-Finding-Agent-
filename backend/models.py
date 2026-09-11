from pydantic import BaseModel
from typing import List, Optional

class StudentProfile(BaseModel):
    skills: List[str]
    interests: List[str]
    programme: str
    year: str
    cgpa: float
    max_duration_weeks: Optional[int] = 8
    preferred_start_date: Optional[str] = "15 Sept"

class EligibilityCriteria(BaseModel):
    programme: str
    years: List[str]
    min_cgpa: Optional[float] = None

class InternshipOpportunity(BaseModel):
    title: str
    organization: Optional[str] = None
    domain: str
    required_skills: List[str]
    eligibility: EligibilityCriteria
    duration: Optional[str] = None
    deadline: str
    application_link: Optional[str] = None
    status: Optional[str] = "Open"
    start_date: Optional[str] = None
    application_instructions: Optional[str] = None

class RankedRecommendation(BaseModel):
    rank: int
    title: str
    organization: Optional[str] = None
    match_level: str  # "High", "Medium", "Low"
    matched_skills: List[str]
    matched_interest: Optional[str] = None
    missing_preferred_skills: List[str]
    eligibility_status: str  # "Eligible"
    reason: str
    deadline: str
    application_link: Optional[str] = None
    duration: Optional[str] = None
    start_date: Optional[str] = None
    status: Optional[str] = "Open"
    application_instructions: Optional[str] = None

class NotEligibleRecommendation(BaseModel):
    title: str
    organization: Optional[str] = None
    reason: str

class TopRecommendation(RankedRecommendation):
    why_recommended: str

class TransitionRow(BaseModel):
    title: str
    prev_status: str
    updated_status: str
    decision: str
    reason: str

class RecommendationResponse(BaseModel):
    ranked: List[RankedRecommendation]
    not_eligible: List[NotEligibleRecommendation]
    top_recommendation: Optional[TopRecommendation] = None
    message: Optional[str] = None
    transition_table: Optional[List[TransitionRow]] = None
    eligible_remaining_count: Optional[int] = 0
    original_top_recommendation_changed: Optional[str] = "No"
    opportunities_removed: Optional[List[str]] = []
    reasons_for_removal: Optional[List[str]] = []

class EmailAlertRequest(BaseModel):
    email: str
    title: str
    deadline: str
    organization: str
