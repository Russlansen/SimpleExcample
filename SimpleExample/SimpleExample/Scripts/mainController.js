﻿angular.module("MainModule", [])
    .controller("MainCtrl", function ($scope, $http) {
        $scope.title = "Customers";
        $scope.url = '../api/Action/';
        const defaultNumberPerPage = 3;
        $scope.maxCustomerPerPage = defaultNumberPerPage;
        $scope.showMessage = false;
        $scope.showErrorMessage = false;
        $scope.currentPage = (sessionStorage.getItem('currentPage') != undefined &&
                              sessionStorage.getItem('currentPage') > 0) ?
                              sessionStorage.getItem('currentPage') : 1;

        $scope.idChange = function () {
            if ($scope.customer.Id !== undefined) {
                $http({
                    method: 'GET',
                    url: $scope.url + $scope.customer.Id
                }).then(function (response) {
                    $scope.showMessage = false;
                    $scope.showErrorMessage = false;
                    $scope.customer.Name = response.data[0].Name;
                    $scope.customer.Age = response.data[0].Age;
                }, function (error) {
                    $scope.message = error.data.Message;
                    $scope.showErrorMessage = true;
                    $scope.showMessage = false;
                });
            }
        }

        $scope.getCustomers = function (page) {
            if (typeof $scope.maxCustomerPerPage != "number") {
                $scope.maxCustomerPerPage = defaultNumberPerPage;
            }
            if (page <= 0) {
                page = 1;
            }
            $http({
                method: 'GET',
                url: $scope.url + 'GetPagination/' + $scope.maxCustomerPerPage + '/' + page
            }).then(function (response) {
                $scope.showMessage = false;
                $scope.showErrorMessage = false;
                $scope.getResponse = response.data.Customers;
                $scope.paginationArray = response.data.TotalPages;

                if ($scope.currentPage > $scope.paginationArray.length) {
                    sessionStorage.setItem('currentPage', $scope.paginationArray.length);
                    $scope.currentPage = sessionStorage.getItem('currentPage');
                    $scope.getCustomers($scope.currentPage);
                } else {
                    sessionStorage.setItem('currentPage', page);
                    $scope.currentPage = sessionStorage.getItem('currentPage');
                }

            }, function (error) {
                $scope.message = error.data.Message;
                $scope.showErrorMessage = true;
                $scope.showMessage = false;
            });
        }

        $scope.getCustomer = function () {
            $http({
                method: 'GET',
                url: $scope.url + $scope.id
            }).then(function (response) {
                $scope.showMessage = false;
                $scope.showErrorMessage = false;
                $scope.getResponse = response.data;
            }, function (error) {
                $scope.message = error.data.Message;
                $scope.showErrorMessage = true;
                $scope.showMessage = false;
            });
        }

        $scope.updateCustomer = function () {
            $http({
                method: 'POST',
                url: $scope.url,
                data: $scope.customer
            }).then(function (response) {
                $scope.message = "User updated";
                $scope.showMessage = true;
                $scope.showErrorMessage = false;
                setTimeout(function () {
                    $scope.getCustomers($scope.currentPage)
                }, 2000);

            }, function (error) {
                $scope.message = error.data.Message;
                $scope.showErrorMessage = true;
                $scope.showMessage = false;
            });
            $scope.showMessage = true;
        }

        $scope.addCustomer = function () {
            $http({
                method: 'PUT',
                url: $scope.url,
                data: $scope.newCustomer
            }).then(function (response) {
                $scope.message = "User created";
                $scope.showMessage = true;
                $scope.showErrorMessage = false;
                setTimeout(function () {
                    $scope.getCustomers($scope.currentPage)
                }, 2000);
            }, function (error) {
                $scope.message = error.data.Message;
                $scope.showErrorMessage = true;
                $scope.showMessage = false;
            });
            $scope.showMessage = true;
        } 

        $scope.deleteCustomer = function () {
            $http({
                method: 'DELETE',
                url: $scope.url + $scope.idDelete,
            }).then(function (response) {
                $scope.message = "User deleted";
                $scope.showMessage = true;
                $scope.showErrorMessage = false;
                setTimeout(function () {
                    $scope.getCustomers($scope.currentPage)
                }, 2000);
            }, function (error) {
                $scope.message = error.data.Message;
                $scope.showErrorMessage = true;
                $scope.showMessage = false;
            });       
        }

        $scope.previousPage = function () {
            if ($scope.currentPage <= 1) return 1;
            else return $scope.currentPage - 1;
        }

        $scope.nextPage = function () {
            if ($scope.currentPage >= $scope.paginationArray.length) return $scope.paginationArray.length;
            else return parseInt($scope.currentPage) + 1;
        }
        $scope.getCustomers($scope.currentPage);
    })