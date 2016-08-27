/**
 * Created by azuo on 2016/8/21.
 */

'use strict';

// Setting up route
angular.module('FileManagerApp').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('file', {
        abstract: true,
        url: '/file',
        template: '<ui-view/>'
      })
      .state('file.list', {
        url: '',
        templateUrl: 'modules/file-manager/client/templates/main.html',
        data: {
          roles: ['user', 'admin']
        }
      });
    // .state('articles.create', {
    //     url: '/create',
    //     templateUrl: 'modules/articles/client/views/create-article.client.view.html',
    //     data: {
    //         roles: ['user', 'admin']
    //     }
    // })
    // .state('articles.view', {
    //     url: '/:articleId',
    //     templateUrl: 'modules/articles/client/views/view-article.client.view.html'
    // })
    // .state('articles.edit', {
    //     url: '/:articleId/edit',
    //     templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
    //     data: {
    //         roles: ['user', 'admin']
    //     }
    // });
  }
]);
