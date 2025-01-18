
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

// Evento de envío del formulario
$("#formulario").submit(function(e) {
  e.preventDefault(); // Evitar el envío del formulario por defecto
  
  var nombreUsuario = $("#nombre_usuario").val();
  var labelNombreUsuario = $("label[for='nombre_usuario']").text().trim();
  
  if (nombreUsuario === "") {
    $("#error_nombre_usuario").text("El campo " + labelNombreUsuario + " es requerido.");
  } else {
    $("#error_nombre_usuario").text(""); // Limpiar el mensaje de error si no hay error
    // Aquí puedes realizar otras acciones, como enviar el formulario
  }
    
});

//Validar que cantidad permita maximo 3 decimales.
$('#cantidad, #existencias, #minimo, #cantidadMayor').on('keypress', function(event) {
  const charCode = event.which || event.keyCode;
  const charStr = String.fromCharCode(charCode);
  const valorActual = $(this).val();
  if (charStr === '.') {
    if (valorActual.indexOf('.') !== -1) {
      event.preventDefault();
    }
  } else if (!/^\d+$/.test(charStr) && charStr !== '.') {
    event.preventDefault();
  }

  if (charStr !== '.') {
    const valorConDecimal = valorActual + charStr;
    const partes = valorConDecimal.split('.');
    if (partes.length > 1 && partes[1].length > 3) {
      event.preventDefault();
    }
  }
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

//Validar que monedas permitan maximo 2 decimales.
$('#debito, #efectivo, #pgmovil, #divisas, #descuento, #dolares, #total_producto, #pcompra, #pventa, #pmayor').on('keypress', function(event) {
  const charCode = event.which || event.keyCode;
  const charStr = String.fromCharCode(charCode);
  const valorActual = $(this).val();
  if (charStr === '.') {
    if (valorActual.indexOf('.') !== -1) {
      event.preventDefault();
    }
  } else if (!/^\d+$/.test(charStr) && charStr !== '.') {
    event.preventDefault();
  }

  if (charStr !== '.') {
    const valorConDecimal = valorActual + charStr;
    const partes = valorConDecimal.split('.');
    if (partes.length > 1 && partes[1].length > 2) {
      event.preventDefault();
    }
  }
});

//validación dolares. 
$("#dolares").on('change', function() {
  if($(this).val() < 0){
    $(this).val(0);
  }
})

$('#comprobante').on('keypress', function(event) {
  var valor = $(this).val();
  if (valor.length >= 4 && event.charCode >= 48 && event.charCode <= 57) {
    event.preventDefault();
  } else if (event.charCode < 48 || event.charCode > 57) {
    event.preventDefault();
  }
});

$('#rif').on('input', function() {
  let inputVal = $(this).val().toUpperCase(); // Convertir a mayúsculas

  // Permitir solo letras C, E, G, J, P, V al inicio, seguido de números y el guion "-", con un máximo de 10 caracteres
  if (!/^[CEGJPV]?[0-9-]*$/.test(inputVal) || inputVal.length > 10) {
      // Remover cualquier carácter inválido y limitar a 10 caracteres
      inputVal = inputVal.replace(/[^CEGJPV0-9-]/g, '').substring(0, 10);
  }

  $(this).val(inputVal); // Establecer el valor modificado
});

$('#cuenta').on('input', function() {
  let inputVal = $(this).val();

  // Permitir solo números con un máximo de 20 caracteres
  if (!/^\d*$/.test(inputVal) || inputVal.length > 20) {
      // Remover cualquier carácter no numérico y limitar a 20 caracteres
      $(this).val(inputVal.replace(/\D/g, '').substring(0, 20));
  }
});

$('#codigo_barras').on('input', function() {
  let inputVal = $(this).val();

  // Permitir solo números con un máximo de 20 caracteres
  if (!/^\d*$/.test(inputVal) || inputVal.length > 128) {
      // Remover cualquier carácter no numérico y limitar a 20 caracteres
      $(this).val(inputVal.replace(/\D/g, '').substring(0, 128));
  }
});

var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var websitePattern = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.+)?$/;

$('#email').on('blur', function() {
    var email = $(this);
    if (email.val().trim() !== "") {
        if (!emailPattern.test(email.val())) {
            email.addClass('is-invalid');
        } else {
            email.removeClass('is-invalid');
            email.addClass('is-valid');
        }
    } else {
        email.removeClass('is-invalid is-valid');
    }
});

$('#web').on('blur', function() {
    var web = $(this);
    if (web.val().trim() !== "") {
        if (!websitePattern.test(web.val())) {
            web.addClass('is-invalid');
        } else {
            web.removeClass('is-invalid');
            web.addClass('is-valid');
        }
    } else {
        website.removeClass('is-invalid is-valid');
    }
});