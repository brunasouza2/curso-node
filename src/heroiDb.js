// npm install mongodb

/*
    show dbs
    use caracteres
    show collections
    db.nomeDaColecao.insert({
        nome: 'teste',
        idade: 123
    })

    for(i=0; i< 1000; i++){
        db.nomeDaColecao.insert({nome: 'teste'+i})
    }
    db.nomeDaColecao.find()

*/

const {
    MongoClient
} = require('mongodb')

class HeroiDB {
    constructor() {
        this.heroiCollection = {}
    }

    async connect() {
        // localhost:27017/dbName
        const mongodbString = 'mongodb://localhost:27017/heroi'
        const mongoClient = new MongoClient(mongodbString, {userNewUrlParser: true})
        const connection = await mongoClient.connect()
        const heroiCollection = await connection.db('caracteres').collection('heroi')
        this.heroiCollection = heroiCollection
    }

    async cadastrar(heroi) {
        return this.heroiCollection.insertOne(heroi)
    }

    async listar(filtro) {
        return this.heroiCollection.find(filtro).toArray()
    }

    async remover(id) {
        return this.heroiCollection.deleteOne({_id: id})
    }

    async atualizar(idHeroi, heroiAtualizado) {
        //$set: dado
        return this.heroiCollection.update({
            _id: idHeroi
        }, {
            $set: heroiAtualizado
        })
    }
}

module.exports = HeroiDB

// async function main(){
//     const heroi = new HeroiDB()
//     const { heroiCollection } = await heroi.connect()
//     await heroiCollection.insertOne({
//         nome: 'Homem Aranha',
//         poder: 'Teia',
//         idade: 23
//     })

//     const items = await heroiCollection.find().toArray()
//     console.log('items', items)
//     return;
// }

// main()
