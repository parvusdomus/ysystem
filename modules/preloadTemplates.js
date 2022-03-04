export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/ysystem/templates/actors/Negro/Jugador_partes/habilidades.html",
      "/systems/ysystem/templates/actors/Negro/Jugador_partes/equipo.html",
      "/systems/ysystem/templates/actors/Negro/Jugador_partes/bio.html",
      "/systems/ysystem/templates/actors/Negro/Jugador_partes/magia.html",
      "/systems/ysystem/templates/actors/Rojo/Jugador_partes/habilidades.html",
      "/systems/ysystem/templates/actors/Rojo/Jugador_partes/equipo.html",
      "/systems/ysystem/templates/actors/Rojo/Jugador_partes/bio.html",
      "/systems/ysystem/templates/actors/Rojo/Jugador_partes/magia.html",
      "/systems/ysystem/templates/actors/PNJ_partes/general.html",
      "/systems/ysystem/templates/actors/PNJ_partes/bio.html",
      "/systems/ysystem/templates/actors/PNJ_partes/magia.html"
    ];
        return loadTemplates(templatePaths);
};
