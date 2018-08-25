app.factory('proyService', function ($http, $stateParams, $q, riesService, objService) {
    var factory = {}
    var paramObj = {};
    var proyecto = {};

    factory.getAll = function () {
        //return proimise from here
        return $http({
            method: 'GET',
            url: 'api/proyectos'
        });
    }

    factory.getById = function (pIdProy) {
        //return proimise from here
        return $http({
            method: 'GET',
            url: 'api/proyectos',
            params: { id: pIdProy }
        });
    }

    factory.getProyEmp = function (pIdEmpresa) {
        var deferred = $q.defer();
        var proys = $http({
            method: 'GET',
            url: 'api/proyectos'
        });
        var pry = [];
        pry = factory.getAll();
        for (var i = 0; i < proys.length; i++) {
            if (proys[i].IdEmpresa == pIdEmpresa) {
                pry[i] = proys[i];
                console.log(proys[i].Nombre);
            }
        }
        //console.log("Recepcion de id de mepresa # " + pIdEmpresa + " En getProyEmp()");
        deferred.resolve(pry);

        return deferred.promise;
    }

    factory.registrar = function (pNombre, pFechaInicio, pFechaFin, pPresupuesto, pIdEmp) {
        $http({
            method: "POST",
            url: "/api/proyectos",
            dataType: 'json',
            data: {
                Nombre: pNombre,
                fechaInicio: pFechaInicio,
                fechaFin: pFechaFin,
                presupuestoTotal: pPresupuesto,
                IdEmpresa: pIdEmp
            },
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return true;
        }, function myError(response) {
            alert("Error al registrar el proyecto " + pNombre);
            return false;
        });
    }

    factory.borrar = function (pId) {
        $http({
            method: 'DELETE',
            url: 'api/proyectos/' + pId
        }).then(function (response) {
            return true;
        });
    }

    factory.regisRiesProy = function (pRies, pIdProy) {
        riesService.registrar(pRies, pIdProy);
    }

    factory.regisObjProy = function (pObj, pIdProy) {
        objService.registrar(pObj, $stateParams.id);
    }

    factory.getEmpresa = function () {
            return paramObj;
    }

    factory.setEmpresa = function (pData) {
        paramObj = pData;
        console.log("Set empresa @ Proyecto service ");
    }

    factory.getProyecto = function () {
        return proyecto;
    }

    factory.setProyecto = function (pData) {
        proyecto = pData;
    }
    return factory;
});
