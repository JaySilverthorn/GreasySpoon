

(function () {

    'use_strict';

    angular.module('app')
        .controller('modalPopupController', modalPopupController);

    modalPopupController.$inject = ['$scope', '$uibModalInstance'];

    /**
     * Create a modal popup dialog.
     *
     */
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
