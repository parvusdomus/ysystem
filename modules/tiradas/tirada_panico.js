export async function TiradaPanico(actor) {
  console.log ("TIRADA PANICO")
  const element = event.currentTarget;
  const dataset = element.dataset;
  //SACO LOS VALORES DE HABILIDAD Y ATRIBUTO
  let valor_habilidad=0;
  let nombre_habilidad="Tirada de Panico";
  //MONTO LA TIRADA
  let tirada=""
  let dificultad=actor.data.data.Aplomo.Valor;
  //dificultad+=actor.data.data.Aplomo.Bono;
  let resultado=""
  var archivo_template = "";
  var datos_template={};
  archivo_template = '/systems/ysystem/templates/dialogos/tirada_panico.html';
  datos_template = {
                      };

  const contenido_Dialogo = await renderTemplate(archivo_template, datos_template);
  let dialogo = new Dialog({
    title: `Nueva tirada de ${nombre_habilidad}`,
    content: contenido_Dialogo,
    buttons: {
     Lanzar: {
      icon: '<i class="fas fa-dice"></i>',
      label: "Lanzar",
      callback: () => {
          valor_habilidad=Number(document.getElementById("nivel_panico").value)
          tirada=valor_habilidad+"d6"
          let d6Roll = new Roll(tirada).roll({async: false});
          let flavor = tirada+" VS "+ dificultad
        const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_habilidad_chatPNJ.html';
        if (d6Roll.total <= dificultad){resultado="ÉXITO"}
        else {resultado="FALLO"}
        let dados=[];
        for (let i = 0; i < valor_habilidad; i++) {
          dados.push(d6Roll.terms[0].results[i].result);
        }
        const datos_template_chat = {
         tirada: flavor,
         nombre_habilidad: nombre_habilidad,
         valor_habilidad: valor_habilidad,
         tirada: tirada,
         resultado: resultado,
         total: d6Roll.total,
         dificultad: dificultad,
         dados: dados,
         actor: actor.data._id,
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
