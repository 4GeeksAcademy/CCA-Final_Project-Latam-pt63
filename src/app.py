"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Users, Pets, Doctors, Appointments, Vaccines, PasswordReset
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_cors import CORS
from flask_bcrypt import Bcrypt

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

import uuid
from datetime import datetime, timedelta, timezone

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

bcrypt = Bcrypt(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route("/pet", methods=["GET"])
@app.route("/pet/<int:pet_id>", methods=["GET"])
@jwt_required()
def get_pet(pet_id=None):
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()
    if admin is not None:
        if pet_id is None:
            pets = Pets.query.all()
            return jsonify({"pets": [p.serialize() for p in pets]}), 200
        pet = Pets.query.get(pet_id)
        if pet is None:
            return jsonify({"msg": "Pet not found"}), 404
        return jsonify(pet.serialize()), 200
    user_info = Users.query.filter_by(email=user).first()
    if user_info is None:
        return jsonify({"msg": "User doesnt exist"}), 400
    if pet_id is None:
        pets = Pets.query.filter_by(owner_id=user_info.user_id).all()
        return jsonify({"pets": [p.serialize() for p in pets]}), 200
    pet = Pets.query.get(pet_id)
    if pet is None:
        return jsonify({"msg": "Pet not found"}), 404
    if pet.owner_id != user_info.user_id:
        return jsonify({"msg": "You are not allowed to view this pet"}), 403
    return jsonify(pet.serialize()), 200


@app.route("/pet", methods=["POST"])
@jwt_required()
def create_pet():
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()

    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        print("user: ", user_info)
        if user_info is None:
            return jsonify({'msg': 'User doesnt exist'}), 400
        body = request.get_json(silent=True) or {}
        owner_id = user_info.user_id
        pet_type = (body.get("pet_type") or "")
        name = (body.get("name") or "")
        birthdate = (body.get("birthdate") or "")
        breed = (body.get("breed") or "")
        allergies = (body.get("allergies") or "")
        neutered = body.get("neutered")

    else:
        body = request.get_json(silent=True) or {}
        owner_id = (body.get("owner_id") or "")
        if isinstance(owner_id, str):
            if owner_id != "" and not owner_id.isdigit():
                return jsonify({"msg": "owner_id must be an integer"}), 400
            if owner_id != "":
                owner_id = int(owner_id)
        pet_type = (body.get("pet_type") or "")
        name = (body.get("name") or "")
        birthdate = (body.get("birthdate") or "")
        breed = (body.get("breed") or "")
        allergies = (body.get("allergies") or "")
        neutered = body.get("neutered")

    if owner_id == "":
        return jsonify({"msg": "owner_id is required"}), 400
    if pet_type == "":
        return jsonify({"msg": "pet_type is required"}), 400
    if name == "":
        return jsonify({"msg": "name is required"}), 400
    if birthdate == "":
        return jsonify({"msg": "birthdate is required"}), 400
    if breed == "":
        return jsonify({"msg": "breed is required"}), 400
    if allergies == "":
        return jsonify({"msg": "allergies is required. Use 'none' if there are no allergies"}), 400
    if neutered is None:
        return jsonify({"msg": "neutered is required"}), 400
    if not isinstance(neutered, bool):
        return jsonify({"msg": "neutered must be a boolean (true/false)"}), 400
    owner = Users.query.get(owner_id)
    if owner is None:
        return jsonify({"msg": "Owner not found"}), 404
    new_pet = Pets()
    new_pet.owner_id = owner_id
    new_pet.pet_type = pet_type
    new_pet.name = name
    new_pet.birthdate = birthdate
    new_pet.breed = breed
    new_pet.allergies = allergies
    new_pet.neutered = neutered
    new_pet.info = body.get("info")
    new_pet.image = body.get("image")

    db.session.add(new_pet)
    db.session.commit()

    return jsonify({"msg": "Pet created successfully", "pet": new_pet.serialize()}), 201


@app.route("/pet/<int:pet_id>", methods=["PUT"])
@jwt_required()
def update_pet(pet_id):
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()

    pet = Pets.query.get(pet_id)
    if pet is None:
        return jsonify({"msg": "Pet not found"}), 404

    body = request.get_json(silent=True) or {}

    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        if user_info is None:
            return jsonify({"msg": "User doesnt exist"}), 400
        if pet.owner_id != user_info.user_id:
            return jsonify({"msg": "You are not allowed to update this pet"}), 403
        new_owner_id = user_info.user_id
    else:
        new_owner_id = body.get("owner_id", pet.owner_id)

    if new_owner_id is None or new_owner_id == "":
        return jsonify({"msg": "owner_id is required"}), 400
    if isinstance(new_owner_id, str):
        if not new_owner_id.isdigit():
            return jsonify({"msg": "owner_id must be an integer"}), 400
        new_owner_id = int(new_owner_id)

    owner = Users.query.get(new_owner_id)
    if owner is None:
        return jsonify({"msg": "Owner not found"}), 404

    pet.owner_id = new_owner_id

    if "pet_type" in body:
        pet.pet_type = (body.get("pet_type") or "")
    if "name" in body:
        pet.name = (body.get("name") or "")
    if "birthdate" in body:
        pet.birthdate = (body.get("birthdate") or "")
    if "breed" in body:
        pet.breed = (body.get("breed") or "")
    if "allergies" in body:
        pet.allergies = (body.get("allergies") or "")

    if "neutered" in body:
        neutered = body.get("neutered")
        if neutered is None:
            return jsonify({"msg": "neutered is required"}), 400
        if not isinstance(neutered, bool):
            return jsonify({"msg": "neutered must be a boolean (true/false)"}), 400
        pet.neutered = neutered

    if "info" in body:
        pet.info = body.get("info")
    if "image" in body:
        pet.image = body.get("image")

    if pet.owner_id is None:
        return jsonify({"msg": "owner_id is required"}), 400
    if (pet.pet_type or "") == "":
        return jsonify({"msg": "pet_type is required"}), 400
    if (pet.name or "") == "":
        return jsonify({"msg": "name is required"}), 400
    if (pet.birthdate or "") == "":
        return jsonify({"msg": "birthdate is required"}), 400
    if (pet.breed or "") == "":
        return jsonify({"msg": "breed is required"}), 400
    if (pet.allergies or "") == "":
        return jsonify({"msg": "allergies is required. Use 'none' if there are no allergies"}), 400
    if pet.neutered is None:
        return jsonify({"msg": "neutered is required"}), 400

    db.session.commit()
    return jsonify({"msg": "Pet updated successfully", "pet": pet.serialize()}), 200


@app.route('/signup', methods=['POST'])
def signup():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'You must include information in the body'}), 400
    if 'first_name' not in body:
        return jsonify({'msg': 'You must include a first name'}), 400
    if 'last_name' not in body:
        return jsonify({'msg': 'You must include a last name'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'You must include an email'}), 400
    if 'phonenumber' not in body:
        return jsonify({'msg': 'You must include a phonenumber'}), 400
    if 'address' not in body:
        return jsonify({'msg': 'You must include an address'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'You must include a password'}), 400
    valid_user_email = Users.query.filter_by(email=body['email']).first()
    valid_doctor_email = Doctors.query.filter_by(email=body['email']).first()
    if valid_user_email != None or valid_doctor_email != None:
        return jsonify({'msg': 'Email already exists'}), 400
    new_user = Users()
    new_user.first_name = body['first_name']
    new_user.last_name = body['last_name']
    new_user.email = body['email']
    new_user.phonenumber = body['phonenumber']
    new_user.address = body['address']
    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_user.password = pw_hash
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'New user added successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'You must include information in the body'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'You must include an email'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'You must include a password'}), 400
    user = Users.query.filter_by(email=body['email']).first()
    if user is None:
        admin = Doctors.query.filter_by(email=body['email']).first()
        if admin is None:
            return jsonify({'msg': 'Incorrect email or password'}), 400
        else:
            is_correct_password = bcrypt.check_password_hash(
                admin.password, body['password'])
            if not is_correct_password:
                return jsonify({'msg': 'Incorrect email or password'}), 400
            token = create_access_token(identity=admin.email)
            return jsonify({'msg': 'Login successful',
                            'token': token,
                            'role': 'admin'}), 200
    else:
        is_correct_password = bcrypt.check_password_hash(
            user.password, body['password'])
        if not is_correct_password:
            return jsonify({'msg': 'Incorrect email or password'}), 400
        token = create_access_token(identity=user.email)
        return jsonify({'msg': 'Login successful',
                        'token': token,
                        'role': 'user'}), 200


@app.route('/doctors', methods=['POST'])
def create_doctor():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'You must send information in the body'}), 400
    if 'first_name' not in body:
        return jsonify({'msg': 'Missing (first_name)'}), 400
    if 'last_name' not in body:
        return jsonify({'msg': 'Missing (last_name'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'missing (email)'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'missing (password)'}), 400
    if 'specialty' not in body:
        return jsonify({'msg': 'missing (specialty)'}), 400

    doctor_existente = Doctors.query.filter_by(email=body['email']).first()
    valid_user_email = Users.query.filter_by(email=body['email']).first()
    if doctor_existente != None or valid_user_email != None:
        return jsonify({'msg': 'email already registered'}), 400

    new_doctor = Doctors()
    new_doctor.first_name = body['first_name']
    new_doctor.last_name = body['last_name']
    new_doctor.email = body['email']
    new_doctor.specialty = body['specialty']
    new_doctor.phone_number = body.get('phone_number')

    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_doctor.password = pw_hash

    db.session.add(new_doctor)
    db.session.commit()
    return jsonify({'msg': 'Doctor created successfully'}), 201


@app.route('/doctors', methods=['GET'])
@jwt_required()
def get_doctor_info():
    user = get_jwt_identity()
    valid_user = Users.query.filter_by(email=user).first()
    valid_admin = Doctors.query.filter_by(email=user).first()
    if valid_user != None or valid_admin != None:
        doctors = Doctors.query.all()
        doctors_serialized = []
        for doctor in doctors:
            doctors_serialized.append(doctor.serialize())
        return jsonify({'doctors': doctors_serialized}), 200
    else:
        return jsonify({'msg': 'user not found'}), 404


@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        if user_info is None:
            return jsonify({'msg': 'User not found'}), 404
        else:
            userdict = user_info.serialize()
            pets_serialized = []
            for pet in user_info.pets:
                pets_serialized.append(pet.serialize())
            userdict['pets'] = pets_serialized
            return jsonify({'user': userdict}), 200
    else:
        users = Users.query.all()
        users_serialized = []
        for user in users:
            pets_serialized = []
            userdict = user.serialize()
            for pet in user.pets:
                pets_serialized.append(pet.serialize())
                print(type(user))
            userdict['pets'] = pets_serialized
            users_serialized.append(userdict)
        return jsonify({'users': users_serialized}), 200


@app.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def modify_user(user_id):
    user = get_jwt_identity()
    body = request.get_json()
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        if user_info is None:
            return jsonify({'msg': 'User not found'}), 400
        if user_info.user_id != user_id:
            return jsonify({'msg': 'You cant modify a different user'}), 400
        else:
            if 'first_name' in body:
                user_info.first_name = body['first_name']
            if 'last_name' in body:
                user_info.last_name = body['last_name']
            if 'phonenumber' in body:
                user_info.phonenumber = body['phonenumber']
            if 'address' in body:
                user_info.address = body['address']
            db.session.commit()
            return jsonify({'msg': 'User updated successfully',
                            'user': user_info.serialize()}), 200
    else:
        update_user = Users.query.get(user_id)
        if update_user is None:
            return jsonify({'msg': 'User not found'}), 404
        if 'first_name' in body:
            user_info.first_name = body['first_name']
        if 'last_name' in body:
            user_info.last_name = body['last_name']
        if 'phonenumber' in body:
            update_user.phonenumber = body['phonenumber']
        if 'address' in body:
            update_user.address = body['address']
        db.session.commit()
        return jsonify({'msg': 'User updated successfully',
                        'user': update_user.serialize()}), 200


@app.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_single_user(user_id):
    user = get_jwt_identity()
    requested_user = Users.query.get(user_id)
    if requested_user is None:
        return jsonify({'msg': 'User not found'}), 404
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        if user_info is None:
            return jsonify({'msg': 'User not found'}), 404
        if user_info.user_id != user_id:
            return jsonify({'msg': 'You cant access this information'}), 400
        return jsonify({'user': user_info.serialize()}), 200
    else:
        return jsonify({'user': requested_user.serialize()}), 200


@app.route('/private', methods=['GET'])
@jwt_required()
def verify_admin():
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        return jsonify({'msg': 'You dont have access to this page'}), 400
    else:
        return jsonify({'msg': 'Access granted'}), 200


@app.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        if user_info is None:
            return jsonify({'msg': 'User not found'}), 404
        body = request.get_json()
        if body is None:
            return jsonify({'msg': 'You must include information in the body'}), 400
        if 'doctor_id' not in body:
            return jsonify({'msg': 'You must include a doctor_id'}), 400
        if 'pet_id' not in body:
            return jsonify({'msg': 'You must include a pet_id'}), 400
        if 'date' not in body:
            return jsonify({'msg': 'You must include a date'}), 400
        if 'time' not in body:
            return jsonify({'msg': 'You must include a time'}), 400
        if 'motive' not in body:
            return jsonify({'msg': 'You must include a motive'}), 400
        doctor_id = body['doctor_id']
        valid_doctor_id = Doctors.query.get(doctor_id)
        if valid_doctor_id is None:
            return jsonify({'msg': 'Doctor not found'}), 404
        pet = Pets.query.get(body['pet_id'])
        if pet.owner_id != user_info.user_id:
            return jsonify({'msg': 'You cant make an appointment for a pet you dont own'}), 400

        new_appointment = Appointments()
        new_appointment.doctor_id = body['doctor_id']
        new_appointment.pet_id = body['pet_id']
        new_appointment.date = body['date']
        new_appointment.time = body['time']
        new_appointment.motive = body['motive']
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify({'msg': 'Appointment created successfully'})
    else:
        body = request.get_json(silent=True)
        if body is None:
            return jsonify({'msg': 'You must include information in the body'}), 400
        if 'doctor_id' not in body:
            return jsonify({'msg': 'You must include a doctor_id'}), 400
        if 'pet_id' not in body:
            return jsonify({'msg': 'You must include a pet_id'}), 400
        if 'date' not in body:
            return jsonify({'msg': 'You must include a date'}), 400
        if 'time' not in body:
            return jsonify({'msg': 'You must include a time'}), 400
        if 'motive' not in body:
            return jsonify({'msg': 'You must include a motive'}), 400
        doctor_id = body['doctor_id']
        valid_doctor_id = Doctors.query.get(doctor_id)
        if valid_doctor_id is None:
            return jsonify({'msg': 'Doctor not found'}), 404

        new_appointment = Appointments()
        new_appointment.doctor_id = body['doctor_id']
        new_appointment.pet_id = body['pet_id']
        new_appointment.date = body['date']
        new_appointment.time = body['time']
        new_appointment.motive = body['motive']
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify({'msg': 'Appointment created successfully'})


@app.route('/vaccine', methods=['POST'])
def create_vaccine():
    body = request.get_json()
    if 'vaccine_name' not in body or 'pet_id' not in body or 'vaccination_date' not in body or 'expiry_date' not in body:
        return jsonify({"msg": "Missing fields: vaccine_name, pet_id, vaccination_date and expiry_date are required"}), 400
    new_vaccine = Vaccines(
        vaccine_name=body['vaccine_name'],
        pet_id=body['pet_id'],
        vaccination_date=body['vaccination_date'],
        expiry_date=body['expiry_date']
    )
    db.session.add(new_vaccine)
    db.session.commit()
    return jsonify(new_vaccine.serialize()), 201


@app.route('/vaccine/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_vaccines(pet_id):
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()
    pet = Pets.query.get(pet_id)
    if pet is None:
        return jsonify({'msg': 'Pet not found'}), 404
    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        if user_info is None:
            return jsonify({'msg': 'User not found'}), 404
        if user_info.user_id != pet.owner_id:
            return jsonify({'msg': 'You cant access information of a pet you dont own'}), 400
        vaccines = Vaccines.query.filter_by(pet_id=pet_id).all()
        vaccines_serialized = []
        for vaccine in vaccines:
            vaccines_serialized.append(vaccine.serialize())
        return jsonify({'vaccines': vaccines_serialized})
    else:
        vaccines = Vaccines.query.filter_by(pet_id=pet_id).all()
        vaccines_serialized = []
        for vaccine in vaccines:
            vaccines_serialized.append(vaccine.serialize())
        return jsonify({'vaccines': vaccines_serialized})


@app.route('/appointment/<int:appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    user_email = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user_email).first()

    if admin is None:
        return jsonify({'msg': 'Access denied. Only admins can update appointments'}), 403

    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'You must include information in the body'}), 400

    appointment = Appointments.query.get(appointment_id)
    if appointment is None:
        return jsonify({'msg': 'Appointment not found'}), 404

    if 'date' in body:
        appointment.date = body['date']
    if 'time' in body:
        appointment.time = body['time']
    if 'motive' in body:
        appointment.motive = body['motive']
    if 'status' in body:
        appointment.status = body['status']

    db.session.commit()
    return jsonify({'msg': 'Appointment updated successfully'}), 200


@app.route('/appointment/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(appointment_id):
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        return jsonify({'msg': 'User not found'}), 404
    else:
        appointment = Appointments.query.get(appointment_id)
        if appointment is None:
            return jsonify({'msg': 'Appointment not found'}), 404
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({'msg': 'Appointment deleted successfully'})


@app.route('/history/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_pet_history(pet_id):
    user = get_jwt_identity()
    pet = Pets.query.get(pet_id)
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        owner = Users.query.filter_by(email=user).first()
        if owner is None:
            return jsonify({'msg': 'User not found'}), 404
        if pet.owner_id != owner.user_id:
            return jsonify({'msg': 'You cant acces info from a pet you dont own'}), 400
        else:
            history = Appointments.query.filter_by(pet_id=pet_id).all()
            history_serialized = []
            for appointment in history:
                history_serialized.append(appointment.serialize())
            return jsonify({'history': history_serialized}), 200
    else:
        history = Appointments.query.filter_by(pet_id=pet_id).all()
        history_serialized = []
        for appointment in history:
            history_serialized.append(appointment.serialize())
        return jsonify({'history': history_serialized}), 200


@app.route('/send-recovery-link', methods=['POST'])
def send_recovery_link():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'You must include information in the body'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'You must include an email'}), 400
    valid_user = Users.query.filter_by(email=body['email']).first()
    if valid_user is None:
        return jsonify({'msg': 'User not found'}), 404
    new_uuid = uuid.uuid4()
    current_time = datetime.now()
    time_limit = current_time + timedelta(minutes=30)

    new_password = PasswordReset()
    new_password.user_id = valid_user.user_id
    new_password.uuid = new_uuid
    new_password.time = time_limit
    db.session.add(new_password)
    db.session.commit()

    message = Mail(
        from_email='petcareproject47@gmail.com',
        to_emails=valid_user.email,
        subject='Password Reset',
        html_content=f"<strong>Here is your recovery <a href=https://super-duper-computing-machine-pjq64rj6gxgx26ww-3000.app.github.dev/reset-password/{new_uuid}>link</a></strong>")
    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
    # sg.set_sendgrid_data_residency("eu")
    # uncomment the above line if you are sending mail using a regional EU subuser
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)

    return jsonify({'msg': 'New password request generated successfully, Please check your email',
                    'link': f"https://super-duper-computing-machine-pjq64rj6gxgx26ww-3000.app.github.dev/reset-password/{new_uuid}"}), 200


@app.route('/reset-password/<string:user_uuid>', methods=['PUT'])
def reset_password(user_uuid):
    valid_request = PasswordReset.query.filter_by(uuid=user_uuid).first()
    if valid_request is None:
        return jsonify({'msg': 'Request not found'}), 404
    if valid_request.time < datetime.now():
        return jsonify({'msg': 'Request expired'}), 400
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'You must include information in the body'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'You must include an email'})
    valid_user = Users.query.filter_by(email=body['email']).first()
    if valid_user.user_id != valid_request.user_id:
        return jsonify({'msg': 'You cant update the password of this user'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'You must include a password'}), 400
    user = Users.query.get(valid_request.user_id)
    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    user.password = pw_hash
    db.session.commit()
    return jsonify({'msg': 'Password changed successfully'}), 200


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
