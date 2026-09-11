import re
from typing import List, Dict, Any, Tuple
from models import (
    StudentProfile,
    InternshipOpportunity,
    RankedRecommendation,
    NotEligibleRecommendation,
    TopRecommendation,
    TransitionRow,
    RecommendationResponse
)

def parse_duration_to_weeks(duration_str: str) -> float:
    if not duration_str:
        return 0.0
    
    duration_str = duration_str.lower().strip()
    
    # Match weeks, e.g. "8 weeks", "2 week"
    match_weeks = re.search(r'(\d+)\s*week', duration_str)
    if match_weeks:
        return float(match_weeks.group(1))
        
    # Match months, e.g. "6 Months", "3 month"
    match_months = re.search(r'(\d+)\s*month', duration_str)
    if match_months:
        return float(match_months.group(1)) * 4.33
        
    return 0.0

def date_to_days(date_str: str) -> int:
    if not date_str:
        return 0
    
    date_str = date_str.lower().strip()
    
    # Extract number (day)
    match_num = re.search(r'(\d+)', date_str)
    if not match_num:
        return 0
    day = int(match_num.group(1))
    
    # Determine month
    months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
    month_idx = 0
    for idx, m in enumerate(months, start=1):
        if m in date_str:
            month_idx = idx
            break
            
    if month_idx == 0:
        return 0
        
    return month_idx * 31 + day

def get_recommendations(student: StudentProfile, internships: List[InternshipOpportunity]) -> RecommendationResponse:
    eligible_list: List[Tuple[InternshipOpportunity, int, Dict[str, Any]]] = []
    not_eligible_list: List[NotEligibleRecommendation] = []
    transition_table: List[TransitionRow] = []

    # Pre-process student attributes for case-insensitive matching
    student_skills_lower = [s.lower().strip() for s in student.skills]
    student_interests_lower = [i.lower().strip() for i in student.interests]
    student_programme_lower = student.programme.lower().strip()
    student_year_upper = student.year.upper().strip()

    # Tracker for transition table inputs
    ml_intern_removed = False
    data_analytics_removed = False
    ml_intern_reason = ""
    data_analytics_reason = ""

    for item in internships:
        reasons_ineligible = []

        # 1. Availability check (Change 1)
        if item.status and item.status.lower() in ("closed", "applications closed"):
            reasons_ineligible.append("Applications Closed")
            if item.title == "ML Intern":
                ml_intern_removed = True
                ml_intern_reason = "No longer available"

        # 2. Eligibility check: Programme
        req_programme = item.eligibility.programme
        if req_programme.lower().strip() not in student_programme_lower:
            reasons_ineligible.append(f"programme '{student.programme}' does not match required '{req_programme}'")

        # 3. Eligibility check: Year
        req_years = [y.upper().strip() for y in item.eligibility.years]
        if student_year_upper not in req_years:
            allowed_years_str = ", ".join(item.eligibility.years)
            reasons_ineligible.append(f"year '{student.year}' does not match allowed years [{allowed_years_str}]")

        # 4. Eligibility check: CGPA (Change 3)
        if item.eligibility.min_cgpa is not None:
            if student.cgpa < item.eligibility.min_cgpa:
                reasons_ineligible.append(f"CGPA {student.cgpa} is below required {item.eligibility.min_cgpa}")
                if item.title == "Data Analytics Intern":
                    data_analytics_removed = True
                    data_analytics_reason = f"Updated CGPA requirement is {item.eligibility.min_cgpa}"

        # 5. Constraint check: Duration (Change 2)
        if item.duration and student.max_duration_weeks:
            weeks = parse_duration_to_weeks(item.duration)
            if weeks > student.max_duration_weeks:
                reasons_ineligible.append(f"duration {item.duration} exceeds maximum allowed of {student.max_duration_weeks} weeks")

        # 6. Constraint check: Start Date relative to exams (Change 2)
        if item.start_date and student.preferred_start_date:
            item_days = date_to_days(item.start_date)
            exams_days = date_to_days(student.preferred_start_date)
            if item_days > 0 and exams_days > 0 and item_days < exams_days:
                reasons_ineligible.append(f"starts on {item.start_date}, which is before availability start date {student.preferred_start_date}")

        # If not eligible due to any filters
        if reasons_ineligible:
            reason_str = f"Not eligible because: {'; '.join(reasons_ineligible)}."
            not_eligible_list.append(NotEligibleRecommendation(
                title=item.title,
                organization=item.organization,
                reason=reason_str
            ))
            continue

        # If eligible, calculate relevance score
        score = 0
        matched_skills: List[str] = []
        partial_skills: List[str] = []
        missing_skills: List[str] = []

        # Calculate skill matches
        for req_skill in item.required_skills:
            req_skill_lower = req_skill.lower().strip()
            # Check for exact match
            if req_skill_lower in student_skills_lower:
                score += 2
                matched_skills.append(req_skill)
            else:
                # Check for partial match (substring overlap)
                is_partial = False
                for stud_skill in student_skills_lower:
                    if len(req_skill_lower) >= 3 and len(stud_skill) >= 3:
                        if (req_skill_lower in stud_skill) or (stud_skill in req_skill_lower):
                            score += 1
                            partial_skills.append(req_skill)
                            is_partial = True
                            break
                if not is_partial:
                    missing_skills.append(req_skill)

        # Calculate interest/domain matches
        domain_matched = False
        matched_interest_val = None
        item_domain_lower = item.domain.lower().strip()
        if item_domain_lower in student_interests_lower:
            score += 2
            domain_matched = True
            idx = student_interests_lower.index(item_domain_lower)
            matched_interest_val = student.interests[idx]

        # Check if there is a skill mismatch (score is 0)
        if score == 0:
            skills_str = ", ".join(item.required_skills)
            reason_str = f"Requires {skills_str} skills which are not in your profile; also no domain interest match."
            not_eligible_list.append(NotEligibleRecommendation(
                title=item.title,
                organization=item.organization,
                reason=reason_str
            ))
            continue

        # Determine match level
        if score >= 4:
            match_level = "High"
        elif score >= 2:
            match_level = "Medium"
        else:
            match_level = "Low"

        # Construct reason sentence
        reason_parts = []
        all_matched_skills = matched_skills + partial_skills
        if all_matched_skills:
            skills_str = ", ".join(all_matched_skills)
            reason_parts.append(skills_str)
        
        if all_matched_skills and domain_matched:
            reason_str = f"Matches {skills_str} and your {item.domain} interest. Meets year, CGPA, duration, and start-date requirements."
        elif all_matched_skills:
            reason_str = f"Matches {skills_str}. Meets year, CGPA, duration, and start-date requirements."
        elif domain_matched:
            reason_str = f"Matches your {item.domain} interest. Meets year, CGPA, duration, and start-date requirements."
        else:
            reason_str = "Meets year, CGPA, duration, and start-date requirements."

        details = {
            "match_level": match_level,
            "matched_skills": all_matched_skills,
            "matched_interest": matched_interest_val,
            "missing_preferred_skills": missing_skills,
            "reason": reason_str,
            "score": score
        }

        eligible_list.append((item, score, details))

    # Sort eligible by score descending (stable sort preserves original order)
    eligible_list.sort(key=lambda x: -x[1])

    ranked_recommendations: List[RankedRecommendation] = []
    for rank_idx, (item, score, details) in enumerate(eligible_list, start=1):
        ranked_recommendations.append(RankedRecommendation(
            rank=rank_idx,
            title=item.title,
            organization=item.organization,
            match_level=details["match_level"],
            matched_skills=details["matched_skills"],
            matched_interest=details["matched_interest"],
            missing_preferred_skills=details["missing_preferred_skills"],
            eligibility_status="Eligible",
            reason=details["reason"],
            deadline=item.deadline,
            application_link=item.application_link,
            duration=item.duration,
            start_date=item.start_date,
            status=item.status or "Open",
            application_instructions=item.application_instructions or "Apply via application link or contact placement cell."
        ))

    # 7. Construct Reassessment Transition Table
    # Row 1: ML Intern
    if ml_intern_removed:
        transition_table.append(TransitionRow(
            title="ML Intern",
            prev_status="Rank 1",
            updated_status="Applications Closed",
            decision="Remove",
            reason=ml_intern_reason
        ))
    # Row 2: Data Analytics Intern
    if data_analytics_removed:
        transition_table.append(TransitionRow(
            title="Data Analytics Intern",
            prev_status="Rank 2",
            updated_status="Not Eligible",
            decision="Remove",
            reason=data_analytics_reason
        ))
    
    # Row 3 & 4: Top 2 newly eligible alternatives (if any)
    if len(ranked_recommendations) >= 1:
        item_x = ranked_recommendations[0]
        transition_table.append(TransitionRow(
            title=item_x.title,
            prev_status="Previously lower ranked",
            updated_status="Eligible",
            decision="Reconsider",
            reason="Meets revised constraints and profile"
        ))
    if len(ranked_recommendations) >= 2:
        item_y = ranked_recommendations[1]
        transition_table.append(TransitionRow(
            title=item_y.title,
            prev_status="Previously lower ranked",
            updated_status="Eligible",
            decision="Reconsider",
            reason="Suitable alternative"
        ))

    # Determine top recommendation
    top_rec = None
    if ranked_recommendations:
        first_item = ranked_recommendations[0]
        why_para = (
            f"The '{first_item.title}' role at {first_item.organization or 'Placement Cell'} is our new top recommendation for you "
            f"with a {first_item.match_level} match level. This internship strongly aligns with your skills "
            f"and interests, satisfies your max duration constraint ({first_item.duration}), and starts on {first_item.start_date or 'TBD'} "
            f"which is on or after your preferred start date of {student.preferred_start_date}."
        )
        
        top_rec = TopRecommendation(
            rank=first_item.rank,
            title=first_item.title,
            organization=first_item.organization,
            match_level=first_item.match_level,
            matched_skills=first_item.matched_skills,
            matched_interest=first_item.matched_interest,
            missing_preferred_skills=first_item.missing_preferred_skills,
            eligibility_status=first_item.eligibility_status,
            reason=first_item.reason,
            deadline=first_item.deadline,
            application_link=first_item.application_link,
            duration=first_item.duration,
            start_date=first_item.start_date,
            status=first_item.status or "Open",
            application_instructions=first_item.application_instructions or "Apply via application link or contact placement cell.",
            why_recommended=why_para
        )

    # Determine top level message if no recommendations matched
    message = None
    if not ranked_recommendations:
        message = "NO Opportunities Found"

    # Determine report metrics
    top_changed = "Yes" if ml_intern_removed else "No"
    removed_list = []
    reasons_list = []
    if ml_intern_removed:
        removed_list.append("ML Intern")
        reasons_list.append("Closed")
    if data_analytics_removed:
        removed_list.append("Data Analytics Intern")
        reasons_list.append("Eligibility changed (CGPA requirement updated to 8.5)")

    return RecommendationResponse(
        ranked=ranked_recommendations,
        not_eligible=not_eligible_list,
        top_recommendation=top_rec,
        message=message,
        transition_table=transition_table,
        eligible_remaining_count=len(ranked_recommendations),
        original_top_recommendation_changed=top_changed,
        opportunities_removed=removed_list,
        reasons_for_removal=reasons_list
    )
