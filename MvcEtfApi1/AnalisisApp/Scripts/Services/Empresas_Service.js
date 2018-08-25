app.factory('empService', function ($http, $stateParams, $q, proyService) {
    var factory = {}
    var empId = null;
    var paramObj = null;

    factory.getAll = function () {
        //return proimise from here
        return $http({
            method: 'GET',
            url: 'api/empresas'
        });
    }

    factory.getProyEmp = function () {
        //return proimise from here
        return $http({
            method: 'GET',
            url: 'api/proyectos'
        });
    }

    factory.getById = function (pId) {
        //return proimise from here
        return $http({
            method: 'GET',
            url: 'api/empresas',
            params: { id: pId }
        });
    }

    factory.regisEmp = function (pEmp, pIdUsr) {
        $http({
            method: "POST",
            url: "/api/empresas",
            dataType: 'json',
            data: {
                Nombre: pEmp.Nombre,
                IdUsuario: pIdUsr
            },
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return true;
        }, function myError(response) {
            alert("Error al registrar " + pEmp.Nombre);
            return false;
        });
    }

    factory.borrar = function (pId) {
        $http({
            method: 'DELETE',
            url: 'api/Empresas/' + pId
        }).then(function (response) {
            return true;
        });
    }

    factory.regisProyEmp = function (pProy, pIdEmp) {
        proyService.registrar(pProy, pIdEmp);
    }

    factory.getEmpresa = function () {
        return paramObj;
    }

    factory.setEmpresa = function (pData) {
        paramObj = pData;
        console.log("Set empresa @ Empresa service ");
    }

    factory.asyncGreet = function (pEmp) {

        //factory.setEmpresa(pEmp);

        var deferred = $q.defer();

        setTimeout(function () {
            deferred.notify('About to greet ');

            if (pEmp) {
                
                alert(pEmp.Nombre+" En time out");
                deferred.resolve('Hello, ');
            } else {
                deferred.reject('Greeting ');
            }
        }, 1000);

        return deferred.promise;
    }

    return factory;
});