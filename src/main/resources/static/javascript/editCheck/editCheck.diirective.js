(function () {

    'use_strict';

    angular.module('app')
        .directive('editCheck', editCheck);

    editCheck.$inject = [];

    function editCheck() {
       return {
            restrict: 'E',
            scope: {},
            templateUrl:'/templates/editCheck.html',
            controller: 'editCheckController',
            controllerAs: 'vm'
       }
    }

})();