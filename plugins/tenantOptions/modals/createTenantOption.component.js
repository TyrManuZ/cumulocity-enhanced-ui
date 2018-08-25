/*
Copyright (c) 2018 Tobias Sommer
Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
(function () {
  'use strict';

  angular
    .module('c8y.enhanced.tenantOptions')
    .component('c8yTenantOptionCreate', {
      templateUrl: ':::PLUGIN_PATH:::/modals/createTenantOption.html',
      bindings: {
        close: '&',
        dismiss: '&'
      },
      controllerAs: 'vm',
      controller: Controller
    });

  /* @ngInject */
  function Controller() {
    const vm = this;

    vm.option = {};
    vm.isCreate = true;
  }
}());
