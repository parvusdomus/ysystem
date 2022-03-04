export default class FichaPoderYsystem extends ItemSheet{
  static get defaultOptions() {
    if (game.settings.get ("ysystem", "forceFontSize")){
      game.settings.set("core","fontSize", "5");
    }
    return mergeObject(super.defaultOptions, {
      classes: ["Ysystem", "sheet", "item"],
      width: 620,
      height: 420,
      resizable: false
    });
  }
  get template(){
          return `systems/ysystem/templates/items/Poder.html`;
      }
}
