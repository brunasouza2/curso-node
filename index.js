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
    const dbArquivo = new HeroiDbArquivo();

    const heroi = new Heroi(commander)

    /*
    node index.js --nome Flash --poder Velocidade --idade 80 --cadastrar
    */

    // node index.js --cadastrar
    // node index.js -c

    // node index.js --nome

    if(commander.cadastrar){
        await dbArquivo.cadastrar(heroi)
        console.log('Heroi cadastrado com sucesso!');
        return;
    }
    /*
    node index.js --nome "Mulher Maravilha" --poder forca --idade 48 --id 1562884451582 --atualizar
    */

    if(commander.atualizar){
        const { id } = heroi
        delete heroi.id
        await dbArquivo.atualizar(id, heroi)
        console.log('Herois atualizado com sucesso!');
        return;
    }

    /**
     * node index.js --id 1562880595687 --remover
     */

    if(commander.remover){
        const id = heroi.id
        if(!id){
            throw new Error('Voce deve passar o ID')
        }
        await dbArquivo.remover(id)
        console.log('Heroi removido com sucesso');
        return;
    }
    /**
     * node index.js --nome fl --listar
     */

    if(commander.listar){
        let filtro = {}
        if(heroi.nome){
            filtro = {nome: heroi.nome}
        }

        const herois = await dbArquivo.listar(filtro)
        console.log('herois', JSON.stringify(herois))
        return;
    }
}

main();