(function () {
  'use strict';

  angular
    .module('c8y.enhanced.appSubscriptions')
    .component('c8yAppSubscriptions', {
      templateUrl: ':::PLUGIN_PATH:::/appSubscriptions.html',
      bindings: {
        text: '@'
      },
      controllerAs: 'vm',
      controller: Controller
    });

  /* @ngInject */
  function Controller(
    c8yApplication,
    c8yTitle,
    $location
  ) {
    const vm = this;

    _.assign(vm, {
      $onInit,
      refresh
    });

    ////////////

    function $onInit() {
      c8yTitle.changeTitle({
        title: "All applications"
      });
      refresh();
    }

    function refresh() {
      c8yApplication.listByTenant({
        pageSize: 2000
      }).then(updateApplicationList);
    }

    function updateApplicationList(applications) {
      vm.applications = applications;
      c8yTitle.changeTitle({
        title: "All applications",
        subtitle: applications.length + " applications"
      });
    }

  }
}());
