import json
import os
from models import StudentProfile, InternshipOpportunity
from agent import get_recommendations

def test_recommendation_logic():
    # Load seed data
    json_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'internships.json')
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    internships = [InternshipOpportunity(**item) for item in data]
    
    # Test profile with mystery constraints: max 8 weeks, starts after 15 Sept exams
    student = StudentProfile(
        skills=["Python", "Machine Learning", "SQL", "Figma"],
        interests=["AI/ML", "Data Science", "UI/UX Design"],
        programme="B.Tech CSE",
        year="III",
        cgpa=8.2,
        max_duration_weeks=8,
        preferred_start_date="15 Sept"
    )
    
    res = get_recommendations(student, internships)
    
    print("--- Test Recommendation Logic (Mystery Mission) ---")
    print("Transition Table:")
    for row in res.transition_table:
        print(f"Title: {row.title} | Prev: {row.prev_status} | Updated: {row.updated_status} | Decision: {row.decision} | Reason: {row.reason}")
    
    print("\nRanked recommendations:")
    for r in res.ranked:
        print(f"Rank {r.rank}: {r.title} ({r.match_level}) - Duration: {r.duration} - Start Date: {r.start_date}")
    
    print("\nNot Eligible recommendations:")
    for n in res.not_eligible:
        print(f"Title: {n.title} - Reason: {n.reason}")
        
    print("\nTop Recommendation:")
    if res.top_recommendation:
        print(f"Title: {res.top_recommendation.title}")
        print(f"Why: {res.top_recommendation.why_recommended}")
    else:
        print("None")
        
    # Assertions for Change Detection and Constraint Handling
    assert res.eligible_remaining_count == 4, f"Expected 4 eligible remaining, got {res.eligible_remaining_count}"
    assert res.ranked[0].title == "Python Developer Intern", f"Rank 1 should be Python Developer Intern, got {res.ranked[0].title}"
    assert res.ranked[1].title == "UI/UX Design Intern", f"Rank 2 should be UI/UX Design Intern, got {res.ranked[1].title}"
    
    # Check that ML Intern was removed
    transition_titles = [row.title for row in res.transition_table]
    assert "ML Intern" in transition_titles, "ML Intern should be in transition table"
    assert "Data Analytics Intern" in transition_titles, "Data Analytics Intern should be in transition table"
    
    # Verify transitions content
    ml_row = next(row for row in res.transition_table if row.title == "ML Intern")
    assert ml_row.decision == "Remove"
    assert "No longer available" in ml_row.reason or "Closed" in ml_row.updated_status
    
    da_row = next(row for row in res.transition_table if row.title == "Data Analytics Intern")
    assert da_row.decision == "Remove"
    assert "CGPA" in da_row.reason or "Not Eligible" in da_row.updated_status

    # Assert new report fields
    assert res.original_top_recommendation_changed == "Yes", "Top recommendation should have changed"
    assert "ML Intern" in res.opportunities_removed
    assert "Data Analytics Intern" in res.opportunities_removed
    assert "Closed" in res.reasons_for_removal
    
    print("\nALL TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_recommendation_logic()
