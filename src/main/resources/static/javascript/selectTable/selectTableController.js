

(function () {

    'use_strict';

    angular.module('app')
        .controller('selectTableController', selectTableController);

        selectTableController.$inject = ['$scope', 'checkService', '$location'];

    /**
     * Allow the user to select a table for opening a check.
     *
     * @param {object} checkService - the REST API interface
     *
     */
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

        /**
         * Redirect to the editCheck page once a table is selected.
         **
         */
        function selectTable() {

            $location.path( "/editCheck/" +  $scope.currentTableNumber);
        }
    }

})();
