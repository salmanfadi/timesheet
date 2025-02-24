from flask import Blueprint, request, session, render_template, jsonify, redirect, url_for
from models import Employee, Timesheets_table, db
from utils.utils import send_email
from datetime import datetime
import calendar

user_bp = Blueprint('user', __name__)

@user_bp.route('/send_bulk_email', methods=['POST'])
def send_bulk_email():
    selected_tiles = request.form.getlist("tile-checkbox")
    selected_rows = request.form.getlist("row-checkbox")
    email_list = set()

    for tile in selected_tiles:
        email = Employee.query.filter_by(Employee_ID=tile).first().KUDZU_Email_Id
        email_list.add(email)

    for row in selected_rows:
        email = Employee.query.filter_by(Employee_ID=row).first().KUDZU_Email_Id
        email_list.add(email)

    send_email("Your Subject", list(email_list), "Your Email Body")
    return "Emails sent successfully!"

@user_bp.route('/my-profile')
def my_profile():
    email = session.get('email')
    if email:
        employee = Employee.query.filter_by(KUDZU_Email_Id=email).first()
        if employee:
            return render_template('myprofile.html', employee=employee)
    return redirect(url_for('auth.login'))

@user_bp.route('/user-dashboard')
def user_dashboard():
    email = session.get('email')
    if email:
        employee = Employee.query.filter_by(KUDZU_Email_Id=email).first()
        if employee:
            return render_template('userdash.html', employee=employee)
    return redirect(url_for('auth.login'))

@user_bp.route('/my-timesheet')
def my_timesheet():
    # Retrieve the email address from the session
    email = session.get('email')
    if email:
        # Query the Employee table using the email address
        employee = Employee.query.filter_by(KUDZU_Email_Id=email).first()
        if employee:
            current_month = calendar.month_name[datetime.now().month]
            # Pass employee details to the template
            return render_template('timesheet.html', employee=employee, current_month=current_month)
    # Redirect to login if email not found or employee not found
    return redirect(url_for('login'))

@user_bp.route('/kanban')
def kanban():
    return render_template('kanban.html')

@user_bp.route('/personal-tile/<employee_id>')
def personal_tile(employee_id):
    # Query the Employee table to get employee details by employee_id
    employee = Employee.query.filter_by(Employee_ID=employee_id).first()
    if employee:
        # Get current month and year
        current_month = datetime.now().month
        current_year = datetime.now().year

        # Get selected month and year from the request parameters
        selected_month = request.args.get('month', current_month, type=int)
        selected_year = request.args.get('year', current_year, type=int)
        
        # Query timesheet data for the selected month and year from timesheets_table
        timesheet_data = Timesheets_table.query.filter(
            Timesheets_table.employee_id == employee_id,
            db.extract('month', Timesheets_table.date) == selected_month,
            db.extract('year', Timesheets_table.date) == selected_year
        ).all()

        # Check if timesheet data is available
        if timesheet_data:
            timesheet_available = True
        else:
            timesheet_available = False

        # Render personal tile HTML and pass employee details, timesheet data, and availability flag to the template
        return render_template(
            "personaltile.html",
            employee=employee,
            current_month=current_month,
            current_year=current_year,
            timesheet_data=timesheet_data,
            timesheet_available=timesheet_available
        )
    else:
        # Redirect to view_data if employee not found
        return redirect(url_for('view_data'))
