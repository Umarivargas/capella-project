app.factory('analisisEVService', function ($http, $stateParams, proyService) {
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
        getByName: function (pnombreProyecto) {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/proyectos',
                params: { Nombre: pnombreProyecto }
            });
        },

        registrar: function (pnombreProyecto, pfechaInicio, pfechaFin, ppresupuestoTotal, pIdEmp) {
            $http({
                method: "POST",
                url: "/api/proyectos",
                dataType: 'json',
                data: {
                    Nombre: pnombreProyecto,
                    fechaInicio: pfechaInicio,
                    fechaFin: pfechaFin,
                    presupuestoTotal: ppresupuestoTotal,
                    IdEmpresa: pIdEmp
                },
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                alert("El proyecto " + pnombreProyecto + " ha sido registrado existosamente ");
                return true;
            }, function myError(response) {
                alert("Error al registrar el proyecto" + pnombreProyecto);
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
