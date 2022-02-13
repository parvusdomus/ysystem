export async function TiradaHechizo(actor, poder, id_atributo, dificultad, objetivo) {
  console.log ("TIRADA HECHIZO")
  const element = event.currentTarget;
  const dataset = element.dataset;
  //SACO LOS VALORES DE HABILIDAD Y ATRIBUTO
  let valor_habilidad=actor.data.data.Magia.Valor;
  let nombre_habilidad=poder;
  let valor_atributo=actor.data.data[id_atributo];
  let dificultad1=0;
  let dificultad2=dificultad;
  //PENALIZO POR HERIDAS
  if (actor.data.data.Salud.value <= 3){
    valor_habilidad-=3;
  } else if (actor.data.data.Salud.value <= 6) {
    valor_habilidad-=2;
  } else if (actor.data.data.Salud.value <= 10) {
    valor_habilidad-=1;
  }
  //PENALIZO POR ARMADURA Y Escudo
  valor_atributo-=Number(actor.data.data.Protección_Penalización);
  //MONTO LA TIRADA
  if (valor_habilidad < 0){valor_habilidad=0}
  let tirada=valor_habilidad+"d6"
  if (valor_atributo>0){
    tirada+="+"+valor_atributo
  } else if(valor_atributo<0){
    tirada+=valor_atributo
  }

  let resultado=""
  let mensaje_Proeza= actor.data.name+ " usa Proeza para la tirada..."
  var archivo_template = "";
  var datos_template={};
  if (objetivo){
    archivo_template = '/systems/ysystem/templates/dialogos/tirada_hechizo_objetivo.html';

    datos_template = { tirada: tirada,
                        agilidad: objetivo.document._actor.data.data.Agilidad.Valor,
                        aplomo: objetivo.document._actor.data.data.Aplomo.Valor,
                        perspicacia: objetivo.document._actor.data.data.Perspicacia.Valor
                      };
  }
  else{
    archivo_template = '/systems/ysystem/templates/dialogos/tirada_hechizo.html';
    datos_template = { tirada: tirada,
                        dificultad2: dificultad2
                      };
  }

  const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);
  let dialogo = new Dialog({
    title: `Nueva tirada de ${nombre_habilidad}`,
    content: contenido_Dialogo,
    buttons: {
     Lanzar: {
      icon: '<i class="fas fa-dice"></i>',
      label: "Lanzar",
      callback: () => {
        let proezas=actor.data.data.Proezas.value;
        if (document.getElementById("mod_dados").value != 0){
          valor_habilidad+=Number(document.getElementById("mod_dados").value)
          if (valor_habilidad < 0){valor_habilidad=0}
          tirada=valor_habilidad+"d6+"+valor_atributo
        }
        if (document.getElementById("mod_num").value != 0){
          valor_atributo+=Number(document.getElementById("mod_num").value)
          if (valor_atributo > 0){tirada=valor_habilidad+"d6+"+valor_atributo}
          else{tirada=valor_habilidad+"d6"+valor_atributo}
        }
        if (document.getElementById("proezas").value > 0){
          if (proezas >0){
            valor_habilidad++
            proezas--
            tirada=valor_habilidad+"d6+"+valor_atributo
            actor.update ({ 'data.Proezas.value': proezas });
            const chatData = {
              content: mensaje_Proeza,
            };
            ChatMessage.create(chatData);
          }
          else{ui.notifications.warn("No te quedan puntos de PROEZA!!");}
        }
        if (actor.data.data.Recuerdo_Cuando_Activo=="true"){
          valor_habilidad+=2
          tirada=valor_habilidad+"d6+"+valor_atributo
          actor.update ({ 'data.Recuerdo_Cuando_Activo': "false" });
        }
        let d6Roll = new Roll(tirada).roll({async: false});
        let flavor = tirada+" VS "+ document.getElementById("dificultad").value
        const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_hechizo_chat.html';
        dificultad1 = document.getElementById("dificultad").value;
        if (d6Roll.total >= dificultad1 && d6Roll.total >= dificultad2){resultado="ÉXITO"}
        else {resultado="FALLO"}
        let seises=0;
        let unos=0;
        let dados=[];
        for (let i = 0; i < valor_habilidad; i++) {
          if (d6Roll.terms[0].results[i].result == 6){seises++}
          if (d6Roll.terms[0].results[i].result == 1){unos++}
          dados.push(d6Roll.terms[0].results[i].result);
        }
        if (seises>=2){resultado="CRÍTICO"}
        if (unos>0 && unos == valor_habilidad){resultado="PIFIA"}
        const datos_template_chat = {
         tirada: flavor,
         nombre_habilidad: nombre_habilidad,
         valor_habilidad: valor_habilidad,
         valor_atributo: valor_atributo,
         tirada: tirada,
         resultado: resultado,
         total: d6Roll.total,
         dificultad1: dificultad1,
         dificultad2: dificultad2,
         dados: dados,
         actor: actor.data._id,
         proezas: actor.data.data.Proezas.value,
         personaje: actor.data.name
        };
        var contenido_Dialogo_chat;
        renderTemplate(archivo_template_chat, datos_template_chat).then(
         (contenido_Dialogo_chat)=> {
           const chatData = {
             type: CONST.CHAT_MESSAGE_TYPES.ROLL,
             roll: d6Roll,
             content: contenido_Dialogo_chat,
           };
          ChatMessage.create(chatData);
    } )
    		 }
             }
           },
           render: html => console.log("Register interactivity in the rendered dialog"),
           close: html => console.log("This always is logged no matter which option is chosen")
         });
         dialogo.render(true);
}
