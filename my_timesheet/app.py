# app.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_session import Session
from flask_mail import Mail
import app_config
from models import db

# Initialize the Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:AlginThomas%4012345@localhost/timesheet'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config.from_object(app_config)

# Initialize extensions
Session(app)
db.init_app(app)
migrate = Migrate(app, db)
mail = Mail(app)

# Import and register routes
from routes.auth_routes import auth_bp
from routes.data_routes import data_bp
from routes.user_routes import user_bp

app.register_blueprint(auth_bp)
app.register_blueprint(data_bp)
app.register_blueprint(user_bp)

from werkzeug.middleware.proxy_fix import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)


@app.cli.command('init-db')
def init_db():
    db.create_all()
    db.session.commit()
    print('Database initialized!')

if __name__ == '__main__':
    app.run(debug=True)
