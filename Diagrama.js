class Diagrama {
    constructor(parametro) {
        this.diagrama = this;
        this.handle = "i-move";
        this.repre = parametro.representante;
        this.bot_classe = parametro.bot_classe;
        this.nb = parametro.nb;
        this.url = parametro.URL;
        this.divs = [];
        this.load = this.load();
        this.connector = [];
        this.isDown = false;
        this.getJSon = parametro.data;
        this.draggingIndex;
        this.startX;
        this.startY;
    }
    getCoordenada(parametro) {
        let elPrimario = document.getElementById(parametro[0]);
        let elSecundario = document.getElementById(parametro[1]);
        if (elPrimario != undefined && elSecundario != undefined) {
            let propPrimario = elPrimario.getBoundingClientRect();
            let prpSecundario = elSecundario.getBoundingClientRect();
            let x1 = parseInt(elPrimario.offsetLeft, 10) + parseInt(propPrimario.width / 2, 10);
            let x2 = parseInt(elSecundario.offsetLeft, 10) + parseInt(prpSecundario.width / 2, 10);
            let y1 = parseInt(elPrimario.offsetTop, 10) + parseInt(propPrimario.height / 2, 10);
            let y2 = parseInt(elSecundario.offsetTop, 10) + parseInt(prpSecundario.height / 2, 10);
            let height = this.getDistanciaEL(x2, y1, x2, y2);
            let width = this.getDistanciaEL(x1, y1, x2, y1);
            this.posicionarConector(x1, y1, x2, y2, parametro[2], height, width);
        }
    }
    getCoordenadaElFilho(parametro) {
        let elPaiPrimario = document.getElementById(parametro[0]);
        let elPaiSecundario = document.getElementById(parametro[1]);
        let elPrimario = document.getElementById(parametro[0]).closest(".caixa-intecao");
        let elSecundario = document.getElementById(parametro[1]).closest(".caixa-intecao");
        if (elPrimario != undefined && elSecundario != undefined) {
            let propPrimario = elPrimario.getBoundingClientRect();
            let prpSecundario = elSecundario.getBoundingClientRect();
            let x1 = parseInt(elPrimario.offsetLeft, 10) + parseInt(elPaiPrimario.offsetLeft, 10) + parseInt(propPrimario.width / 2, 10);
            let x2 = parseInt(elSecundario.offsetLeft, 10) + parseInt(elPaiSecundario.offsetLeft, 10) + parseInt(prpSecundario.width / 2, 10);
            let y1 = parseInt(elPrimario.offsetTop, 10) + parseInt(elPaiPrimario.offsetTop, 10) + parseInt(propPrimario.height / 2, 10);
            let y2 = parseInt(elSecundario.offsetTop, 10) + parseInt(elPaiSecundario.offsetTop, 10) + parseInt(prpSecundario.height / 2, 10);
            let height = this.getDistanciaEL(x2, y1, x2, y2);
            let width = this.getDistanciaEL(x1, y1, x2, y1);
            this.posicionarConector(x1, y1, x2, y2, parametro[2], height, width);
        }
    }
    getDistanciaEL(x1, y1, x2, y2) {
        return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
    }
    posicionarConector(x1, y1, x2, y2, connector, height, width) {
        let xMeio = (x1 + x2) / 2;
        let linha = connector;
        if (linha != undefined) {
            linha.classList = "connector";
            linha.style.width = width;
            linha.style.height = height;
            if (y1 > y2) {
                linha.style.top = (y1 - height);
                linha.style.left = xMeio - (width / 2);
                if (x1 > x2) {
                    linha.classList.add("conector-bottom-left");
                }
                else {
                    linha.classList.add("conector-bottom-right");
                }
            }
            else {
                linha.style.top = y1;
                linha.style.left = xMeio - (width / 2);
                if (x1 > x2) {
                    linha.classList.add("conector-top-left");
                }
                else {
                    linha.classList.add("conector-top-right");
                }
            }
        }
    }
    gravaCoordenada(intencao) {
        let url = this.url;
        let repre = this.repre;
        let bot_classe = this.bot_classe;
        let nb = this.nb;
        let request = new XMLHttpRequest();
        request.open("POST", url, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("&representante=" + repre + "&bot_classe=" + bot_classe + "&nb=" + nb + "&acao=gravaCordenada&intencao=" + intencao.getAttribute('id') + "&position=" + intencao.getAttribute('style'));
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                request.responseText;
            }
        };
    }
    criarElemento(type, attributes) {
        var objeto = document.createElement(type);
        for (var key in attributes) {
            if (key == "class") {
                objeto.classList.add.apply(objeto.classList, attributes[key]);
            }
            else if (key == "text") {
                objeto.textContent = attributes[key];
            }
            else {
                objeto.setAttribute(key, attributes[key]);
            }
        }
        return objeto;
    }
    handleMouseDown(e) {
        let handle = this.handle;
        e.preventDefault();
        e.stopPropagation();
        if (e.target.classList.contains(handle)) {
            this.startX = parseInt(e.clientX, 10) + parseInt(document.body.scrollLeft, 10);
            this.startY = parseInt(e.clientY, 10) + parseInt(document.body.scrollTop, 10);
            this.draggingIndex = undefined;
            for (var i = 0; i < this.divs.length; i++) {
                var d = this.divs[i];
                var x = parseInt(d.div.style.left);
                var y = parseInt(d.div.style.top);
                if (this.startX > x && this.startX < x + d.w && this.startY > y && this.startY < y + d.h) { // if para controlar scroll
                    this.draggingIndex = i;
                    this.isDown = true;
                    break;
                }
            }
        }
    }
    handleMouseMove(e) {
        if (!this.isDown) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        let mouseX = parseInt(e.clientX) + parseInt(document.body.scrollLeft, 10);
        let mouseY = parseInt(e.clientY) + parseInt(document.body.scrollTop, 10);
        let dragging = this.divs[this.draggingIndex].div;
        let dragEl = e.target.closest(".caixa-intecao").getAttribute("id");
        let dx = mouseX - this.startX;
        let dy = mouseY - this.startY;
        this.startX = mouseX;
        this.startY = mouseY;
        dragging.style.left = (parseInt(dragging.style.left) + dx) + 'px';
        dragging.style.top = (parseInt(dragging.style.top) + dy) + 'px';
        let arrOrigem = document.querySelectorAll("[data-origem  = " + dragEl + "]");
        let arrDestino = document.querySelectorAll("[data-destino = " + dragEl + "]");
        for (let i = 0; i <= arrOrigem.length - 1; i++) {
            this.getCoordenada([arrOrigem[i].getAttribute("data-origem"), arrOrigem[i].getAttribute("data-destino"), arrOrigem[i]]);
        }
        for (let i = 0; i <= arrDestino.length - 1; i++) {
            this.getCoordenada([arrDestino[i].getAttribute("data-origem"), arrDestino[i].getAttribute("data-destino"), arrDestino[i]]);
        }
    }
    handleMouseUp(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isDown = false;
        if (e.target.classList.contains(this.handle)) {
            this.gravaCoordenada(e.target.closest(".caixa-intecao"));
        }
    }
    tema(p) {
        //Definir um padrão para construção do elemento
        if (p.propriedade.position == ' -- ') {
            p.propriedade.position = "position: absolute; left: 1317px; top: 120px";
        }
        let tema = this.criarElemento("div", { class: ["caixa-intecao", p.propriedade.tema], id: p.intencao, style: p.propriedade.position });
        let titulo = this.criarElemento("div", { class: ["caixa-intencao-titulo"] });
        let corpo = this.criarElemento("div", { class: ["caixa-intencao-corpo"] });
        let divIcone = this.criarElemento("div", { class: ["caixa-intencao-icone"] });
        let span = this.criarElemento("span", { class: ["condicaoBot"], text: p.propriedade.label });
        let tituloCorpo = this.criarElemento("span", { class: ["intencao-titulo"], text: p.propriedade.titulo });
        let botao = ["i-cogs", "i-plus-circle-2", "i-move", "i-filter-4"];
        for (let i = 0; i < botao.length; i++) {
            divIcone.append(this.criarElemento("i", { class: [botao[i]] }));
        }
        titulo.append(divIcone);
        titulo.append(span);
        corpo.append(tituloCorpo);
        tema.appendChild(titulo);
        if (p.atributo.length > 0) {
            for (let i = 0; i < p.atributo.length; i++) {
                let divRecebe = this.criarElemento("div", { class: ["intencao-info"], id: p.atributo[i].id });
                divRecebe.appendChild(this.criarElemento("span", { class: ["condicaoBot"], text: i + 1 }));
                divRecebe.appendChild(this.criarElemento("span", { class: ["label-acao"], text: p.atributo[i].titulo }));
                corpo.appendChild(divRecebe);
            }
        }
        tema.appendChild(corpo);
        tema.addEventListener('click', function (e) { this.acaoIcone(e); }.bind(this), false);
        document.getElementById("montaDiagrama").appendChild(tema);
        this.divs.push({ div: tema, w: 100, h: 100 });
    }
    acaoIcone(e) {
        console.log(e);
        let divBox = e.target.closest(".caixa-intecao");
        if (e.target.classList.contains("i-plus-circle-2")) {
            var lblAtributo = divBox.querySelectorAll(".intencao-info").length + 1;
            let divRecebe = this.criarElemento("div", { class: ["intencao-info"] });
            divRecebe.appendChild(this.criarElemento("span", { class: ["condicaoBot"], text: lblAtributo }));
            divRecebe.appendChild(this.criarElemento("span", { class: ["label-acao"], text: "Nova Intencão" }));
            divBox.appendChild(divRecebe);
        }
        else if (e.target.classList.contains("i-cogs")) {
            manutencaoAtributo(divBox.id);
        }
        else if (e.target.classList.contains("i-plus-circle-2")) {
        }
    }
    load() {
        let url = this.url;
        let repre = this.repre;
        let bot_classe = this.bot_classe;
        let nb = this.nb;
        let request = new XMLHttpRequest();
        request.open('POST', url, false);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("&acao=infoBot&representante=" + repre + "&bot_classe=" + bot_classe + "&nb=" + nb);
        if (request.readyState == 4) {
            if (request.status == 200) {
                return JSON.parse(request.responseText);
            }
            else {
                reject(request.responseText);
            }
        }
    }
    iniciar() {
        let intencaoObjeto = this.getJSon;
        let intencao = Object.values(this.load);
        let intencoes = Object.values(intencao[0]);
        intencaoObjeto.forEach(element => {
            this.tema(element);
            if (element.filho != null) {
                element.filho.forEach((filho => {
                    let el = this.criarElemento("div", { class: ["connector"], "data-origem": element.intencao, "data-destino": filho });
                    this.connector.push(el);
                    document.getElementById("montaDiagrama").appendChild(el);
                }));
            }
        });
        let linha = document.getElementById("teste_linha");
        this.getCoordenadaElFilho(["lbl_menu_cimbinha", "lbl_sair_cubiruba", linha]);
        for (var i = 0; i <= this.connector.length - 1; i++) {
            this.getCoordenada([this.connector[i].getAttribute("data-origem"), this.connector[i].getAttribute("data-destino"), this.connector[i]]);
        }
    }
}
