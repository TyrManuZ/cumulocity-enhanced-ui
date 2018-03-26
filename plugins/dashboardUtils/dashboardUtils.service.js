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
    c8yBinary,
    dashboardUtilsConstants
  ) {
    const service = {
      exportDashboard
    };

    const CONSTANTS = dashboardUtilsConstants;

    return service;

    ////////////
    function cleanseDashboardJson(dashboard) {
      dashboard = dashboard.data
      _.forEach(CONSTANTS.DASHBOARD_KEYS_TO_BE_REMOVED, function(key) {
        delete dashboard[key];
      });
      return {
        data: dashboard
      };
    }

    function getDeviceReferenceAndAddToManifest(manifestDevices, currentDeviceId) {
      var deviceReference;
      if (manifestDevices[currentDeviceId]) {
        deviceReference = manifestDevices[currentDeviceId].value
      } else {
        deviceReference = 'device' + (Object.keys(manifestDevices).length + 1);
        manifestDevices[currentDeviceId] = {
          value: deviceReference,
          widgets: [],
          datapoints: []
        }
      }
      return deviceReference;
    }

    function getBinaryReferenceAndAddToManifest(manifestBinaries, currentBinaryId) {
      var binaryReference;
      if (manifestBinaries[currentBinaryId]) {
        binaryReference = manifestBinaries[currentBinaryId].value
      } else {
        binaryReference = 'binary' + (Object.keys(manifestBinaries).length + 1);
        manifestBinaries[currentBinaryId] = {
          value: binaryReference
        }
      }
      return binaryReference;
    }

    // TODO: scada widget has an additional fragment for the mapping
    function detectDevices(dashboard) {
      var devices = {};
      _.forEach(dashboard.data.c8y_Dashboard.children, function(widget, key, widgets) {
        // Device reference in general widget configuration
        if (_.has(widget, ['config', 'device'])) {
          var currentDeviceId = widget.config.device.id;
          var newDeviceString = getDeviceReferenceAndAddToManifest(devices, currentDeviceId);
          devices[currentDeviceId].widgets.push(widget.title);
          widgets[key].config.device = {id: '{{' + newDeviceString + '}}'};
        }
        // Device reference in a datapoint configured in the widget
        if (_.has(widget, ['config', 'datapoints'])) {
          _.forEach(widgets[key].config.datapoints, function(datapoint, index, datapoints) {
            var currentDeviceId = datapoint.__target.id;
            var newDeviceString = getDeviceReferenceAndAddToManifest(devices, currentDeviceId);
            devices[currentDeviceId].datapoints.push(datapoint.label);
            devices[currentDeviceId].widgets.push(widget.title);
            datapoints[index].__target = {id: '{{' + newDeviceString + '}}'};
          });
        }
      });
      devices = _.values(devices);
      _.forEach(devices, function(device, index, devices) {
        devices[index].widgets = _.uniq(devices[index].widgets);
        devices[index].datapoints = _.uniq(devices[index].datapoints);
      });
      dashboard.manifest = _.orderBy(devices, 'value');
      return dashboard;
    }

    function detectBinaries(dashboard) {
      var binaries = {};
      _.forEach(dashboard.data.c8y_Dashboard.children, function(widget, key, widgets) {
        var currentBinaryId;
        var newBinaryString;
        if (_.has(widget, ['config', 'imageBinaryId'])) {
          currentBinaryId = widget.config.imageBinaryId;
          newBinaryString = getBinaryReferenceAndAddToManifest(binaries, currentBinaryId);
          widgets[key].config.imageBinaryId = '{{' + newBinaryString + '}}';
        } else if (_.has(widget, ['config', 'binaryId'])) {
          currentBinaryId = widget.config.binaryId;
          newBinaryString = getBinaryReferenceAndAddToManifest(binaries, currentBinaryId);
          widgets[key].config.imageBinaryId = '{{' + newBinaryString + '}}';
        }
      });
      dashboard.binaries = binaries;
      return dashboard;
    }

    function downloadBinaries(dashboard) {
      var promises = [];
      _.forEach(dashboard.binaries, function(binary, binaryId) {
        promises.push(c8yBinary.downloadAsDataUri(binaryId));
      });
      return $q.all(promises).then(function(binaryResults) {
        var binaries = _.values(dashboard.binaries);
        _.forEach(binaryResults, function(binaryData, index) {
          binaries[index].extension = resolveExtension(binaryData);
          binaries[index].data = c8yBinary.decodeDataUri(binaryData);
        });
        dashboard.binaries = binaries;
        return dashboard;
      });
    }

    function resolveExtension(binaryData) {
      var extension;
      var index = binaryData.indexOf(';');
      var dataType = binaryData.substr(0, index);
      if (dataType.includes('svg')) {
          extension = '.svg';
      } else {
          extension = '.' + dataType.substr(dataType.indexOf('/') + 1, index);
      }
      return extension;
    }

    function generateZip(dashboard) {
      var zip = new JSZip();
      zip.file('dashboard.json', angular.toJson(dashboard.data, 2));
      _.forEach(dashboard.binaries, function(binary) {
        zip.file(binary.value + binary.extension, binary.data, {binary: true});
      });
      zip.generateAsync({type:"blob"}).then(function(blob) {
        saveAs(blob, "dashboard.zip");
      });
    }

    function exportDashboard() {
      var dashboardId = $routeParams.dashboardId;
      c8yInventory.detail(dashboardId)
        .then(cleanseDashboardJson)
        .then(detectDevices)
        .then(detectBinaries)
        .then(downloadBinaries)
        .then(generateZip)
    }
  }
}());
