// para instalar pacotes externos usamos a ferramenta NPM (Node Package Manager) ou YARN
// (foi criado pelo FB para ser mais performatico)

//para iniciar um projeto node.js, precisamos de um arquivo que define os pacotes. Quando outra 
//pessoa precisar acessar o seu código, este arquivo lhe ensina como instalar ou 
// quais versoes sao suportadas.

//para iniciar um projeto
// npm init
// -> -y => não precisa de wizard

// para trabalhar com programas de linha de comando usaremos o Comander
// npm install comander
// --save (No PASSO)
// --save-dev -> Ferramentas como transpiladores, testes, ferramentas para diminuir o tamanho do arquivo


const Heroi = require('./src/heroiEntidade')
const HeroiDbArquivo = require('./src/heroiDbArquivo')
const HeroiMongoDB = require('./src/heroiDb')

const Commander = require('commander')
const commander = Commander
        .version('v1.0')
        .option('-n, --nome [value]', 'O nome do heroi')
        .option('-i, --idade [value]', 'A idade do heroi')
        .option('-I, --id [value]', 'O id do heroi')
        .option('-p, --poder [value]', 'O poder do heroi')
        //definimos opcoes para utilizar
        .option('-c, --cadastrar', 'deve cadastrar um heroi')
        .option('-a, --atualizar [value]', 'deve atualizar um heroi')
        .option('-r, --remover', 'deve remover um heroi')
        .option('-l, --listar', 'deve listar um heroi')
        .parse(process.argv)

async function main(){
    try{
        const dbArquivo = new HeroiDbArquivo();
        const dbMongo = new HeroiMongoDB()
        await dbMongo.connect()
        console.log('Mongo conectado!')
        const heroi = new Heroi(commander)

        /*
        node index.mongo.js --nome Flash --poder Velocidade --idade 80 --cadastrar
        */

        // node index.mongo.js --cadastrar
        // node index.mongo.js -c

        // node index.mongo.js --nome

        if(commander.cadastrar){
            await dbMongo.cadastrar(heroi)
            console.log('Heroi cadastrado com sucesso!');
            process.exit(0)
            return;
        }
        /*
        node index.mongo.js --nome "Mulher Maravilha" --poder forca --idade 48 --id 5d27c9406d30594deca3bf83 --atualizar
        */

        if(commander.atualizar){
            const { _id } = heroi
            // gambeta do bem, para remover as chaves
            if(!_id){
                throw new Error('O Id é obrigatorio')
            }
            delete heroi._id
            const heroisFinal = JSON.parse(JSON.stringify(heroi))
            await dbMongo.atualizar(_id, heroisFinal)
            console.log('Herois atualizado com sucesso!');
            process.exit(0)
            return;
        }

        /**
         * node index.mongo.js --id 5d27d27893fbdf1ba0c9907a --remover
         */

        if(commander.remover){
            const id = heroi._id
            if(!id){
                throw new Error('Voce deve passar o ID')
            }
            await dbMongo.remover(id)
            console.log('Heroi removido com sucesso');
            process.exit(0)
            return;
        }
        /**
         * node index.mongo.js --nome tar --listar
         */

        if(commander.listar){
            let filtro = {}
            if(heroi.nome){

                filtro = { 
                    nome: { 
                        $regex: `.*${heroi.nome}*.`, 
                        $options: 'i' }
                    }
            }

            const herois = await dbMongo.listar(filtro)
            console.log('herois', JSON.stringify(herois))
            process.exit(0)
            return;
        }
    }catch(error){
        console.error('Deu Ruim')
        process.error(0)
    }
}

main();