

(function () {

    'use_strict';

    angular.module('app')
        .controller('viewCheckController', viewCheckController);

    viewCheckController.$inject = ['$q', '$scope', 'checkService', '$routeParams', '$location'];

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

        function getCheck(checkId) {
            var deferred = $q.defer();

            checkService.getCheckDetails(checkId)
                .then(function(data) {
                    $scope.check = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        function getMenuItems() {
            var deferred = $q.defer();

            checkService.getMenuItems()
                .then(function(data) {
                    $scope.menuItems = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        function setMenuItemsForDisplay(orderedItems) {

            $scope.selectedMenuItems = [];

            $scope.menuItems.forEach(function (menuItem) {

                orderedItems.forEach(function (orderedItem) {

                    if (menuItem.id === orderedItem.itemId ) {

                        $scope.selectedMenuItems.push(menuItem);
                    }

                });
            });
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

        function editCheck() {

            $location.path( "/editCheck/" +  tableNumber);
        }

        function getDisplayTip(check) {

            var displayTip;

            return displayTip;
        }

        function getFormattedPrice(value) {

            var displayValue;
            var cents;

            displayValue = value.split(".");

            cents = displayValue[1].substring(0,2);

            displayValue = displayValue[0] + "." + cents;

            return displayValue;
        }

        function getDisplayTotal() {

            var displayTotal=0.0;

            $scope.selectedMenuItems.forEach(function (menuItem) {

                displayTotal += menuItem.price;
            });

            displayTotal += $scope.check.tax;
            displayTotal += $scope.check.tip;

            displayTotal = getFormattedPrice(displayTotal.toString());

            return displayTotal;
        }

    }

})();
