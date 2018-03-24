(function () {
  'use strict';

  angular
    .module('c8y.enhanced.tenantOptions')
    .config(configure);

  /* @ngInject */
  function configure(
    c8yNavigatorProvider,
    c8yViewsProvider
  ) {
    c8yNavigatorProvider.addNavigation({
      name: 'Tenant options',
      icon: 'th-list',
      parent: 'Settings',
      path: 'tenant-options'
    });

    c8yViewsProvider.when('/tenant-options', {
      template: '<c8y-tenant-options />'
    });
  }
}());
