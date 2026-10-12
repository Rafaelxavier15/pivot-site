const PAGINAS = ["inicio", "cursos", "curso", "sobre", "conta"];

function rotaAtual() {
  const [pagina, parametro] = location.hash.replace(/^#\/?/, "").split("/");
  return { pagina: pagina || "inicio", parametro };
}

function irPara(pagina, parametro) {
  const alvo = "#/" + pagina + (parametro ? "/" + parametro : "");
  if (location.hash === alvo) {
    mostrarPagina();
  } else {
    location.hash = alvo;
  }
}

function mostrarPagina() {
  let { pagina, parametro } = rotaAtual();
  if (!PAGINAS.includes(pagina)) pagina = "inicio";
  if (pagina === "curso") {
    if (CURSOS.some((c) => c.id === parametro)) {
      desenharCurso(parametro);
    } else {
      pagina = "cursos";
    }
  }
  if (pagina === "conta") desenharConta();
  $$(".pg").forEach((e) => e.classList.toggle("on", e.id === "p-" + pagina));
  const ativa = pagina === "curso" ? "cursos" : pagina;
  $$("#nav a[data-pg]").forEach((a) => a.classList.toggle("on", a.dataset.pg === ativa));
  window.scrollTo(0, 0);
}

function registrarInteresse(id) {
  if (!Estado.usuario) {
    Estado.pendente = id;
    abrirModal("entrar", "Entre ou crie sua conta para salvar seu interesse neste curso.");
    return;
  }
  const usuario = Estado.usuario;
  if (!usuario.favoritos.includes(id)) usuario.favoritos.push(id);
  salvarUsuarioAtual();
  desenharCabecalho();
  aviso("Curso adicionado ao seu perfil ✓");
  irPara("conta");
}

function concluirAcesso() {
  fecharModal();
  desenharCabecalho();
  Chat.historico = Estado.usuario.conversa || [];
  Assistente.reiniciar();
  desenharChat();
  if (Estado.pendente) {
    const id = Estado.pendente;
    Estado.pendente = null;
    registrarInteresse(id);
  } else {
    irPara("conta");
  }
}

async function enviarEntrada() {
  const resultado = await entrar($("#entradaEmail").value, $("#entradaSenha").value);
  if (resultado.ok) return concluirAcesso();
  if (resultado.naoExiste) return abrirModal("criar", resultado.erro + " Preencha os dados para criar a sua.");
  $("#mm").textContent = resultado.erro;
}

async function enviarCadastro() {
  const resultado = await cadastrar(
    $("#cadNome").value,
    $("#cadEmail").value,
    $("#cadSenha").value,
    $("#cadConfirma").value
  );
  if (resultado.ok) return concluirAcesso();
  if (resultado.existe) return abrirModal("entrar", resultado.erro);
  $("#mm").textContent = resultado.erro;
}

function encerrarConta() {
  sair();
  Chat.historico = [];
  Assistente.reiniciar();
  desenharCabecalho();
  desenharChat();
  irPara("inicio");
  aviso("Você saiu da conta");
}

function atualizarFoto(arquivo) {
  if (!arquivo || !Estado.usuario) return;
  const leitor = new FileReader();
  leitor.onload = () => {
    const imagem = new Image();
    imagem.onload = () => {
      const lado = 220;
      const tela = document.createElement("canvas");
      tela.width = lado;
      tela.height = lado;
      const menor = Math.min(imagem.width, imagem.height);
      tela
        .getContext("2d")
        .drawImage(imagem, (imagem.width - menor) / 2, (imagem.height - menor) / 2, menor, menor, 0, 0, lado, lado);
      Estado.usuario.foto = tela.toDataURL("image/jpeg", 0.82);
      salvarUsuarioAtual();
      desenharCabecalho();
      desenharConta();
      aviso("Foto atualizada ✓");
    };
    imagem.src = leitor.result;
  };
  leitor.readAsDataURL(arquivo);
}

function salvarDados() {
  const usuario = Estado.usuario;
  usuario.nome = $("#campoNome").value.trim() || usuario.nome;
  usuario.telefone = $("#campoTelefone").value.trim();
  usuario.cidade = $("#campoCidade").value.trim();
  usuario.objetivo = $("#campoObjetivo").value.trim();
  salvarUsuarioAtual();
  desenharCabecalho();
  desenharConta();
  aviso("Dados salvos ✓");
}

function tratarCliques(e) {
  const alvo = e.target;
  const dentroDoChat = Boolean(alvo.closest("#box"));

  const pagina = alvo.closest("[data-pg]");
  if (pagina) {
    if (dentroDoChat) alternarChat(false);
    irPara(pagina.dataset.pg);
    return;
  }
  const abrir = alvo.closest("[data-open]");
  if (abrir) {
    if (dentroDoChat) alternarChat(false);
    irPara("curso", abrir.dataset.open);
    return;
  }
  const favorito = alvo.closest("[data-fav]");
  if (favorito) {
    registrarInteresse(favorito.dataset.fav);
    return;
  }
  const remover = alvo.closest("[data-rm]");
  if (remover) {
    Estado.usuario.favoritos = Estado.usuario.favoritos.filter((id) => id !== remover.dataset.rm);
    salvarUsuarioAtual();
    desenharConta();
    return;
  }
  if (alvo.closest("[data-soon]")) {
    aviso("Em breve! As matrículas deste curso abrem em breve.");
    return;
  }
  const resposta = alvo.closest("[data-resp]");
  if (resposta) {
    enviarMensagem(resposta.dataset.resp);
    return;
  }
  if (alvo.closest("[data-chat]")) {
    alternarChat(true);
    return;
  }
  if (alvo.closest(".soc a")) {
    e.preventDefault();
    return;
  }

  const acoes = {
    botaoEntrar: () => abrirModal("entrar"),
    botaoEntrar2: () => abrirModal("entrar"),
    linkEntrar: () => abrirModal("entrar"),
    botaoCriar: () => abrirModal("criar"),
    botaoCriar2: () => abrirModal("criar"),
    linkCriar: () => abrirModal("criar"),
    enviarEntrar: enviarEntrada,
    enviarCriar: enviarCadastro,
    mx: fecharModal,
    md: fecharModal,
    botaoSair: encerrarConta,
    botaoSair2: encerrarConta,
    botaoSalvar: salvarDados,
    send: () => {
      const campo = $("#inp");
      enviarMensagem(campo.value);
      campo.value = "";
    },
    x: () => alternarChat(false),
  };
  const id = alvo.id || (alvo.closest("#fab") ? "fab" : "");
  if (id === "fab") {
    alternarChat(!$("#box").classList.contains("on"));
    return;
  }
  if (acoes[id]) acoes[id]();
}

function tratarTeclas(e) {
  if (e.key === "Escape") fecharModal();
  if (e.key !== "Enter") return;
  if (e.target.id === "inp") {
    enviarMensagem(e.target.value);
    e.target.value = "";
    return;
  }
  if ($("#md").classList.contains("on")) {
    if ($("#enviarEntrar")) enviarEntrada();
    else if ($("#enviarCriar")) enviarCadastro();
  }
}

function iniciar() {
  $("#mq").textContent = "PIVOT ✦ ".repeat(24);
  $$(".pt i").forEach((e) => {
    e.textContent = "OUTUBRO ROSA ".repeat(80);
  });
  restaurarSessao();
  if (Estado.usuario) Chat.historico = Estado.usuario.conversa || [];
  desenharCursos();
  desenharCabecalho();
  desenharChat();
  $("#fab").innerHTML = ROBO;
  $$("#dots i").forEach((ponto, i) => ponto.addEventListener("click", () => mostrarSlide(i)));
  mostrarSlide(0);
  mostrarPagina();

  document.addEventListener("click", tratarCliques);
  document.addEventListener("keydown", tratarTeclas);
  document.addEventListener("change", (e) => {
    if (e.target.id === "campoFoto") atualizarFoto(e.target.files[0]);
  });
  window.addEventListener("hashchange", mostrarPagina);
}

iniciar();
