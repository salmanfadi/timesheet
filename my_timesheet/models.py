from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Employee(db.Model):
    SNo = db.Column(db.Integer, nullable=False)
    Employee_ID = db.Column(db.String(20), primary_key=True)
    Candidate_Name = db.Column(db.String(100), nullable=False)
    Candidate_Status = db.Column(db.String(50), nullable=False)
    Candidate_Designation = db.Column(db.String(50))
    Candidate_Skill_Technology = db.Column(db.String(100), nullable=False)
    KUDZU_Email_Id = db.Column(db.String(100), nullable=False)
    Client = db.Column(db.String(100), nullable=False)
    Project_Name = db.Column(db.String(100))

class LoginDetails(db.Model):
    Employee_ID = db.Column(db.String(20), primary_key=True)
    Candidate_Name = db.Column(db.String(100), nullable=False)
    KUDZU_Email_Id = db.Column(db.String(100), nullable=False)
    Password = db.Column(db.String(100), nullable=False)
    Candidate_Designation = db.Column(db.String(100))

class Timesheets_table(db.Model):
    SNo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    employee_id = db.Column(db.String(20), nullable=False)
    date = db.Column(db.Date, nullable=False)
    day = db.Column(db.String(20), nullable=False)
    login_time = db.Column(db.Time)
    logout_time = db.Column(db.Time)
    shift_details = db.Column(db.String(100))
    remarks = db.Column(db.String(200))
    leave = db.Column(db.Boolean, default=False)
    workday = db.Column(db.Boolean, default=True)
