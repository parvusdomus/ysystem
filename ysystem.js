import FichaYsystem from "./modules/fichas/FichaPJ.js";

//import { preloadHandlebarsTemplates } from "./module/preloadTemplates.js";

Hooks.once("init", function(){
    console.log("test | INICIALIZANDO HOJAS DE PERSONAJE DE Ysystem");

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Ysystem", FichaYsystem, {
      makeDefault: true,
      types: ['Jugador']
    });

    console.log ("test | HOJAS INICIALIZADAS");
    //console.log ("test | CARGANDO TEMPLATES");
    //preloadHandlebarsTemplates();
    //console.log ("test | TEMPLATES CARGADOS");
});
