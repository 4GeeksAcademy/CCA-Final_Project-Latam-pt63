import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, Date, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = 'users'
    user_id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(25), nullable=False)
    last_name: Mapped[str] = mapped_column(String(25), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phonenumber: Mapped[str] = mapped_column(String(20), nullable=False)
    address: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(nullable=False)
    pets: Mapped[list['Pets']] = relationship(back_populates='owner')
    password_resets: Mapped[list['PasswordReset']] = relationship(
        back_populates='user')

    def __repr__(self):
        return f'{self.first_name}'

    def serialize(self):
        return {
            "user_id": self.user_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phonenumber": self.phonenumber,
            "address": self.address,
            "password": self.password,
            # do not serialize the password, its a security breach
        }

# //----- Creado  por Chris -----//


class Pets(db.Model):
    __tablename__ = "pets"

    pet_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    owner_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.user_id"), nullable=False)
    owner: Mapped['Users'] = relationship(back_populates='pets')

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    pet_type: Mapped[str] = mapped_column(String(30), nullable=False)
    birthdate: Mapped[str] = mapped_column(String(50), nullable=True)
    breed: Mapped[str] = mapped_column(String(120), nullable=True)
    sex: Mapped[str] = mapped_column(String(20), nullable=True)
    weight: Mapped[float] = mapped_column(Float, nullable=True)
    
    allergies: Mapped[str] = mapped_column(
        String(255), nullable=True)

    neutered: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=False)

    info: Mapped[str] = mapped_column(String(500), nullable=True)
    image: Mapped[str] = mapped_column(String(500), nullable=True)
    vaccines: Mapped[list['Vaccines']] = relationship(back_populates='pet')
    appointments: Mapped[list['Appointments']
                         ] = relationship(back_populates='pet')

    def __repr__(self):
        return f'{self.name}'

    def serialize(self):
        return {
            "pet_id": self.pet_id,
            "owner_id": self.owner_id,
            "name": self.name,
            "pet_type": self.pet_type,
            "birthdate": self.birthdate,
            "breed": self.breed,
            "sex": self.sex,           
            "weight": self.weight,     
            "allergies": self.allergies,
            "neutered": self.neutered,
            "info": self.info,
            "image": self.image,
            "owner_name": f"{self.owner.first_name} {self.owner.last_name}" if self.owner else None
        }

# //----- Creado por Carlos -----//


class Doctors(db.Model):
    __tablename__ = 'doctors'
    doctor_id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    specialty: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phonenumber: Mapped[str] = mapped_column(String(20), nullable=True)
    password: Mapped[str] = mapped_column(String(250), nullable=False)
    appointments: Mapped[list['Appointments']
                         ] = relationship(back_populates='doctor')

    def __repr__(self):
        return f'{self.first_name} {self.last_name}'

    def serialize(self):
        return {
            "id": self.doctor_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "specialty": self.specialty,
            "email": self.email,
            "phone_number": self.phonenumber
        }


class Vaccines(db.Model):
    __tablename__ = 'vaccines'
    vaccine_id: Mapped[int] = mapped_column(primary_key=True)
    vaccine_name: Mapped[str] = mapped_column(String(20), nullable=False)
    pet_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('pets.pet_id'), nullable=False)
    pet: Mapped['Pets'] = relationship(back_populates='vaccines')
    vaccination_date: Mapped[str] = mapped_column(String(20), nullable=False)
    expiry_date: Mapped[str] = mapped_column(String(20), nullable=False)

    def __repr__(self):
        return f'{self.vaccine_name}'

    def serialize(self):
        return {
            "vaccine_id": self.vaccine_id,
            "vaccine_name": self.vaccine_name,
            "pet_id": self.pet_id,
            "vaccination_date": self.vaccination_date,
            "expiry_date": self.expiry_date
        }


class Appointments(db.Model):
    __tablename__ = 'appointments'
    appointment_id: Mapped[int] = mapped_column(primary_key=True)
    doctor_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('doctors.doctor_id'), nullable=False)
    pet_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('pets.pet_id'), nullable=False)
    date: Mapped[str] = mapped_column(String(50), nullable=False)
    time: Mapped[str] = mapped_column(String(50), nullable=False)
    motive: Mapped[str] = mapped_column(String(250), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=True)
    anamnesis: Mapped[str] = mapped_column(String(500), nullable=True)
    procedures: Mapped[str] = mapped_column(String(500), nullable=True)
    medication: Mapped[str] = mapped_column(String(500), nullable=True)
    observations: Mapped[str] = mapped_column(String(500), nullable=True)
    doctor: Mapped['Doctors'] = relationship(back_populates='appointments')
    pet: Mapped['Pets'] = relationship(back_populates='appointments')

    def serialize(self):
        owner_data = None
        if self.pet and self.pet.owner:
            owner_data = {
                "first_name": self.pet.owner.first_name,
                "last_name": self.pet.owner.last_name,
                "phonenumber": self.pet.owner.phonenumber,
                "email": self.pet.owner.email,
                "address": self.pet.owner.address
            }

        pet_data = None
        if self.pet:
            pet_data = {
                "name": self.pet.name,
                "breed": self.pet.breed,
                "pet_type": self.pet.pet_type,
                "allergies": self.pet.allergies,
                "birthdate": self.pet.birthdate,
                "sex": self.pet.sex,        
                "weight": self.pet.weight  
            }

        return {
            "appointment_id": self.appointment_id,
            "doctor_id": self.doctor_id,
            "pet_id": self.pet_id,
            "date": self.date,
            "time": self.time,
            "motive": self.motive,
            "status": self.status,
            "anamnesis": self.anamnesis,
            "procedures": self.procedures,
            "medication": self.medication,
            "observations": self.observations,
            "doctor_name": f"{self.doctor.first_name} {self.doctor.last_name}" if self.doctor else "No asignado",
            "pet_data": pet_data,    
            "owner_data": owner_data 
        }


class PasswordReset(db.Model):
    __tablename__ = 'password_reset'
    reset_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey(Users.user_id), nullable=False)
    user: Mapped['Users'] = relationship(back_populates='password_resets')
    uuid: Mapped[str] = mapped_column(String(36), nullable=False)
    time: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    def serialize(self):
        return {
            'reset_id': self.reset_id,
            'uuid': self.uuid,
            'time': self.time
        }