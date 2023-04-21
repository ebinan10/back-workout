const mongoose = require('mongoose');
const Schema = mongoose.Schema

const RefreshToken = new Schema({
    refreshtoken:{
        type: String,
        require: true
    }
},{timestamp: true})

module.exports = mongoose.model('RefreshToken',RefreshToken)
