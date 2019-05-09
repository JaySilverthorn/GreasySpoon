

(function () {

    'use_strict';

    angular.module('app')
        .controller('listChecksController', listChecksController);

    listChecksController.$inject = ['$q', '$scope', 'checkService', '$location'];

    function listChecksController($q, $scope, checkService, $location) {

        $scope.selectCheck = selectCheck;
        $scope.headingTitle = "Checks";

        setChecksForDisplay();

        function selectCheck() {

            var currentCheck = JSON.parse($scope.currentCheck);

            $location.path( "/editCheck/" +  currentCheck.tableNumber + "/" + currentCheck.id);
        }

        function setChecksForDisplay() {

            checkService.getChecks()
                .then(function(data) {
                    $scope.checks = data;

                    getTables()
                        .then(function (tables) {

                            var tableNumber;
                            var displayDate;

                            $scope.checks.forEach(function (check, index, array) {

                                tableNumber = getTableNumber(tables, check.tableId);

                                displayDate = getDisplayDate(check);

                                array[index].tableNumber = tableNumber;
                                array[index].displayDate = displayDate;

                            })
                        })
                });
        }

        function getTables() {

            var deferred = $q.defer();

            checkService.getTables()
                .then(function(data) {
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        function getTableNumber(tables, tableId) {

            var tableNumber;

            tables.forEach(function (table) {

                if (table.id == tableId) {
                    tableNumber = table.number;
                }
            });

            return tableNumber;
        }

        function getDisplayDate(check) {

            var dateUpdated = new Date(check.dateUpdated);

            var date = dateUpdated.getDate();
            var month = dateUpdated.getMonth();
            var year = dateUpdated.getFullYear();
            var hours = dateUpdated.getHours();
            var minutes = dateUpdated.getMinutes();

            var displayDate  = (month+1) + "/" + date + "/" + year + "  " + hours + ":" + minutes;

            return displayDate;
        }


    }

})();
