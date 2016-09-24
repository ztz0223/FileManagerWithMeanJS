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
var uuid = require('node-uuid');
var sleep = require('sleep');
var _ = require('lodash');

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

var createBucket = function (date) {

    var dateStr = dateFormat(date, 'yyyy-mm-dd HH:MM:ss');

    return {
        id: 'NULL',
        user: '',  //Owner
        number: '0',
        rights: 'drwxr-xr-x',
        type: 'dir',
        name: '',  //bucket key
        date: dateStr //date
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
        if (err === null) {
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
        if (err) {
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

    if (req.files.length !== 1) {
        res.status(400).send({
            result: {
                error: 'No file specified!'
            }
        });
    }

    var savePath = path.join(saveFilePath, user, fullPath);

    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }

    var handleFile = function (file) {
        var errRtn;

        console.log('Original file: ' + file.destination + file.filename);
        console.log('Dest file: ' + path.join(savePath, file.originalname));

        fs.rename(file.destination + file.filename, path.join(savePath, file.originalname), function (err) {
            if (err) {
                console.log(err);
                errRtn = err;
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
                    if (err) {
                        console.log('Mongo save err:' + err);
                        errRtn = err;
                    }
                    else {
                        console.log('File with user: ' + user + ', name: ' + file.name + ' saved!');
                    }
                });
            }
        });

        return errRtn;
    };

    var errRtn = handleFile(req.files[0]);
    if (errRtn) {
        res.status(400).send({
            result: {
                error: errRtn
            }
        });
    }
    else {
        res.json({ status: 'OK' });
    }
};

exports.download = function (req, res) {
    console.log('file download');

    var username = req.query.user;
    var fullPath = req.query.fullPath;

    var pathBase = path.dirname(fullPath);
    var filename = path.basename(fullPath);

    fileMgr.find({ user: username, path: pathBase, name: filename }, function (err) {
        if (err) {
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

exports.projectGet = function (req, res) {
    console.log('Package list');

    // Get post data info, and the data is from data of client request
    var pathBase = '/';
    var username = req.body.user;
    var typeSch = 'pkg';

    console.log('path is: ' + path);

    var filesSent = {
        items: []
    };

    fileMgr.find({ path: pathBase, type: typeSch }, function (err, files) {
        if (err === null) {
            files.forEach(function (file) {
                var newFile = createFile(file.date);

                newFile.size = file.size;
                newFile.user = file.user;
                newFile.rights = file.rights;
                newFile.type = 'Package';
                newFile.name = file.name;
                newFile.id = file.id;

                filesSent.items.push(newFile);
            });
        }

        // the db find is an async opr, so get all, and then send response to client.
        res.json(filesSent);
    });
};

exports.projectPost = function (req, res) {
    console.log('Package create');

    var file = new fileMgr();
    var fullPath = '/';
    console.log(fullPath + ' is the fullpath!');

    file.path = path.dirname(fullPath);
    file.group = '';
    file.size = 0;
    file.user = req.body.owner || 'None';
    file.number = 0;
    file.rights = 'drwxr-xr-x';
    file.type = 'pkg';
    file.name = req.body.bucketKey;
    file.id = req.body.id;
    file.date = Date.now();

    fileMgr.find({ path: file.path, type: file.type, name: file.name }, function (err, files) {
        if (err === null && files.length !== 0) {
            return res.status(400).send({
                err: 'The package ' + file.name + ' already exists!'
            });
        }

        // No duplicate
        file.save(function (err) {
            if (err) {
                return res.status(400).send({
                    err: errorHandler.getErrorMessage(err)
                });
            }
            else {
                res.json(file);
            }
        });
    });
};

exports.projectDelete = function (req, res) {
    console.log('Package delete');

    var file = new fileMgr();
    var delProjectId = req.params.projectId;

    var idList = [delProjectId];

    fileMgr.find({ projectId: delProjectId}, function (err, files) {
        if (err === null) {
            files.forEach(function (file) {
                idList.push(file.id);
            });
        }

        fileMgr.remove({ 'id': { '$in': idList } }, function (err) {
            if (err) {
                res.json({ err: 'The package ' + delProjectId + ' delete failed!' });
            }
            else {
                res.json({ projectId: delProjectId });
            }
        });
    });
};

exports.projectFolderGet = function (req, res) {
    console.log('Package folder get');

    var projectId = req.params.projectId;
    var parentFolderId = req.params.folderId;

    var filesSent = {
        entryList: []
    };

    fileMgr.find({ projectId: projectId, folderId: parentFolderId }, function (err, files) {
        if (err === null) {
            files.forEach(function (file) {
                var newFile = createFile(file.date);

                newFile.size = file.size;
                newFile.user = file.user;
                newFile.rights = file.rights;
                newFile.type = file.type;
                newFile.name = file.name;
                newFile.id = file.id;
                newFile.projectId = file.projectId;
                newFile.entryId = file.folderId;

                filesSent.entryList.push(newFile);
            });
        }

        // the db find is an async opr, so get all, and then send response to client.
        res.json(filesSent);
    });
};

exports.projectFolderCreate = function (req, res) {
    console.log('Package folder create');

    var projectId = req.params.projectId;
    var parentFolderId = req.params.parentId;
    var folderName = req.params.folderName;
    var folderId = uuid.v4();

    var file = new fileMgr();
    var fullPath = '/';
    console.log(fullPath + ' is the fullpath!');

    file.path = path.dirname(fullPath);
    file.group = '';
    file.size = 0;
    file.user = req.body.owner || 'None';
    file.number = 0;
    file.rights = 'drwxr-xr-x';
    file.type = 'dir';
    file.name = folderName;
    file.id = folderId;
    file.projectId = projectId;
    file.folderId = parentFolderId;
    file.date = Date.now();

    fileMgr.find({ projectId: file.projectId, folderId: file.folderId, id: file.id }, function (err, files) {
        if (err === null && files.length !== 0) {
            return res.status(400).send({
                err: 'The folder under project already exists!'
            });
        }

        // No duplicate
        file.save(function (err) {
            if (err) {
                return res.status(400).send({
                    err: errorHandler.getErrorMessage(err)
                });
            }
            else {
                res.json({ folderId: file.id });
            }
        });
    });
};

exports.projectFolderDelete = function (req, res) {
    console.log('Package folder delete');

    var file = new fileMgr();
    var delProjectId = req.params.projectId;
    var delFolderId = req.params.folderId;

    // To delete the files/folders under the folder, but just direct children, not delete the files under child folder
    fileMgr.remove({ projectId: delProjectId, id: delFolderId }, function (err) {
        if (err) {
            res.json({err: 'The package ' + delProjectId + ' delete failed!'});
        }
        else {
            res.json({ projectId: delProjectId, id: delFolderId});
        }
    });
};

exports.projectFolderFileUpload = function (req, res) {
    console.log('Package folder file upload');

    console.log(req.file); // Will be null
    console.log(req.files); // All of the file list will be here, after the multer midware translation
    console.log(req.body);  // Will be the client's data sent

    var projectId = req.params.projectId;
    var folderId = req.params.parentId;

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
    if (req.files.length !== 1) {
        res.status(400).send({
            result: {
                error: 'No file specified!'
            }
        });
    }

    var savePath = path.join(saveFilePath, user);
    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }

    var handleFile = function (file) {
        var errRtn;
        var fileId;

        console.log('Original file: ' + file.destination + file.filename);
        console.log('Dest file: ' + path.join(savePath, file.originalname));

        fs.rename(file.destination + file.filename, path.join(savePath, file.originalname), function (err) {
            if (err) {
                console.log(err);
                errRtn = err;
            }
            else {
                var newfile = new fileMgr();
                newfile.path = '/';
                newfile.group = '';
                newfile.size = file.size;
                newfile.user = user;
                newfile.number = 0;
                newfile.rights = '-rwxr-xr-x';
                newfile.type = 'file';
                newfile.name = file.originalname;
                newfile.date = Date.now();
                newfile.id = uuid.v4();
                newfile.projectId = projectId;
                newfile.folderId = folderId;

                fileId = newfile.id;

                newfile.save(function (err) {
                    if (err) {
                        console.log('Mongo save err:' + err);
                        errRtn = err;
                    }
                    else {
                        console.log('File with user: ' + user + ', name: ' + file.name + ' saved!');
                    }
                });
            }
        });

        return { err: errRtn, fileId: fileId, fileName: req.files[0].originalname };
    };

    var errRtn;
    var rtnObj;
    req.files.forEach(function (file) {
        var rtnObj = handleFile(file);
        if(rtnObj.err) {
            errRtn = rtnObj.err;
        }
    });

    // sleep 3s to send the response, to check the client progress bar status
    sleep.sleep(1);
    if (errRtn) {
        res.status(400).send({
            result: {
                error: errRtn
            }
        });
    }
    else {
        res.json({ status: 'OK', id: rtnObj.id });
    }
};

exports.projectFileUpload = function (req, res) {
    console.log('Package file upload');

    console.log(req.file); // Will be null
    console.log(req.files); // All of the file list will be here, after the multer midware translation
    console.log(req.body);  // Will be the client's data sent

    var projectId = req.params.projectId;
    var fileId = req.params.fileId;

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
    if (req.files.length !== 1) {
        res.status(400).send({
            result: {
                error: 'No file specified!'
            }
        });
    }

    var savePath = path.join(saveFilePath, user);
    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }

    var handleFile = function (file) {
        var errRtn;

        console.log('Original file: ' + file.destination + file.filename);
        console.log('Dest file: ' + path.join(savePath, file.originalname));

        fs.rename(file.destination + file.filename, path.join(savePath, file.originalname), function (err) {
            if (err) {
                console.log(err);
                errRtn = err;
            }
            else {
                var newfile = new fileMgr();
                newfile.path = '/';
                newfile.group = '';
                newfile.size = file.size;
                newfile.user = user;
                newfile.number = 0;
                newfile.rights = '-rwxr-xr-x';
                newfile.type = 'file';
                newfile.name = file.originalname;
                newfile.date = Date.now();
                newfile.id = fileId;
                newfile.projectId = projectId;
                newfile.folderId = projectId;

                newfile.save(function (err) {
                    if (err) {
                        console.log('Mongo save err:' + err);
                        errRtn = err;
                    }
                    else {
                        console.log('File with user: ' + user + ', name: ' + file.name + ' saved!');
                    }
                });
            }
        });

        return errRtn;
    };

    var errRtn;
    req.files.forEach(function (file) {
        var rtn = handleFile(file);
        if(rtn) {
            errRtn = rtn;
        }
    });

    // sleep 3s to send the response, to check the client progress bar status
    sleep.sleep(1);
    if (errRtn) {
        res.status(400).send({
            result: {
                error: errRtn
            }
        });
    }
    else {
        res.json({ status: 'OK', fileId: fileId, fileName: req.files[0].originalname });
    }

};

exports.projectFileDelete = function (req, res) {
    console.log('Package file delete');

    var file = new fileMgr();
    var delProjectId = req.params.projectId;
    var delFileId = req.params.fileId;

    // To delete the files/folders under the folder, but just direct children, not delete the files under child folder
    fileMgr.remove({ projectId: delProjectId, id: delFileId }, function (err) {
        if (err) {
            res.json({err: 'The package ' + delProjectId + ' delete failed!'});
        }
        else {
            res.json({ projectId: delProjectId, id: delFileId});
        }
    });
};

exports.projectFileDownload = function (req, res) {
    console.log('Package file download');

    var downloadProjectId = req.params.projectId;
    var downloadFileId = req.params.fileId;

    var user = req.body.user || 'None';
    var savePath = path.join(saveFilePath, user);
    if (!fs.existsSync(savePath)) {
        return res.status(400).send({
                err: 'File not found!'
        });
    }

    fileMgr.find({ projectId: downloadProjectId, id: downloadFileId }, function (err, file) {
        if (err) {
            return res.status(400).send({
                    error: errorHandler.getErrorMessage(err)
            });
        }
        else {
            var filePath = path.join(savePath, file[0].name);
            console.log('Download file: ' + filePath);
            res.download(filePath);
        }
    });
};


var tokenCount = 1;
exports.tokenPost = function (req, res) {
    console.log('Token get');

    tokenCount += 1;
    sleep.sleep(1);

    var token = {
        token_type: 'Bearer',
        expires_in: '1900',
        access_token: '6adb615a-3b9c-4e0b-8004-f2af7199642e',
        value: tokenCount
    };
    res.json(token);
};

var convertList = [];
exports.convertStatusGet = function (req, res) {
    console.log('Convert status get');

    var projectId = req.params.projectId;
    var fileId = req.params.fileId;

    var item = {
        pId: projectId,
        fId: fileId,
        count: 1
    };

    var index = _.findIndex(convertList, function (listItem) {
        return item.pId == listItem.pId && item.fId == listItem.fId;
    });

    if(index === -1) {
        convertList.push(item);
        res.json({ status: 'Working' });
    }
    else {
        if(convertList[index].count >= 3) {
            res.json({ status: 'Finished' });
        }
        else {
            convertList[index].count++;
            res.json({ status: 'Working' });
        }
    }
};
