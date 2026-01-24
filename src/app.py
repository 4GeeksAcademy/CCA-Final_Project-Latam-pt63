"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Users, Pets, Doctors, Appointments, Vaccines
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_cors import CORS
from flask_bcrypt import Bcrypt

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

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
    valid_email = Users.query.filter_by(email=body['email']).first()
    if valid_email != None:
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
    if doctor_existente:
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
            return jsonify({'user': user_info.serialize()}), 200
    else:
        users = Users.query.all()
        users_serialized = []
        for user in users:
            users_serialized.append(user.serialize())
        return jsonify({'users': users_serialized}),200
    
@app.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def modify_user(user_id):
    user = get_jwt_identity()
    body = request.get_json()
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        if user_info is None:
            return jsonify({'msg':'User not found'}),400
        if user_info.user_id != user_id:
            return jsonify({'msg':'You cant modify a different user'}),400
        else:
            if 'email' in body:
                user_info.email = body['email']
            if 'phonenumber' in body:
                user_info.phonenumber = body['phonenumber']
            if 'address' in body:
                user_info.address = body['address']
            db.session.commit()
            return jsonify({'msg':'User updates successfully',
                            'user': user_info.serialize()}),200
    else:
        update_user = Users.query.get(user_id)
        if update_user is None:
            return jsonify({'msg':'User not found'}),404
        if 'email' in body:
            update_user.email = body['email']
        if 'phonenumber' in body:
            update_user.phonenumber = body['phonenumber']
        if 'address' in body:
            update_user.address = body['address']
        db.session.commit()
        return jsonify({'msg': 'User updated successfully',
                        'user': update_user.serialize()}),200
    
@app.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_single_user(user_id):
    user = get_jwt_identity()
    requested_user = Users.query.get(user_id)
    if requested_user is None:
        return jsonify({'msg':'User not found'}),404
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        if user_info is None:
            return jsonify({'msg':'User not found'}),404
        if user_info.user_id != user_id:
            return jsonify({'msg':'You cant access this information'}),400
        return jsonify({'user':user_info.serialize()}),200
    else:
        return jsonify({'user':requested_user.serialize()},200)
        
            
    
        

    


@app.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        if user_info is None:
            return jsonify({'msg': 'User not found'}), 404
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





# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT=int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
