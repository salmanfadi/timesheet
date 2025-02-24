from flask import Blueprint, jsonify, render_template, request, session, send_file
import calendar
from datetime import datetime
import pandas as pd
import io
from models import Employee, Timesheets_table, db
import identity

data_bp = Blueprint('data', __name__)

@data_bp.route('/import-data')
def import_data():
    df = pd.read_excel('./static/IND and CON Active List-2.xlsx')
    for _, r in df.iterrows():
        employee = Employee(
            SNo=r['S No'],
            Employee_ID=r['Employee ID'],
            Candidate_Name=r['Candidate Name'],
            Candidate_Status=r['Candidate Status'],
            Candidate_Designation=r['Candidate Designation'],
            Candidate_Skill_Technology=r['Candidate Skill/Technology'],
            KUDZU_Email_Id=r['KUDZU-Email Id'],
            Client=r['Client'],
            Project_Name=r['Project Name']
        )
        db.session.add(employee)
    db.session.commit()
    return "Data imported successfully"

from calendar import monthrange

@data_bp.route('/create_and_insert_data', methods=['POST'])
def create_and_insert_data():
    try:
        employee_id = request.form['employee_id']
        month_year = request.form['month_year']
        
        # Extract year and month
        year, month = map(int, month_year.split('-'))
        
        # Check if a timesheet already exists for this employee
        existing_timesheets = Timesheets_table.query.filter_by(employee_id=employee_id).all()
        if existing_timesheets:
            return jsonify({'error': 'Timesheet already exists'}), 400
        
        # Get the number of days in the given month
        num_days_in_month = monthrange(year, month)[1]
        
        timesheet_entries = []
        for i in range(1, num_days_in_month + 1):
            day_date = datetime(year, month, i)
            day = calendar.day_name[day_date.weekday()]

            timesheet_entry = Timesheets_table(
                employee_id=employee_id,
                date=day_date,
                day=day,
                login_time=request.form.get(f"login-time-{i}"),
                logout_time=request.form.get(f"logout-time-{i}"),
                shift_details=request.form.get(f"shift-details-{i}"),
                remarks=request.form.get(f"remarks-{i}"),
                leave=request.form.get(f"leave-{i}") == "on"
            )
            timesheet_entries.append(timesheet_entry)

        db.session.add_all(timesheet_entries)
        db.session.commit()
        return render_template('success.html')

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@data_bp.route('/download_timesheet')
def download_timesheet():
    timesheet_data = session.get('timesheet_data', [])
    employee_name = session.get('employee_name', 'Employee')
    timesheet_month = session.get('timesheet_month', 'Timesheet')

    csv_output = io.StringIO()
    csv_output.write("Date,Day,Login Time,Logout Time,Shift Details,Remarks,Leave\n")
    for entry in timesheet_data:
        login_time = entry['login_time'].split(' ')[1] if entry['login_time'] else ''
        logout_time = entry['logout_time'].split(' ')[1] if entry['logout_time'] else ''
        row = [
            entry['date'],
            entry['day'],
            login_time,
            logout_time,
            entry['shift_details'],
            entry['remarks'],
            'Yes' if entry['leave'] else 'No'
        ]
        csv_output.write(','.join(row) + '\n')

    csv_output.seek(0)
    filename = f"{employee_name}_Timesheet_{timesheet_month}.csv"
    return send_file(io.BytesIO(csv_output.getvalue().encode('utf-8')),
                     mimetype='text/csv',
                     as_attachment=True,
                     download_name=filename)

@data_bp.route('/table')
def index():
    return render_template('index.html')

@data_bp.route('/view-data')
def view_data():
    employees = Employee.query.all()
    return render_template('personal.html', employees=employees)

@data_bp.route('/approve_timesheet', methods=['POST'])
def approve_timesheet():
    try:
        employee_id = request.form['employee_id']
        previous_month = request.form['previous_month']
        previous_year = request.form['previous_year']

        if not employee_id or not previous_month or not previous_year:
            raise ValueError("Missing required form data")

        # Assuming DB_CONFIG is defined somewhere in app.py or config
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE employee
            SET previous_month_timesheet = 'Submitted'
            WHERE Employee_ID = %s
        """, (employee_id,))

        conn.commit()
        conn.close()

        return jsonify({'message': 'Timesheet approved successfully'}), 200

    except Exception as e:
        app.logger.error(f"Error approving timesheet: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500
