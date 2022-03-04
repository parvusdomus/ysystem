export async function TiradaAtaquePNJ(actor, nombre_arma, id_habilidad, daño, objetivo) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  //SACO LOS VALORES DE HABILIDAD Y ATRIBUTO
  let valor_habilidad="";
  let nombre_habilidad="";
  let valor_atributo="";
  let objetivo_id;
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
  let agilidad=0;
  let aplomo=0;
  let perspicacia=0;
  let resultado=""
  let mensaje_Proeza= actor.data.name+ " usa Proeza para la tirada..."
  var archivo_template = "";
  var datos_template={};
  if (objetivo){
    agilidad=Number(objetivo.document._actor.data.data.Agilidad.Valor)+Number(objetivo.document._actor.data.data.Agilidad.Bono)
    aplomo=Number(objetivo.document._actor.data.data.Aplomo.Valor)+Number(objetivo.document._actor.data.data.Aplomo.Bono)
    perspicacia=Number(objetivo.document._actor.data.data.Perspicacia.Valor)+Number(objetivo.document._actor.data.data.Perspicacia.Bono)
    if (game.settings.get ("ysystem", "aspectoFicha") == "Negro"){
      archivo_template = '/systems/ysystem/templates/dialogos/Negro/tirada_ataque_objetivoPNJ.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
      archivo_template = '/systems/ysystem/templates/dialogos/Rojo/tirada_ataque_objetivoPNJ.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Medieval"){
      archivo_template = '/systems/ysystem/templates/dialogos/Medieval/tirada_ataque_objetivoPNJ.html';
    }


    datos_template = { tirada: tirada,
                        agilidad: agilidad,
                        aplomo: aplomo,
                        perspicacia: perspicacia,
                        retrato: actor.data.img
                      };
  }
  else{
    if (game.settings.get ("ysystem", "aspectoFicha") == "Negro"){
      archivo_template = '/systems/ysystem/templates/dialogos/Negro/tirada_ataquePNJ.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
      archivo_template = '/systems/ysystem/templates/dialogos/Rojo/tirada_ataquePNJ.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Medieval"){
      archivo_template = '/systems/ysystem/templates/dialogos/Medieval/tirada_ataquePNJ.html';
    }

    datos_template = { tirada: tirada,
                        daño: daño,
                        retrato: actor.data.img
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
        let dificultad=document.getElementById("dificultad").value;
        let daño_total=daño;
        if (objetivo){
          dificultad=Number(dificultad)+Number(objetivo.document._actor.data.data.Protección_Agilidad);
          daño_total=Number(daño_total)-Number(objetivo.document._actor.data.data.Protección_Daño);
          objetivo_id=objetivo.data._id;
        }
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
        if (document.getElementById("apuntar").value > valor_habilidad){
          ui.notifications.warn("No puedes pasar más dados a apuntar que los que tienes en la Habilidad");
          return 1;
        }
        if (document.getElementById("apuntar").value>0 && valor_habilidad>=document.getElementById("apuntar").value){
          valor_habilidad-= document.getElementById("apuntar").value
          tirada=valor_habilidad+"d6+"+valor_atributo
        }


        let d6Roll = new Roll(String(tirada)).roll({async: false});

        let flavor = tirada+" VS "+ dificultad;
        const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_ataque_chatPNJ.html';
        if (d6Roll.total >= dificultad){resultado="ÉXITO"}
        else {resultado="FALLO"}
        let tirada_daño=daño_total;
        if (document.getElementById("apuntar").value>0){
            tirada_daño+="+"+document.getElementById("apuntar").value+"d6"
        }
        let d6DañoRoll = new Roll(String(tirada_daño)).roll({async: false});
        daño_total=d6DañoRoll.total;
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
          daño_total=String(Number(daño_total)*2);
      }

        if (unos>0 && unos == valor_habilidad){resultado="PIFIA"}
        const rolls = []; //array of Roll
        rolls.push(d6Roll)
        rolls.push(d6DañoRoll)
        const pool = PoolTerm.fromRolls(rolls);
        let roll = Roll.fromTerms([pool]);

        const datos_template_chat = {
         tirada: flavor,
         nombre_habilidad: nombre_habilidad,
         valor_habilidad: valor_habilidad,
         valor_atributo: valor_atributo,
         tirada: tirada,
         resultado: resultado,
         total: d6Roll.total,
         dificultad: dificultad,
         dados: dados,
         actor: actor.data._id,
         daño: daño_total,
         objetivo: objetivo_id,
         personaje: actor.data.name
        };
        var contenido_Dialogo_chat;
        renderTemplate(archivo_template_chat, datos_template_chat).then(
         (contenido_Dialogo_chat)=> {
           const chatData = {
             type: CONST.CHAT_MESSAGE_TYPES.ROLL,
             roll: roll,
             content: contenido_Dialogo_chat,
           };
          ChatMessage.create(chatData);

        }) //FIN DEL THEN DEL CREAR MENSAJE



    		 }
             }
           },
           render: html => console.log("Register interactivity in the rendered dialog"),
           close: html => console.log("This always is logged no matter which option is chosen")
         });
         dialogo.render(true);
}
