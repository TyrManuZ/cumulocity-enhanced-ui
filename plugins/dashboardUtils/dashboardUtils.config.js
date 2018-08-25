/*
Copyright (c) 2018 Tobias Sommer
Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
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

      /* @ngInject */
      action: function (dashboardUtilsService) {
        return dashboardUtilsService.exportDashboard();
      }
    });

    c8yActionsProvider.addUrlAction({
      path: '/:subpath/:deviceId',
      text: 'Import dashboard',
      priority: 900,

      /* @ngInject */
      action: function (dashboardUtilsService) {
        return dashboardUtilsService.popupImportDashboard();
      }
    });
  }
}());
