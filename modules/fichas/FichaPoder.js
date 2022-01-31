export default class FichaPoderYsystem extends ItemSheet{
  static get defaultOptions() {
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
