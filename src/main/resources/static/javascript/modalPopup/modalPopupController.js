

(function () {

    'use_strict';

    angular.module('app')
        .controller('modalPopupController', modalPopupController);

    modalPopupController.$inject = ['$scope', '$uibModalInstance'];

    function modalPopupController($scope, $uibModalInstance) {

        $scope.ok = ok;
        $scope.cancel = cancel;

        function ok() {

            var result="OK";
            $uibModalInstance.close(result);
        }

        function cancel() {

            $uibModalInstance.dismiss();
        }
    }

})();
