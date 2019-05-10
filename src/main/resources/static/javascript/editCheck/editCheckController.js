

(function () {

    'use_strict';

    angular.module('app')
        .controller('editCheckController', editCheckController);

    editCheckController.$inject = ['$q', '$scope', 'checkService', '$routeParams', '$uibModal', '$location'];

    function editCheckController($q, $scope, checkService, $routeParams, $uibModal, $location) {

        var tableNumber = $routeParams.tableNumber;
        var checkId = $routeParams.checkId;

        $scope.selectedMenuItems = [];
        $scope.newlyAddedMenuItems = [];
        $scope.check = undefined;
        $scope.tableNumber = tableNumber;

        $scope.selectMenuItem = selectMenuItem;
        $scope.saveCheck = saveCheck;
        $scope.closeCheck = closeCheck;
        $scope.openVoidPopup = openVoidPopup;

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
                        $scope.tables = tables;
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

                        orderedItem.name = menuItem.name;
                        orderedItem.price = menuItem.price;
                        $scope.selectedMenuItems.push(orderedItem);
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

        function voidItem(itemId) {

            if ($scope.check !== undefined && $scope.tableNumber != undefined) {
                checkService.voidItemOnCheck(itemId, $scope.check.id)
                    .then(function(data) {
                        var voidItem = data;
                        if ($scope.check.orderedItems !== undefined) {
                            var tableId = getTableId($scope.tables, $scope.tableNumber);
                            getOpenCheckForTable(tableId)
                                .then(function (check) {
                                    $scope.check = check;
                                    setMenuItemsForDisplay($scope.check.orderedItems);
                                })
                        }
                    });
            }

        }

        function openVoidPopup(currentSelectedMenuItem) {

            var menuItem = JSON.parse(currentSelectedMenuItem[0]);
            var itemId = menuItem.id;
            var voided = menuItem.voided;

            if (!voided) {
                if ($scope.check !== undefined) {
                    $uibModal.open( {
                        size: 'md',
                        templateUrl: '/templates/modalPopup.html',
                        controller: 'modalPopupController',
                        controllerAs: 'vm'
                    }).result.then(function (result) {
                        var res = result;

                        if (result === "OK") {
                            voidItem(itemId);
                        }
                    })
                }
            }
        }
    }

})();
