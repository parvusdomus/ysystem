export default class FichaPNJYsystem extends ActorSheet{

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["Ysystem", "sheet", "actor", "PNJ"],
      template: "systems/ysystem/templates/actors/PNJ.html",
      width: 800,
      height: 470,
      resizable: false
    });
  }

  getData() {
        const data = super.getData().data;
        data.dtypes = ["String", "Number", "Boolean"];
        if (this.actor.data.type == 'PNJ' ) {
          console.log ("ACTOR")
          console.log (this.actor)
          this._prepareCharacterItems(data);
          this._calculaValores(data);

        }
        return data;
      }

      _calculaValores(actorData) {
    const data = actorData;
    console.log (data)
    const Agilidad =Number(data.data.Destreza)+Number(data.data.Habilidades.Atletismo.Valor)*3;
    const Aplomo =5+Number(data.data.Carisma)+Number(data.data.Inteligencia);
    const Perspicacia=5+Number(data.data.Percepción)+Number(data.data.Inteligencia);
    const Iniciativa=Number(data.data.Destreza)+Number(data.data.Inteligencia);
    const Salud=13+Number(data.data.Fuerza)*2;
    const R_Física=12-Number(data.data.Fuerza);

    const Poder=5+Number(data.data.Percepción)+Number(data.data.Inteligencia)+Number(data.data.Magia.Valor)*3;

    let Protección_Daño=0;
    let Protección_Penalización=0;
    let Protección_Agilidad=0;
    let Armadura = data.Armaduras.find((k) => k.type === "Armadura" && k.data.Equipado=="true");
    if (Armadura){
      Protección_Daño=Armadura.data.Nivel;
      Protección_Penalización+=Armadura.data.Penalizador;
    }
    let Escudo = data.Escudos.find((k) => k.type === "Escudo" && k.data.Equipado=="true");
    if (Escudo){
      Protección_Agilidad=Escudo.data.Nivel;
      Protección_Penalización+=Escudo.data.Penalizador;
    }

    //ACTUALIZO TODOS LOS VALORES
    this.actor.update ({ 'data.Agilidad.Valor': Agilidad });
    this.actor.update ({ 'data.Aplomo.Valor': Aplomo });
    this.actor.update ({ 'data.Perspicacia.Valor': Perspicacia });
    this.actor.update ({ 'data.Iniciativa': Iniciativa });
    this.actor.update ({ 'data.Salud.max': Salud });
    this.actor.update ({ 'data.Resistencia_Física': R_Física });
    this.actor.update ({ 'data.Protección_Daño': Protección_Daño });
    this.actor.update ({ 'data.Protección_Agilidad': Protección_Agilidad });
    this.actor.update ({ 'data.Protección_Penalización': Protección_Penalización });
    this.actor.update ({ 'data.Poder.max': Poder });

    }

    _prepareCharacterItems(sheetData) {
    const actorData = sheetData;

    // Inicializo arrays para meter los objetos por tipo.
    //"arma", "armadura", "aspecto", "don", "habilidad", "limitacion", "maniobra", "objeto", "talento"
     const Armas = [];
     const Armaduras = [];
     const Escudos = [];
     const Poderes = [];
     const Objetos = [];
     // Ordena los objetos por tipo y los mete en el array correspondiente
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type === 'Arma') {
        if (i.data.Habilidad=="Lucha"){i.data.Ataque=actorData.data.Habilidades.Lucha.Valor+"D6+"+actorData.data.Destreza}
        if (i.data.Habilidad=="Puntería"){i.data.Ataque=actorData.data.Habilidades.Puntería.Valor+"D6+"+actorData.data.Percepción}
        if (i.data.Bono=="FUE_2"){i.data.Daño_Total=Number(i.data.Daño)+Math.floor(Number(actorData.data.Fuerza)/2)}
        if (i.data.Bono=="FUE"){i.data.Daño_Total=Number(i.data.Daño)+Number(actorData.data.Fuerza)}
        if (i.data.Bono=="PER"){i.data.Daño_Total=Number(i.data.Daño)+Number(actorData.data.Percepción)}
        Armas.push(i);
      }
      else if (i.type === 'Armadura') {
        Armaduras.push(i);
      }
       else if (i.type === "Escudo") {
         Escudos.push(i);
       }
       else if (i.type === "Poder") {
         Poderes.push(i);
       }
       else if (i.type === "Objeto") {
         Objetos.push(i);
       }
    }
    //Asigno cada array al actordata
actorData.Armas = Armas;
actorData.Armaduras = Armaduras;
actorData.Escudos = Escudos;
actorData.Poderes = Poderes;
actorData.Objetos = Objetos;
}

      activateListeners(html) {
              super.activateListeners(html);

              // Si la hoja no es editable me salgo
              if (!this.options.editable) return;

              //AQUI IRIAN LOS LISTENERS DE LAS TIRADAS

      }

}
