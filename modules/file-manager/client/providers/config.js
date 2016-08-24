(function (angular) {
  'use strict';
  angular.module('FileManagerApp').provider('fileManagerConfig', function () {
    
    var values = {
      fileManagerName: 'File Manager V0.1',
      defaultLang: 'en',
      
      listUrl: '/api/file/list',
      uploadUrl: '/api/file/upload',
      renameUrl: '/api/file/rename',
      copyUrl: '/api/file/copy',
      moveUrl: '/api/file/move',
      removeUrl: '/api/file/remove',
      editUrl: '/api/file/edit',
      getContentUrl: '/api/file/getContent',
      createFolderUrl: '/api/file/createFolder',
      downloadFileUrl: '/api/file/download',
      downloadMultipleUrl: '/api/file/downloadMulti',
      compressUrl: '/api/file/compress',
      extractUrl: '/api/file/extract',
      permissionsUrl: '/api/file/permission',
      
      searchForm: true,
      sidebar: true,
      breadcrumb: true,
      allowedActions: {
        upload: true,
        rename: true,
        move: true,
        copy: true,
        edit: true,
        changePermissions: true,
        compress: true,
        compressChooseName: true,
        extract: true,
        download: true,
        downloadMultiple: true,
        preview: true,
        remove: true,
        createFolder: true,
        pickFiles: false,
        pickFolders: false
      },
      
      multipleDownloadFileName: 'angular-filemanager.zip',
      showExtensionIcons: true,
      showSizeForDirectories: false,
      useBinarySizePrefixes: false,
      downloadFilesByAjax: true,
      previewImagesInModal: true,
      enablePermissionsRecursive: true,
      compressAsync: false,
      extractAsync: false,
      pickCallback: null,
      
      isEditableFilePattern: /\.(txt|diff?|patch|svg|asc|cnf|cfg|conf|html?|.html|cfm|cgi|aspx?|ini|pl|py|md|css|cs|js|jsp|log|htaccess|htpasswd|gitignore|gitattributes|env|json|atom|eml|rss|markdown|sql|xml|xslt?|sh|rb|as|bat|cmd|cob|for|ftn|frm|frx|inc|lisp|scm|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|tmpl|lock|go|yml|yaml|tsv|lst)$/i,
      isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
      isExtractableFilePattern: /\.(gz|tar|rar|g?zip)$/i,
      tplPath: 'modules/file-manager/client/templates'
    };
    
    return {
      $get: function () {
        return values;
      },
      set: function (constants) {
        angular.extend(values, constants);
      }
    };
    
  });
})(angular);
