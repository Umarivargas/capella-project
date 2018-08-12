(function (app) {
    var ListaUsuarioController = function ($scope, $http) {
        $scope.message = "Usuarios controller works";
        $http.get("/api/Usuarios").success(function (data) {
            $scope.usuarios = data;
        });
    };
    app.controller("ListaUsuarioController", ListaUsuarioController);
}(Angular.module("AnalisisApp")));