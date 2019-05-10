

(function () {

    'use_strict';

    angular.module('app')
        .controller('viewCheckController', viewCheckController);

    viewCheckController.$inject = ['$q', '$scope', 'checkService', '$routeParams', '$location'];

    /**
     * Show a readonly list of all checks.
     *
     * @param {object} checkService - the REST API interface
     *
     */
    function viewCheckController($q, $scope, checkService, $routeParams, $location) {

        var tableNumber = $routeParams.tableNumber;
        var checkId = $routeParams.checkId;

        $scope.selectedMenuItems = [];
        $scope.newlyAddedMenuItems = [];
        $scope.editCheck = editCheck;
        $scope.check = undefined;

        $scope.headingTitle = "Check for Table " + tableNumber;
        $scope.closed = "";

        getCheck(checkId)
            .then(function (check) {
                getMenuItems()
                    .then(function (data) {
                        setMenuItemsForDisplay(check.orderedItems);

                        $scope.closed = (check.closed === true? "CLOSED":"OPEN");

                        if (check.closed) {
                            check.displayTip = getFormattedPrice(check.tip.toString());
                            check.displayTax = getFormattedPrice(check.tax.toString());
                            check.displayTotal = getDisplayTotal();
                        }
                    });
            });

        /**
         * Retriev a check based on the checkId.
         *
         * @param {string} checkId - the check ID.
         *
         */
        function getCheck(checkId) {
            var deferred = $q.defer();

            checkService.getCheckDetails(checkId)
                .then(function(data) {
                    $scope.check = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Retriev the menu items.
         *
         */
        function getMenuItems() {
            var deferred = $q.defer();

            checkService.getMenuItems()
                .then(function(data) {
                    $scope.menuItems = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Set display appropriate values for the users order of menu items.
         *
         * @param {object} orderedItems - the menu items ordered.
         *
         */
        function setMenuItemsForDisplay(orderedItems) {

            $scope.selectedMenuItems = [];

            $scope.menuItems.forEach(function (menuItem) {

                orderedItems.forEach(function (orderedItem) {

                    if (menuItem.id === orderedItem.itemId ) {

                        orderedItem.name = menuItem.name;
                        orderedItem.price = menuItem.price;
                        orderedItem.displayPrice = getFormattedPrice(menuItem.price.toString());
                        $scope.selectedMenuItems.push(orderedItem);
                    }

                });
            });
        }

        /**
         * Set display appropriate values for the users order of menu items.
         *
         *
         * @param {object} tables - all tables used by servers.
         *
         * @param {string} tableId - the id representing a table.
         *
         * @return (number) the table number corresponding to the given tableId
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
         * Redirect to the edit screen when user hit edit button.
         *
         */
        function editCheck() {

            $location.path( "/editCheck/" +  tableNumber);
        }

        /**
         * Format a price for two digit dollar values.
         *
         * @param {string} value - string to clean up.
         *
         * @return (string) the formatted value
         *
         */
        function getFormattedPrice(value) {

            var displayValue;
            var cents;

            displayValue = value.split(".");

            if (displayValue.length == 2) {
                cents = displayValue[1].substring(0,2);
                if (cents.length == 1) {
                    cents = cents + "0";
                }
            } else {
                cents = "00";
            }

            displayValue = displayValue[0] + "." + cents;

            return displayValue;
        }

        /**
         * Calculate the check total for display.
         *
         * @return {string} the sum of all the non voided menu items.
         *
         */
        function getDisplayTotal() {

            var displayTotal=0.0;

            $scope.selectedMenuItems.forEach(function (menuItem) {

                if (!menuItem.voided) {
                    displayTotal += menuItem.price;
                }
            });

            displayTotal += $scope.check.tax;
            displayTotal += $scope.check.tip;

            displayTotal = getFormattedPrice(displayTotal.toString());

            return displayTotal;
        }

    }

})();
