app.factory('proyService', function ($http, $stateParams, riesService, objService) {
    return {
        paramObj: null,

        getAll: function () {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/proyectos'
            });
        },

        getById: function (pIdProy) {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/proyectos',
                params: { id: pIdProy }
            });
        },

        registrar: function (pNomProy, pIdEmp) {
            $http({
                method: "POST",
                url: "/api/proyectos",
                dataType: 'json',
                data: {
                    Nombre: pNomProy,
                    IdEmpresa: pIdEmp
                },
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                return true;
            }, function myError(response) {
                alert("Error al registrar " + nomProy);
                return false;
            });
        },

        borrar: function (pId) {
            $http({
                method: 'DELETE',
                url: 'api/proyectos/' + pId
            }).then(function (response) {
                return true;
            });
        },

        regisRiesProy: function (pRies, pIdProy) {
            riesService.registrar(pRies, pIdProy);
        },

        regisObjProy: function (pObj, pIdProy) {
            objService.registrar(pObj, $stateParams.id);
        },

        getEmpresa: function () {
            if (paramObj != null) {
               return paramObj;
            }else
            return null;
        },

        setEmpresa: function (pData) {
            paramObj = pData;
            console.log("Set empresa @ Proyecto service ");
        }
    };
});
