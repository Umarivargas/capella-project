app.factory('empService', function ($http, $stateParams, proyService) {
    return {
        empId: null,
        paramObj: null,

        getAll: function () {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/empresas'
            });
        },

        getProyEmp: function () {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/proyectos'
            });
        },

        getById: function (pId) {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/empresas',
                params: { id: pId }
            });
        },

        regisEmp: function (pEmp, pIdUsr) {
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
        },

        borrar: function (pId) {
            $http({
                method: 'DELETE',
                url: 'api/Empresas/' + pId
            }).then(function (response) {
                return true;
            });
        },

        regisProyEmp: function (pProy, pIdEmp) {
            proyService.registrar(pProy, pIdEmp);
        },
        getEmpresa: function () {
            return paramObj;
        },

        setEmpresa: function (pData) {
            paramObj = pData;
            console.log("Set empresa @ Empresa service ");
        }
    };
});