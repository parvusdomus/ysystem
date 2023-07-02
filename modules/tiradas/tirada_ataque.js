export async function TiradaAtaque(actor, nombre_arma, id_habilidad, daño, objetivo) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  //SACO LOS VALORES DE HABILIDAD Y ATRIBUTO
  let valor_habilidad="";
  let nombre_habilidad="";
  let valor_atributo="";
  let objetivo_id;
  if (id_habilidad=="Magia"){
    valor_habilidad=actor.system.Magia.Valor;
    nombre_habilidad=actor.system.Magia.Nombre;
    valor_atributo=actor.system[actor.system.Magia.Atributo]
  } else{
    valor_habilidad=actor.system.Habilidades[id_habilidad].Valor;
    nombre_habilidad=actor.system.Habilidades[id_habilidad].Nombre;
    valor_atributo=actor.system[actor.system.Habilidades[id_habilidad].Atributo]
  }
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
      archivo_template = '/systems/ysystem/templates/dialogos/Negro/tirada_ataque_objetivo.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
      archivo_template = '/systems/ysystem/templates/dialogos/Rojo/tirada_ataque_objetivo.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Medieval"){
      archivo_template = '/systems/ysystem/templates/dialogos/Medieval/tirada_ataque_objetivo.html';
    }


    datos_template = { tirada: tirada,
                        agilidad: agilidad,
                        aplomo: aplomo,
                        perspicacia: perspicacia
                      };
  }
  else{
    if (game.settings.get ("ysystem", "aspectoFicha") == "Negro"){
      archivo_template = '/systems/ysystem/templates/dialogos/Negro/tirada_ataque.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
      archivo_template = '/systems/ysystem/templates/dialogos/Rojo/tirada_ataque.html';
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Medieval"){
      archivo_template = '/systems/ysystem/templates/dialogos/Medieval/tirada_ataque.html';
    }

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
        let dificultad=document.getElementById("dificultad").value;
        let proezas=actor.system.Proezas.value;
        let daño_total=daño;
        if (objetivo){
          dificultad=Number(dificultad)+Number(objetivo.system.Protección_Agilidad);
          daño_total=Number(daño_total)-Number(objetivo.system.Protección_Daño);
          objetivo_id=objetivo._id;
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
        if (actor.system.Recuerdo_Cuando_Activo=="true"){
          valor_habilidad+=2
          tirada=valor_habilidad+"d6+"+valor_atributo
          actor.update ({ 'data.Recuerdo_Cuando_Activo': "false" });
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
        const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_ataque_chat.html';
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
         actor: actor._id,
         proezas: actor.system.Proezas.value,
         daño: daño_total,
         objetivo: objetivo_id,
         personaje: actor.name
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
