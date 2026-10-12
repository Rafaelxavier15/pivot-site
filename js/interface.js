const Chat = { historico: [] };
let sliderAtual = 0;
let sliderTempo;

function fotoUsuario(usuario) {
  return usuario.foto ? `<img src="${usuario.foto}" alt="">` : icone("usr");
}

function desenharCabecalho() {
  const usuario = Estado.usuario;
  const alvo = $("#auth");
  if (usuario) {
    const primeiroNome = escapar(usuario.nome.split(" ")[0]);
    alvo.innerHTML = `
      <span class="hi"><span class="mav">${fotoUsuario(usuario)}</span>Olá, ${primeiroNome}</span>
      <button class="y" data-pg="conta">Minha conta</button>
      <button class="o" id="botaoSair">Sair</button>`;
  } else {
    alvo.innerHTML = `
      <button class="o" id="botaoEntrar">Entrar</button>
      <button id="botaoCriar">Criar conta</button>`;
  }
}

function desenharCursos() {
  $("#courses").innerHTML = CURSOS.map(
    (c) => `
    <div class="card cc">
      <div class="cic">${icone(c.icone)}</div>
      <div class="meta">${escapar(c.area).toUpperCase()} · ${c.horas}</div>
      <h3>${escapar(c.nome)}</h3>
      <p>${escapar(c.resumo)}</p>
      <div class="cbt">
        <button data-open="${c.id}">Saber mais ↗</button>
        <button class="o" data-fav="${c.id}">Tenho interesse</button>
      </div>
    </div>`
  ).join("");
}

function desenharCurso(id) {
  const c = CURSOS.find((curso) => curso.id === id);
  const maior = Math.max(...c.modulos.map((m) => m.horas));
  $("#cv").innerHTML = `
    <p><button class="o" data-pg="cursos">← Voltar aos cursos</button></p>
    <section class="cv-hero">
      <div class="big-ic">${icone(c.icone)}</div>
      <div>
        <span class="tagy">${escapar(c.area).toUpperCase()}</span>
        <h1>${escapar(c.nome)}</h1>
        <p>${escapar(c.descricao)}</p>
        <div class="facts">
          <div><b>CARGA HORÁRIA</b><span>${c.horas}</span></div>
          <div><b>DURAÇÃO</b><span>${c.duracao}</span></div>
          <div><b>FORMATO</b><span>${escapar(c.formato)}</span></div>
          <div><b>TURNO</b><span>${escapar(c.turno)}</span></div>
          <div><b>NÍVEL</b><span>${c.nivel}</span></div>
          <div><b>CERTIFICADO</b><span>Incluso</span></div>
        </div>
        <div class="row2">
          <button class="y" data-soon="1">Começar curso ↗</button>
          <button data-fav="${c.id}">Tenho interesse</button>
        </div>
      </div>
    </section>
    <section class="sec y">
      <h2>O que você vai aprender</h2>
      <div class="skg">${c.habilidades.map((h) => `<div><i>✓</i>${escapar(h)}</div>`).join("")}</div>
    </section>
    <section class="sec w">
      <h2>Aulas do curso</h2>
      ${c.modulos
        .map(
          (m, i) => `
        <div class="mr">
          <div class="mn">${i + 1}</div>
          <div><b>${escapar(m.nome)}</b><div class="bar"><i style="width:${Math.round((m.horas / maior) * 100)}%"></i></div></div>
          <div class="mh">${m.horas}h</div>
        </div>`
        )
        .join("")}
      <p class="note" style="margin:12px 0 0">Total: ${c.horas} de aulas teóricas e práticas, com projeto final e certificado.</p>
    </section>
    <section class="sec">
      <h2>Seus professores</h2>
      <div class="tch">
        ${c.professores
          .map((i) => {
            const p = PROFESSORES[i];
            return `
          <div class="tc">
            <div class="tav">${gerarAvatar(i)}</div>
            <div><h3>${escapar(p.nome)}</h3><div class="rl">${escapar(p.cargo)}</div><p>${escapar(p.bio)}</p></div>
          </div>`;
          })
          .join("")}
      </div>
      <p class="note" style="margin:12px 0 0">* Professores e perfis fictícios, para demonstração.</p>
    </section>
    <section class="sec b">
      <h2>Onde você pode trabalhar</h2>
      <div class="jbg">${c.atuacao.map((a) => `<div>${icone("case")}${escapar(a)}</div>`).join("")}</div>
      <p style="margin:14px 0 0">Oportunidades em empresas de Jundiaí e região, em home office ou como profissional autônomo.</p>
    </section>
    <section class="ab-cta">
      <h2>Pronto para o próximo passo?</h2>
      <p>Comece em ${escapar(c.nome)} e leve a sua carreira para outro nível.</p>
      <div class="row2" style="justify-content:center">
        <button class="y" data-soon="1">Começar curso ↗</button>
        <button data-fav="${c.id}" style="background:#fff;color:var(--b)">Tenho interesse</button>
      </div>
    </section>`;
}

function desenharConta() {
  const usuario = Estado.usuario;
  const alvo = $("#acct");
  if (!usuario) {
    alvo.innerHTML = `
      <section class="sec w">
        <h2>Minha conta</h2>
        <p class="note">Você não está conectado. Entre ou crie sua conta para salvar cursos de interesse, sua foto e suas conversas com a PVT IA.</p>
        <button id="botaoEntrar2">Entrar</button>
        <button class="o" id="botaoCriar2">Criar conta</button>
      </section>`;
    return;
  }
  const ano = new Date(usuario.criadoEm).getFullYear();
  const favoritos = usuario.favoritos
    .map((id) => CURSOS.find((c) => c.id === id))
    .filter(Boolean)
    .map(
      (c) => `
      <div class="fi">
        <div class="nm">
          <div class="cic">${icone(c.icone)}</div>
          <div>${escapar(c.nome)}<div class="note">${c.horas} · ${escapar(c.area)}</div></div>
        </div>
        <div class="bt">
          <button data-open="${c.id}">Saber mais</button>
          <button class="y" data-soon="1">Começar curso</button>
          <button class="o" data-rm="${c.id}">Remover</button>
        </div>
      </div>`
    )
    .join("");

  alvo.innerHTML = `
    <section class="acc-hero">
      <div class="ph-col">
        <div class="ph">${fotoUsuario(usuario)}</div>
        <label class="btn-l">Alterar foto<input type="file" id="campoFoto" accept="image/*" hidden></label>
      </div>
      <div>
        <h2>${escapar(usuario.nome)}</h2>
        <p>${escapar(usuario.email)}</p>
        <span class="chip">ALUNO PIVOT</span><span class="chip">DESDE ${ano}</span>
      </div>
    </section>
    <div class="stg">
      <div class="st"><b>${usuario.favoritos.length}</b><span>Cursos de interesse</span></div>
      <div class="st"><b>0</b><span>Cursos em andamento</span></div>
      <div class="st"><b>0</b><span>Certificados</span></div>
      <div class="st"><b>0h</b><span>Horas de estudo</span></div>
    </div>
    <div class="two">
      <section class="sec fm">
        <h2>Dados pessoais</h2>
        <label>Nome completo<input id="campoNome" value="${escapar(usuario.nome)}"></label>
        <label>E-mail<input value="${escapar(usuario.email)}" disabled></label>
        <label>Telefone<input id="campoTelefone" type="tel" placeholder="(11) 90000-0000" value="${escapar(usuario.telefone)}"></label>
        <label>Cidade<input id="campoCidade" placeholder="Jundiaí" value="${escapar(usuario.cidade)}"></label>
        <label>Objetivo profissional<input id="campoObjetivo" placeholder="Ex.: conseguir meu primeiro emprego" value="${escapar(usuario.objetivo)}"></label>
        <button id="botaoSalvar">Salvar alterações</button>
      </section>
      <section class="sec y">
        <h2>Preferências</h2>
        <label class="tgl">Receber novidades da PIVOT por e-mail<input type="checkbox" checked></label>
        <label class="tgl">Avisos de novos cursos e turmas<input type="checkbox" checked></label>
        <label class="tgl">Lembretes de matrícula<input type="checkbox"></label>
        <label class="tgl">Convites para eventos e feiras de emprego<input type="checkbox" checked></label>
        <p class="note" style="margin-top:14px">As preferências são apenas ilustrativas por enquanto.</p>
      </section>
    </div>
    <section class="sec w">
      <h2>Meus cursos de interesse</h2>
      ${favoritos || '<p class="note">Você ainda não marcou nenhum curso. <a style="color:var(--b);cursor:pointer;font-weight:700" data-pg="cursos">Ver cursos</a></p>'}
    </section>
    ${usuario.recomendacao ? `<section class="sec"><h2>Última recomendação da PVT IA</h2><p>${escapar(usuario.recomendacao).replace(/\n/g, "<br>")}</p></section>` : ""}
    <p><button class="o" id="botaoSair2">Sair da conta</button></p>`;
}

function abrirModal(modo, mensagem) {
  $("#mm").textContent = mensagem || "";
  if (modo === "entrar") {
    $("#mt").textContent = "Entrar";
    $("#mc").innerHTML = `
      <label>E-mail<input id="entradaEmail" type="email" autocomplete="email" placeholder="seu@email.com"></label>
      <label>Senha<input id="entradaSenha" type="password" class="pw" autocomplete="current-password" placeholder="Sua senha"></label>
      <button id="enviarEntrar">Entrar</button>
      <p class="note" style="margin-top:14px">Ainda não tem cadastro? <a id="linkCriar">Criar conta</a></p>`;
  } else {
    $("#mt").textContent = "Criar conta";
    $("#mc").innerHTML = `
      <label>Nome completo<input id="cadNome" autocomplete="name"></label>
      <label>E-mail<input id="cadEmail" type="email" autocomplete="email" placeholder="seu@email.com"></label>
      <label>Senha (mínimo 6 caracteres)<input id="cadSenha" type="password" class="pw" autocomplete="new-password"></label>
      <label>Confirmar senha<input id="cadConfirma" type="password" class="pw" autocomplete="new-password"></label>
      <button id="enviarCriar">Criar conta</button>
      <p class="note" style="margin-top:14px">Já tem cadastro? <a id="linkEntrar">Entrar</a></p>`;
  }
  $("#md").classList.add("on");
}

function fecharModal() {
  $("#md").classList.remove("on");
}

function adicionarMensagem(texto, tipo, chips = []) {
  const caixa = $("#msgs");
  const balao = document.createElement("div");
  balao.className = "m " + tipo;
  balao.textContent = texto;
  caixa.appendChild(balao);
  if (chips.length) {
    const linha = document.createElement("div");
    linha.className = "qr";
    linha.innerHTML = chips
      .map((chip) => {
        const atributo = chip.abrir
          ? `data-open="${chip.abrir}"`
          : chip.pagina
          ? `data-pg="${chip.pagina}"`
          : `data-resp="${escapar(chip.resposta)}"`;
        return `<button ${atributo}>${escapar(chip.rotulo)}</button>`;
      })
      .join("");
    caixa.appendChild(linha);
  }
  caixa.scrollTop = caixa.scrollHeight;
  return balao;
}

function desenharChat() {
  $("#msgs").innerHTML = "";
  adicionarMensagem(
    "Oi! Eu sou a PVT IA, o robozinho da PIVOT. Me conta: o que você gosta de fazer e qual é o seu objetivo profissional?",
    "bot",
    Assistente.sugestoes()
  );
  Chat.historico.forEach((item) => adicionarMensagem(item.texto, item.tipo, item.chips || []));
}

function alternarChat(abrir) {
  const caixa = $("#box");
  caixa.classList.toggle("on", abrir);
  $("#fab").innerHTML = abrir ? "✕" : ROBO;
  $("#fl").style.display = abrir ? "none" : "block";
  if (abrir) $("#inp").focus();
}

function guardarConversa(recomendacao) {
  const usuario = Estado.usuario;
  if (!usuario) return;
  usuario.conversa = Chat.historico.slice(-30);
  if (recomendacao) usuario.recomendacao = recomendacao;
  salvarUsuarioAtual();
}

function enviarMensagem(texto) {
  const entrada = texto.trim();
  if (!entrada) return;
  adicionarMensagem(entrada, "me");
  Chat.historico.push({ tipo: "me", texto: entrada });
  const digitando = adicionarMensagem("…", "bot");
  setTimeout(() => {
    const resposta = Assistente.responder(entrada);
    digitando.remove();
    adicionarMensagem(resposta.texto, "bot", resposta.chips || []);
    Chat.historico.push({ tipo: "bot", texto: resposta.texto, chips: resposta.chips || [] });
    guardarConversa(resposta.recomendacao ? resposta.texto : "");
    if (Estado.usuario && resposta.recomendacao && $("#p-conta").classList.contains("on")) desenharConta();
  }, 450);
}

function mostrarSlide(indice) {
  const slides = $$(".sl");
  const pontos = $$("#dots i");
  sliderAtual = (indice + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("on", i === sliderAtual));
  pontos.forEach((p, i) => p.classList.toggle("on", i === sliderAtual));
  clearInterval(sliderTempo);
  sliderTempo = setInterval(() => mostrarSlide(sliderAtual + 1), 5000);
}
