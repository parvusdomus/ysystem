export default class YsystemChat {
  static chatListeners (html) {
    html.on('click', '.repite_habilidad_proeza', this._onrepite_habilidad_proeza.bind(this));
  }

  static _onrepite_habilidad_proeza (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = game.actors.get(dataset.actor_id);
    if (actor.data.data.Proezas.value <= 0){
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
    const archivo_template = '/systems/ysystem/templates/dialogos/repite_tirada_habilidad.html';
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
             var proezas=actor.data.data.Proezas.value;
             proezas--;
             actor.update ({ 'data.Proezas.value': proezas });
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
              actor: actor.data._id
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
