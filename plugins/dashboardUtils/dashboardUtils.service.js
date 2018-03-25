(function () {
  'use strict';

  angular
    .module('c8y.enhanced.dashboardUtils')
    .factory('dashboardUtilsService', dashboardUtilsService);

  /* @ngInject */
  function dashboardUtilsService(
    $q,
    $routeParams,
    c8yInventory,
    dashboardUtilsConstants
  ) {
    const service = {
      exportDashboard
    };

    return service;

    ////////////
    function cleanseDashboardJson(dashboard) {
      var deferred = $q.defer();
      dashboard = dashboard.data
      _.forEach(dashboardUtilsConstants.DASHBOARD_KEYS_TO_BE_REMOVED, function(key) {
        delete dashboard[key];
      });
      deferred.resolve(dashboard);
      return deferred.promise;
    }

    function generateZip(dashboard) {
      var zip = new JSZip();
      zip.file('dashboard.json', angular.toJson(dashboard, 2));
      zip.generateAsync({type:"blob"}).then(function(blob) {
        saveAs(blob, "dashboard.zip");
      });
    }

    function exportDashboard() {
      var dashboardId = $routeParams.dashboardId;
      c8yInventory.detail(dashboardId)
        .then(cleanseDashboardJson)
        .then(generateZip)
    }
  }
}());
