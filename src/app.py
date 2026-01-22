"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Users, Pets, Doctors
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



@app.route("/pet/<int:pet_id>", methods=["GET"])
def get_pet(pet_id):
    pet = Pets.query.get(pet_id)
    if pet is None:
        return jsonify({"msg": "Pet not found"}), 404
    return jsonify(pet.serialize()), 200


@app.route("/pet", methods=["POST"])
@jwt_required()
def create_pet():
    user = get_jwt_identity()
    admin = Doctors.query.filter_by(email=user).first()
    if admin is None:
        user_info = Users.query.filter_by(email=user).first()
        print("user: ", user_info)
        print("user_info.user_id: ", user_info.user_id)
        if user_info is None:
            return jsonify({'msg':'User doesnt exist'}),400
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
        pet_type = (body.get("pet_type") or "")
        name = (body.get("name") or "")
        birthdate = (body.get("birthdate") or "")
        breed = (body.get("breed") or "")
        allergies = (body.get("allergies") or "")
        neutered = body.get("neutered")

    if owner_id is None:
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
def update_pet(pet_id):
    pet = Pets.query.get(pet_id)
    if pet is None:
        return jsonify({"msg": "Pet not found"}), 404

    body = request.get_json(silent=True) or {}

    if "owner_id" in body:
        new_owner_id = body.get("owner_id")
        if new_owner_id is None:
            return jsonify({"msg": "owner_id is required"}), 400
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

@app.route('/login',methods=['POST'])
def login():
    body =  request.get_json(silent=True)
    if body is None:
        return jsonify({'msg':'You must include information in the body'}),400
    if 'email' not in body:
        return jsonify({'msg':'You must include an email'}),400
    if 'password' not in body:
        return jsonify({'msg':'You must include a password'}),400
    user = Users.query.filter_by(email=body['email']).first()
    if user is None:
        admin = Doctors.query.filter_by(email=body['email']).first()
        if admin is None:
            return jsonify({'msg':'Incorrect email or password'}),400
        is_correct_password = bcrypt.check_password_hash(admin.password, body['password'])
        if not is_correct_password:
            return jsonify({'msg':'Incorrect email or password'}),400
        token = create_access_token(identity=user.email)
        return jsonify({'msg':'Login successful',
                    'token': token,
                    'role': 'admin'}), 200
    else:
        is_correct_password = bcrypt.check_password_hash(user.password, body['password'])
        if not is_correct_password:
            return jsonify({'msg':'Incorrect email or password'}),400
        token = create_access_token(identity=user.email)
        return jsonify({'msg':'Login successful',
                    'token': token,
                    'role': 'user'}), 200

@app.route('/doctors', methods=['POST'])
def create_doctor():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Debes enviar información en el body'}), 400
    if 'first_name' not in body:
        return jsonify({'msg': 'Falta el nombre (first_name)'}), 400
    if 'last_name' not in body:
        return jsonify({'msg': 'Falta el apellido (last_name)'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'Falta el correo (email)'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'Falta la contraseña (password)'}), 400
    if 'speciality' not in body:
        return jsonify({'msg': 'Falta la especialidad (speciality)'}), 400
    
    doctor_existente = Doctors.query.filter_by(email=body['email']).first()
    if doctor_existente:
        return jsonify({'msg': 'El correo ya está registrado'}), 400    
    
    new_doctor = Doctors()
    new_doctor.first_name = body['first_name']
    new_doctor.last_name = body['last_name']
    new_doctor.email = body['email']
    new_doctor.speciality = body['speciality']
    new_doctor.phone_number = body.get('phone_number')

    pw_hash = generate_password_hash(body['password'])
    new_doctor.password = pw_hash

    db.session.add(new_doctor)
    db.session.commit()
    return jsonify({'msg': 'Doctor creado exitosamente'}), 201
# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
