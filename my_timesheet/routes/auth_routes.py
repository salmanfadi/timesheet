from flask import Blueprint, jsonify, request, session, render_template, redirect, url_for
from models import LoginDetails, db
from utils.utils import authenticate

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/add_login_details', methods=['GET'])
def add_login_details():
    try:
        login_details_list = [
            LoginDetails(Employee_ID='IND-2420', Candidate_Name='Siddharth Ramachandran', KUDZU_Email_Id='siddharth.r@kudzuinfotech.com', Password='SpeedRocks1760.', Candidate_Designation='Tech Lead'),
        ]
        db.session.add_all(login_details_list)
        db.session.commit()

        return jsonify({"message": "Login details added successfully."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = authenticate(email, password)
        if user:
            session['email'] = email
            if user.Candidate_Designation != 'Admin':
                return redirect(url_for('user.user_dashboard'))
            else:
                return redirect(url_for('view_data'))
        else:
            error = 'Invalid email or password'
    return render_template('login.html', error=error)

@auth_bp.route("/logout")
def logout():
    return redirect(url_for('auth.login'))

@auth_bp.route('/auth_response')
def auth_response():
    result = auth.complete_log_in(request.args)
    if "error" in result:
        return render_template("auth_error.html", result=result)
    return redirect(url_for("index"))

@auth_bp.route('/admin-login')
def admin_login():
    return render_template("adlog.html", version=__version__, **auth.log_in(
        scopes=app_config.SCOPE, 
        redirect_uri=url_for("auth_response", _external=True)
    ))
