const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validateRole = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']


    },
    password: {
        type: String,
        required: [true, 'La contrasenia es necesaria']
    },

    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validateRole
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false

    }

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);