const categoriasAPI = {
    "Estudos": "student studying",
    "Compras": "Shopping mall"
};

const categoriasFundo = [
    {
        nome: "Floresta",
        imagem: "src/imagens/floresta_horizontal.jpg"
    },
    {
        nome: "Praia",
        imagem: "src/imagens/praia_horizontal.jpg"
    },
    {
        nome: "Montanha",
        imagem: "src/imagens/montanha_horizontal.jpg"
    },
    {
        nome: "Espaço",
        imagem: "src/imagens/espaco_horizontal.jpg"
    },
    {
        nome: "Cidade",
        imagem: "src/imagens/cidade_horizontal.jpg"
    },
    {
        nome: "Pôr do Sol",
        imagem: "src/imagens/por-do-sol_horizontal.jpg"
    }
];

const section_cadastro = document.querySelector(".section_cadastro");
const section_categoria = document.querySelector(".section_categoria");
const section_lista = document.querySelector(".section_lista");
const div_primeiro_acesso = document.querySelector(".primeiro_acesso")
const div_lista = document.querySelector(".div_lista")
const div_edit_tarefa = document.querySelector(".div_edit_tarefa")
const container_categoria = document.querySelector(".container_categoria");
const container_lista_tarefas = document.querySelector(".container_lista_tarefas")
const subtitulo_cadastro = document.querySelector(".subtitulo_cadastro")
const classe_btn_voltar = document.querySelector(".classe_btn_voltar")
const containerFundos = document.querySelector(".container_fundos");

const nome_usuario = document.querySelector("#nome_usuario");
const tarefa_digitada = document.querySelector("#tarefa");
const objetivo = document.querySelector("#objetivo");
const input_edit = document.querySelector("#input_edit");

const span_nome_usuario = document.querySelector("#span_nome_usuario");
const span_objetivo_selecionado = document.querySelector("#span_objetivo_selecionado");

const btn_cadastrar = document.querySelector("#btn_cadastrar");
const btn_add_catergoria = document.querySelector("#add_catergoria");
const btn_voltar_categoria = document.querySelector("#btn_voltar_categoria");
const btn_add_tarefa = document.querySelector("#add_tarefa");
const btn_cancelasr_edit = document.querySelector("#cancelar_edit")
const btn_concluir_edicao = document.querySelector("#concluir_edicao")
const id_btn_voltar = document.querySelector("#id_btn_voltar")
const btn_fechar_modal_erro= document.querySelector("#btn_fechar_modal_erro")
const btn_fechar_modal_img= document.querySelector("#btn_fechar_modal_img")
const btn_img_fundo_inicio = document.querySelector("#btn_img_fundo_inicio");
const btn_img_fundo_categoria = document.querySelector("#btn_img_fundo_categoria");
const inputFundo = document.querySelector("#input_fundo");

let cadastro = JSON.parse(localStorage.getItem("cadastro")) || {};
let categorias_salvas = JSON.parse(localStorage.getItem("categorias_salvas")) || [];
let categoria_selecionada = null
let indice_tarefa = null
let fundosCarregados = false;
let data = null
let dia = ""
let mes = ""
let ano = ""
let data_atual = ""

// -----------------------------------------------------Açoes da pagina-----------------------------------------------------------
// Ação ao recarregar a pagina
document.addEventListener("DOMContentLoaded", () =>{
    const imagemSalva = localStorage.getItem("imagem_fundo");
    if (imagemSalva) {
        document.body.style.backgroundImage = `url('${imagemSalva}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";
    }
    if (!cadastro.concluido){ //Mostra a seção de cadastro quando o cadastro não foi realizado
        div_primeiro_acesso.classList.add("visivel")
        classe_btn_voltar.classList.add("oculto")
        subtitulo_cadastro.classList.add("oculto")
    } else { //Mostra a seção principal se o cadastro foi realizado
        section_cadastro.classList.add("oculto");
        section_categoria.classList.add("visivel");
        span_nome_usuario.innerText = cadastro.nome_usuario;
        criar_sub_categoria()
    }
});

// Botão para adicionar categorias
btn_cadastrar.addEventListener('click', () =>{
    const area_selecionada = document.querySelector('input[name="interesse"]:checked');
    const prazo_selecionado = document.querySelector('input[name="periodo"]:checked');
    if (!cadastro.concluido){
        subtitulo_cadastro.classList.add("oculto")
        const desafio_selecionado = document.querySelector('input[name="desafio"]:checked');
        if(!desafio_selecionado || nome_usuario.value.trim() === ""){
           abrir_modal_erro()
        } else {
            cadastro = {
            nome_usuario: nome_usuario.value.trim(),
            desafio_selecionado: desafio_selecionado.value,
            concluido: true
            };
            localStorage.setItem("cadastro", JSON.stringify(cadastro));
            nome_usuario.value = "";
            desafio_selecionado.value = "";
            span_nome_usuario.innerText = cadastro.nome_usuario;
        }
    }

    if(!area_selecionada || !prazo_selecionado || objetivo.value.trim() === ""){
        abrir_modal_erro()
    } else {
        let valor_duracao = 0
        if(prazo_selecionado.value === "imediato"){
            valor_duracao = 24.00
        }else if (prazo_selecionado.value === "curto"){
            valor_duracao = 7
        } else if(prazo_selecionado.value === "medio"){
            valor_duracao = 30
        } else {
            valor_duracao = 365
        }

        let categoria = {
        id_card: `card${categorias_salvas.length + 1}-${area_selecionada.value}`,
        area_interesse: area_selecionada.value,
        objetivo: objetivo.value.trim(),
        prazo: prazo_selecionado.value,
        data_salva: new Date,
        duracao: valor_duracao,
        tarefas: []
        };
        categorias_salvas.push(categoria);
        localStorage.setItem("categorias_salvas", JSON.stringify(categorias_salvas));
        area_selecionada.checked = false;
        objetivo.value = "";
        prazo_selecionado.checked = false;
        criar_sub_categoria()

        div_primeiro_acesso.classList.remove("visivel");
        section_cadastro.classList.add("oculto");
        section_categoria.classList.add("visivel");
    } 
});

//Botão para abrir a escolha do plano de fundo
btn_img_fundo_inicio.addEventListener("click", abrirModalFundos);
btn_img_fundo_categoria.addEventListener("click", abrirModalFundos);

// Botão para abrir a seção de cadastro de categorias
btn_add_catergoria.addEventListener('click', () =>{
    btn_cadastrar.textContent = "Cadastrar categoria";
    classe_btn_voltar.classList.remove("oculto");
    section_categoria.classList.remove("visivel");
    section_cadastro.classList.remove("oculto");
    subtitulo_cadastro.classList.remove("oculto")
});

//Botão para voltar para aba de categoria 
btn_voltar_categoria.addEventListener('click', () => {
    section_categoria.classList.add("visivel");
    section_lista.classList.remove("visivel");
})

id_btn_voltar.addEventListener('click', () =>{
    section_cadastro.classList.add("oculto");
    section_categoria.classList.add("visivel");
})

//Botão para adicionar as tarefas
btn_add_tarefa.addEventListener("click", () => {
        categorias_salvas.forEach(item => {
            if(item.objetivo === span_objetivo_selecionado.textContent){
                container_lista_tarefas.innerHTML = "";
                if(tarefa_digitada.value.trim() === ""){
                    abrir_modal_erro()                    
                } else {
                    item.tarefas.push({
                        id: crypto.randomUUID(),
                        nome: tarefa_digitada.value.trim(),
                        concluida: false
                    })
                    localStorage.setItem("categorias_salvas", JSON.stringify(categorias_salvas));
                    atualizarLista(item);
                }
            }
        })    
    tarefa_digitada.value = ""
    tarefa_digitada.focus()
})

//Botão para cancelar a edição da tarefa
btn_cancelasr_edit.addEventListener('click', fechar_aba_edit)

//Botão para concluir a edição da tarefa
btn_concluir_edicao.addEventListener('click', () => {
    if(input_edit.value.trim() === ""){
        abrir_modal_erro()
    } else {
        let tarefa_editada = input_edit.value.trim()
        categoria_selecionada.tarefas.forEach(tarefa =>{
            if(tarefa.id === indice_tarefa){
                tarefa.nome = tarefa_editada
                localStorage.setItem("categorias_salvas", JSON.stringify(categorias_salvas));
                atualizarLista(categoria_selecionada);
            } 
        })
    fechar_aba_edit()
    }
})

//Botão para fechar o Popp de erro
btn_fechar_modal_erro.addEventListener('click', () =>{
    const modal = document.getElementById("modal_erro")
    modal.close()
})

//Botão para fechar o Popp de imagen de fundo
btn_fechar_modal_img.addEventListener('click', () =>{
    const modal = document.getElementById("modal_imagem_fundo")
    modal.close()
})

// -----------------------------------------------------Funções da pagina----------------------------------------------------------- 
//Função para atualizar a data e a hora atual
function atualizar_data(){
    data = new Date()
    dia = data.getDate()
    mes = data.getMonth() + 1
    ano = data.getFullYear()
    data_atual = `${dia}/${mes}/${ano}`
}

//Cria a Lista com as Categorias criadas
function criar_sub_categoria(){
    container_categoria.innerHTML = "";    
    atualizar_data()

    categorias_salvas = categorias_salvas.filter(item => {
        if(item.prazo === "imediato"){
            const criado = new Date(item.data_salva);
            const agora = new Date();
    
            if(agora - criado >= 24 * 60 * 60 * 1000){
                return false;
            }
        } else {
            if(item.duracao <= 0){
                return false;
            }
        }
        return true
    })

    localStorage.setItem("categorias_salvas", JSON.stringify(categorias_salvas));

    categorias_salvas.forEach(item => {
        let unidade_prazo = ""
        if(item.prazo === "imediato"){
            let expiracao = new Date(item.data_salva)
            expiracao.setHours(expiracao.getHours()+24)
            const agora = new Date()
            const diferenca = expiracao - agora;
            const horas = Math.floor(diferenca/(1000*60*60))
            const minutos = Math.floor((diferenca % (1000*60*60))/(1000*60))
            item.duracao = `${horas}h ${minutos}min`
        } else {
            unidade_prazo = "dias"
            if(item.data_salva !== data_atual){
                item.duracao -= 1
                item.data_salva = data_atual
            }
        }

        const card_categoria = document.createElement("div");
        card_categoria.classList.add("card_categoria");

        const info_card_categoria = document.createElement("div");
        info_card_categoria.classList.add("info_card_categoria");

        const titulo_categoria = document.createElement("h3");
        titulo_categoria.innerText = `Categoria: ${item.area_interesse}`;
        info_card_categoria.appendChild(titulo_categoria);

        const objetivo_categoria = document.createElement("p");
        objetivo_categoria.innerText = `Objetivo: ${item.objetivo}`;
        info_card_categoria.appendChild(objetivo_categoria);

        const prazo_categoria = document.createElement("p");
        prazo_categoria.innerText = `Prazo: ${item.prazo}`;
        info_card_categoria.appendChild(prazo_categoria);

        const contagem_temino_atividade = document.createElement("p");
        contagem_temino_atividade.innerHTML = `Expira em <span>${item.duracao}</span> ${unidade_prazo}.`
        info_card_categoria.appendChild(contagem_temino_atividade)

        card_categoria.appendChild(info_card_categoria)
        container_categoria.appendChild(card_categoria)
        
        //Botão de excluir a categoria
        const remover_categoria = document.createElement("div");
        remover_categoria.classList.add("remover_categoria")

        const btn_remover_categoria = document.createElement("button")
        btn_remover_categoria.classList.add("btn_remover_categoria")
        btn_remover_categoria.innerHTML = '<i class="fa-solid fa-trash"></i>'

        btn_remover_categoria.addEventListener("click", (event) => {
            event.stopPropagation();
            acao_remover_categoria(item);
        });  
        
        remover_categoria.appendChild(btn_remover_categoria)
        card_categoria.appendChild(remover_categoria)
    
        //colocar a imagem no card
        const categoria = categoriasAPI[item.area_interesse]
        conectar_API(categoria, card_categoria)

        //Abri o card da categoria
        card_categoria.addEventListener("click", () => {
            abrir_aba_lista(item)
        })
    });
}

//Conecta a API do Pexel para utilizar as imagens
function conectar_API(categoria, card){
    
    fetch(`https://api.pexels.com/v1/search?query=${categoria}&per_page=30`,{
        headers:{
        Authorization: "DWs5g3WjzRyo74Y7gLzKVhFQW03ZIqOrvAP2JUMu2owASgGszYHPQiiV"
        }
    })
    .then(resposta => resposta.json())
    .then(dados =>{

        const numero = Math.floor(Math.random()*dados.photos.length);
        const imagem = dados.photos[numero].src.landscape;
        card.style.backgroundImage = `url('${imagem}')`;
    })
}

//Função para abrir a aba com a lista de afazeres
function abrir_aba_lista(card_selecionado){
    section_categoria.classList.remove("visivel");
    section_lista.classList.add("visivel");
    span_objetivo_selecionado.innerText = card_selecionado.objetivo
    atualizarLista(card_selecionado)
};

//Função para atualizar as tarefas da lista
function atualizarLista(item){
    container_lista_tarefas.innerHTML = "";
    item.tarefas.forEach(tarefa => {
        const container_tarefa = document.createElement("div")
        container_tarefa.classList.add("container_tarefa")

        const titulo_tarefa = document.createElement("p");
        titulo_tarefa.innerText = tarefa.nome;
        container_tarefa.appendChild(titulo_tarefa);

        const acoes_tarefa = document.createElement("div")
        acoes_tarefa.classList.add("acoes_tarefa")
        container_tarefa.appendChild(acoes_tarefa);

        const btn_tarefa_concluida = document.createElement("button")
        btn_tarefa_concluida.classList.add("tarefa_concluida")
        btn_tarefa_concluida.innerHTML = '<i class="fa-solid fa-check"></i>'
        acoes_tarefa.appendChild(btn_tarefa_concluida)

        const btn_editar_tarefa = document.createElement("button")
        btn_editar_tarefa.classList.add("editar_tarefa")
        btn_editar_tarefa.innerHTML = '<i class="fa-solid fa-pen"></i>'
        acoes_tarefa.appendChild(btn_editar_tarefa)

        const btn_excluir_tarefa = document.createElement("button")
        btn_excluir_tarefa.classList.add("excluir_tarefa")
        btn_excluir_tarefa.innerHTML = '<i class="fa-solid fa-xmark"></i>'
        acoes_tarefa.appendChild(btn_excluir_tarefa)
        
        container_lista_tarefas.appendChild(container_tarefa)

        if(tarefa.concluida){
            container_tarefa.classList.add("finalizado")
        } else {
            container_tarefa.classList.remove("finalizado")
        }
    });
}
    
//Função para identificar qual tarefa foi selecionada
document.addEventListener("click", (elemento) => {
    const elemento_alvo = elemento.target
    const elemento_pai = elemento_alvo.closest("div")
    const div_alvo = elemento_alvo.closest(".container_tarefa")
        
    if(div_alvo && elemento_pai.classList.contains("acoes_tarefa")){
        const titulo_tarefa_selecionado = div_alvo.querySelector("p").textContent;
        
        categoria_selecionada = categorias_salvas.find(item =>
            item.objetivo === span_objetivo_selecionado.textContent
        );
        if (!categoria_selecionada) return;
        categoria_selecionada.tarefas.forEach(tarefa =>{
            if(tarefa.nome === titulo_tarefa_selecionado){
                indice_tarefa = tarefa.id;

                ////Concluir a tarefa
                if(elemento_alvo.classList.contains("tarefa_concluida")){
                    if(!tarefa.concluida){
                        tarefa.concluida = true
                    } else {
                        tarefa.concluida = false
                    }
                }
                //Editar a tarefa
                if(elemento_alvo.classList.contains("editar_tarefa")){
                    div_lista.classList.add("oculto")
                    div_edit_tarefa.classList.add("visivel")
                    input_edit.value = titulo_tarefa_selecionado
                }
                //Exclui a tarefa da lista
                if(elemento_alvo.classList.contains("excluir_tarefa")){
                    if (indice_tarefa !== -1) {
                        categoria_selecionada.tarefas.splice(indice_tarefa, 1);
                    }
                }
            }            
        })   
        localStorage.setItem("categorias_salvas", JSON.stringify(categorias_salvas));
        atualizarLista(categoria_selecionada);
    }    
})

//Função para remover a categoria
function acao_remover_categoria(item){
    categorias_salvas = categorias_salvas.filter( categoria => categoria.id_card !== item.id_card)
    localStorage.setItem("categorias_salvas", JSON.stringify(categorias_salvas))
    criar_sub_categoria()

}

//Função para fechar a aba de edição da tarfea
function fechar_aba_edit(){
    div_lista.classList.remove("oculto")
    div_edit_tarefa.classList.remove("visivel")
}

//PopUp de erro
function abrir_modal_erro(){
    const modal = document.getElementById("modal_erro")
    modal.showModal()
}

//PopUp das imagens do fundo
function abrirModalFundos() {
    carregarFundos();
    document.getElementById("modal_imagem_fundo").showModal();
}


//Função para carregar o fundo do To-Do
function carregarFundos(){
    containerFundos.innerHTML = "";
    categoriasFundo.forEach(fundo => {
        const card = document.createElement("div");
        card.classList.add("card_fundo");
        card.style.backgroundImage = `url('${fundo.imagem}')`;
        const titulo = document.createElement("p");
        titulo.textContent = fundo.nome;
        card.appendChild(titulo);

        card.addEventListener("click", () => {
            selecionarFundo(card, fundo.imagem);
        });
        containerFundos.appendChild(card);
     });
     const cardUpload = document.createElement("div");

    cardUpload.classList.add("card_fundo");
    cardUpload.innerHTML = `
        <div class="img_escolha">
            <span>🖼</span>
            <p>Escolher minha imagem</p>
        </div>
    `;

    cardUpload.addEventListener("click", () => {
        document.getElementById("input_fundo").click();
    });

    containerFundos.appendChild(cardUpload);
}

//Função para serlecionar o fundo do To-Do
function selecionarFundo(card, imagem){
    document.querySelectorAll(".card_fundo").forEach(item=>{
        item.classList.remove("selecionado");
    });
    card.classList.add("selecionado");
    document.body.style.backgroundImage = `url('${imagem}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    localStorage.setItem("imagem_fundo", imagem);

}

//Função para carregar imagem dos arquivos
inputFundo.addEventListener("change", function(){
    const arquivo = this.files[0];
    if(!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = function(evento){
        const imagem = evento.target.result;
        document.body.style.backgroundImage = `url('${imagem}')`;
        localStorage.setItem("imagem_fundo", imagem);
    }
    leitor.readAsDataURL(arquivo);
});
