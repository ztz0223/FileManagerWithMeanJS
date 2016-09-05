/**
 * Created by azuo on 2016/8/24.
 */
'use strict';

var path = require('path');
var mongoose = require('mongoose');
var fileMgr = mongoose.model('File');
var dateFormat = require('dateformat');
var fs = require('fs');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var saveFilePath = './uploads/';

var createFile = function (date) {

    var dayStr = dateFormat(date, 'dd');
    var timeStr = dateFormat(date, 'HH:MM');
    var monStr = dateFormat(date, 'mmm');
    var dateStr = dateFormat(date, 'yyyy-mm-dd HH:MM:ss');

    return {
        time: timeStr,
        day: dayStr,
        month: monStr,
        size: '0',
        group: '',
        user: '',
        number: '0',
        rights: 'drwxr-xr-x',
        type: 'dir',
        name: '',
        date: dateStr
    };
};

exports.list = function (req, res) {
    console.log('file list');

    // Get post data info, and the data is from data of client request
    var action = req.body.action;
    var pathBase = req.body.path;
    var username = req.body.user;

    console.log('action is: ' + action);
    console.log('path is: ' + path);

    var filesSent = {
        result: [
            // {
            //     time: '12:11',
            //     day: '25',
            //     month: 'Aug',
            //     size: '0',
            //     group: '1331',
            //     user: 'jonas@guillermopercoco.com.ar',
            //     number: '2',
            //     rights: 'drwxr-xr-x',
            //     type: 'dir',
            //     name: 'abc',
            //     date: '2016-08-25 11:13:04'
            // },
            // {
            //     time: '11:54',
            //     day: '25',
            //     month: 'Aug',
            //     size: '2012543',
            //     group: '1331',
            //     user: 'jonas@guillermopercoco.com.ar',
            //     number: '1',
            //     rights: '-rw-r--r--',
            //     type: 'file',
            //     name: '24A.png',
            //     date: '2016-08-25 11:13:04'
            // }
        ]
    };

    fileMgr.find({ user: username, path: pathBase }, function (err, files) {
        if(err === null) {
            files.forEach(function (file) {
                var newFile = createFile(file.date);

                newFile.size = file.size;
                newFile.user = file.user;
                newFile.rights = file.rights;
                newFile.type = file.type;
                newFile.name = file.name;

                filesSent.result.push(newFile);
            });
        }

        // the db find is an async opr, so get all, and then send response to client.
        res.json(filesSent);
    });

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

exports.createFolder = function (req, res) {
    var file = new fileMgr();

    var fullPath = req.body.newPath;

    console.log(fullPath + ' is the fullpath!');

    file.path = path.dirname(fullPath);
    file.group = '';
    file.size = 0;
    file.user = req.body.user;
    file.number = 0;
    file.rights = 'drwxr-xr-x';
    file.type = 'dir';
    file.name = path.basename(fullPath);
    file.date = Date.now();

    file.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(file);
        }
    });
};

exports.upload = function (req, res) {
    console.log('file upload');

    console.log(req.file); // Will be null
    console.log(req.files); // All of the file list will be here, after the multer midware translation
    console.log(req.body);  // Will be the client's data sent

    /*
    *
    * Files section info:
     * { fieldname: 'file-0',
     originalname: 'aa.csv',
     encoding: '7bit',
     mimetype: 'application/vnd.ms-excel',
     destination: './uploads/',
     filename: '32c62820307b8d83cc59779b9d30aeeb',
     path: 'uploads\\32c62820307b8d83cc59779b9d30aeeb',
     size: 808 },
    * */

    var user = req.body.user || 'None';
    var fullPath = req.body.destination;
    console.log(fullPath + ' is the fullpath!');

    if(req.files.length < 1) {
        return res.json({ status: 'OK' });
    }

    var savePath = path.join(saveFilePath, user, fullPath);

    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }

    req.files.forEach(function (file) {
        console.log('Original file: ' + file.destination + file.filename);
        console.log('Dest file: ' + path.join(savePath, file.originalname));
        fs.rename(file.destination + file.filename, path.join(savePath, file.originalname), function (err) {
            if(err) {
                console.log(err);
            }
            else {
                var newfile = new fileMgr();
                newfile.path = path.dirname(fullPath);
                newfile.group = '';
                newfile.size = file.size;
                newfile.user = user;
                newfile.number = 0;
                newfile.rights = '-rwxr-xr-x';
                newfile.type = 'file';
                newfile.name = file.originalname;
                newfile.date = Date.now();

                newfile.save(function (err) {
                    if(err) {
                        console.log('Mongo save err:' + err);
                        res.status(400).send({
                            result: {
                                error: errorHandler.getErrorMessage(err)
                            }
                        });
                    }
                    else {
                        console.log('File with user: ' + user + ', name: ' + file.name + ' saved!');
                    }
                });
            }
        });
    });

    res.json({ status: 'OK' });
};

exports.download = function (req, res) {
    console.log('file download');

    var username = req.query.user;
    var fullPath = req.query.fullPath;

    var pathBase = path.dirname(fullPath);
    var filename = path.basename(fullPath);

    fileMgr.find({ user: username, path: pathBase, name: filename }, function (err) {
        if(err) {
            return res.status(400).send({
                result: {
                    error: errorHandler.getErrorMessage(err)
                }
            });
        }
        else {
            var rootPath = path.join(saveFilePath, username, fullPath);
            res.download(rootPath);
        }
    });
};
