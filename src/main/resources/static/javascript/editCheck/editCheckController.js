

(function () {

    'use_strict';

    angular.module('app')
        .controller('editCheckController', editCheckController);

    editCheckController.$inject = ['$q', '$scope', 'checkService', '$routeParams'];

    function editCheckController($q, $scope, checkService, $routeParams) {

        var tableNumber = $routeParams.tableNumber;
        var checkId = $routeParams.checkId;

        $scope.selectedMenuItems = [];
        $scope.newlyAddedMenuItems = [];
        $scope.check = undefined;

        $scope.selectMenuItem = selectMenuItem;
        $scope.saveCheck = saveCheck;
        $scope.closeCheck = closeCheck;

        $scope.headingTitle = "Check for Table " + tableNumber;
        $scope.closed = "";

        $scope.headingSubtitle2 = "Items added to check";

        checkService.getMenuItems()
            .then(function(data) {
                $scope.menuItems = data;
                $scope.currentMenuItem = "Select menu item";
                $("#notItem option[value='Select menu item']").attr("selected", true);
                $("#notItem option[value='Select menu item']").prop('selected', true);
            });

        setCheckforTable(tableNumber);

        function selectMenuItem() {

            $scope.selectedMenuItems.push(JSON.parse($scope.currentMenuItem));
            $scope.newlyAddedMenuItems.push(JSON.parse($scope.currentMenuItem));

            $scope.currentMenuItem = "Select menu item";
            $("#notItem option[value='Select menu item']").attr("selected", true);
            $("#notItem option[value='Select menu item']").prop('selected', true);
        }

        function setCheckforTable(tableNumber) {

            if ($scope.check === undefined) {
                getTables()
                    .then(function (data) {
                        var tables = data;
                        var tableId = getTableId(tables, tableNumber);
                        getOpenCheckForTable(tableId)
                            .then(function (check) {
                                if (check !== undefined) {
                                    $scope.check = check;

                                    $scope.closed = (check.closed? "CLOSED": "OPEN");

                                    if (check.orderedItems !== undefined) {
                                        setMenuItemsForDisplay(check.orderedItems);
                                    }
                                }
                            })
                    })
            }
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

        function saveCheck() {

            if ($scope.check === undefined || $scope.check.closed) {
                getTables()
                    .then(function (data) {
                        var tables = data;
                        var tableId = getTableId(tables, tableNumber);
                        getOpenCheckForTable(tableId)
                            .then(function (check) {
                                if (check) {
                                    $scope.check = check;
                                    $scope.closed = (check.closed? "CLOSED": "OPEN");

                                    addMenuItemsToCheck();

                                } else {
                                    createCheck(tableId)
                                        .then(function (data) {
                                            addMenuItemsToCheck();
                                        })
                                }
                            })
                    })

            } else {

                addMenuItemsToCheck();
            }
        }

        function addMenuItemsToCheck() {

            checkService.addItemsToCheck($scope.newlyAddedMenuItems, $scope.check.id)
                .then(function(data) {
                    return data;
                });
        }

        function getOpenCheckForTable(tableId) {
            var deferred = $q.defer();

            checkService.getChecks()
                .then(function(data) {
                    var foundCheck = undefined;

                    data.forEach(function (check) {
                        if (check.tableId == tableId) {
                            if (!check.closed) {
                                foundCheck = check;
                            }
                        }
                    });

                    if (foundCheck !== undefined) {
                        checkService.getCheckDetails(foundCheck.id)
                            .then(function(data) {
                                deferred.resolve(data);
                            });
                    } else {
                        deferred.resolve(undefined);
                    }

                });

            return deferred.promise;
        }

        function getTables() {

            var deferred = $q.defer();

            checkService.getTables()
                .then(function(data) {
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        function getTableId(tables, tableNumber) {

            var tableId;

            tables.forEach(function (table) {

                if (table.number == tableNumber) {
                    tableId = table.id;
                }
            });

            return tableId;
        }

        function createCheck(tableId) {

            var deferred = $q.defer();

            checkService.createCheck(tableId)
                .then(function(data) {
                    $scope.check = data;
                    $scope.closed = (check.closed? "CLOSED": "OPEN");
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        function closeCheck() {

            if ($scope.check !== undefined) {
                checkService.closeCheck($scope.check.id)
                    .then(function(data) {
                        $scope.check = data;
                        $scope.closed = (check.closed? "CLOSED": "OPEN");

                    });
            }
        }
    }

})();
