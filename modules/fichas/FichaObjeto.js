export default class FichaObjetoYsystem extends ItemSheet{
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["Ysystem", "sheet", "item"],
      width: 320,
      height: 370,
      resizable: false
    });
  }
  get template(){
          return `systems/ysystem/templates/items/${this.item.data.type}.html`;
      }
}
