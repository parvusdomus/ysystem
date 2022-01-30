import FichaYsystem from "./modules/fichas/FichaPJ.js";
import FichaPNJYsystem from "./modules/fichas/FichaPNJ.js";
import FichaObjetoYsystem from "./modules/fichas/FichaObjeto.js";
import { preloadHandlebarsTemplates } from "./modules/preloadTemplates.js";

Hooks.once("init", function(){
    console.log("test | INICIALIZANDO HOJAS DE PERSONAJE DE Ysystem");

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Ysystem", FichaYsystem, {
      makeDefault: true,
      types: ['Jugador']
    });
    Actors.registerSheet("Ysystem", FichaPNJYsystem, {
      makeDefault: true,
      types: ['PNJ']
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("Ysystem", FichaObjetoYsystem,{
      makeDefault: true,
      types: ['Arma','Armadura','Escudo','Objeto', 'Poder']
    });
    console.log ("test | HOJAS INICIALIZADAS");
    console.log ("test | CARGANDO TEMPLATES");
    preloadHandlebarsTemplates();
    console.log ("test | TEMPLATES CARGADOS");
});
