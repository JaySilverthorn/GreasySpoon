

(function () {

    'use strict'

    angular.module('app')
        .service('checkService', CheckService);

    CheckService.$inject = ['$q', '$http'];

    /**
     * Collection of REST APIs.
     *
     */
    function CheckService($q, $http) {

        var service = {
            getTables: getTables,
            getMenuItems: getMenuItems,
            getChecks: getChecks,
            getCheckDetails: getCheckDetails,
            createCheck: createCheck,
            addItemsToCheck: addItemsToCheck,
            addItemToCheck: addItemToCheck,
            voidItemOnCheck: voidItemOnCheck,
            closeCheck: closeCheck
        };

        return service;

        function rejectError(httpErrorObj) {
            return $q.reject(httpErrorObj.status)
        }

        function getTables() {

            return $http({
                cache: true,
                url: 'https://check-api.herokuapp.com/tables',
                method: "GET",
                headers: {
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzEzMjE3LTRjYTktNGU5YS05MmU1LWU0OGMxYjcyNWY2OSIsIm5hbWUiOiJKYXkifQ.Y2Q-Mvxi3IVlC2LupzT-xQj1AXe-LNmhiG2CkkrKYSo"
                }
            }).then(function (httpObj) {
                return httpObj.data;
            });
        }

        function getMenuItems() {

            return $http({
                cache: true,
                url: 'https://check-api.herokuapp.com/items',
                method: "GET",
                headers: {
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzEzMjE3LTRjYTktNGU5YS05MmU1LWU0OGMxYjcyNWY2OSIsIm5hbWUiOiJKYXkifQ.Y2Q-Mvxi3IVlC2LupzT-xQj1AXe-LNmhiG2CkkrKYSo"
                }
            }).then(function (httpObj) {
                return httpObj.data;
            });
        }

        function getChecks() {

            return $http({
                url: 'https://check-api.herokuapp.com/checks',
                method: "GET",
                headers: {
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzEzMjE3LTRjYTktNGU5YS05MmU1LWU0OGMxYjcyNWY2OSIsIm5hbWUiOiJKYXkifQ.Y2Q-Mvxi3IVlC2LupzT-xQj1AXe-LNmhiG2CkkrKYSo"
                }
            }).then(function (httpObj) {
                return httpObj.data;
            });
        }

        function getCheckDetails(checkId) {

            return $http({
                url: 'https://check-api.herokuapp.com/checks/' + checkId,
                method: "GET",
                headers: {
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzEzMjE3LTRjYTktNGU5YS05MmU1LWU0OGMxYjcyNWY2OSIsIm5hbWUiOiJKYXkifQ.Y2Q-Mvxi3IVlC2LupzT-xQj1AXe-LNmhiG2CkkrKYSo"
                }
            }).then(function (httpObj) {
                return httpObj.data;
            });
        }

        function createCheck(tableId) {

            return $http({
                url: 'https://check-api.herokuapp.com/checks',
                method: "POST",
                headers: {
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzEzMjE3LTRjYTktNGU5YS05MmU1LWU0OGMxYjcyNWY2OSIsIm5hbWUiOiJKYXkifQ.Y2Q-Mvxi3IVlC2LupzT-xQj1AXe-LNmhiG2CkkrKYSo"
                },
                data: {"tableId": tableId}
            }).then(function (httpObj) {
                return httpObj.data;
            }).catch(rejectError);
        }

        function addItemsToCheck(items, checkId) {

            var deferred = $q.defer();
            var promisses = [];

            items.forEach(function (item) {
                promisses.push(addItemToCheck(item.id, checkId));
            });

            $q.all(promisses).then(function(data) {
                deferred.resolve(data);
            })

            return deferred.promise;
        }

        function addItemToCheck(itemId, checkId) {

            return $http({
                url: 'https://check-api.herokuapp.com/checks/'+ checkId + "/addItem",
                method: "PUT",
                headers: {
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzEzMjE3LTRjYTktNGU5YS05MmU1LWU0OGMxYjcyNWY2OSIsIm5hbWUiOiJKYXkifQ.Y2Q-Mvxi3IVlC2LupzT-xQj1AXe-LNmhiG2CkkrKYSo"
                },
                data: {"itemId": itemId}
            }).then(function (httpObj) {
                return httpObj.data;
            });
        }

        function voidItemOnCheck(itemId, checkId) {

            return $http({
                url: 'https://check-api.herokuapp.com/checks/'+ checkId + "/voidItem",
                method: "PUT",
                headers: {
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzEzMjE3LTRjYTktNGU5YS05MmU1LWU0OGMxYjcyNWY2OSIsIm5hbWUiOiJKYXkifQ.Y2Q-Mvxi3IVlC2LupzT-xQj1AXe-LNmhiG2CkkrKYSo"
                },
                data: {"orderedItemId": itemId}
            }).then(function (httpObj) {
                return httpObj.data;
            });
        }

        function closeCheck(checkId) {

            return $http({
                url: 'https://check-api.herokuapp.com/checks/'+ checkId + "/close",
                method: "PUT",
                headers: {
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzEzMjE3LTRjYTktNGU5YS05MmU1LWU0OGMxYjcyNWY2OSIsIm5hbWUiOiJKYXkifQ.Y2Q-Mvxi3IVlC2LupzT-xQj1AXe-LNmhiG2CkkrKYSo"
                },
                data: {}
            }).then(function (httpObj) {
                return httpObj.data;
            });
        }
    }

})();
