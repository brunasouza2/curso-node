// biblioteca padrão do node.js para trabalhar com requisições Web
// const http = require('http')
// http.createServer( (req, res) => {
//     res.end('Hello Word')
// }).listen(3000, () => console.log ('Server rodando'))

/**
 * vamos trabalhar com o padrão REST x RESTFULL
 * -> JSON (Javascript Schema Object Notation)
 * -> Rest -> padrão (convenção) de APIs (NAO é Framework)
 * 
 *  ACAO    |METODO |URL
 * cadastrar|POST   |/v1/herois  -> dados no body
 * atualizar|       |/v1/herois/:id -> dados no body
 *           PATCH -> atualização parcial
 *           PUT -> substituir toda a informação
 * remover  |DELETE |/v1/herois/:id
 * listar   |GET    |/v1/herois?skip=0&limit=10&nome=e
 * listar   |GET    |/v1/herois/:id/habilidades
 * listar   |GET    |/v1/herois/:id/habilidades/:id
 * 
 * 
 * npm i hapi
 * 
 */

const Hapi = require('hapi')
const Db = require('./src/heroiDb')
const app = new Hapi.Server({
    port:3000
})

async function main(){
   try{
       const database = new Db()
       await database.connect()

       app.route([
           {
               // localhost:3000/v1/herois?nome=flash
               path: '/v1/herois',
               method: 'GET',
               handler: async (request) => {
                   try{
                       const {query} = request
                       return database.listar(query)
                   }catch(error){
                       console.error('DEU RUIM', e)
                   }
               }
           }
       ])

       await app.start()
       console.log(`servidor rodando ${app.info.host}:${app.info.port}`)

   }catch(error){
       console.error('DEU RUIM', e)
   }
}

main()

