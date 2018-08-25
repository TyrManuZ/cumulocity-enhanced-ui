/*
Copyright (c) 2018 Tobias Sommer
Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
(function () {
  'use strict';

  angular
    .module('c8y.enhanced.dashboardUtils')
    .constant('dashboardUtilsConstants', {
      ZIP_PREFIX: 'dashboard',
      ZIP_EXTENSION: '.zip',
      DASHBOARD_KEYS_TO_BE_REMOVED: [
        'id',
        'lastUpdated',
        'owner',
        'additionParents',
        'childAdditions',
        'deviceParents',
        'childDevices',
        'assetParents',
        'childAssets',
        'creationTime',
        'self'
      ]
    });
}());
