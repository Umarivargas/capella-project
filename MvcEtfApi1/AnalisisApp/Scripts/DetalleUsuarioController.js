(function (app) {
    var DetalleUsuarioController = function ($scope, $http, $routeParams) {
        var id = $routeParams.id;
        $http.get("/api/Usuarios/" + id)
            .success(function (data) {
                $scope.usuario = data;
            });
    };
    app.controller("DetalleUsuarioController", DetalleUsuarioController);
}(angular.module("AnalisisApp")));