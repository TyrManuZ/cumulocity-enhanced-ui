/*
Copyright (c) 2018 Tobias Sommer
Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
(function () {
  'use strict';

  angular
    .module('c8y.enhanced.tenantOptions')
    .component('c8yTenantOptionDetail', {
      templateUrl: ':::PLUGIN_PATH:::/tenantOptionDetail.html',
      bindings: {
        option: '<',
        create: '<'
      },
      controllerAs: 'vm',
      controller: Controller
    });

  /* @ngInject */
  function Controller() {
  }
}());
