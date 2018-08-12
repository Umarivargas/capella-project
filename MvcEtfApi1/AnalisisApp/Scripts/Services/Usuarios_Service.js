app.factory('usrService', function ($http, $stateParams) {
    return {
        usrId: null,

        //getAll: function () {
        //    //return proimise from here
        //    return $http({
        //        method: 'GET',
        //        url: 'api/usuarios'
        //    });
        //},

        getById: function (pId) {
            //return proimise from here
            return $http({
                method: 'GET',
                url: 'api/usuarios',
                params: { id: pId }
            });
        }
        //,
        //registrar: function (pUsr) {
        //    $http({
        //        method: "POST",
        //        url: "/api/usuarios",
        //        dataType: 'json',
        //        data: {
        //            Nombre: pUsr.Nombre,
        //            Apellidos: pUsr.Apellidos,
        //            CorreoElec: pUsr.CorreoElec,
        //            Password: pUsr.Password
        //        },
        //        headers: { "Content-Type": "application/json" }
        //    });
        //},

        //borrar: function (id) {
        //    $http({
        //        method: 'DELETE',
        //        url: 'api/usuarios/' + id
        //    });
        //}
    };
});