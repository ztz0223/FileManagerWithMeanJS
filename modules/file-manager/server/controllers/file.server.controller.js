/**
 * Created by azuo on 2016/8/24.
 */
'use strict';

var path = require('path');
var mongoose = require('mongoose');
var fileMgr = mongoose.model('File');

exports.list = function (req, res) {
    console.log('file list');

    // Get post data info, and the data is from data of client request
    var action = req.body.action;
    var path = req.body.path;

    console.log('action is: ' + action);
    console.log('path is: ' + path);

    var articles = {
        result: [
            {
                time: '12:11',
                day: '25',
                month: 'Aug',
                size: '0',
                group: '1331',
                user: 'jonas@guillermopercoco.com.ar',
                number: '2',
                rights: 'drwxr-xr-x',
                type: 'dir',
                name: 'abc',
                date: '2016-08-25 11:13:04'
            },
            {
                time: '10:44',
                day: '25',
                month: 'Aug',
                size: '0',
                group: '1331',
                user: 'jonas@guillermopercoco.com.ar',
                number: '2',
                rights: 'drwxr-xr-x',
                type: 'dir',
                name: 'kkkk',
                date: '2016-08-25 11:13:04'
            },
            {
                time: '10:42',
                day: '25',
                month: 'Aug',
                size: '0',
                group: '1331',
                user: 'jonas@guillermopercoco.com.ar',
                number: '2',
                rights: 'drwxr-xr-x',
                type: 'dir',
                name: 'trest',
                date: '2016-08-25 11:13:04'
            },
            {
                time: '11:54',
                day: '25',
                month: 'Aug',
                size: '2012543',
                group: '1331',
                user: 'jonas@guillermopercoco.com.ar',
                number: '1',
                rights: '-rw-r--r--',
                type: 'file',
                name: '24A.png',
                date: '2016-08-25 11:13:04'
            },
            {
                time: '10:38',
                day: '25',
                month: 'Aug',
                size: '25643',
                group: '1331',
                user: 'jonas@guillermopercoco.com.ar',
                number: '1',
                rights: '-rw-r--r--',
                type: 'file',
                name: 'Registration Step 1.PNG',
                date: '2016-08-25 11:13:04'
            },
            {
                time: '10:37',
                day: '25',
                month: 'Aug',
                size: '24720',
                group: '1331',
                user: 'jonas@guillermopercoco.com.ar',
                number: '1',
                rights: '-rw-r--r--',
                type: 'file',
                name: 'Registration Step 2.PNG',
                date: '2016-08-25 11:13:04'
            },
            {
                time: '12:12',
                day: '25',
                month: 'Aug',
                size: '0',
                group: '1331',
                user: 'jonas@guillermopercoco.com.ar',
                number: '1',
                rights: '-rw-r--r--',
                type: 'file',
                name: 'abc2.zip',
                date: '2016-08-25 11:13:04'
            },
            {
                time: '11:46',
                day: '25',
                month: 'Aug',
                size: '1115',
                group: '1331',
                user: 'jonas@guillermopercoco.com.ar',
                number: '1',
                rights: '-rw-r--r--',
                type: 'file',
                name: 'nb-configuration.xml',
                date: '2016-08-25 11:13:04'
            },
            {
                time: '11:46',
                day: '25',
                month: 'Aug',
                size: '2360',
                group: '1331',
                user: 'jonas@guillermopercoco.com.ar',
                number: '1',
                rights: '-rw-r--r--',
                type: 'file',
                name: 'pom.xml',
                date: '2016-08-25 11:13:04'
            }
        ]
    };

    res.json(articles);

    // Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    //   if (err) {
    //     return res.status(400).send({
    //       //message: errorHandler.getErrorMessage(err)
    //     });
    //   } else {
    //     res.json(articles);
    //   }
    // });
};
