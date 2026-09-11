from alerts import send_deadline_alert

def run_demo_alert():
    print("=== Running Email Alert Demo Case ===")
    
    # Mock Alert Parameters
    recipient = "hackathon.student@example.edu"
    job_title = "ML Intern"
    deadline = "10 Sept"
    org = "TBD - Placement Cell"
    
    print(f"Triggering mock deadline alert to: {recipient}")
    print(f"Details: {job_title} at {org} (Deadline: {deadline})\n")
    
    result = send_deadline_alert(
        recipient_email=recipient,
        job_title=job_title,
        deadline=deadline,
        organization=org
    )
    
    print("\n--- Alert Results ---")
    print(f"Status: {result['status']}")
    print(f"Message: {result['message']}")
    print(f"Log File Location: {result['file_path']}")
    
    print("\n--- Email Preview ---")
    print(result['email_preview'].encode('ascii', errors='replace').decode('ascii'))
    print("=====================================")

if __name__ == "__main__":
    run_demo_alert()
