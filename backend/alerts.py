import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# SMTP Configurations from environment variables
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")  # App password

def send_deadline_alert(recipient_email: str, job_title: str, deadline: str, organization: str) -> dict:
    """
    Sends an internship application deadline alert. 
    Saves a local text copy to data/last_alert_email.txt for demo verification, 
    and tries to send via SMTP if credentials are provided.
    """
    subject = f"🚨 URGENT DEADLINE: Apply for {job_title} at {organization} by {deadline}!"
    
    body = f"""Dear Student,

This is an automated alert from your Campus Placement Agent.

The application deadline for the '{job_title}' internship opportunity at '{organization}' is coming up fast on {deadline}!

Details:
- Title: {job_title}
- Organization: {organization}
- Deadline: {deadline}

Please prepare your application and submit it before the deadline.

Best regards,
Campus Placement Cell Agent
"""

    # Determine directory paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    debug_dir = os.path.abspath(os.path.join(base_dir, "..", "data"))
    os.makedirs(debug_dir, exist_ok=True)
    debug_file_path = os.path.join(debug_dir, "last_alert_email.txt")
    
    email_content = f"To: {recipient_email}\nSubject: {subject}\n\n{body}"
    
    try:
        with open(debug_file_path, "w", encoding="utf-8") as f:
            f.write(email_content)
        print(f"Demo Mode: Email logged to {debug_file_path}")
    except Exception as e:
        print(f"Failed to write mock email to file: {e}")

    # If SMTP Username and SMTP Password are set, attempt real sending
    if SMTP_USERNAME and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg['From'] = SMTP_USERNAME
            msg['To'] = recipient_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
                
            return {
                "status": "sent",
                "message": f"Real email alert successfully sent to {recipient_email} via SMTP.",
                "file_path": debug_file_path,
                "email_preview": email_content
            }
        except Exception as e:
            return {
                "status": "failed_smtp",
                "message": f"Failed to send email via SMTP ({e}). Fallback to logging successful.",
                "file_path": debug_file_path,
                "email_preview": email_content
            }
    else:
        return {
            "status": "simulated",
            "message": f"Email alert simulated successfully! Saved local log to data/last_alert_email.txt.",
            "file_path": debug_file_path,
            "email_preview": email_content
        }
