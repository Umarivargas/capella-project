app.factory('riesService', function ($http, $stateParams) {
    return {
        paramObj: null,

        riesObj: null,

        getAll: function () {
            //return proimise from here          
            return $http({
                method: 'GET',
                url: 'api/Riesgos'
            });
        },
       
        getById: function (pId) {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/riesgos',
                params: { id: pId }
            });
        },

        registrar: function (pRies, pIdProy) {
            $http({
                method: "POST",
                url: "/api/riesgos",
                dataType: 'json',
                data: {
                    Nombre: pRies.Nombre,
                    IdProyecto: pIdProy
                },
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                return true;
            }, function myError(response) {
                alert("Error al registrar " + pRies.Nombre);
                return false;
            });
        },

        borrar: function (pId) {
            $http({
                method: 'DELETE',
                url: 'api/riesgos/' + pId
            }).then(function (response) {
                return true;
            });
        },

        setRiesgo: function (pData) {
            riesObj = pData;
            console.log("Set Riesgo @ Riesgo service ");
        },

        getRiesgo: function () {
            return riesObj;
        },

        setObjetivo: function (pData) {
            paramObj = pData;
            console.log("Set objetivo @ Riesgo service ");
        },

        getObjetivo: function () {
            return paramObj;
        }
    };
});