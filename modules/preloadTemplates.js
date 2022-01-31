export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/ysystem/templates/actors/Jugador_partes/habilidades.html",
      "/systems/ysystem/templates/actors/Jugador_partes/equipo.html",
      "/systems/ysystem/templates/actors/Jugador_partes/bio.html",
      "/systems/ysystem/templates/actors/Jugador_partes/magia.html"
    ];
        return loadTemplates(templatePaths);
};
