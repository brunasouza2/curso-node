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
 * para evitar ficar fazendo ifs, validando na mão
 * podemos trabalhar com schemas de validação onde validamos o pedido primeiro antes de 
 * passar pelo nosso HANDLER
 * 
 * npm i joi
 * 
 * npm i hapi-swagger@9.1.3 inert vision
 * 
 * para padronizar status de operação das APIs usamos o Boom
 * npm i bomm
 * 
 */

const Hapi = require('hapi')
const Joi = require('joi')
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const Boom = require('boom')
const { ObjectId } = require('mongodb')
const Db = require('./src/heroiDb')
const app = new Hapi.Server({
    port:3000
})

async function main(){
   try{
       const database = new Db()
       await database.connect()

       await app.register([
           Inert,
           Vision,
           {
               plugin: HapiSwagger,
               options: {
                   documentationPath: '/v1/documentation',
                   info: {
                       title: 'API Heroes - Bruna',
                       version: 'v1.0'
                   },
                   lang: 'pt'
               }
           }
       ])

       app.route([
           {
               // localhost:3000/v1/herois?nome=flash
               // localhost:3000/v1/herois?skip=1&limit=1
               path: '/v1/herois',
               method: 'GET',
               config:{
                   tags: [ 'api' ],
                   description: 'Listar Herois',
                   notes: 'Pode filtrar por nome e paginar',
                   validate: {
                       failAction: (request, h, err) =>{
                           throw err   
                       },
                       query: {
                           nome: Joi.string().max(10).min(2),
                           skip: Joi.number().default(0),
                           limit: Joi.number().max(10).default(10)
                       }
                   }
               },
               handler: async (request) => {
                   try{
                       const {query} = request
                       const {skip, limit} = query
                       return database.listar(query, parseInt(skip), parseInt(limit))
                   }catch(error){
                       console.error('DEU RUIM', error)
                       return Boom.internal();
                   }
               }
           },
           {
               path: '/v1/herois',
               method: 'POST',
               config: {
                   tags: [ 'api' ],
                   description: 'Cadastrar Herois',
                   notes: 'Pode cadastrar por nome, idade e poder',
                   validate: {
                       failAction: (r, h, erro) => {
                           throw erro
                       },
                       payload: {
                           nome: Joi.string().max(10).required(),
                           idade: Joi.number().min(18).required(),
                           poder: Joi.string().max(10).required()
                       }
                   }
               },
               handler: async (request) => {
                   try {
                       const {payload} = request
                       return database.cadastrar(payload)
                   } catch (error) {
                       console.error('DEU RUIM', error)
                       return Boom.internal();
                   }
               }
           },
           {
               path: '/v1/herois/{id}',
               method: 'DELETE',
               config: {                    
                   tags: [ 'api' ],
                   description: 'Remover Herois',
                   notes: 'Remove por id',
                   validate : {
                       failAction: (request, h, err) =>{
                           throw err   
                       },
                       params: {
                           id: Joi.string().max(40).required()
                       }
                   }
               },
               async handler(request) {
                   try {
                       const { id } = request.params
                       return database.remover(ObjectId(id))
                   } catch (error) {
                       console.log('DEU RUIM', error);
                       return Boom.internal();
                   }
               }
           },
           {
               path: '/v1/herois/{id}',
               method: 'PATCH',
               config: {
                   tags: [ 'api' ],
                   description: 'Atualizar Herois',
                   notes: 'atualizar heroi por id',
                   validate: {
                       failAction (r, h, error){
                           throw error
                       },
                       params: {
                           id: Joi.string().max(40).required()
                       },
                       payload: {
                           nome: Joi.string().max(20).min(2),
                           poder: Joi.string().max(20).min(2),
                           idade: Joi.number().min(18)
                       }
                   }
               },
               async handler (request, h) {
                   try {
                       const { id } = request.params
                       const { payload } = request
                       const v = database.atualizar(ObjectId(id),payload)
                       return h.response(v).code(201)
                   } catch (error) {
                       console.log('DEU RUIM', error)
                       return Boom.internal();
                   }
               }
           }
       ])

       await app.start()
       console.log(`servidor rodando ${app.info.host}:${app.info.port}`)

   }catch(error){
       console.error('DEU RUIM', error)
       return Boom.internal();
   }
}

main()

