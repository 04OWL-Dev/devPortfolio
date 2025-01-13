
//Activa el mensaje segun sea lo que vaya a ocurrir
function mensajes(aviso, mensaje){
    var color;
    var sombra;
    switch(aviso){
        case 0://Cuidado
            color = "rgba(250, 0, 0, 0.8)";
            sombra = "rgb(145, 36, 36)";
        break;
        case 1://Información
            color = "rgba(24, 119, 24, 0.8)";
            sombra = " rgb(26, 78, 35)";
        break
        case 2://Alerta
            color = "rgba(238, 255, 3, 0.8)";
            sombra = "rgb(91, 92, 17)";
        break
    }
    $("#mensaje").html(mensaje).css({
        "background-color":color,
        "text-shadow": "0px 2px 4px " + sombra
    }).slideDown("slow");
}