/*
Copyright (c) 2018 Tobias Sommer
Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
(function () {
  'use strict';

  angular
    .module('c8y.enhanced.dashboardUtils')
    .component('c8yDashboardImportConfig', {
      templateUrl: ':::PLUGIN_PATH:::/modals/dashboardImportConfig.html',
      bindings: {
        close: '&',
        dismiss: '&',
        resolve: '<'
      },
      controllerAs: 'vm',
      controller: Controller
    });

  /* @ngInject */
  function Controller(
    $q,
    $routeParams,
    $location,
    dashboardUtilsService,
    c8yInventory,
    c8yBinary,
    c8yAlert
  ) {
    const vm = this;

    var processingStatus = {
      inProgress: false,
      progress: 0,
      label: null
    };
    var rootId = $routeParams.groupId === null ? $routeParams.deviceId : $routeParams.groupId;

    var devices = vm.resolve.dashboard.manifest.devices;
    _.forEach(devices, function(device) {
      var widgets = device.widgets.join(', ');
      var datapoints = device.datapoints.join(', ');
      device.help = 'Used in the following widgets: ' + widgets + '; Used for the following datapoints: ' + datapoints;
    });

    var dashboard = vm.resolve.dashboard;

    if ($routeParams.deviceId) {
      getDeviceType().then(function(result) {
        vm.deviceType=result;
      });
    }

    _.assign(vm, {
      devices,
      rootId,
      dashboard,
      processingStatus,
      configureDashboard,
      back
    });

    function getDeviceType() {
      return c8yInventory.detail($routeParams.deviceId).then(function(result) {
        return result.data.type;
      });
    }

    function replaceDeviceIds() {
      if (dashboard.manifest.type != 'deviceType') {
        _.forEach(devices, function(device) {
          dashboard.dashboard = _.replace(dashboard.dashboard, new RegExp("{{" + device.value + "}}", "g"), device.selectedDevice.id);
        });
      }
    }

    function setDashboardType(dashboard) {
      // Now convert JSON string to object
      dashboard.dashboard = angular.fromJson(dashboard.dashboard);
      var fragment;
      if (dashboard.manifest.type == 'group') {
        fragment = 'c8y_Dashboard!group!' + $routeParams.groupId;
        dashboard.dashboard[fragment] = {};
      } else if (dashboard.manifest.type == 'device') {
        fragment = 'c8y_Dashboard!device!' + $routeParams.deviceId;
        dashboard.dashboard[fragment] = {};
      } else if (dashboard.manifest.type == 'deviceType') {
        fragment = 'c8y_Dashboard!type!' + vm.deviceType;
        dashboard.dashboard[fragment] = {};
      }
      return dashboard;
    }

    function createDashboard(dashboard) {
      return c8yInventory.save(dashboard.dashboard);
    }

    function uploadBinaries() {
      var binaryIds = [];
      var binaryPromises = [];
      _.forEach(dashboard.binaries, function(binary) {
        binaryPromises.push(c8yBinary.upload(binary));
      });
      return $q.all(binaryPromises)
        .then(function (results) {
          _.forEach(results, function(result) {
            binaryIds.push(result.data.id);
          });
          dashboard.binaryIds = binaryIds;
          return dashboard;
        });
    }

    function replaceBinaryIds(dashboard) {
      var binaryString;
      _.forEach(dashboard.binaryIds, function(binaryId, index) {
        binaryString = 'binary' + (index + 1);
        dashboard.dashboard = _.replace(dashboard.dashboard, new RegExp("{{" + binaryString + "}}", "g"), binaryId);
      });
      return dashboard;
    }

    function finishImport(result) {
      if ($routeParams.groupId) {
        $location.path('/group/' + $routeParams.groupId + '/dashboard/' + result.data.id);
      } else if ($routeParams.deviceId) {
        $location.path('/device/' + $routeParams.deviceId + '/dashboard/' + result.data.id);
      }
      c8yAlert.success('Dashboard successfully imported.')
      vm.close();
    }

    function configureDashboard() {
      replaceDeviceIds();
      uploadBinaries()
        .then(replaceBinaryIds)
        .then(setDashboardType)
        .then(createDashboard)
        .then(finishImport)
    }

    function back() {
      vm.close();
      return dashboardUtilsService.popupImportDashboard();
    }
  }
}());
