const { 
    exists,
    promises: {
        writeFile,
        readFile,
    },
} = require('fs')

const existsAsync = (parametro) => 
    new Promise((resolve, reject) => {
        return exists(parametro, (existe) => resolve(existe))
    })

class HeroiDbArquivo {
    constructor(){
        this.NOME_ARQUIVO = 'herois.json'
    }
    async _obterArquivo(){
        if(! await existsAsync(this.NOME_ARQUIVO)){
            return [];
        }
        const texto = await readFile(this.NOME_ARQUIVO)
        return JSON.parse(texto)
    }

    async _escreverArquivo(dado){
        const dadoTexto = JSON.stringify(dado)
        await writeFile(this.NOME_ARQUIVO, dadoTexto)
        return;
    }

    async cadastrar(heroi){
        const herois = await this.listar()
        heroi.id = Date.now()
        herois.push(heroi);
        await this._escreverArquivo(herois)
        return;
    }

    async listar(filtro={}){
        if(!Object.keys(filtro).length){
            return await this._obterArquivo();
        }
        const dados = await this._obterArquivo()
        // para entrar em cada item da lista
        const dadosFiltrados = dados.filter(heroi =>             
                ~heroi.nome.toLowerCase()
                .indexOf(filtro.nome.toLowerCase())
            )
        return dadosFiltrados
    }

    async remover(idHeroi){
        const dados = await this._obterArquivo()
        const dadosFiltrados = dados.filter(( { id } ) => id !== parseInt(idHeroi))
        return await this._escreverArquivo(dadosFiltrados)
    }

    async atualizar(idHeroi, heroiAtualizado){
        const dados = await this._obterArquivo()
        const indiceHeroiAntigo = dados.findIndex( ({ id }) => id === parseInt(idHeroi) )

        if(indiceHeroiAntigo=== -1) {
            throw new Error('O heroi não existe!')
        }

        const atual = dados[indiceHeroiAntigo]
        // removendo da lista
        dados.splice(indiceHeroiAntigo, 1);

        // para remover todas as chaves que esteja vazias (undenifed) precisamos
        // converter o objeto para string e depois para objeto novamente

        const objTexto = JSON.stringify(heroiAtualizado)
        const objFinal = JSON.parse(objTexto);

        const heroiAlterado = {
            ...atual,
            ...objFinal
        }

        const novaLista = [
            ...dados,
            heroiAlterado
        ]

        return await this._escreverArquivo(novaLista)
    }
}

module.exports = HeroiDbArquivo;

// async function main(){
//     const minhaClass = new HeroiDbArquivo();

//     await minhaClass.cadastrar({
//         nome: 'Flash',
//         poder: 'Velocidade'
//     })

//     const dado = await minhaClass.listar({
//         nome: 'fl'
//     });
//     console.log(dado)
// }

// main()