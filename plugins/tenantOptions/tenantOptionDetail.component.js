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
