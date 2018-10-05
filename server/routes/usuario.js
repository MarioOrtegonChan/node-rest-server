const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {
    //res.json('get Usuario LOCAL!!!');

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ status: true }, 'name email password role status google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ status: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        status: body.status,
        google: body.google,
    });

    usuario.save((err, userBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            usuario: userBD
        });
    });

});


app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            usuario: userBD
        });

    });


});

app.delete('/usuario/:id', function(req, res) {
    //res.json('delete Usuario');
    let id = req.params.id;
    let changeStatus = {
        status: false
    };

    //Eliminacion de base de datos
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //Eliminacion logica de base de datos
    Usuario.findByIdAndUpdate(id, changeStatus, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }

            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;