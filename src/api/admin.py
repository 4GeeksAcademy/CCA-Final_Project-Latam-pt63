import os
import inspect
from flask_admin import Admin
from . import models
from .models import db, Users, Pets, Doctors, Vaccines, Appointments, PasswordReset
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme


class UserModelView(ModelView):
    column_auto_select_related = True
    column_list = ['user_id', 'first_name', 'last_name',
                   'email', 'phonenumber', 'address', 'password', 'pets']


class PetsModelView(ModelView):
    column_auto_select_related = True
    column_list = ['pet_id', 'owner_id', 'owner', 'name', 'pet_type',
                   'birthdate', 'breed', 'allergies', 'neutered', 'info', 'image', 'vaccines']


class DoctorsModelView(ModelView):
    column_auto_select_related = True
    column_list = ['doctor_id', 'first_name', 'last_name',
                   'specialty', 'email', 'phonenumber', 'password']


class VaccinesModelView(ModelView):
    column_auto_select_related = True
    column_list = ['vaccine_id', 'vaccine_name',
                   'pet', 'vaccination_date', 'expiry_date']


class AppointmentsModelView(ModelView):
    column_auto_select_related = True
    column_list = ['appointment_id', 'doctor', 'pet', 'date', 'time', 'motive']


class PasswordResetModelView(ModelView):
    column_auto_select_related = True
    column_list = ['reset_id', 'user_id', 'uuid',
                   'time']


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin',
                  theme=Bootstrap4Theme(swatch='cerulean'))

    admin.add_view(UserModelView(Users, db.session))
    admin.add_view(PetsModelView(Pets, db.session))
    admin.add_view(DoctorsModelView(Doctors, db.session))
    admin.add_view(VaccinesModelView(Vaccines, db.session))
    admin.add_view(AppointmentsModelView(Appointments, db.session))
    admin.add_view(PasswordResetModelView(PasswordReset, db.session))

    # # Dynamically add all models to the admin interface
    # for name, obj in inspect.getmembers(models):
    #     # Verify that the object is a SQLAlchemy model before adding it to the admin.
    #     if inspect.isclass(obj) and issubclass(obj, db.Model):
    # admin.add_view(ModelView(obj, db.session))
