from flask_mail import Message
from app import mail
from models import LoginDetails

def send_email(subject, recipients, body):
    msg = Message(subject, recipients=recipients)
    msg.body = body
    mail.send(msg)

def authenticate(email, password):
    return LoginDetails.query.filter_by(KUDZU_Email_Id=email, Password=password).first()