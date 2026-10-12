const Assistente = {
  interesses: {},
  rodadasSemPista: 0,

  normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  },

  pontuar(texto) {
    const resultado = {};
    Object.entries(PALAVRAS_CHAVE).forEach(([id, palavras]) => {
      const total = palavras.reduce((soma, palavra) => soma + (texto.includes(palavra) ? 1 : 0), 0);
      if (total > 0) resultado[id] = total;
    });
    return resultado;
  },

  acumular(pontos) {
    Object.entries(pontos).forEach(([id, valor]) => {
      this.interesses[id] = (this.interesses[id] || 0) + valor;
    });
  },

  melhoresCursos() {
    const ordenados = Object.entries(this.interesses).sort((a, b) => b[1] - a[1]);
    if (!ordenados.length) return [];
    const maximo = ordenados[0][1];
    return ordenados.filter(([, valor]) => valor >= maximo * 0.5).slice(0, 3).map(([id]) => id);
  },

  chipsCursos(ids) {
    return ids.map((id) => ({ rotulo: CURSOS.find((c) => c.id === id).nome, abrir: id }));
  },

  sugestoes() {
    return [
      { rotulo: "Gosto de tecnologia", resposta: "Gosto de tecnologia e computadores" },
      { rotulo: "Gosto de lidar com pessoas", resposta: "Gosto de lidar com pessoas e vender" },
      { rotulo: "Gosto de criar e desenhar", resposta: "Gosto de criar e desenhar" },
      { rotulo: "Prefiro trabalho prático", resposta: "Prefiro trabalho prático, mão na massa" },
      { rotulo: "Quais cursos vocês têm?", resposta: "Quais cursos vocês têm?" },
    ];
  },

  responder(entrada) {
    const texto = this.normalizar(entrada);

    if (/^(oi|ola|bom dia|boa tarde|boa noite|e ai|hey|opa)\b/.test(texto)) {
      return {
        texto: "Oi! Que bom ter você aqui. Me conta: o que você gosta de fazer e qual é o seu objetivo profissional?",
        chips: this.sugestoes(),
      };
    }
    if (/(obrigad|valeu|agradec)/.test(texto)) {
      return { texto: "Por nada! Se quiser, é só me contar mais sobre o que você procura que eu ajudo a escolher o curso ideal." };
    }
    if (/(certificad|diploma)/.test(texto)) {
      return { texto: "Todos os cursos da PIVOT têm certificado de conclusão para quem completa as aulas e o projeto final." };
    }
    if (/(preco|valor|mensalidade|quanto custa|pagamento|bolsa|desconto)/.test(texto)) {
      return {
        texto: "Os valores e as condições de pagamento serão divulgados em breve. Marque seu interesse no curso e acompanhe pela sua conta.",
      };
    }
    if (/(matricula|inscricao|inscrever|como entro|como faco para entrar)/.test(texto)) {
      return {
        texto: "As matrículas de 2026 estão abertas. Escolha um curso, clique em “Tenho interesse” e acompanhe tudo pela sua conta.",
        chips: [{ rotulo: "Ver cursos", pagina: "cursos" }],
      };
    }
    if (/(onde fica|endereco|localizacao|jundiai|cidade)/.test(texto)) {
      return { texto: "A PIVOT fica em Jundiaí, SP. Em breve divulgamos o endereço completo e as datas do Dia de portas abertas." };
    }
    if (/(quanto tempo|duracao|duram|horario|turno|periodo|carga horaria)/.test(texto)) {
      return {
        texto: "Os cursos duram de 3 a 6 meses, com cargas horárias de 120h a 240h e turnos de manhã, tarde ou noite, conforme o curso.",
      };
    }
    if (/(quais cursos|que cursos|cursos tem|cursos voces|opcoes|lista de cursos)/.test(texto)) {
      return {
        texto: "Temos 8 cursos técnicos: " + CURSOS.map((c) => c.nome).join(", ") + ". Toque em um para saber mais.",
        chips: this.chipsCursos(CURSOS.map((c) => c.id)),
      };
    }

    const pontos = this.pontuar(texto);
    this.acumular(pontos);
    const melhores = this.melhoresCursos();

    if (melhores.length) {
      this.rodadasSemPista = 0;
      const linhas = melhores.map((id) => {
        const c = CURSOS.find((curso) => curso.id === id);
        return `• ${c.nome} (${c.horas}): ${c.resumo}`;
      });
      let abertura = "Pelo que você contou, estes cursos combinam com você:";
      if (/(primeiro emprego|sem experiencia)/.test(texto)) {
        abertura = "Para quem está começando, estes cursos são ótimos pontos de partida:";
      }
      if (/(mudar de carreira|recomecar|trocar de area)/.test(texto)) {
        abertura = "Mudar de carreira é um passo e tanto! Estes cursos podem ajudar:";
      }
      return {
        texto: `${abertura}\n${linhas.join("\n")}\nQuer saber mais sobre algum deles?`,
        chips: this.chipsCursos(melhores),
        recomendacao: true,
      };
    }

    this.rodadasSemPista += 1;
    const perguntas = [
      "Conta pra mim: você gosta mais de lidar com computadores, pessoas, criar coisas, organizar ou mexer com as mãos?",
      "Pode me dizer uma atividade de que você gosta, como desenhar, vender, organizar, programar ou consertar coisas?",
      "Se preferir, escolha uma das opções abaixo e eu indico os cursos.",
    ];
    return {
      texto: perguntas[(this.rodadasSemPista - 1) % perguntas.length],
      chips: this.sugestoes(),
    };
  },

  reiniciar() {
    this.interesses = {};
    this.rodadasSemPista = 0;
  },
};
