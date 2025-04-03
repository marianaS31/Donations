const mongoose = require('mongoose');
const adminsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: /^[a-zA-Z]+$/
    },
    email: {
        type: String,
        required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password:{
        type:String,
        required:true
    },
    tipo:{
        type:String,
        required:true,
    },
});


module.exports = mongoose.model('admins', adminsSchema);