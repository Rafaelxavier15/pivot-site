const Armazenamento = {
  chaveUsuarios: "pivot_usuarios",
  chaveSessao: "pivot_sessao",

  ler(chave, padrao) {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : padrao;
    } catch (erro) {
      return padrao;
    }
  },

  gravar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      return false;
    }
  },

  usuarios() {
    return this.ler(this.chaveUsuarios, {});
  },

  obterUsuario(email) {
    return this.usuarios()[email] || null;
  },

  salvarUsuario(usuario) {
    const tabela = this.usuarios();
    tabela[usuario.email] = usuario;
    return this.gravar(this.chaveUsuarios, tabela);
  },

  sessao() {
    return this.ler(this.chaveSessao, null);
  },

  iniciarSessao(email) {
    return this.gravar(this.chaveSessao, email);
  },

  encerrarSessao() {
    try {
      localStorage.removeItem(this.chaveSessao);
    } catch (erro) {
      return;
    }
  },
};
