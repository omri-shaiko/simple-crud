'use strict';

angular.module('testApp.auth', [
  'testApp.constants',
  'testApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
