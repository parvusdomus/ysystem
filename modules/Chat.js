import {TiradaResistenciaFisicaAuto} from "./tiradas/tirada_resistencia_fisicaAuto.js";
export default class YsystemChat {
  static chatListeners (html) {
    html.on('click', '.repite_habilidad_proeza', this._onrepite_habilidad_proeza.bind(this));
    html.on('click', '.repite_ataque_proeza', this._onrepite_ataque_proeza.bind(this));
    html.on('click', '.aplica_daño', this._onaplica_daño.bind(this));
    html.on('click', '.aumenta_daño', this._onaumenta_daño.bind(this));
    html.on('click', '.repite_hechizo_proeza', this._onrepite_hechizo_proeza.bind(this));
  }

  static _onrepite_habilidad_proeza (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = game.actors.get(dataset.actor_id);
    if (actor.system.Proezas.value <= 0){
      ui.notifications.warn("No te quedan puntos de PROEZA!!");
      return 1;
    }

    let resultado="";
    let conservado=0;
    let dados_final=[];
    let habilidad=dataset.valor_habilidad;
    let dados_split = dataset.dados.split(',');
    let dados=[];
    for (let i = 0; i < dataset.valor_habilidad; i++){
      dados.push({dado:dados_split[i],
                  indice:i
      });
    }
    const archivo_template = '/systems/ysystem/templates/dialogos/Negro/repite_tirada_habilidad.html';
    const datos_template = {
     dados: dados,
     dificultad: dataset.dificultad,
     nombre_habilidad: dataset.nombre_habilidad,
     tirada: dataset.tirada,
     valor_atributo: dataset.valor_atributo,
     valor_habilidad: dataset.valor_habilidad,
    };

    renderTemplate(archivo_template, datos_template).then(
     (contenido_Dialogo)=> {
       let dialogo = new Dialog({
         title: `Repetir tirada de ${dataset.nombre_habilidad}`,
         content: contenido_Dialogo,
         buttons: {
          Lanzar: {
           icon: '<i class="fas fa-dice"></i>',
           label: "Repetir",
           callback: () => {
             for (let i = 0; i < dataset.valor_habilidad; i++){
               if (document.getElementById(i).checked){
                 conservado+=Number(dados[i].dado);
                 habilidad--;
                 dados_final.push(dados[i].dado);
               }
             }
             let tirada="";
             if (conservado>0){
               tirada=conservado+"+"+habilidad+"d6"
             } else
             {
               tirada=habilidad+"d6"
             }
             if (dataset.valor_atributo > 0){
               tirada+="+"+dataset.valor_atributo;
             }
             let d6Roll = new Roll(tirada).roll({async: false});
             var proezas=actor.system.Proezas.value;
             proezas--;
             actor.update ({ 'system.Proezas.value': proezas });
             let flavor = tirada+" VS "+ dataset.dificultad;
             const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_habilidad_repetida_chat.html';
             if (d6Roll.total >= dataset.dificultad){resultado="ÉXITO"}
             else {resultado="FALLO"}
             if (conservado>0){
               for (let i = 0; i < habilidad; i++) {
               dados_final.push(d6Roll.terms[2].results[i].result);
              }
            } else{
              for (let i = 0; i < habilidad; i++) {
              dados_final.push(d6Roll.terms[0].results[i].result);
             }
            }

            let unos=0;
             for (let i = 0; i < dataset.valor_habilidad; i++) {
               if (dados_final[i] == 1){unos++}
             }
             if (unos>0 && unos == dataset.valor_habilidad){resultado="PIFIA"}
             const datos_template_chat = {
              tirada: flavor,
              nombre_habilidad: dataset.nombre_habilidad,
              valor_habilidad: dataset.valor_habilidad,
              valor_atributo: dataset.valor_atributo,
              tirada: tirada,
              resultado: resultado,
              total: d6Roll.total,
              dificultad: dataset.dificultad,
              dados: dados_final,
              actor: actor._id,
              personaje: actor.name
             };
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
         }
       })
       dialogo.render(true);
    } )

  }

  static _onrepite_ataque_proeza (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = game.actors.get(dataset.actor_id);
    let objetivo;
    let objetivo_id;
    if (dataset.objetivo_id){
      objetivo = canvas.tokens.get(dataset.objetivo_id);
      objetivo_id=objetivo._id;
    }
    if (actor.system.Proezas.value <= 0){
      ui.notifications.warn("No te quedan puntos de PROEZA!!");
      return 1;
    }

    let resultado="";
    let conservado=0;
    let dados_final=[];
    let habilidad=dataset.valor_habilidad;
    let dados_split = dataset.dados.split(',');
    let dados=[];
    for (let i = 0; i < dataset.valor_habilidad; i++){
      dados.push({dado:dados_split[i],
                  indice:i
      });
    }
    const archivo_template = '/systems/ysystem/templates/dialogos/Negro/repite_tirada_habilidad.html';
    const datos_template = {
     dados: dados,
     dificultad: dataset.dificultad,
     nombre_habilidad: dataset.nombre_habilidad,
     tirada: dataset.tirada,
     valor_atributo: dataset.valor_atributo,
     valor_habilidad: dataset.valor_habilidad,
    };

    renderTemplate(archivo_template, datos_template).then(
     (contenido_Dialogo)=> {
       let dialogo = new Dialog({
         title: `Repetir tirada de ${dataset.nombre_habilidad}`,
         content: contenido_Dialogo,
         buttons: {
          Lanzar: {
           icon: '<i class="fas fa-dice"></i>',
           label: "Repetir",
           callback: () => {
             for (let i = 0; i < dataset.valor_habilidad; i++){
               if (document.getElementById(i).checked){
                 conservado+=Number(dados[i].dado);
                 habilidad--;
                 dados_final.push(dados[i].dado);
               }
             }
             let tirada="";
             if (conservado>0){
               tirada=conservado+"+"+habilidad+"d6"
             } else
             {
               tirada=habilidad+"d6"
             }
             if (dataset.valor_atributo > 0){
               tirada+="+"+dataset.valor_atributo;
             }
             let d6Roll = new Roll(tirada).roll({async: false});
             var proezas=actor.system.Proezas.value;
             proezas--;
             actor.update ({ 'data.Proezas.value': proezas });
             let flavor = tirada+" VS "+ dataset.dificultad;
             const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_ataque_repetida_chat.html';
             if (d6Roll.total >= dataset.dificultad){resultado="ÉXITO"}
             else {resultado="FALLO"}
             if (conservado>0){
               for (let i = 0; i < habilidad; i++) {
               dados_final.push(d6Roll.terms[2].results[i].result);
              }
            } else{
              for (let i = 0; i < habilidad; i++) {
              dados_final.push(d6Roll.terms[0].results[i].result);
             }
            }

            let unos=0;
             for (let i = 0; i < dataset.valor_habilidad; i++) {
               if (dados_final[i] == 1){unos++}
             }
             if (unos>0 && unos == dataset.valor_habilidad){resultado="PIFIA"}
             const datos_template_chat = {
              tirada: flavor,
              nombre_habilidad: dataset.nombre_habilidad,
              valor_habilidad: dataset.valor_habilidad,
              valor_atributo: dataset.valor_atributo,
              tirada: tirada,
              resultado: resultado,
              total: d6Roll.total,
              dificultad: dataset.dificultad,
              dados: dados_final,
              actor: actor._id,
              proezas: actor.system.Proezas.value,
              daño: dataset.daño,
              objetivo: objetivo_id,
              personaje: actor.name
             };
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
         }
       })
       dialogo.render(true);
    } )

  }

  static _onaplica_daño (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = game.actors.get(dataset.actor_id);
    //const objetivo = canvas.tokens.objects.children.find(document.actorId => dataset.objetivo_id);
    const objetivo = canvas.tokens.objects.children.find(objetivo => objetivo.document.actorId ==  dataset.objetivo_id)?.actor;
    let VidaOriginal=Number(objetivo.system.Salud.value);
    let VidaActual=0;
    let Mensaje="";
    let NumTiradasResistencia=0;
    if (Number(dataset.daño)<=0){
      ui.notifications.notify("No se puede aplicar un valor de daño menor que 0");
      return 1
    }
    if (objetivo){
      VidaActual=Number(objetivo.system.Salud.value)-Number(dataset.daño)
      if (VidaActual < 0){VidaActual=0}
      objetivo.update ({ 'system.Salud.value': VidaActual });
      Mensaje = dataset.daño + " puntos de daño aplicado/s a "+objetivo.name;
      ui.notifications.notify(Mensaje);
      const chatData = {
        content: Mensaje,
      };
      ChatMessage.create(chatData);
      if (VidaOriginal>=16){
        if (VidaActual<16){NumTiradasResistencia++;}
        if (VidaActual<11){NumTiradasResistencia++;}
        if (VidaActual<7){NumTiradasResistencia++;}
        if (VidaActual<4){NumTiradasResistencia++;}
        if (VidaActual<2){NumTiradasResistencia++;}
      }
      if (VidaOriginal<16 && VidaOriginal>=11){
        if (VidaActual<11){NumTiradasResistencia++;}
        if (VidaActual<7){NumTiradasResistencia++;}
        if (VidaActual<4){NumTiradasResistencia++;}
        if (VidaActual<2){NumTiradasResistencia++;}
      }
      if (VidaOriginal<11 && VidaOriginal>=7){
        if (VidaActual<7){NumTiradasResistencia++;}
        if (VidaActual<4){NumTiradasResistencia++;}
        if (VidaActual<2){NumTiradasResistencia++;}
      }
      if (VidaOriginal<7 && VidaOriginal>=4){
        if (VidaActual<4){NumTiradasResistencia++;}
        if (VidaActual<2){NumTiradasResistencia++;}
      }
      if (VidaOriginal<4 && VidaOriginal>=2){
        if (VidaActual<2){NumTiradasResistencia++;}
      }
      for (let i = 0; i < NumTiradasResistencia; i++){
        TiradaResistenciaFisicaAuto (objetivo, VidaActual);}

    }
    else {
      ui.notifications.notify("No hay objetivo");
      return 1;
    }

  }

  static _onaumenta_daño (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = game.actors.get(dataset.actor_id);
    if (actor.system.Proezas.value <=0){
      ui.notifications.warn("No te quedan Proezas");
      return 1;
    }
    const objetivo = canvas.tokens.get(dataset.objetivo_id);
    const messageId = $(element)
            .parents('[data-message-id]')
            .attr('data-message-id');
    let dados_split = dataset.dados.split(',');
    let tirada=dataset.daño+"+1d6x"
    let d6xRoll = new Roll(tirada).roll({async: false});
    let daño=d6xRoll.total;
    let proezas=Number(actor.system.Proezas.value)-1;
    actor.update ({ 'system.Proezas.value': proezas });
    const message = game.messages.get(messageId)
    let flavor=actor.name+" usa Proeza para aumentar el daño"
    d6xRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      flavor: flavor
   });
    const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_ataque_chat.html';
    const datos_template_chat = {
     tirada: dataset.tirada,
     nombre_habilidad: dataset.nombre_habilidad,
     resultado: dataset.resultado,
     total: dataset.total,
     dificultad: dataset.dificultad,
     dados: dados_split,
     actor: dataset.actor_id,
     proezas: actor.system.Proezas.value,
     daño: daño,
     objetivo: dataset.objetivo_id,
     personaje: actor.name,
     valor_habilidad: dataset.valor_habilidad
    };
    renderTemplate(archivo_template_chat, datos_template_chat).then(
     (contenido_Dialogo_chat)=> {
       message.update({id: messageId, content: contenido_Dialogo_chat})
    })

  }

  static _onrepite_hechizo_proeza (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = game.actors.get(dataset.actor_id);
    if (actor.system.Proezas.value <= 0){
      ui.notifications.warn("No te quedan puntos de PROEZA!!");
      return 1;
    }

    let resultado="";
    let conservado=0;
    let dados_final=[];
    let habilidad=dataset.valor_habilidad;
    let dados_split = dataset.dados.split(',');
    let dados=[];
    for (let i = 0; i < dataset.valor_habilidad; i++){
      dados.push({dado:dados_split[i],
                  indice:i
      });
    }
    const archivo_template = '/systems/ysystem/templates/dialogos/Negro/repite_tirada_hechizo.html';
    const datos_template = {
     dados: dados,
     dificultad1: dataset.dificultad1,
     dificultad2: dataset.dificultad2,
     nombre_habilidad: dataset.nombre_habilidad,
     tirada: dataset.tirada,
     valor_atributo: dataset.valor_atributo,
     valor_habilidad: dataset.valor_habilidad,
    };

    renderTemplate(archivo_template, datos_template).then(
     (contenido_Dialogo)=> {
       let dialogo = new Dialog({
         title: `Repetir tirada de ${dataset.nombre_habilidad}`,
         content: contenido_Dialogo,
         buttons: {
          Lanzar: {
           icon: '<i class="fas fa-dice"></i>',
           label: "Repetir",
           callback: () => {
             for (let i = 0; i < dataset.valor_habilidad; i++){
               if (document.getElementById(i).checked){
                 conservado+=Number(dados[i].dado);
                 habilidad--;
                 dados_final.push(dados[i].dado);
               }
             }
             let tirada="";
             if (conservado>0){
               tirada=conservado+"+"+habilidad+"d6"
             } else
             {
               tirada=habilidad+"d6"
             }
             if (dataset.valor_atributo > 0){
               tirada+="+"+dataset.valor_atributo;
             }
             let d6Roll = new Roll(tirada).roll({async: false});
             var proezas=actor.system.Proezas.value;
             proezas--;
             actor.update ({ 'system.Proezas.value': proezas });
             let flavor = tirada+" VS "+ dataset.dificultad;
             const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_hechizo_repetida_chat.html';
             if (d6Roll.total >= dataset.dificultad1 && d6Roll.total >= dataset.dificultad2){resultado="ÉXITO"}
             else {resultado="FALLO"}
             if (conservado>0){
               for (let i = 0; i < habilidad; i++) {
               dados_final.push(d6Roll.terms[2].results[i].result);
              }
            } else{
              for (let i = 0; i < habilidad; i++) {
              dados_final.push(d6Roll.terms[0].results[i].result);
             }
            }

            let unos=0;
             for (let i = 0; i < dataset.valor_habilidad; i++) {
               if (dados_final[i] == 1){unos++}
             }
             if (unos>0 && unos == dataset.valor_habilidad){resultado="PIFIA"}
             const datos_template_chat = {
              tirada: flavor,
              nombre_habilidad: dataset.nombre_habilidad,
              valor_habilidad: dataset.valor_habilidad,
              valor_atributo: dataset.valor_atributo,
              tirada: tirada,
              resultado: resultado,
              total: d6Roll.total,
              dificultad1: dataset.dificultad1,
              dificultad2: dataset.dificultad2,
              dados: dados_final,
              actor: actor._id,
              personaje: actor.name
             };
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
         }
       })
       dialogo.render(true);
    } )


  }

}
