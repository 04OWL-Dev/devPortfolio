
function CargarSelectDB(url,idSelect){
    $.getJSON(url,function(data){
        let almacena="";
        $(`#${idSelect} > option`).remove();
        var i = 1;
        $.each(data, function(id,value){
            almacena = "valores= " + id + " Dato = " + value;
            $(`#${idSelect}`).append('<option value="'+value.id+'">'+value.concepto+'</option>');
        })
        
        $(`#${idSelect}`).trigger('change');
    });
}
function dir(url,idSelect){
    $.getJSON(url,function(data){
        let almacena="";
        $(`#${idSelect} > option`).remove();
        var i = 1;
        //console.log(url)
        $.each(data, function(id,value){
            almacena = "valores= " + id + " Dato = " + value.nombre;
            //console.log(almacena)
            $(`#${idSelect}`).append('<option value="'+value.id+'">'+value.nombre+'</option>');
        })
        
        $(`#${idSelect}`).trigger('change');
    });
}

//Noty Master function
function generateNoty(layout, text, type) {
    var n = noty({
        text: text,
        type: type,
        dismissQueue: true,
        layout: layout,
        theme: 'relax',
        timeout: 4000
    });
}

function procesarFormulario(idFormulario){
    var i = true;
    valorfinal = "";
    $("#"+idFormulario).find("input, select, textarea").each(function(){
      var type = "";
        var $me = $(this);
        var campo = $me.prop("tagName").toUpperCase();
        // si no se especificó un campo, ignoramos el elemento
        //if (!campo || (campo == "INPUT" && $me.attr("type").toUpperCase() == "HIDDEN")) return;
            // dependiendo de que tipo de control se trate
        var valor = undefined;
        console.log($me.attr("type"),$me.prop('name'));//FILTRO
        switch ($me[0].nodeName.toUpperCase()){
            case "TEXTAREA":
                valor = $me.val();
                break;
            case "LABEL":
                valor = $me.text();
                break;
            case "INPUT":
                type = $me.attr("type").toUpperCase();
                if (type == "CHECKBOX" || type == "RADIO"){
                    valor = $me.prop("checked");
                }else{
                    valor = $me.val();
                }
                break;
            case "SELECT":
                valor = $me.find(':selected').val();
                //$("input[name='opciones']:checked").val();
        }
        if ((valor == undefined||valor == "") && $me.prop("required")){
            const label = $("label[for='"+$me.prop('name')+"']").text().trim();
            mostrarMensaje('error','El campo '+label+' es obligatorio')
            i=false;
        }
            
    });
    //console.log(i)
    return i;
}
var contadorMensajes = 0; // Contador para generar IDs únicos
  
function mostrarMensaje(tipo, mensaje) {
  var id = "mensaje-" + contadorMensajes; // Generar un ID único para cada div de mensaje
  contadorMensajes++;
  
  // Crear el div de mensaje dinámicamente
  var $mensaje = $("<div>", { id: id, class: "alert mensaje", role: "alert" });
  
  // Establecer clases de estilos según el tipo de mensaje
  switch (tipo) {
    case "error":
      $mensaje.addClass("alert-danger");
      break;
    case "completado":
      $mensaje.addClass("alert-success");
      break;
    case "revise":
      $mensaje.addClass("alert-info");
      break;
    case "enviando":
      $mensaje.addClass("alert-warning");
      break;
    default:
      $mensaje.addClass("alert-secondary");
      break;
  }
  
  // Establecer el contenido del mensaje
  $mensaje.text(mensaje);
  
  // Crear el botón de cerrar mensaje
  var $botonCerrar = $("<span>", { class: "cerrar-mensaje", "aria-hidden": "true" }).html("&times;");
  
  // Agregar el botón de cerrar mensaje al div de mensaje
  $mensaje.prepend($botonCerrar);
  
  // Agregar el div de mensaje al contenedor de mensajes al final
  $("#contenedor-mensajes").append($mensaje);
 
  
  // Establecer el tiempo de duración del mensaje (5 segundos)
  setTimeout(function() {
    $("#" + id).fadeOut("slow", function() {
      $(this).remove();
    });
  }, 7000);
}

// Evento de clic para mostrar un mensaje de ejemplo
$("#btnMostrarMensaje").click(function() {
  mostrarMensaje("completado", "El proceso se ha completado exitosamente.");
});

// Evento de clic en el botón de cerrar mensaje
$(document).on("click", ".cerrar-mensaje", function() {
  $(this).parent(".mensaje").fadeOut("slow", function() {
    $(this).remove();
  });
});

function validarTextoSinNumeros(id) {
  $(document).on('input', `#${id}`, function() {
      // Reemplazar los números por una cadena vacía
      $(this).val($(this).val().replace(/\d+/g, ''));
  });
}

function validarCedulaTelefono(id) {
  $(document).on('input', `#${id}`, function() {
    // Obtener el valor actual del campo
    let valor = $(this).val();    
    // Reemplazar cualquier carácter que no sea un número
    valor = valor.replace(/\D/g, '');    
    // Validar longitud según el tipo de ID
    if (id === 'cedula') {
      // Para cédula, limitar a 8 dígitos
      if (valor.length > 8) {
        valor = valor.substring(0, 8);
      }
    } else if (id === 'telefono') {
      // Para teléfono, limitar a 11 dígitos
      if (valor.length > 11) {
        valor = valor.substring(0, 11);
      }
    }    
    // Actualizar el valor del campo
    $(this).val(valor);
  });
}

function validarCorreo(correo) {
  var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(correo);
}


