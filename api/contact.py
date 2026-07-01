import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def handler(request):
    # ✅ استقبال الطلب
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }

    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        body = json.loads(request.body)
        name = body.get('name')
        email = body.get('email')
        subject = body.get('subject')
        message = body.get('message')

        if not all([name, email, subject, message]):
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'All fields are required'})
            }

        # ✅ إرسال الإيميل
        sender = os.environ.get('EMAIL_USER')
        password = os.environ.get('EMAIL_PASS')

        if not sender or not password:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email configuration error'})
            }

        msg = MIMEMultipart()
        msg['From'] = f'"{name}" <{email}>'
        msg['To'] = sender
        msg['Subject'] = subject

        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #00d4ff; padding-bottom: 10px;">📧 New Message from Portfolio</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
            <p><strong>👤 Name:</strong> {name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:{email}">{email}</a></p>
            <p><strong>📝 Subject:</strong> {subject}</p>
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
              <p><strong>💬 Message:</strong></p>
              <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">{message}</p>
            </div>
          </div>
          <p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
        """

        msg.attach(MIMEText(html, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender, password)
        server.sendmail(sender, sender, msg.as_string())
        server.quit()

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'message': 'Email sent successfully!'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }