(function () {
  'use strict';

  angular
    .module('c8y.enhanced.tenantOptions')
    .component('c8yTenantOptionUpdate', {
      templateUrl: ':::PLUGIN_PATH:::/modals/updateTenantOption.html',
      bindings: {
        close: '&',
        dismiss: '&',
        resolve: '<'
      },
      controllerAs: 'vm',
      controller: Controller
    });

  /* @ngInject */
  function Controller() {
    const vm = this;

    vm.option = vm.resolve.option;
    vm.isCreate = false;
  }
}());
