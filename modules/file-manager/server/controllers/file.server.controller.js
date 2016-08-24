/**
 * Created by azuo on 2016/8/24.
 */
'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');


exports.list = function (req, res) {
  console.log('file list');
  
  var articles = {
    name: 'a',
    rights: '',
    date: '2016-10-10 11:11:11',
    size: 100,
    type: 'dir' //"dir" means folder
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
