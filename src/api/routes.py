"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Doctors
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/doctors', methods=['POST'])
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