(function () {
  'use strict';

  angular
    .module('c8y.enhanced.tenantOptions')
    .component('c8yTenantOptions', {
      templateUrl: ':::PLUGIN_PATH:::/tenantOptions.html',
      bindings: {
        text: '@'
      },
      controllerAs: 'vm',
      controller: Controller
    });

  /* @ngInject */
  function Controller(
    c8ySettings,
    c8yModal,
    c8yAlert
  ) {
    const vm = this;

    _.assign(vm, {
      $onInit,
      refresh,
      popupDeleteTenantOption,
      popupAddTenantOption,
      popupUpdateTenantOption
    });

    ////////////

    function $onInit() {
      refresh();
    }

    function refresh() {
      c8ySettings.list({
        pageSize: 2000
      }).then(updateTenantOptions);
    }

    function updateTenantOptions(tenantOptions) {
      vm.options = tenantOptions;
    }

    function removeTenantOption(option) {
      return c8ySettings.deleteOption(option);
    }

    function popupDeleteTenantOption(option) {
      return c8yModal({
        title: 'Delete tenant option',
        body: 'Are you sure you want to delete this tenant option?',
        status: 'danger'
      })
        .then(() => removeTenantOption(option))
        .then(() => refresh())
        .then(() => c8yAlert.success('Tenant option deleted'));
    }

    function popupAddTenantOption() {
      return c8yModal({
          component: 'c8yTenantOptionCreate'
         })
        .then(addTenantOption)
        .then(() => refresh())
        .then(() => c8yAlert.success('Tenant option successfully created.'));
    }

    function addTenantOption(option) {
      return c8ySettings.createOption(option);
    }

    function popupUpdateTenantOption(option) {
      return c8yModal({
          component: 'c8yTenantOptionUpdate',
          resolve: {
            option: function() {
              return option;
            }
          } 
        })
        .then(updateTenantOption)
        .then(() => refresh())
        .then(() => c8yAlert.success('Tenant option successfully updated.'));
    }

    function updateTenantOption(option) {
      return c8ySettings.updateOption(option);
    }
  }
}());
