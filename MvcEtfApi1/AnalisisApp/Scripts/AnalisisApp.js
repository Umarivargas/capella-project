(function () {
    var app = Angular.module("AnalisisApp", ["ngRoute"]);
    var config = function ($routeProvider) {
        $routeProvider
        .when("/list",
            { templateUrl: "/AnalisisApp/Views/Index.html", controller: "ListaUsuarioController" })
        .when("/detalles/:id",
            { templateUrl: "/AnalisisApp/Views/DetalleUsuario.html", controller: "DetalleUsuarioController" })
        .otherwise(
            { redirectTo: "/list", controller: "ListaUsuarioController" });
    };

    app.config(config);
}());