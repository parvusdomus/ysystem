import FichaYsystem from "./modules/fichas/FichaPJ.js";
import FichaPNJYsystem from "./modules/fichas/FichaPNJ.js";
import FichaObjetoYsystem from "./modules/fichas/FichaObjeto.js";
import FichaPoderYsystem from "./modules/fichas/FichaPoder.js";
import YsystemChat from "./modules/Chat.js";
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
      types: ['Arma','Armadura','Escudo','Objeto']
    });
    Items.registerSheet("Ysystem", FichaPoderYsystem,{
      makeDefault: true,
      types: ['Poder']
    });
    console.log ("test | HOJAS INICIALIZADAS");
    console.log ("test | CARGANDO TEMPLATES");
    preloadHandlebarsTemplates();
    console.log ("test | TEMPLATES CARGADOS");
    console.log ("test | FORZANDO TAMAÑO DE LETRA");
    console.log (game.settings.settings)
    game.settings.set("core","fontSize", "5");
    console.log ("test | TAMAÑO DE LETRA FORZADO");
});

Hooks.on('renderChatLog', (app, html, data) => YsystemChat.chatListeners(html))
