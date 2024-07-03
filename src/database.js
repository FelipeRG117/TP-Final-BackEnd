const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const {mongo_url} = configObject;

class BaseDatos {
    static #instancia; 
    constructor(){
        mongoose.connect("mongodb+srv://FelipeReyes50045:coderhouse@vidar771.pck1zis.mongodb.net/tienda?retryWrites=true&w=majority&appName=vidar771");
    }

    static getInstancia() {
        if(this.#instancia) {
            console.log("Conexion previa");
            return this.#instancia;
        }

        this.#instancia = new BaseDatos();
        console.log("Conexión exitosa!!");
        return this.#instancia;
    }
}

module.exports = BaseDatos.getInstancia();