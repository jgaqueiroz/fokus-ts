"use strict";
const tarefasLS = localStorage.getItem('tarefas');
let estadoInicial = {
    tarefas: (tarefasLS) ? JSON.parse(tarefasLS) : [
        {
            descricao: 'Tarefa concluída',
            concluida: true
        },
        {
            descricao: 'Tarefa pendente 1',
            concluida: false
        },
        {
            descricao: 'Tarefa pendente 2',
            concluida: false
        }
    ],
    tarefaSelecionada: null,
    editando: false
};
const selecionarTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { tarefaSelecionada: tarefa });
};
const adicionarTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { tarefas: [...estado.tarefas, tarefa] });
};
const concluirTarefa = (estado, tarefa) => {
    estado.tarefas.forEach(t => {
        if (t == tarefa) {
            t.concluida = true;
        }
    });
    return Object.assign(Object.assign({}, estado), { tarefaSelecionada: (tarefa == estadoInicial.tarefaSelecionada) ? null : estadoInicial.tarefaSelecionada, editando: (tarefa == estadoInicial.tarefaSelecionada) ? false : estadoInicial.editando });
};
const editarTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { tarefaSelecionada: tarefa, editando: true });
};
const deletarTarefa = (estado) => {
    const tarefas = estado.tarefas.filter(t => t != estado.tarefaSelecionada);
    return Object.assign(Object.assign({}, estado), { tarefas, editando: false, tarefaSelecionada: null });
};
const removerConcluidas = (estado) => {
    const tarefas = estado.tarefas.filter(t => t.concluida != true);
    return Object.assign(Object.assign({}, estado), { tarefas });
};
const removerTodas = (estado) => {
    return {
        tarefas: [],
        tarefaSelecionada: null,
        editando: false
    };
};
const atualizarUI = () => {
    const taskIconSvg = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF" />
            <path
                d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E" />
        </svg>
    `;
    const ulTarefas = document.querySelector('.app__section-task-list');
    const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
    const formAdicionarTarefa = document.querySelector('.app__form-add-task');
    const textarea = document.querySelector('.app__form-textarea');
    const labelForm = document.querySelector('.app__form-label');
    const btnDeletar = document.querySelector('.app__form-footer__button--delete');
    const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
    const pTarefaEmAndamento = document.querySelector('.app__section-active-task-description');
    const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
    const btnRemoverTodas = document.querySelector('#btn-remover-todas');
    const tarefasString = JSON.stringify(estadoInicial.tarefas);
    localStorage.setItem('tarefas', tarefasString);
    btnAdicionarTarefa.onclick = () => {
        if (estadoInicial.editando) {
            estadoInicial.editando = false;
            estadoInicial.tarefaSelecionada = null;
            labelForm.innerText = 'Adicionando tarefa';
            textarea.value = '';
        }
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.remove('hidden');
    };
    btnDeletar.onclick = () => {
        estadoInicial = deletarTarefa(estadoInicial);
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.add('hidden');
        atualizarUI();
    };
    btnCancelar.onclick = () => {
        estadoInicial.editando = false;
        labelForm.innerText = 'Adicionando tarefa';
        textarea.value = '';
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.add('hidden');
        atualizarUI();
    };
    btnRemoverConcluidas.onclick = () => {
        estadoInicial = removerConcluidas(estadoInicial);
        atualizarUI();
    };
    btnRemoverTodas.onclick = () => {
        estadoInicial = removerTodas(estadoInicial);
        atualizarUI();
    };
    pTarefaEmAndamento.innerText = (estadoInicial.tarefaSelecionada) ? estadoInicial.tarefaSelecionada.descricao : '';
    if (estadoInicial.editando && estadoInicial.tarefaSelecionada) {
        textarea.value = estadoInicial.tarefaSelecionada.descricao;
        labelForm.innerText = 'Editando tarefa';
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.remove('hidden');
        btnDeletar === null || btnDeletar === void 0 ? void 0 : btnDeletar.classList.remove('hidden');
    }
    else {
        textarea.value = '';
        labelForm.innerText = 'Adicionando tarefa';
        btnDeletar === null || btnDeletar === void 0 ? void 0 : btnDeletar.classList.add('hidden');
    }
    formAdicionarTarefa.onsubmit = (evento) => {
        evento.preventDefault();
        const descricao = textarea.value;
        if (estadoInicial.editando) {
            estadoInicial.tarefas.forEach(tarefa => {
                if (tarefa == estadoInicial.tarefaSelecionada) {
                    tarefa.descricao = textarea.value;
                }
            });
            estadoInicial.editando = false;
            estadoInicial.tarefaSelecionada = null;
        }
        else {
            estadoInicial = adicionarTarefa(estadoInicial, {
                descricao,
                concluida: false
            });
        }
        atualizarUI();
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.toggle('hidden');
    };
    if (ulTarefas) {
        ulTarefas.innerHTML = '';
    }
    estadoInicial.tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.classList.add('app__section-task-list-item');
        const svgIcon = document.createElement('svg');
        svgIcon.innerHTML = taskIconSvg;
        const paragraph = document.createElement('p');
        paragraph.classList.add('app__section-task-list-item-description');
        paragraph.textContent = tarefa.descricao;
        const button = document.createElement('button');
        button.classList.add('app_button-edit');
        const editIcon = document.createElement('img');
        editIcon.setAttribute('src', './imagens/edit.png');
        button.appendChild(editIcon);
        if (tarefa.concluida) {
            button.setAttribute('disabled', 'true');
            li.classList.add('app__section-task-list-item-complete');
        }
        else {
            svgIcon.onclick = (evento) => {
                evento.stopPropagation();
                estadoInicial = concluirTarefa(estadoInicial, tarefa);
                atualizarUI();
            };
            editIcon.onclick = (evento) => {
                evento.stopPropagation();
                estadoInicial = editarTarefa(estadoInicial, tarefa);
                atualizarUI();
            };
        }
        if (!tarefa.concluida && tarefa == estadoInicial.tarefaSelecionada) {
            li.classList.add('app__section-task-list-item-active');
        }
        li.appendChild(svgIcon);
        li.appendChild(paragraph);
        li.appendChild(button);
        li.addEventListener("click", () => {
            if (tarefa.concluida)
                return true;
            estadoInicial = selecionarTarefa(estadoInicial, tarefa);
            atualizarUI();
        });
        ulTarefas === null || ulTarefas === void 0 ? void 0 : ulTarefas.appendChild(li);
    });
};
document.addEventListener('TarefaFinalizada', () => {
    if (estadoInicial.tarefaSelecionada) {
        estadoInicial = concluirTarefa(estadoInicial, estadoInicial.tarefaSelecionada);
        atualizarUI();
    }
});
atualizarUI();
