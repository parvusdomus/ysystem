export async function TiradaResistenciaFisicaAuto(actor, VidaActual) {
  const element = event.currentTarget;
  //SACO LOS VALORES DE HABILIDAD Y ATRIBUTO
  let valor_habilidad=3;
  let dificultad=actor.data.document._actor.data.data.Resistencia_Física;
  let nombre_habilidad="R. Física";
  //PENALIZO POR HERIDAS
  if (VidaActual <= 3){
    valor_habilidad-=3;
  } else if (VidaActual <= 6) {
    valor_habilidad-=2;
  } else if (VidaActual <= 10) {
    valor_habilidad-=1;
  }
  //MONTO LA TIRADA
  if (valor_habilidad < 0){valor_habilidad=0}
  let tirada=valor_habilidad+"d6"

  let resultado=""
        let proezas=actor.data.document._actor.data.data.Proezas.value;
        let d6Roll = new Roll(tirada).roll({async: false});
        let flavor = tirada+" VS "+ dificultad;
        const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_habilidad_chat.html';
        if (d6Roll.total >= dificultad){resultado="ÉXITO"}
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
         valor_atributo: "",
         tirada: tirada,
         resultado: resultado,
         total: d6Roll.total,
         dificultad: dificultad,
         dados: dados,
         actor: actor.data.document._actor.data._id,
         proezas: actor.data.document._actor.data.data.Proezas.value,
         personaje: actor.data.document._actor.name
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
    })

}
