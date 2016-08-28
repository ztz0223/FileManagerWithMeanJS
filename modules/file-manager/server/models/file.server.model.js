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
        required: 'Title cannot be blank'
    },
    size: {
        type: Number,
        default: 0
    },
    group: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    user: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    number: {
        type: Number,
        default: 0
    },
    rights: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    type: {
        type: String,
        default: 'file',
        trim: true,
        required: 'Title cannot be blank'
    },
    name: {
        type: String,
        trim: true,
        required: 'Title cannot be blank'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('File', FileSchema);
