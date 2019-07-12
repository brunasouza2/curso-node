
const {ObjectID} = require('mongodb')
class Heroi {
    // extraimos somente o necessário para criar o heroi
    constructor({id, nome, idade, poder}){
        this._id = id ? ObjectID(id) : id
        this.nome = nome
        this.idade = idade
        this.poder = poder
    }
}
// exportamos a classe para o mundo
module.exports = Heroi