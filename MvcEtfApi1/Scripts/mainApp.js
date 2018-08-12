var app = angular.module("mainApp", ['ui.router']);

app.controller("UsuariosCtrl", function (usrService, empService, $scope, $http, $state, $stateParams) {
    $scope.pagina = "Usuarios";
    $scope.usuarios = {};
    $scope.usuario = {};
    $scope.Nombre = null;
    $scope.Apellidos = null;
    $scope.CorreoElec = null;
    $scope.Password = null;

    $scope.NombreEmp = null;

    $scope.Usr = { Nombre: $scope.Nombre, Apellidos: $scope.Apellidos, CorreoElec: $scope.CorreoElec, Password: $scope.Password };

    usrService.getAll().then(function (response) {
        $scope.usuarios = response.data;
    }, function (error) {
        console.log("Error occured ", error);
    });
    //alert(usrService.getById($stateParams.id));

    $http({
        method: 'GET',
        url: 'api/usuarios',
        params: { id: $stateParams.id }
    });

    var id = $stateParams.id;

    usrService.getById(id).then(function (response) {
        $scope.usuario = response.data;
    }, function (error) {
        console.log("Error occured ", error);
    });


    $scope.RegistrarUsuario = function(){
        usrService.registrar($scope.Usr).then(function () { 
            $state.go('Usuarios.Lista');
        });
    }

    $scope.Borrar = function (pIdEmpresa) {
        alert(pIdEmpresa);
        //$http({
        //    method: 'DELETE',
        //    url: 'api/Empresas/ + id'
        //});
        //$state.go('Usuarios.Lista');
    }

    $scope.RegEmpUsr = function (pidUSr) {
        if ($scope.NombreEmp.replace(/\s/g, '') != "" || $scope.NombreEmp.replace(/\s/g, '') == null) {
            $scope.emp = { IdEmpresa: null, Nombre: $scope.NombreEmp, IdUsuario: usrService.usrId, UsuarioEmpresa: {}, ProyectosEmpresa: {}, Usuario: { IdUsuario: 1 } };
            empService.registrar($scope.emp, pidUSr);
            $state.go('Empresas');
        }
    }
});

app.controller("EmpresasCtrl", function (empService, objService, proyService, usrService, $scope, $filter, $http, $state, $stateParams) {
    $scope.pagina = "Empresas";
    $scope.empresa = {};
    $scope.empresas = {};
    $scope.emp = { IdEmpresa: null, Nombre: null, IdUsuario: usrService.usrId, UsuarioEmpresa: {}, ProyectosEmpresa: {}, Usuario: { IdUsuario: 1 } };
    $scope.detEmp;
    $scope.proyectosEmp = {};
    $scope.NombreProy = null;
  
    //Llamadas a proyectos por empresa
    $scope.$on('$stateChangeSuccess', function () {
        if ($scope.detEmp == null) {          
            $scope.detEmp = proyService.getEmpresa();
        }
        $scope.showProyList($scope.detEmp.IdEmpresa);
        //proyService.getAll().then(function (response) {
        //    for (var i = 0; i < response.data.length; i++) {
        //        if (response.data[i].IdEmpresa == empService.getEmpresa().IdEmpresa) {
        //            $scope.proyectosEmp[i] = response.data[i];
        //            //console.log($scope.riesXProy[i].Nombre + " id: " + $scope.riesXProy[i].IdProyecto);
        //        }
        //    }
        //}, function (error) {
        //    console.log("Error occured ", error);
        //});
    });

    empService.getAll().then(function (response) {
        $scope.empresas = response.data;
    }, function (error) {
        console.log("Error occured ", error);
    });

    $scope.showProyList = function (pIdEmpresa) {
        proyService.getAll().then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].IdEmpresa == pIdEmpresa) {
                    $scope.proyectosEmp[i] = response.data[i];
                }
            }
            console.log(pIdEmpresa);
        }, function (error) {
            console.log("Error occured ", error);
        });
    }

    //empService.getById(pIdEmp).then(function (response) {
    //    $scope.empresa = response.data;
    //}, function (error) {
    //    //console.log("Error occured ", error);
    //});

    $scope.registrarEmpresa = function () {
        if ($scope.emp.Nombre.replace(/\s/g, '') != "" || $scope.emp.Nombre.replace(/\s/g, '') == null) {
            // JSON.stringify($scope.emp)
            empService.registrar($scope.emp.Nombre, 1);
            //Navega hacia la vista con la lista de empresas
            $state.go('Empresas.Lista');
        }
    }

    $scope.Borrar = function (pIdEmpresa) {
        empService.borrar(pIdEmpresa);
        $state.go('Empresas.Lista');
    }

    $scope.Cancelar = function () {
        $scope.emp.Nombre = null;
        $state.go('Empresas.Lista');
    }

    $scope.RegProyEmp = function (pIdEmp) {
        if ($scope.NombreProy.replace(/\s/g, '') != "" || $scope.NombreProy.replace(/\s/g, '') == null) {
            console.log("Registrando empresa: " + $scope.NombreProy + " ID: " + $scope.detEmp.IdEmpresa);
            proyService.registrar($scope.NombreProy, $scope.detEmp.IdEmpresa);
            $state.go('Empresas.Detalle', { paramEmp: $scope.detEmp });
        }
    }

    $scope.BorrarProyEmp = function (pIdProy) {
        proyService.borrar(pIdProy);
        $scope.detEmp = $stateParams.paramEmp;
        $state.go('Empresas.Detalle', { paramEmp: $scope.detEmp });
    }

    $scope.DetalleEmp = function (pEmp) {
        $scope.detEmp = pEmp;
        proyService.setEmpresa(pEmp);
        //$scope.showProyList(empService.getEmpresa().IdEmpresa);
        $state.go('Empresas.Detalle');
    }

    $scope.DetalleProy = function (pProy) {
        objService.setProyecto(pProy);
        $state.go('Proyectos.Detalle');
    }
});

app.controller("ProyectosCtrl", function (proyService, riesService, objService, $scope, $http, $state, $stateParams) {
    $scope.pagina = "Proyectos";
    $scope.proyectos = [];
    $scope.proyecto = {};
    $scope.Proy = { Nombre: $scope.NombreProy };
    $scope.detProy;
    /******************Objeto Riesgo********************/
    $scope.NombreRies = null;
    $scope.DescripcionRies = null;
    $scope.ProbabilidadRies = null;
    $scope.ImpactoRies = null;
    /******************Riesgo por proyectos ********************/
    $scope.detRies = $stateParams.paramRies;
    $scope.riesgos = [];

    /****************** Objetivos por proyectos ********************/
    $scope.objsXProy = []

    //Llamadas a listar
    proyService.getAll().then(function (response) {
        $scope.proyectos = response.data;
    }, function (error) {
        console.log("Error occured ", error);
    });

    proyService.getById($stateParams.id).then(function (response) {
        $scope.proyecto = response.data;
    }, function (error) {
        console.log("Error occured ", error);
    });

    $scope.Borrar = function (pIdProyecto) {
        alert(pIdProyecto);
        proyService.borrar(pIdProyecto);
        $scope.proyecto = null;
        $state.go('Proyectos.Lista');
    }

    $scope.Cancelar = function () {
        $scope.proyecto = null;
        $state.go('Proyectos.Lista');
    }

    $scope.RegRiesProy = function (pIdProy) {
        if ($scope.Ries == null) {
            alert("Riesgo nulo");
            //$scope.Ries = {
            //    Nombre: $scope.NombreRies.replace(/\s/g, ''),
            //    Descripcion: $scope.DescripcionRies.replace(/\s/g, ''),
            //    Probabilidad: $scope.ProbabilidadRies.replace(/\s/g, ''),
            //    Impacto: $scope.ImpactoRies.replace(/\s/g, ''),
            //    IdProyecto: $scope.proyecto.IdProyecto.replace(/\s/g, '')
            //}
            //riesService.regisProyEmp($scope.NombreProy, pIdProy);
            //$state.go('Riesgos.Lista');
        }
    }

    $scope.$on('$stateChangeSuccess', function () {
        $scope.detProy = objService.getProyecto();
        //console.log("Parametro proyecto: ", $scope.detProy);

        //Llamadas a objetivosos por proyecto
        objService.getAll().then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].IdProyecto == $scope.detProy.IdProyecto) {
                    $scope.objsXProy[i] = response.data[i];
                    //console.log($scope.objsXProy[i].Nombre);
                }
            }
        }, function (error) {
            console.log("Error occured ", error);
        });
    })

    $scope.DetalleObj = function (pProy) {
        objService.setProyecto(pProy);
        $state.go('Objetivos.Detalle');
    }
});

app.controller("ObjetivosCtrl", function (objService, riesService, $scope, $http, $state, $stateParams) {
    $scope.pagina = "Objetivos";
    $scope.objetivo = {};
    $scope.objetivos = [];
    $scope.objsXProy = [];
    $scope.detObj;
    $scope.riesgo = {};
    $scope.riesXProy = [];
    $scope.detObj = objService.getProyecto();

    $scope.Ries = { Nombre: null, Descripcion: null, Probabilidad: null, Impacto: null, IdProyecto: null }

    objService.getAll().then(function (response) {
        //alert($stateParams.id);
        $scope.objetivos = response.data;
        //alert($stateParams.idProy);
    }, function (error) {
        console.log("Error occured ", error);
    });

    objService.getById().then(function (response) {
        $scope.objetivo = response.data;
    }, function (error) {
        console.log("Error occured ", error);
    });

    $scope.Borrar = function (pIdObjetivo) {
        alert(pIdObjetivo);
        objService.borrar(pIdObjetivo);
        $scope.objetivo = null;
        $state.go('Objetivos.Lista');
    }

    $scope.Cancelar = function () {
        $scope.objetivo = null;
        $state.go('Objetivos.Lista');
    }

    $scope.$on('$stateChangeSuccess', function () {
        $scope.detObj = objService.getProyecto();
        riesService.getAll().then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].IdObjetivo == $scope.detObj.IdObjetivo) {
                    $scope.riesXProy[i] = response.data[i];
                    console.log("Nombre: "+$scope.riesXProy[i].Nombre+" "+$scope.riesXProy[i].IdRiesgo);
                }
            }
        }, function (error) {
            console.log("Error occured ", error);
        });
    })

    $scope.DetalleRies = function (pRiesgo) {
        riesService.setRiesgo(pRiesgo);
        $state.go('Riesgos.Detalle');
        //$state.go('Riesgos.Detalle', { paramObj: pObjetivo }, { reload: true });
    }

    $scope.getCategoria = function (pCat) {
        if (pCat == 3) { return "Alto"; } else
            if (pCat == 2) { return "Medio"; } else
                return "Bajo";
    }
});

app.controller("RiesgosCtrl", function (riesService, $scope, $http, $state, $stateParams, $q) {
    $scope.pagina = "Riesgos";
    $scope.riesgos = [];
    $scope.riesgo;
    $scope.detRies;

    $scope.$on('$stateChangeSuccess', function () {
        $scope.detRies = riesService.getRiesgo();
    })

    riesService.getAll().then(function (response) {
        $scope.riesgos = response.data;
    }, function (error) {
        console.log("Error occured ", error);
    });

    riesService.getById($stateParams.id).then(function (response) {
        $scope.riesgo = response.data;
    }, function (error) {
        console.log("Error occured ", error);
    });

    $scope.Borrar = function (pIdProyecto) {
        alert(pIdProyecto);
        riesService.borrar(pIdProyecto);
        $scope.riesgo = null;
        $state.go('Riesgos.Lista');
    }

    $scope.Cancelar = function () {
        $scope.riesgo = null;
        $state.go('Riesgos.Lista');
    }

});

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("", "/Index");
    $stateProvider
        .state("Usuarios", { //Seccion de Empresas
            url: "/Usuarios",
            templateUrl: "/AnalisisApp/Views/Usuarios.html"
        })
        .state("Usuarios.Lista", {
            url: "/Lista",
            templateUrl: "/AnalisisApp/Views/Usuarios/Lista.html"
        })
        .state("Usuarios.Ingreso", {
            url: "/Registrar",
            templateUrl: "/AnalisisApp/Views/Usuarios/Ingreso.html"
        })
        .state("Usuarios.Detalle", {
            url: "/Detalle:id",
            templateUrl: "/AnalisisApp/Views/Usuarios/Detalle.html",
            controller: 'UsuariosCtrl'
        })
        .state("Empresas", { //Seccion de Empresas
            url: "/Empresas",
            templateUrl: "/AnalisisApp/Views/Empresas.html"
        })
        .state("Empresas.Lista", {
            url: "/Lista",
            templateUrl: "/AnalisisApp/Views/Empresas/Lista.html"
        })
        .state("Empresas.Ingreso", {
            url: "/Ingreso",
            templateUrl: "/AnalisisApp/Views/Empresas/Ingreso.html"
        })
        .state("Empresas.Detalle", {
            url: "Empresas.Detalle",
            templateUrl: "/AnalisisApp/Views/Empresas/Detalle.html",
            controller: 'EmpresasCtrl',
            params: {
                paramEmp: null,
            }
        })
        .state("Proyectos", { //Seccion de Proyectos
            url: "/Proyectos",
            templateUrl: "/AnalisisApp/Views/Proyectos.html"
        })
        .state("Proyectos.Lista", {
            url: "/Lista",
            templateUrl: "/AnalisisApp/Views/Proyectos/Lista.html"
        })
        .state("Proyectos.Ingreso", {
            url: "/Ingreso",
            templateUrl: "/AnalisisApp/Views/Proyectos/Ingreso.html"
        })
        .state("Proyectos.Detalle", {
            url: "Proyecto.Detalle",
            templateUrl: "/AnalisisApp/Views/Proyectos/Detalle.html",
            controller: 'ProyectosCtrl',
            params: {
                paramProy: null,
            }
        })
        .state("Riesgos", { //Seccion de Riesgos
            url: "/Riesgos",
            templateUrl: "/AnalisisApp/Views/Riesgos/Lista.html"
        })
        .state("Riesgos.Lista", {
            url: "/Lista",
            templateUrl: "/AnalisisApp/Views/Riesgos/Lista.html"
        })
        .state("Riesgos.Registrar", {
            url: "/Registrar",
            templateUrl: "/AnalisisApp/Views/Riesgos/Registrar.html"
        })
        .state("Riesgos.Detalle", {
            url: "/Riesgos.Detalle",
            templateUrl: "/AnalisisApp/Views/Riesgos/Detalle.html",
            params: {
                paramRies: null,
            }
        })
        .state("Objetivos", { //Seccion de Objetivos
            url: "/Objetivos",
            templateUrl: "/AnalisisApp/Views/Objetivos.html",
            controller: 'ObjetivosCtrl'
        })
        .state("Objetivos.Lista", {
            url: "/Lista:idProy",
            templateUrl: "/AnalisisApp/Views/Objetivos/Lista.html",
            params: { 
                id:"",
                idProy: "",
              }
        })
        .state("Objetivos.Registrar", {
            url: "/Registrar",
            templateUrl: "/AnalisisApp/Views/Objetivos/Ingreso.html"
        })
        .state("Objetivos.Detalle", {
            url: "Objetivos.Detalle",
            templateUrl: "/AnalisisApp/Views/Objetivos/Detalle.html",
            controller: 'ObjetivosCtrl',
            params: {
                paramObj: null,
            }
        });
    $urlRouterProvider.otherwise("/Empresas/Lista");
});