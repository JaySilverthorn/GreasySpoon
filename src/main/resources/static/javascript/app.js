var app = angular.module('app', ['ui.bootstrap','ngRoute','ngResource']);
app.config(function($routeProvider){
    $routeProvider
        .when('/selectTable',{
            templateUrl: '/templates/selectTable.html',
            controller: 'selectTableController'
        })
        .when('/editCheck/:tableNumber',{
            templateUrl: '/templates/editCheck.html',
            controller: 'editCheckController'
        })
        .when('/editCheck/:tableNumber/:checkId',{
            templateUrl: '/templates/viewCheck.html',
            controller: 'viewCheckController'
        })
        .when('/showChecks',{
            templateUrl: '/templates/showChecks.html',
            controller: 'listChecksController'
        })
        .when('/index',{
            templateUrl: '/index.html',
            controller: 'listChecksController'
        })
        .otherwise(
            { redirectTo: '/'}
        );
});

