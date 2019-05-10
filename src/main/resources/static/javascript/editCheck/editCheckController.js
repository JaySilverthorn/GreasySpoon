

(function () {

    'use_strict';

    angular.module('app')
        .controller('editCheckController', editCheckController);

    editCheckController.$inject = ['$q', '$scope', 'checkService', '$routeParams', '$uibModal', '$location'];

    /**
     * Allow a server to add items to a single check.
     *
     * @param {object} checkService - the REST API interface
     *
     */
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

        /**
         * Add a menu item when selected in the UI.
         *
         */
        function selectMenuItem() {

            $scope.selectedMenuItems.push(JSON.parse($scope.currentMenuItem));
            $scope.newlyAddedMenuItems.push(JSON.parse($scope.currentMenuItem));

            $scope.currentMenuItem = "Select menu item";
            $("#notItem option[value='Select menu item']").attr("selected", true);
            $("#notItem option[value='Select menu item']").prop('selected', true);
        }

        /**
         * Traverse the list of tables to find the open one and get the corresponding check.
         *
         * @param {number} the table number
         */
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

        /**
         * Set the display with the menu item details.
         *
         * @param {object} orderedItems - the list of menu items in the order.
         */
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

        /**
         * Save the list of any new menu items to the check. Create a check if needed.
         *
         */
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

        /**
         * Add the new menu items to the check permanently.
         *
         */
        function addMenuItemsToCheck() {

            checkService.addItemsToCheck($scope.newlyAddedMenuItems, $scope.check.id)
                .then(function(data) {
                    return data;
                });
        }

        /**
         * Open the check for a given tableId.
         *
         * @param {string} tableId - id for a table.
         *
         */
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

        /**
         * Retrieve the table list.
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
         * Retrieve the table ID for a given table number.
         *
         * @param {object} tables - the list of tables.
         *
         * @param {number} tableNumber - the table number.
         *
         * @return {string} the table ID
         *
         */
        function getTableId(tables, tableNumber) {

            var tableId;

            tables.forEach(function (table) {

                if (table.number == tableNumber) {
                    tableId = table.id;
                }
            });

            return tableId;
        }

        /**
         * Create a new check.
         *
         * @param {string} tableId - the table ID.
         *
         * @return {object} the check
         *
         */
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
        /**
         * Close the check when the server hits the button in the UI.
         *
         */
        function closeCheck() {

            if ($scope.check !== undefined) {
                checkService.closeCheck($scope.check.id)
                    .then(function(data) {
                        $scope.check = data;
                        $scope.closed = (check.closed? "CLOSED": "OPEN");

                    });
            }
        }

        /**
         * Void a menu item from a check.
         *
         * @param {string} itemId - the item ID to void.
         *
         */
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

        /**
         * Open a popup to confirm the server really wants to void the item selected.
         *
         * @param {object} currentSelectedMenuItem - the item to void.
         *
         */
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
