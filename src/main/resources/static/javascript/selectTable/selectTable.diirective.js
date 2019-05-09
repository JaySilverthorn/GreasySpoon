(function () {

    'use_strict';

    angular.module('app')
        .directive('selectTable', selectTable);

    selectTable.$inject = [];

    function selectTable() {
       return {
            restrict: 'E',
            scope: {},
            templateUrl:'/templates/selectTable.html',
            controller: 'selectTableController',
            controllerAs: 'vm'
       }
    }

})();