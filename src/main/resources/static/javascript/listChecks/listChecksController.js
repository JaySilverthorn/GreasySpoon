

(function () {

    'use_strict';

    angular.module('app')
        .controller('listChecksController', listChecksController);

    listChecksController.$inject = ['$q', '$scope', 'checkService', '$location'];

    /**
     * Allow a server to view all the checks.
     *
     * @param {object} checkService - the REST API interface
     *
     */
    function listChecksController($q, $scope, checkService, $location) {

        $scope.selectCheck = selectCheck;
        $scope.headingTitle = "Checks";

        setChecksForDisplay();

        /**
         * If a check is selected from the list, go to edit screen.
         *
         */
        function selectCheck() {

            var currentCheck = JSON.parse($scope.currentCheck);

            $location.path( "/editCheck/" +  currentCheck.tableNumber + "/" + currentCheck.id);
        }

        /**
         * retrieve all the checks and add a formatted table number and date.
         *
         */
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

        /**
         * retrieve all the tables.
         *
         * @return (object) the list of tables.
         *
         */
        function getTables() {

            var deferred = $q.defer();

            checkService.getTables()
                .then(function(data) {
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * retrieve the table number for a tableId.
         *
         * @param {object} the list of tables.
         *
         * @param {string} the table id.
         *
         * @return (string) the table number.
         *
         */
        function getTableNumber(tables, tableId) {

            var tableNumber;

            tables.forEach(function (table) {

                if (table.id == tableId) {
                    tableNumber = table.number;
                }
            });

            return tableNumber;
        }

        /**
         * Format the date to be easy to read.
         *
         * @param {object} check - the check with the date to modify,
         *
         * @return (string) the formatted date.
         */
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
