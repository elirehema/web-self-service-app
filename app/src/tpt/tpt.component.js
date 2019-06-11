(function () {
    'use strict';

    angular.module('selfService')
        .controller('TPTCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', '$mdDialog', '$mdDateLocale', '$mdToast', 'AccountTransferService', TPTCtrl]);

    function TPTCtrl($scope, $rootScope, $stateParams, $filter, $mdDialog, $mdDateLocale, $mdToast, AccountTransferService) {

        var vm = this;
        vm.fromAccountOptions = [];
        vm.toAccountOptions = [];
        vm.transferFormData = getTransferFormDataObj()

        vm.getTransferTemplate = getTransferTemplate();
        vm.clearForm = clearForm;
        vm.submit = submit;

        // FORMAT THE DATE FOR THE DATEPICKER
        $mdDateLocale.formatDate = function (date) {
            return $filter('date')(date, "dd-MM-yyyy");
        };

        function getTransferFormDataObj() {
            return {
                transferDate: new Date()
            };
        }

        function getTransferTemplate() {
            AccountTransferService.getTransferTemplate().get({type: "tpt"},function (data) {
                vm.fromAccountOptions = data.fromAccountOptions;
                vm.toAccountOptions = data.toAccountOptions;
            });
        }

        function clearForm() {
            vm.transferFormData = getTransferFormDataObj();
            $scope.transferForm.$setPristine();
            $scope.transferForm.$setUntouched();
        }

        function submit(ev) {
            $mdDialog.show({
                controller: 'ReviewTPTDialogCtrl',
                controllerAs: 'vm',
                templateUrl: 'src/tpt/review-tpt-dialog/review-tpt-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {transferFormData: vm.transferFormData},
                clickOutsideToClose: true
            }).then(function (result) {
                if(result === "success"){
                    clearForm();
                }
            }, function () {
                clearForm();
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Transfer Cancelled')
                        .position('top right')
                );
            });
        }


    }
})();