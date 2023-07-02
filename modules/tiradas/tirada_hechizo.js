export async function TiradaHechizo(actor, poder, id_atributo, dificultad, objetivo) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  let Ppoder=(Number(dificultad)/5)-1;
  let PpoderActual=actor.system.Poder.value;

  //SACO LOS VALORES DE HABILIDAD Y ATRIBUTO
  let valor_habilidad=actor.system.Magia.Valor;
  let nombre_habilidad=poder;
  let valor_atributo=actor.system[id_atributo];
  let dificultad1=0;
  let dificultad2=dificultad;
  //PENALIZO POR HERIDAS
  if (actor.system.Salud.value <= 3){
    valor_habilidad-=3;
  } else if (actor.system.Salud.value <= 6) {
    valor_habilidad-=2;
  } else if (actor.system.Salud.value <= 10) {
    valor_habilidad-=1;
  }
  //PENALIZO POR ARMADURA Y Escudo
  valor_atributo-=Number(actor.system.Protección_Penalización);
  //MONTO LA TIRADA
  if (valor_habilidad < 0){valor_habilidad=0}
  let tirada=valor_habilidad+"d6"
  if (valor_atributo>0){
    tirada+="+"+valor_atributo
  } else if(valor_atributo<0){
    tirada+=valor_atributo
  }
  let agilidad=0;
  let aplomo=0;
  let perspicacia=0;
  let resultado=""
  let mensaje_Proeza= actor.name+ " usa Proeza para la tirada..."
  var archivo_template = "";
  var datos_template={};
  if (objetivo){
    agilidad=Number(objetivo.system.Agilidad.Valor)+Number(objetivo.system.Agilidad.Bono)
    aplomo=Number(objetivo.system.Aplomo.Valor)+Number(objetivo.system.Aplomo.Bono)
    perspicacia=Number(objetivo.system.Perspicacia.Valor)+Number(objetivo.system.Perspicacia.Bono)
    if (game.settings.get ("ysystem", "aspectoFicha") == "Negro"){
      archivo_template = '/systems/ysystem/templates/dialogos/Negro/tirada_hechizo_objetivo.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
      archivo_template = '/systems/ysystem/templates/dialogos/Rojo/tirada_hechizo_objetivo.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Medieval"){
      archivo_template = '/systems/ysystem/templates/dialogos/Medieval/tirada_hechizo_objetivo.html';
    }


    datos_template = { tirada: tirada,
                        agilidad: agilidad,
                        aplomo: aplomo,
                        perspicacia: perspicacia
                      };
  }
  else{
    if (game.settings.get ("ysystem", "aspectoFicha") == "Negro"){
      archivo_template = '/systems/ysystem/templates/dialogos/Negro/tirada_hechizo.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
      archivo_template = '/systems/ysystem/templates/dialogos/Rojo/tirada_hechizo.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Medieval"){
      archivo_template = '/systems/ysystem/templates/dialogos/Medieval/tirada_hechizo.html';
    }

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
        let proezas=actor.system.Proezas.value;
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
        if (actor.system.Poder.value < Ppoder){
          ui.notifications.warn("No tienes suficientes puntos de Poder");
          return 1;
        }
        PpoderActual-=Ppoder;
        actor.update ({ 'system.Poder.value': PpoderActual });
        if (document.getElementById("proezas").value > 0){
          if (proezas >0){
            valor_habilidad++
            proezas--
            tirada=valor_habilidad+"d6+"+valor_atributo
            actor.update ({ 'system.Proezas.value': proezas });
            const chatData = {
              content: mensaje_Proeza,
            };
            ChatMessage.create(chatData);
          }
          else{ui.notifications.warn("No te quedan puntos de PROEZA!!");}
        }
        if (actor.system.Recuerdo_Cuando_Activo=="true"){
          valor_habilidad+=2
          tirada=valor_habilidad+"d6+"+valor_atributo
          actor.update ({ 'system.Recuerdo_Cuando_Activo': "false" });
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
         actor: actor._id,
         proezas: actor.system.Proezas.value,
         personaje: actor.name
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
