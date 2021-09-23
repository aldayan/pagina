var nuevoId;
var db = openDatabase("itemDB", "1.0", "itemDB", 65535)

function limpiar() {

    document.getElementById("item").value = "";
    document.getElementById("precio").value = "";
}

// FUNCIONALIDAD DE LOS BOTONES

//ELIMINAR REGISTRO


function eliminar() {
    $(document).one('click', 'button[type="button "] ', function(event) {
        let id = this.id;
        var lista = [];
        $("#tabla").each(function() {
            var celdas = $(this).find('tr.Reg_' + id);
            celdas.each(function() {
                var registro = $(this).find('span.mid');
                registro.each(function() {
                    lista.push($(this).html())
                });
            });

        });

        nuevoId = lista[0].substr(1);

        db.transaction(function(transaction) {
            var sql = "DELETE FROM productos WHERE id=" + nuevoId + "; "
            transaction.executeSql(sql, undefined, function() {
                alert("Registro borrado, actualice la tabla ")

            }, function(transaction, error) {
                alert(error.message);
            })
        })
    });

}


//editar

function editar() {
    $(document).one('click', 'button[type="button "] ', function(event) {
        let id = this.id;
        var lista = [];
        $("#tabla").each(function() {
            var celdas = $(this).find('tr.Reg_' + id);
            celdas.each(function() {
                var registro = $(this).find('span');
                registro.each(function() {
                    lista.push($(this).html())
                });
            });

        });

        document.getElementById("item").value = lista[1];
        document.getElementById("precio").value = lista[2].slice(0, -5);

        nuevoId = lista[0].substr(1);

    })
}

$(function() {
    //ESTA PARTE CREA LA TABLA DE PRODUCTOS 
    $("#crear").click(function() {
        db.transaction(function(transaction) {
            var sql = "CREATE TABLE productos" + "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                "item VARCHAR2 (100) NOT NULL," + "precio DECIMAL(5,2) NOT NULL)";

            transaction.executeSql(sql, undefined, function() {
                alert("tabla creada exitosamente");

            }, function(transaction, error) {
                alert(error.message);



            })


        });
    });

    //CARGA LA LISTA DE PRODUCTOS

    $("#listar").click(function() {
        cargarDatos();

    });


    //FUNCION PARA LISTAR Y PINTAR LA TABLA DE LOS PRODUCTOS EN LA PAGINA WEB
    function cargarDatos() {
        $("#tabla").children().remove;
        db.transaction(function(transaction) {

            var sql = "SELECT * FROM productos ORDER BY id DESC";
            transaction.executeSql(sql, undefined, function(transaction, result) {
                    if (result.rows.length) {
                        $("#tabla").append('<tr><th>Codigo</th><th>Producto</th><th>Precio</th><th></th><th></th></tr>');
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            var item = row.item;
                            var id = row.id;
                            var precio = row.precio;
                            $("#tabla").append('<tr id="fila' + id + '" class="Reg_A ' +
                                id + '"> <td><span class="mid"> A' + id + '</span></td> <td><span> ' +
                                item + ' </span> </td>  <td><span>' +
                                precio + '</span> </td> <td> <button type="button" id="A' + id + '"  class="btn btn-warning"  onclick="editar()"><img src="libs/img/edt.png"></button> </td> <td> <button type="button" id="A' + id + '" class="btn btn-danger" onclick="eliminar()"><img src="libs/img/borr.png"></button></td> < /tr>');


                        }
                    } else {
                        $("#tabla").append('<tr><td colspan="5" align="center"> no existen</td></tr>');

                    }

                },
                function(transaction, error) {
                    alert(error.message);

                })


        })
    }

    //INSERTAR REGISTROS

    $("#insertar").click(function() {

        var item = $("#item").val();
        var precio = $("#precio").val();

        db.transaction(function(transaction) {
            var sql = "INSERT INTO productos (item,precio) VALUES(?,?)";
            transaction.executeSql(sql, [item, precio], function() {

            }, function(transaction, error) {
                alert(error.message);
            })
        })
        limpiar();
        cargarDatos();

    })

    // PARA BORRAR TODA LAS LISTA DE REGISTROS

    $("#borrarTodo").click(function() {

        if (!confirm("Esta seguro de que desea borrar la tabla, todos los datos se perderan"))
            return;
        db.transaction(function(transaction) {
            var sql = "DROP TABLE productos";
            transaction.executeSql(sql, undefined, function() {
                alert("Tabla borrada, por favor, actualice la pagina")
            }, function(transaction, error) {
                alert(error.message);

            })


        })

    })



})