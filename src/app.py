"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Pets, Users, Doctors
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

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
def create_pet():
    body = request.get_json(silent=True) or {}

    owner_id = body.get("owner_id")
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

 
# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
