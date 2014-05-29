/*jshint unused: vars */
define(['angular', 'directives/widget']/*deps*/, function (angular, WidgetDirective)/*invoke*/ {
  'use strict';

  return angular.module('<%= scriptAppName %>', ['packageApp.directives.Widget',
/*angJSDeps*/<%= angularModules %>])<% if (ngRoute) { %>
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    })<% } %>;
});