const express = require('express');
const Admins = require("../schemas/admins");
const Donors = require("../schemas/donors");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var loginController={};
var erros="Nao existe";


loginController.login = async (req, res) => {
    const {email, password} = req.body;
    const admin = await Admins.findOne({email});
    const donor = await Donors.findOne({email});



    if(admin){
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.render('../views/login/login', { error: 'Incorrect password' });
        }
        const token = jwt.sign({email: admin.email}, 'PAW', {expiresIn: '24h'});
        req.session.user = { email: admin.email, role: 'Admin' };
        res.cookie('token', token);
        res.redirect('/');

    
};
}

loginController.verifyLoginUser = function(req, res, next) {
    const authToken = req.cookies['token']
    if (authToken){
        jwt.verify(authToken,'PAW', function(err, decoded) {
            req.userEmail = decoded
            next()
        })
    } else {
        res.redirect('/login');
    }
}


loginController.logout = function(req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.clearCookie('token');
        res.redirect('/');
    });
};



module.exports=loginController;