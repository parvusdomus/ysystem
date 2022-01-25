export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/ysystem/templates/actors/Jugador_partes/general.html",
      "/systems/ysystem/templates/actors/Jugador_partes/equipo.html",
      "/systems/ysystem/templates/actors/Jugador_partes/bio.html"
    ];
        return loadTemplates(templatePaths);
};
