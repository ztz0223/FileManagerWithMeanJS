/**
 * Created by azuo1228 on 8/28/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Article Schema
 */
var FileSchema = new Schema({
    path: {
        type: String,
        default: '',
        trim: true,
        required: 'Path cannot be blank'
    },
    size: {
        type: Number,
        default: 0
    },
    group: {
        type: String,
        default: ''
    },
    user: {
        type: String,
        default: '',
        trim: true,
        required: 'User cannot be blank'
    },
    number: {
        type: Number,
        default: 0
    },
    rights: {
        type: String,
        default: '',
        trim: true,
        required: 'Rights cannot be blank'
    },
    type: {
        type: String,
        default: 'file',
        trim: true,
        required: 'Type cannot be blank'
    },
    name: {
        type: String,
        trim: true,
        required: 'Name cannot be blank'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('File', FileSchema);
