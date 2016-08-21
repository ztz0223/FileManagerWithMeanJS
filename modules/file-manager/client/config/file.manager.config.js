/**
 * Created by azuo on 2016/8/21.
 */

'use strict';

// Configuring the File module
angular.module('FileManagerApp').run(['Menus',
  function (Menus) {
    // Add the file dropdown item
    Menus.addMenuItem('topbar', {
      title: 'File',
      state: 'file',
      type: 'dropdown',
      roles: ['*']
    });
    
    Menus.addSubMenuItem('topbar', 'File', {
      title: 'List File',
      state: 'file.list'
    });
  }
]);
