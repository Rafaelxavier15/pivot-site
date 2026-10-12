const Estado = { usuario: null, pendente: null };

function gerarSal() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function gerarHash(senha, sal) {
  if (window.crypto && crypto.subtle) {
    const codificador = new TextEncoder();
    const chave = await crypto.subtle.importKey("raw", codificador.encode(senha), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: codificador.encode(sal), iterations: 100000, hash: "SHA-256" },
      chave,
      256
    );
    return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 5381;
  const texto = sal + senha;
  for (let i = 0; i < texto.length; i++) {
    h = ((h << 5) + h + texto.charCodeAt(i)) >>> 0;
  }
  return h.toString(16);
}

function iniciarSessao(usuario) {
  Estado.usuario = usuario;
  Armazenamento.iniciarSessao(usuario.email);
}

async function cadastrar(nome, email, senha, confirmacao) {
  const emailLimpo = email.trim().toLowerCase();
  if (nome.trim().length < 3) return { ok: false, erro: "Informe seu nome completo." };
  if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) return { ok: false, erro: "Informe um e-mail válido." };
  if (senha.length < 6) return { ok: false, erro: "A senha precisa ter pelo menos 6 caracteres." };
  if (senha !== confirmacao) return { ok: false, erro: "As senhas não conferem." };
  if (Armazenamento.obterUsuario(emailLimpo)) {
    return { ok: false, existe: true, erro: "Já existe uma conta com este e-mail. Entre com a sua senha." };
  }
  const sal = gerarSal();
  const usuario = {
    nome: nome.trim(),
    email: emailLimpo,
    sal,
    hash: await gerarHash(senha, sal),
    foto: "",
    telefone: "",
    cidade: "",
    objetivo: "",
    criadoEm: Date.now(),
    favoritos: [],
    recomendacao: "",
    conversa: [],
  };
  if (!Armazenamento.salvarUsuario(usuario)) {
    return { ok: false, erro: "Não foi possível salvar o cadastro neste navegador." };
  }
  iniciarSessao(usuario);
  return { ok: true };
}

async function entrar(email, senha) {
  const emailLimpo = email.trim().toLowerCase();
  if (!emailLimpo || !senha) return { ok: false, erro: "Informe seu e-mail e sua senha." };
  const usuario = Armazenamento.obterUsuario(emailLimpo);
  if (!usuario) return { ok: false, naoExiste: true, erro: "Não encontramos uma conta com este e-mail." };
  const hash = await gerarHash(senha, usuario.sal);
  if (hash !== usuario.hash) return { ok: false, erro: "E-mail ou senha incorretos." };
  iniciarSessao(usuario);
  return { ok: true };
}

function sair() {
  Estado.usuario = null;
  Estado.pendente = null;
  Armazenamento.encerrarSessao();
}

function restaurarSessao() {
  const email = Armazenamento.sessao();
  if (!email) return;
  const usuario = Armazenamento.obterUsuario(email);
  if (usuario) {
    Estado.usuario = usuario;
  } else {
    Armazenamento.encerrarSessao();
  }
}

function salvarUsuarioAtual() {
  if (Estado.usuario) Armazenamento.salvarUsuario(Estado.usuario);
}
