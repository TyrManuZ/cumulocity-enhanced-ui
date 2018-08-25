/*
Copyright (c) 2018 Tobias Sommer
Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
(function () {
  'use strict';

  angular
    .module('c8y.enhanced.appSubscriptions')
    .config(configure);

  /* @ngInject */
  function configure(
    c8yNavigatorProvider,
    c8yViewsProvider
  ) {
    c8yNavigatorProvider.addNavigation({
      name: 'All applications',
      parent: 'Applications',
      icon: 'cube',
      path: 'all-applications'
    });

    c8yViewsProvider.when('/all-applications', {
      template: '<c8y-app-subscriptions />'
    });
  }
}());
