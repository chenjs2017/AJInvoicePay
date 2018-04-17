var myApp = angular.module("myApp", [ "ngRoute" ]);

myApp.config(function ($routeProvider) {
    $routeProvider
        .when("/invoice",  { controller: "InvoiceController", templateUrl: "resources/invoice.html" })
        .when("/invoice/:invoice_id",  { controller: "InvoiceController", templateUrl: "resources/invoice.html" })
        .when("/",  { redirectTo: "/invoice" })
});
