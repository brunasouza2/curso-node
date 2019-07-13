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
        const mongodbString = process.env.MONGO_URI
        const mongoClient = new MongoClient(mongodbString, {useNewUrlParser: true})
        const connection = await mongoClient.connect()
        const heroiCollection = await connection
        .db(process.env.MONGO_DATABASE)
        .collection(process.env.MONGO_COLLECTION)
        this.heroiCollection = heroiCollection
    }

    async cadastrar(heroi) {
        return this.heroiCollection.insertOne(heroi)
    }

    async listar(heroi, skip=0, limit=10) {
        let filtro = {}
        if(heroi.nome){

            filtro = { 
                nome: { 
                    $regex: `.*${heroi.nome}*.`, 
                    $options: 'i' }
                }
        }
        return this.heroiCollection.find(filtro).skip(skip).limit(limit).toArray()
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
