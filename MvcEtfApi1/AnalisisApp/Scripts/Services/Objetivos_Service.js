app.factory('objService', function ($http, $stateParams) {
    return {
        empId: null,
        paramObj: null,

        getAll: function (pIdProy) {
            //return proimise from here
            var objs = $http({
                method: 'GET',
                url: 'api/objetivos'
            });

            return objs;
        },

        getById: function (pId) {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/objetivos',
                params: { id: pId }
            });
        },

        registrar: function (pObj, pIdProy) {         
            $http({
                method: "POST",
                url: "/api/objetivos",
                dataType: 'json',
                data: {
                    Nombre: pObj.Nombre,                  
                    Descripcion: pObj.Descripcion,
                    fechaInicio: pObj.fechaInicio,
                    fechaFin: pObj.fechaFin,
                    horasEstimadas: pObj.horasEstimadas,
                    costoHoraRecurso: pObj.costoHoraRecurso,
                    horasInvertidas: pObj.horasInvertidas,
                    nombreDelRecurso: pObj.nombreDelRecurso,
                    estado: 0,
                    IdProyecto: pIdProy
                },
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                return true;
            }, function myError(response) {
                alert("Error al registrar " + pObj.Nombre);
                return false;
            });
        },

        borrar: function (pId) {
            $http({
                method: 'DELETE',
                url: 'api/objetivos/' + pId
            }).then(function (response) {
                return true;
            });
        },

        setProyecto: function (pData) {
            paramObj = pData;
            console.log("Set proyecto @ Objetivo service ");
        },

        getProyecto: function () {
            return paramObj;
        }
    };
});
