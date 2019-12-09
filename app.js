class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor

    }

    validarDados() {
        for(let i in this){
            if(this[i] == undefined ||  this[i] == '' || this[i] == null){
                return false
                
            }
        }
        return true
    }

}

class Bd {

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }
    getProximoId (){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1

    }
    gravar (d) {
        let idAtualizado = this.getProximoId()

        localStorage.setItem(idAtualizado, JSON.stringify(d))

        localStorage.setItem('id', idAtualizado)
    }  

    recuperarTodosRegistros() {
        let despesas = Array ()
        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }

            despesa.id = i

            despesas.push(despesa)          

        }
            
        return despesas

        
    }
    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function apagarCampo(){    
    document.getElementById('ano').value = ''
    document.getElementById('mes').value = ''
    document.getElementById('dia').value = ''
    document.getElementById('tipo').value = ''
    document.getElementById('valor').value = ''
    document.getElementById('descricao').value = ''

}



function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value

    )
    if(despesa.validarDados()) {
       bd.gravar(despesa)

       document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'       
       document.getElementById('modal_titulo_div').className = 'modal-header text-success'
       document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrado com sucesso'
       document.getElementById('modal_botao').innerHTML = 'voltar'
       document.getElementById('modal_botao').className = 'btn btn-primary btn-success'

       apagarCampo()
       

        $('#modalRegistraDespesa').modal('show')

    } else{
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se há algum campo em branco'
        document.getElementById('modal_botao').innerHTML = 'voltar e corrigir'
        document.getElementById('modal_botao').className = 'btn btn-primary btn-danger'

        $('#modalRegistraDespesa').modal('show')
        }
 


}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }


    // Selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''

    

    despesas.forEach(function(d) {
        
        // criando linha(tr)
    
       let linha = listaDespesas.insertRow()

        //criando colunas (td)
        linha.insertCell(0).innerHTML =  d.dia + '/' + d.mes + '/' + d.ano
        

        //ajuste do tipo
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break  
            case '5': d.tipo = 'Transporte'
                break  
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fa fa-times" ></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
            
            document.getElementById('modal_titulo').innerHTML = 'Despesa deletada'       
            document.getElementById('modal_titulo_div').className = 'modal-header text-success'
            document.getElementById('modal_conteudo').innerHTML = 'Despesa foi deletada com sucesso'
            document.getElementById('modal_botao').innerHTML = 'voltar'
            document.getElementById('modal_botao').className = 'btn btn-primary btn-success'      
       

            $('#modalDeleta').modal('show')
            
        }
        linha.insertCell(4).append(btn)
        

    })

}

function pesquisarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesaUnica = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value)

    let despesas = bd.pesquisar(despesaUnica)     
    

    apagarCampo()

    this.carregaListaDespesas(despesas, true)
}


