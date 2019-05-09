

(function () {

    'use_strict';

    angular.module('app')
        .controller('selectTableController', selectTableController);

        selectTableController.$inject = ['$scope', 'checkService', '$location'];

    function selectTableController($scope, checkService, $location) {

        $scope.selectTable = selectTable;
        $scope.headingTitle = "Tables";

        $scope.currentTableNumber = "Select a table";
        $("#notTable option[value='Select a table']").attr("selected", true);
        $("#notTable option[value='Select a table']").prop('selected', true);

        checkService.getTables()
            .then(function(data) {
                $scope.tables = data;
                $scope.currentTableNumber = "Select a table";
                $("#notTable option[value='Select a table']").attr("selected", true);
                $("#notTable option[value='Select a table']").prop('selected', true);
            });

        function selectTable() {

            $location.path( "/editCheck/" +  $scope.currentTableNumber);
        }
    }

})();
