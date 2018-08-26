app.factory('objService', function ($http, $stateParams) {
    return {
        empId: null,
        paramObj: null,

        getObjetivosProyecto: function (pidProyecto) {
            return $http({
                method: 'GET',
                url: 'api/ObjetivosProyectos/' + pidProyecto
            });
        },
        getAll: function (pIdProy) {
            //return proimise from here
            var objs = $http({
                method: 'GET',
                url: 'api/objetivos'
            });

            //if (pIdProy != null) {
            //    for (var i = 0; i < objs.length; i++) {
            //        if (objs[i][IdProyecto] === value) {
            //            array[i];
            //        }
            //    }

            //    return objs.results.find(result => result.IdObjetivo != null);
            //} else {
            //    alert(pIdProy + " nulo");
            return objs;
            //}
        },

        getById: function (pId) {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/objetivos',
                params: { id: pId }
            });
        },

        registrar: function (pnombreRegistroTarea,pdescripcionRegistroTarea,pfechaInicio,pfechaFin,phrasEstimadasObjetivo,precursoAsignadoCostoObjetivo,phrasInvertidasObjetivo,precursoAsignadoObjetivo, pestadoObjetivo,pIdProy) {
            $http({
                method: "POST",
                url: "/api/objetivos",
                dataType: 'json',
                data: {
                    Nombre: pnombreRegistroTarea,
                    Descripcion: pdescripcionRegistroTarea,
                    fechaInicio: pfechaInicio,
                    fechaFin: pfechaFin,
                    horasEstimadas: phrasEstimadasObjetivo,
                    costoHoraRecurso: precursoAsignadoCostoObjetivo,
                    horasInvertidas: phrasInvertidasObjetivo,
                    nombreDelRecurso: precursoAsignadoObjetivo,
                    estado: pestadoObjetivo,
                    IdProyecto: pIdProy
                },
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                alert("La tarea " + pnombreRegistroTarea + " ha sido registrado existosamente ");
                return true;
            }, function myError(response) {
                alert("Error al registrar la tarea" + pnombreRegistroTarea);
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
