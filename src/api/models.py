from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
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
            "pets": self.pets
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
    allergies: Mapped[str] = mapped_column(
        String(255), nullable=True)

    neutered: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=False)

    info: Mapped[str] = mapped_column(String(500), nullable=True)
    image: Mapped[str] = mapped_column(String(500), nullable=True)
    vaccines:Mapped[list['Vaccines']] = relationship(back_populates='pet')

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
            "allergies": self.allergies,
            "neutered": self.neutered,
            "info": self.info,
            "image": self.image,
            "vaccines": self.vaccines
        }

# //----- Creado por Carlos -----//


class Doctors(db.Model):
    __tablename__ = 'doctors'
    doctor_id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    speciality: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=True)
    password: Mapped[str] = mapped_column(String(80), nullable=False)

    def serialize(self):
        return {
            "id": self.doctor_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "speciality": self.speciality,
            "email": self.email,
            "phone_number": self.phone_number
        }


class Vaccines(db.Model):
    __tablename__ = 'vaccines'
    vaccine_id: Mapped[int] = mapped_column(primary_key=True)
    vaccine_name: Mapped[str] = mapped_column(String(20), nullable=False)
    pet_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('pets.pet_id'), nullable=False)
    pet: Mapped['Pets']= relationship(back_populates='vaccines')
    vaccination_date: Mapped[str] = mapped_column(String(20), nullable=False)
    expiry_date: Mapped[str] = mapped_column(String(20), nullable=False)

    def __repr__(self):
        return f'{self.vaccine_name}'
    
    def serialize(self):
        return {
            "vaccine_id": self.vaccine_id,
            "vaccine_name": self.vaccine_name,
            "pet": self.pet,
            "vaccination_date": self.vaccination_date,
            "expiry_date": self.expiry_date
        }
