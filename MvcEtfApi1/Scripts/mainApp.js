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
    $scope.nombreProyecto = null;
    $scope.diasTranscurridos = 0;

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

    $scope.irAnalisis = function (pProy) {
        objService.setProyecto(pProy);
        $state.go('AnalisisEV');
    }

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
    /**Funciones del earned value***/

    /** Valor ganado**/

    $scope.returnValorGanado = function (pidProyecto) {
        proyService.getAll().then(function (response) {
            var respuesta;
            for (var count = 0; count < response.data.length; count++) {
                if (response.data[count].IdProyecto == pidProyecto) {
                     respuesta = response.data[count].ObjetivosProyectoes;
                }
            }
           
            var BAC = 0;
            var objTarea;
            var valorGanadoTarea = 0;
            var porcentajeCompletadoTarea = 0;
            var actualCompletadoTarea = "";
            var sumaValorGanadoTarea = 0;
            var sumaHrsEstimadasTarea = 0;
            var sumaCostoXHoraTarea = 0;
            for (var i = 0; i < respuesta.length; i++) {
                objTarea = respuesta[i];
                sumaHrsEstimadasTarea = objTarea.Objetivo.horasEstimadas;
                sumaCostoXHoraTarea =objTarea.Objetivo.costoHoraRecurso;
                BAC = (sumaHrsEstimadasTarea * sumaCostoXHoraTarea);
                porcentajeCompletadoTarea = objTarea.Objetivo.porcentajeCompletitud;

                if (porcentajeCompletadoTarea == "Completada - 100%") {
                    actualCompletadoTarea = 100;
                } else {
                    porcentajeCompletadoTarea = porcentajeCompletadoTarea.replace("%", "");
                    porcentajeCompletadoTarea = porcentajeCompletadoTarea.replace("En Progreso - ", "");
                    porcentajeCompletadoTarea = porcentajeCompletadoTarea.replace("Pendiente - ", "");
                    actualCompletadoTarea = parseInt((porcentajeCompletadoTarea).replace(" ", ""));
                }
                valorGanadoTarea = ((BAC * actualCompletadoTarea) / 100);
                sumaValorGanadoTarea = (sumaValorGanadoTarea + valorGanadoTarea);
            }
            $scope.sumaValorGanadoTarea = sumaValorGanadoTarea;
            return sumaValorGanadoTarea;
        }, function (error) {
            console.log("Error en calculo del valor ganado ", error);
            return false;
        });
    }


    /** Valor planeado**/

    $scope.returnValorPlaneado = function (pidProyecto) {

        proyService.getAll().then(function (response) {
            var respon;
            for (var count = 0; count < response.data.length; count++) {
                if (response.data[count].IdProyecto == pidProyecto) {
                    respon = response.data[count].ObjetivosProyectoes;
                }
            }
            var BAC = 0;
            var objTarea;
            var valorPlaneadoTarea = 0;
            var porcentajeCompletadoTarea = 0;
            var actualCompletadoTarea = "";
            var sumaValorPlaneadoTarea = 0;
            var sumaHrsEstimadasTarea = 0;
            var sumaCostoXHoraTarea = 0;
            var diasTranscurridos = 0;
            var objData;
            var porcentajeCompleEstimadoFecha = 0;

            var fechaInicial = 0;
            var dateFechaInicial = 0;
            var dateFechaActual;
            var dateFechaFin = 0;
            var fechaFinal = 0;
            var diasEntreFechaInicialFinal = 0;
            var sumaPorcentajeEsperadoCompletado = 0;
            // Calculo de fecha Actual *****************************************
            var hoy = new Date();
            var dd = hoy.getDate();
            var mm = hoy.getMonth() + 1;
            var yyyy = hoy.getFullYear();
            var fechaActual = yyyy + "/" + mm + "/" + dd + " 00:00:00";
            var fechaActual = fechaActual.split(" 00:00:00");

            for (var i = 0; i < respon.length; i++) {
                objTarea = respon[i];
                //Fecha inicial
                fechaInicial = objTarea.Objetivo.fechaInicio;
                fechaInicial = fechaInicial.split(" 00:00:00");
                dateFechaInicial = new Date(fechaInicial);
                //Fecha Actual
                dateFechaActual = new Date(fechaActual);

                diasEntreFechaInicialFinal = $scope.calcularDifFechaInicialFinal(dateFechaFin, dateFechaInicial);
                diasTranscurridos = diasTranscurridos + $scope.calcularDifFechaInicialFinal(dateFechaActual, dateFechaInicial);

                sumaHrsEstimadasTarea = objTarea.Objetivo.horasEstimadas;
                sumaCostoXHoraTarea = objTarea.Objetivo.costoHoraRecurso;
                BAC = BAC + ((diasTranscurridos *8) * sumaCostoXHoraTarea);
                diasTranscurridos = 0;
            }
            sumaValorPlaneadoTarea = Math.round((BAC * $scope.porcentajeCompleEstimadoFecha) / 100);
            $scope.sumaValorPlaneadoTarea = sumaValorPlaneadoTarea;

           return sumaValorPlaneadoTarea;
        }, function (error) {
            console.log("Error en calculo del valor planeado ", error);
            return false;
        });
    }

    /** Costo Actual**/

    $scope.returnCostoActual = function (pidProyecto) {
        proyService.getAll().then(function (response) {
            var respon;
            for (var count = 0; count < response.data.length; count++) {
                if (response.data[count].IdProyecto == pidProyecto) {
                    respon = response.data[count].ObjetivosProyectoes;
                }
            }
            var BAC = 0;
            var objTarea;
            var costoActual = 0;
            var porcentajeCompletadoTarea = 0;
            var actualCompletadoTarea = "";
            var sumaCostoActual = 0;
            var sumaHrsInvertidas = 0;
            var sumaCostoXHoraTarea = 0;
            for (var i = 0; i < respon.length; i++) {
                objTarea = respon[i];
                sumaHrsInvertidas = objTarea.Objetivo.horasInvertidas;
                sumaCostoXHoraTarea = objTarea.Objetivo.costoHoraRecurso;
                
                sumaCostoActual = sumaCostoActual+(sumaHrsInvertidas * sumaCostoXHoraTarea);
            }
            $scope.costoActual = sumaCostoActual;
            return costoActual;
        }, function (error) {
            console.log("Error en calculo del costoActual ", error);
            return false;
        });
    }

    /** Cost variable**/

    $scope.returnCV = function (pidProyecto) {

        var returnValue = $scope.returnValorGanado(pidProyecto) - $scope.returnCostoActual(pidProyecto);
        var costoVariable= "";
        if (returnValue > 1) {
            costoVariable = "Por Debajo del presupuesto: " + costoVariable;
        } else if (returnValue == 1) {
            costoVariable = "Dentro del presupuesto: " + costoVariable;
        } else if (returnValue < 1) {
            costoVariable = "Fuera del presupuesto: " + costoVariable;
        }
        $scope.costoVariable = costoVariable;
        return costoVariable;
    }
    /** Schedule variance**/

    $scope.returnSV = function (pidProyecto) {

        var scheduleVariance = this.returnValorGanado(pidProyecto) - this.returnValorPlaneado(pidProyecto);
        $scope.scheduleVariance = scheduleVariance;
        return scheduleVariance;
    }
    /** SPI**/

    $scope.returnSPI = function (pidProyecto) {

        var spiResult = this.returnValorGanado(pidProyecto) / this.returnValorPlaneado(pidProyecto);
        $scope.spiResult = spiResult;
        return spiResult;
    }
    /** CPI**/

    $scope.returnCPI = function (pidProyecto) {

        var cpi = this.returnValorGanado(pidProyecto) / this.returnCostoActual(pidProyecto);
        var cpiResult = "";
        if (cpi < 1) {
            cpiResult = "Fuera del presupuesto" + cpi;
        } else if (cpi == 1) {
            cpiResult = "Dentro del presupuesto: " + cpi;
        } else if (cpi > 1) {
            cpiResult = "Debajo del presupuesto: " + cpi;
        }

        $scope.cpiResult = cpiResult;
        return cpiResult;
    }

    $scope.returnPorcentajeActualCompletado = function (pidProyecto) {
        proyService.getAll().then(function (response) {
            var respon;
            for (var count = 0; count < response.data.length; count++) {
                if (response.data[count].IdProyecto == pidProyecto) {
                    respon = response.data[count].ObjetivosProyectoes;
                }
            }
                // Calculo de fecha Actual *****************************************
                var hoy = new Date();
                var dd = hoy.getDate();
                var mm = hoy.getMonth() + 1;
                var yyyy = hoy.getFullYear();
                var fechaActual = yyyy + "/" + mm + "/" +dd  + " 00:00:00";
                var fechaActual = fechaActual.split(" 00:00:00");
                //******************************************************************
            
                var objData;
                var porcentajeCompleEstimadoFecha = 0;
                var diasTranscurridos = 0;
                var fechaInicial = 0;
                var dateFechaInicial = 0;
                var dateFechaActual;
                var dateFechaFin = 0;
                var fechaFinal = 0;
                var diasEntreFechaInicialFinal = 0;
                var sumaPorcentajeEsperadoCompletado = 0;
                for (var i = 0; i < respon.length; i++) {
                    objData = respon[i];
                    //Fecha inicial
                    fechaInicial = objData.Objetivo.fechaInicio;
                    fechaInicial = fechaInicial.split(" 00:00:00");
                    dateFechaInicial = new Date(fechaInicial);
                    //fechaInicial = dateFechaInicial.getTime();*/

                    //Fecha final
                    fechaFinal = objData.Objetivo.fechaFin;
                    fechaFinal = fechaFinal.split(" 00:00:00");
                    dateFechaFin = new Date(fechaFinal);
                    //fechaFinal = dateFechaFin.getTime();

                    //Fecha Actual
                    dateFechaActual = new Date(fechaActual);
                    /*fechaActual = dateFechaActual.getTime();

                    //Dias entre fecha inicial y final
                    var semanas = 0;
                    diasEntreFechaInicialFinal = Math.abs(fechaInicial - fechaFinal);
                    diasEntreFechaInicialFinal = Math.round(diasEntreFechaInicialFinal / (1000 * 60 * 60 * 24));
                    semanas = diasEntreFechaInicialFinal / 7;
                    diasEntreFechaInicialFinal = Math.round(diasEntreFechaInicialFinal - ((diasEntreFechaInicialFinal / 7)));//Semanas
                    //diasEntreFechaInicialFinal = ((diasEntreFechaInicialFinal-(semanas*2)) / 4);

                    //Dias entre fecha inicial y actual
                    diasTranscurridos = Math.abs(fechaInicial - fechaActual);
                    diasTranscurridos = Math.round(diasTranscurridos / (1000 * 60 * 60 * 24));
                    diasTranscurridos = Math.round(diasTranscurridos - ((diasTranscurridos / 7)));//Semanas
                    semanas = diasTranscurridos / 7;
                    diasTranscurridos = ((diasTranscurridos - (semanas * 2)) / 4);*/

                    diasEntreFechaInicialFinal = $scope.calcularDifFechaInicialFinal(dateFechaFin, dateFechaInicial);
                    diasTranscurridos = $scope.calcularDifFechaInicialFinal(dateFechaActual, dateFechaInicial);

                    if (diasTranscurridos >= 0 && diasTranscurridos <= (diasEntreFechaInicialFinal * 0.25)) {
                        sumaPorcentajeEsperadoCompletado = sumaPorcentajeEsperadoCompletado+ 25;
                    } else if (diasTranscurridos > (diasEntreFechaInicialFinal * 0.25) && diasTranscurridos <= (diasEntreFechaInicialFinal * 0.50)) {
                        sumaPorcentajeEsperadoCompletado = sumaPorcentajeEsperadoCompletado +50;
                    } else if (diasTranscurridos > (diasEntreFechaInicialFinal * 0.50) && diasTranscurridos <= (diasEntreFechaInicialFinal * 0.75)) {
                        sumaPorcentajeEsperadoCompletado = sumaPorcentajeEsperadoCompletado + 75;
                    } else if (diasTranscurridos > (diasEntreFechaInicialFinal * 0.75) && diasTranscurridos <= ((diasEntreFechaInicialFinal * 100)/100)) {
                        sumaPorcentajeEsperadoCompletado = sumaPorcentajeEsperadoCompletado + 100;
                    }
                  
                }
                
               var porcentajeCompleEstimadoFecha = Math.round((sumaPorcentajeEsperadoCompletado / (respon.length * 100)) * 100);
                $scope.porcentajeCompleEstimadoFecha = porcentajeCompleEstimadoFecha;
                return porcentajeCompleEstimadoFecha;

            }, function (error) {
                console.log("Error calculando porcentaje actual completado ", error);
                return false;
            });
    }

    function calcDiasTranscurridos(pidProyecto) {
        var diasTranscurridos = 0;
        var respon;
        proyService.getAll().then(function (response) {
            for (var count = 0; count < response.data.length; count++) {
                if (response.data[count].IdProyecto == pidProyecto) {
                    respon = response.data[count].ObjetivosProyectoes;
                }
            }
        
            // Calculo de fecha Actual *****************************************
            var hoy = new Date();
            var dd = hoy.getDate();
            var mm = hoy.getMonth() + 1;
            var yyyy = hoy.getFullYear();
            var fechaActual = yyyy + "/" + mm + "/" + dd + " 00:00:00";
            var fechaActual = fechaActual.split(" 00:00:00");
            //******************************************************************

            var objData;
            var porcentajeCompleEstimadoFecha = 0;
            
            var fechaInicial = 0;
            var dateFechaInicial = 0;
            var dateFechaActual;
            var dateFechaFin = 0;
            var fechaFinal = 0;
            var diasEntreFechaInicialFinal = 0;
            var sumaPorcentajeEsperadoCompletado = 0;
            for (var i = 0; i < respon.length; i++) {
                objData = respon[i];
                //Fecha inicial
                fechaInicial = objData.Objetivo.fechaInicio;
                fechaInicial = fechaInicial.split(" 00:00:00");
                dateFechaInicial = new Date(fechaInicial);
                //fechaInicial = dateFechaInicial.getTime();*/
                
                //Fecha Actual
                dateFechaActual = new Date(fechaActual);

                diasEntreFechaInicialFinal = $scope.calcularDifFechaInicialFinal(dateFechaFin, dateFechaInicial);
                diasTranscurridos = diasTranscurridos+$scope.calcularDifFechaInicialFinal(dateFechaActual, dateFechaInicial);
            }
            $scope.diasTranscurridos = diasTranscurridos;
            return diasTranscurridos;
        }, function (error) {
            console.log("Error calculando porcentaje actual completado ", error);
            return false;
        });
         return diasTranscurridos;
    }

    //empService.getById(pIdEmp).then(function (response) {
    //    $scope.empresa = response.data;
    //}, function (error) {
    //    //console.log("Error occured ", error);
    //});
    $scope.calcularDifFechaInicialFinal = function(dateFechaFin, dateFechaInicial){
        if (dateFechaFin < dateFechaInicial) {
            return 0;
        }

        // Calculate days between dates
        var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
        dateFechaInicial.setHours(0, 0, 0, 1);  // Start just after midnight
        dateFechaFin.setHours(23, 59, 59, 999);  // End just before midnight
        var diff = dateFechaFin - dateFechaInicial;  // Milliseconds between datetime objects    
        var days = Math.ceil(diff / millisecondsPerDay);

        // Subtract two weekend days for every week in between
        var weeks = Math.floor(days / 7);
        days = days - (weeks * 2);

        // Handle special cases
        var startDay = dateFechaInicial.getDay();
        var endDay = dateFechaFin.getDay();

        // Remove weekend not previously removed.   
        if (startDay - endDay > 1) {
            days = days - 2;
        }

        // Remove start day if span starts on Sunday but ends before Saturday
        if (startDay == 0 && endDay != 6) {
            days = days - 1;
        }

        // Remove end day if span ends on Saturday but starts after Sunday
        if (endDay == 6 && startDay != 0) {
            days = days - 1;
        }
        return days;
    }

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
    $scope.RegObjProy = function (pIdProy) {
        var fechaInicio = ($scope.fechaInicioObjetivo) + " 00:00:00";
        var fechaFin = ($scope.fechaFinObjetivo) + " 00:00:00";
        var estado=1;
        console.log("Registrando Tarea: " + $scope.nombreRegistroTarea);
        objService.registrar($scope.nombreRegistroTarea, $scope.descripcionRegistroTarea, fechaInicio, fechaFin, $scope.hrasEstimadasObjetivo, $scope.recursoAsignadoCostoObjetivo, $scope.hrasInvertidasObjetivo, $scope.recursoAsignadoObjetivo, estado, $scope.detProy.IdProyecto);
        $state.go('Proyectos.Detalle', { paramEmp: $scope.detEmp });
    }
    $scope.RegProyEmp = function (pIdEmp) {
            var fechaInicio = ($scope.fechaInicioProyecto)+" 00:00:00";
            var fechaFin = ($scope.fechaFinProyecto) + " 00:00:00";
            var presupuestoTotal = parseInt($scope.presupuestoTotal, 10)
            proyService.registrar($scope.nombreProyecto, fechaInicio, fechaFin, presupuestoTotal, $scope.detEmp.IdEmpresa);
        console.log("Registrando proyecto: " + $scope.nombreProyecto);
            $state.go('Empresas.Detalle', { paramEmp: $scope.detEmp });
  
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
    $scope.Proy = { Nombre: $scope.nombreProyecto };
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

    $scope.RegObjProy = function (pIdProy) {
        var fechaInicio = ($scope.fechaInicioObjetivo) + " 00:00:00";
        var fechaFin = ($scope.fechaFinObjetivo) + " 00:00:00";
        var estado;
        if ($scope.estadoObjetivo == "Completado") {
            estado = 0;
        } else {
            estado = 1;
        }
        console.log("Registrando Tarea: " + $scope.nombreRegistroTarea);
        objService.registrar($scope.nombreRegistroTarea, $scope.descripcionRegistroTarea, fechaInicio, fechaFin, $scope.hrasEstimadasObjetivo, $scope.recursoAsignadoCostoObjetivo, $scope.hrasInvertidasObjetivo, $scope.recursoAsignadoObjetivo, estado, $scope.detProy.IdProyecto);
        $state.go('Proyectos.Detalle', { paramEmp: $scope.detEmp });
    }
   
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
        .state("AnalisisEV", {
            url: "/AnalisisEV",
            templateUrl: "/AnalisisApp/Views/AnalisisEV.html",
            controller: 'ProyectosCtrl',
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