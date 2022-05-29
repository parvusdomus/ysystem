import {TiradaResistenciaMental} from "../tiradas/tirada_resistencia_mental.js";
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
  dificultad+=actor.data.data.Aplomo.Bono;
  let resultado=""
  let estabilidad_original=Number(actor.data.data.Estabilidad.value);
  let estabilidad_nueva=0;
  var archivo_template = "";
  var datos_template={};
  if (game.settings.get ("ysystem", "aspectoFicha") == "Negro"){
    archivo_template = '/systems/ysystem/templates/dialogos/Negro/tirada_panico.html';
  }
  if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
    archivo_template = '/systems/ysystem/templates/dialogos/Rojo/tirada_panico.html';
  }
  if (game.settings.get ("ysystem", "aspectoFicha") == "Medieval"){
    archivo_template = '/systems/ysystem/templates/dialogos/Medieval/tirada_panico.html';
  }

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
          let NumTiradasResistencia=0;
        const archivo_template_chat = '/systems/ysystem/templates/chat/tirada_habilidad_chatPNJ.html';
        if (d6Roll.total <= dificultad){resultado="ÉXITO"}
        else {
          resultado="FALLO";
          estabilidad_nueva=estabilidad_original-valor_habilidad;
          actor.update ({ 'data.Estabilidad.value': estabilidad_nueva });

        }
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
          if (estabilidad_original>=16){
            if (estabilidad_nueva<16){NumTiradasResistencia++;}
            if (estabilidad_nueva<11){NumTiradasResistencia++;}
            if (estabilidad_nueva<7){NumTiradasResistencia++;}
            if (estabilidad_nueva<4){NumTiradasResistencia++;}
            if (estabilidad_nueva<2){NumTiradasResistencia++;}
          }
          if (estabilidad_original<16 && estabilidad_original>=11){
            if (estabilidad_nueva<11){NumTiradasResistencia++;}
            if (estabilidad_nueva<7){NumTiradasResistencia++;}
            if (estabilidad_nueva<4){NumTiradasResistencia++;}
            if (estabilidad_nueva<2){NumTiradasResistencia++;}
          }
          if (estabilidad_original<11 && estabilidad_original>=7){
            if (estabilidad_nueva<7){NumTiradasResistencia++;}
            if (estabilidad_nueva<4){NumTiradasResistencia++;}
            if (estabilidad_nueva<2){NumTiradasResistencia++;}
          }
          if (estabilidad_original<7 && estabilidad_original>=4){
            if (estabilidad_nueva<4){NumTiradasResistencia++;}
            if (estabilidad_nueva<2){NumTiradasResistencia++;}
          }
          if (estabilidad_original<4 && estabilidad_original>=2){
            if (estabilidad_nueva<2){NumTiradasResistencia++;}
          }
          console.log ("CORRESPONDEN TIRADAS DE RESISTENCIA: "+NumTiradasResistencia)
          for (let i = 0; i < NumTiradasResistencia; i++){
            //TiradaResistenciaMental (actor);
          }
    } )
    		 }
             }
           },
           render: html => console.log("Register interactivity in the rendered dialog"),
           close: html => console.log("This always is logged no matter which option is chosen")
         });
         dialogo.render(true);
}
