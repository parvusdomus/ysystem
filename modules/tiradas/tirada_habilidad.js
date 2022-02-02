export async function TiradaHabilidad(actor, id_habilidad, objetivo) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  console.log ("TIRADA DE HABILIDAD")
  console.log ("ID HABILIDAD")
  console.log (id_habilidad)
  console.log ("ACTOR")
  console.log (actor)
  console.log ("OBJETIVO")
  console.log (objetivo)
  //SACO LOS VALORES DE HABILIDAD Y ATRIBUTO
  let valor_habilidad=actor.data.data.Habilidades[id_habilidad].Valor;
  let nombre_habilidad=actor.data.data.Habilidades[id_habilidad].Nombre;

  console.log ("HABILIDAD")
  console.log (valor_habilidad)
  let valor_atributo=actor.data.data[actor.data.data.Habilidades[id_habilidad].Atributo]
  console.log ("ATRIBUTO")
  console.log (valor_atributo)
  //PENALIZO POR HERIDAS
  if (actor.data.data.Salud.value <= 3){
    valor_habilidad-=3;
  } else if (actor.data.data.Salud.value <= 6) {
    valor_habilidad-=2;
  } else if (actor.data.data.Salud.value <= 10) {
    valor_habilidad-=1;
  }
  //MONTO LA TIRADA
  if (valor_habilidad < 0){valor_habilidad=0}
  let tirada=valor_habilidad+"d6+"+valor_atributo
  console.log ("TIRADA")
  console.log (tirada)

  const archivo_template = '/systems/ysystem/templates/dialogos/tirada_habilidad.html';
          const datos_template = { tirada: tirada
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
                let proezas=actor.data.data.Proezas.value;
                if (document.getElementById("mod_dados").value > 0){tirada+="+"+document.getElementById("mod_dados").value+"d6"}
                if (document.getElementById("mod_dados").value > 0){tirada+="+"+document.getElementById("mod_num").value}
                if (document.getElementById("mod_dados").value > 0){
                  if (proezas >0){
                    tirada+="+"+document.getElementById("proezas").value+"d6"
                    proezas--
                    actor.update ({ 'data.Proezas.value': proezas });
                  }
                  else{ui.notifications.warn("No te quedan puntos de PROEZA!!");}
                }
                 let d6Roll = new Roll(tirada).roll({async: false});
                 let flavor = tirada+" VS "+ document.getElementById("dificultad").value
                 d6Roll.toMessage({
                 speaker: ChatMessage.getSpeaker({ actor: actor }),
                 flavor: flavor
              });
    		 }
             }
           },
           render: html => console.log("Register interactivity in the rendered dialog"),
           close: html => console.log("This always is logged no matter which option is chosen")
         });
         dialogo.render(true);
}
