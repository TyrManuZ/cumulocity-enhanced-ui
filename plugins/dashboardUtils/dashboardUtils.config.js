(function () {
  'use strict';

  angular
    .module('c8y.enhanced.dashboardUtils')
    .config(configure);

  /* @ngInject */
  function configure(
    c8yActionsProvider
  ) {

    c8yActionsProvider.addUrlAction({
      path: '/:subpath/:deviceId/dashboard/:dashboardId',
      text: 'Export dashboard',
      priority: 1000,
      action: function (dashboardUtilsService) {
        return dashboardUtilsService.exportDashboard();
      }
    });
  }
}());
