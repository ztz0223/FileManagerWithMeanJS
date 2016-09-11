/**
 * Created by azuo on 2016/8/24.
 */
'use strict';

/**
 * Module dependencies.
 */
var file = require('../controllers/file.server.controller');
var multer1 = require('multer');
var upload = multer1({ dest: 'uploads/' });

module.exports = function (app) {
  app.route('/api/file/list')
    .get(file.list)
    .post(file.list);
  
  app.post('/api/file/upload', upload.any(), file.upload);
  
  app.route('/api/file/rename')
    .get(file.list)
    .post(file.list);
  
  app.route('/api/file/copy')
    .get(file.list)
    .post(file.list);
  
  app.route('/api/file/move')
    .get(file.list)
    .post(file.list);
  
  app.route('/api/file/remove')
    .get(file.list)
    .post(file.list);
  app.route('/api/file/edit')
    .get(file.list)
    .post(file.list);
  app.route('/api/file/getContent')
    .get(file.list)
    .post(file.list);
  
  app.route('/api/file/createFolder')
    .get(file.list)
    .post(file.createFolder);
  app.route('/api/file/download')
    .get(file.download);

  app.route('/api/file/downloadMulti')
    .get(file.list)
    .post(file.list);
  
  app.route('/api/file/compress')
    .get(file.list)
    .post(file.list);
  app.route('/api/file/extract')
    .get(file.list)
    .post(file.list);
  app.route('/api/file/permission')
    .get(file.list)
    .post(file.list);

  app.route('/api/file/projects')
      .get(file.projectGet)
      .post(file.projectPost);

};
