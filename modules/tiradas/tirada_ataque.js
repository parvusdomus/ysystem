export async function TiradaAtaque(actor, nombre_arma, id_habilidad, daño, objetivo) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  //SACO LOS VALORES DE HABILIDAD Y ATRIBUTO
  let valor_habilidad="";
  let nombre_habilidad="";
  let valor_atributo="";
  if (id_habilidad=="Magia"){
    valor_habilidad=actor.data.data.Magia.Valor;
    nombre_habilidad=actor.data.data.Magia.Nombre;
    valor_atributo=actor.data.data[actor.data.data.Magia.Atributo]
  } else{
    valor_habilidad=actor.data.data.Habilidades[id_habilidad].Valor;
    nombre_habilidad=actor.data.data.Habilidades[id_habilidad].Nombre;
    valor_atributo=actor.data.data[actor.data.data.Habilidades[id_habilidad].Atributo]
  }
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
    archivo_template = '/systems/ysystem/templates/dialogos/tirada_habilidad_objetivo.html';

    datos_template = { tirada: tirada,
                        agilidad: objetivo.document._actor.data.data.Agilidad.Valor,
                        aplomo: objetivo.document._actor.data.data.Aplomo.Valor,
                        perspicacia: objetivo.document._actor.data.data.Perspicacia.Valor
                      };
  }
  else{
    archivo_template = '/systems/ysystem/templates/dialogos/tirada_ataque.html';
    datos_template = { tirada: tirada,
                        daño: daño
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
        let daño_total=daño;
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
        if (document.getElementById("apuntar").value>0 && valor_habilidad>=document.getElementById("apuntar").value){
          valor_habilidad-= document.getElementById("apuntar").value
          tirada=valor_habilidad+"d6+"+valor_atributo
        }

        let d6Roll = new Roll(tirada).roll({async: false});
        let flavor = tirada+" VS "+ document.getElementById("dificultad").value
        const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_ataque_chat.html';
        if (d6Roll.total >= document.getElementById("dificultad").value){resultado="ÉXITO"}
        else {resultado="FALLO"}
        let seises=0;
        let unos=0;
        let dados=[];
        for (let i = 0; i < valor_habilidad; i++) {
          if (d6Roll.terms[0].results[i].result == 6){seises++}
          if (d6Roll.terms[0].results[i].result == 1){unos++}
          dados.push(d6Roll.terms[0].results[i].result);
        }
        if (seises>=2){
          resultado="CRÍTICO";
          daño_total=String(Number(daño)*2);
      }
        if (unos>0 && unos == valor_habilidad){resultado="PIFIA"}
        const datos_template_chat = {
         tirada: flavor,
         nombre_habilidad: nombre_habilidad,
         valor_habilidad: valor_habilidad,
         valor_atributo: valor_atributo,
         tirada: tirada,
         resultado: resultado,
         total: d6Roll.total,
         dificultad: document.getElementById("dificultad").value,
         dados: dados,
         actor: actor.data._id,
         proezas: actor.data.data.Proezas.value,
         daño: daño_total
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
          let tirada_daño=daño_total;
          if (resultado=="ÉXITO" || resultado=="CRÍTICO"){
              if (document.getElementById("apuntar").value>0 && valor_habilidad>=0){
                  tirada_daño+="+"+document.getElementById("apuntar").value+"d6"
              }
              let d6DañoRoll = new Roll(tirada_daño).roll({async: false});
              daño_total=d6DañoRoll.total;
              const archivo_template_daño_chat = '/systems/ysystem/templates/chat/tirada_daño_chat.html';
              const datos_template_daño_chat = {
               daño: daño_total,
               tirada: tirada_daño
              };
              renderTemplate(archivo_template_daño_chat, datos_template_daño_chat).then(
               (contenido_Dialogo_Daño_chat)=> {
                 const chatData = {
                   type: CONST.CHAT_MESSAGE_TYPES.ROLL,
                   roll: d6DañoRoll,
                   content: contenido_Dialogo_Daño_chat,
                 };
                ChatMessage.create(chatData);
          } )

          }
        }) //FIN DEL THEN DEL CREAR MENSAJE



    		 }
             }
           },
           render: html => console.log("Register interactivity in the rendered dialog"),
           close: html => console.log("This always is logged no matter which option is chosen")
         });
         dialogo.render(true);
}
