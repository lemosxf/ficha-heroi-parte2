
'use strict';



const itens = [
  {
    nome: 'Espadão do Alvorecer',
    tipo: 'Arma',
    raridade: 'Lendário',
    descricao: 'Forjado com o aço de uma estrela caída. Dizem que sua lâmina brilha mais forte quando há alguém inocente por perto.'
  },
  {
    nome: 'Escudo da Guarda',
    tipo: 'Armadura',
    raridade: 'Raro',
    descricao: 'Resistiu a mil golpes e ainda guarda o brasão da Lanterna.'
  },
  {
    nome: 'Elmo da Pluma Azul',
    tipo: 'Armadura',
    raridade: 'Raro',
    descricao: 'A pluma serve de farol para quem se perdeu na névoa.'
  },
  {
    nome: 'Frasco de Estus Pálido',
    tipo: 'Poção',
    raridade: 'Comum',
    descricao: 'Uma dose de chama líquida que restaura as forças.'
  },
  {
    nome: 'Anel do Juramento',
    tipo: 'Acessório',
    raridade: 'Raro',
    descricao: 'Lembra Gale da promessa que fez ao deixar a Ordem.'
  },
  {
    nome: 'Sobrevivente do Abismo',
    tipo: 'Troféu',
    raridade: 'Raro',
    descricao: 'Desceu ao Abismo Cinzento e voltou com todos os resgatados.'
  },
  {
    nome: 'Guardião da Ponte Velha',
    tipo: 'Troféu',
    raridade: 'Comum',
    descricao: 'Defendeu a travessia por sete noites seguidas.'
  }
];

const missoes = [
  { nome: 'Escoltar viajantes pela Ponte Velha', xp: 20 },
  { nome: 'Acender uma fogueira na estrada', xp: 15 },
  { nome: 'Resgatar um mensageiro perdido na névoa', xp: 25 },
  { nome: 'Vigiar o portão até o amanhecer', xp: 10 },
  { nome: 'Defender a vila dos saqueadores', xp: 30 }
];

const XP_PARA_NIVEL = 100;

const estado = { xp: 40, nivel: 42, indiceMissao: 0 };

const classesRaridade = { 'Comum': 'comum', 'Raro': 'raro', 'Lendário': 'lendario' };

const iconesTipo = {
  'Arma': 'fa-khanda',
  'Armadura': 'fa-shield-halved',
  'Poção': 'fa-flask',
  'Acessório': 'fa-ring',
  'Troféu': 'fa-trophy'
};

const CHAVE_TEMA = 'tema-gale';
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const mensagensCampoVazio = {
  'nome': 'Informe seu nome.',
  'email': 'Informe seu e-mail.',
  'mensagem': 'Escreva sua mensagem.',
  'email-rapido': 'Informe seu e-mail para receber o retorno.'
};



const porId = (id) => document.getElementById(id);

// Cria um elemento com classe e texto (textContent: seguro contra HTML indesejado)
function criar(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) { elemento.className = classe; }
  if (texto) { elemento.textContent = texto; }
  return elemento;
}

const consultaMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');



function montarSaudacao(hora) {
  let saudacao;

  if (hora >= 5 && hora < 12) {
    saudacao = 'Bom dia, viajante.';
  } else if (hora >= 12 && hora < 18) {
    saudacao = 'Boa tarde, viajante.';
  } else {
    saudacao = 'Boa noite, guerreiro(a).';
  }

  return `${saudacao} A chama ainda arde.`;
}

function criarBrasas(quantidade) {
  const caixa = porId('brasas');
  if (!caixa || consultaMovimento.matches) { return; }

  for (let i = 0; i < quantidade; i++) {
    const brasa = criar('span', 'brasa');
    brasa.style.setProperty('--x', `${Math.random() * 100}%`);
    brasa.style.setProperty('--t', `${2 + Math.random() * 3}px`);
    brasa.style.setProperty('--dur', `${7 + Math.random() * 6}s`);
    brasa.style.setProperty('--atraso', `${-Math.random() * 12}s`);
    brasa.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
    caixa.appendChild(brasa);
  }
}



const menu = porId('menu');
const botaoMenu = porId('botao-menu');
const barraProgresso = porId('progresso');

function alternarMenu(abrir) {
  menu.classList.toggle('menu-aberto', abrir);
  botaoMenu.setAttribute('aria-expanded', String(abrir));
  botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
}

function iniciarMenu() {
  menu.classList.add('menu-js');

  botaoMenu.addEventListener('click', () => {
    alternarMenu(!menu.classList.contains('menu-aberto'));
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menu.classList.contains('menu-aberto')) {
      alternarMenu(false);
      botaoMenu.focus();
    }
  });

  document.addEventListener('click', (evento) => {
    if (menu.classList.contains('menu-aberto') && !menu.contains(evento.target)) {
      alternarMenu(false);
    }
  });

  const telaGrande = window.matchMedia('(min-width: 992px)');
  telaGrande.addEventListener('change', (evento) => {
    if (evento.matches) { alternarMenu(false); }
  });
}

function iniciarRolagemSuave() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (evento) => {
      const destino = link.getAttribute('href');
      const alvo = destino.length > 1 ? document.querySelector(destino) : null;
      if (!alvo) { return; }

      evento.preventDefault();
      alternarMenu(false);
      alvo.scrollIntoView({
        behavior: consultaMovimento.matches ? 'auto' : 'smooth',
        block: 'start'
      });
      history.replaceState(null, '', destino);

      alvo.setAttribute('tabindex', '-1');
      alvo.focus({ preventScroll: true });
    });
  });
}

let rolagemPendente = false;

function atualizarRolagem() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progresso = total > 0 ? window.scrollY / total : 0;

  barraProgresso.style.setProperty('--p', progresso.toFixed(3));
  menu.classList.toggle('rolado', menu.getBoundingClientRect().top <= 0);
  rolagemPendente = false;
}

function iniciarRolagem() {
  window.addEventListener('scroll', () => {
    if (!rolagemPendente) {
      rolagemPendente = true;
      window.requestAnimationFrame(atualizarRolagem);
    }
  }, { passive: true });

  window.addEventListener('resize', atualizarRolagem);
  atualizarRolagem();
}

function iniciarSecaoAtiva() {
  if (!('IntersectionObserver' in window)) { return; }

  const linksMenu = document.querySelectorAll('.menu-lista a[href^="#"]');

  const espiao = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) { return; }

      linksMenu.forEach((link) => {
        const ativo = link.getAttribute('href') === `#${entrada.target.id}`;
        link.classList.toggle('ativo', ativo);

        if (ativo) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  espiao.observe(porId('topo'));
  document.querySelectorAll('main section[id]').forEach((secao) => espiao.observe(secao));
}



const botaoTema = porId('botao-tema');

function aplicarTema(noturno) {
  document.body.classList.toggle('noturno', noturno);
  botaoTema.setAttribute('aria-pressed', String(noturno));
}

function lerTemaSalvo() {
  try {
    return localStorage.getItem(CHAVE_TEMA) === 'noturno';
  } catch (erro) {
    return false;
  }
}

function salvarTema(noturno) {
  try {
    localStorage.setItem(CHAVE_TEMA, noturno ? 'noturno' : 'padrao');
  } catch (erro) {
  }
}

function iniciarTema() {
  aplicarTema(lerTemaSalvo());

  botaoTema.addEventListener('click', () => {
    const noturno = !document.body.classList.contains('noturno');
    aplicarTema(noturno);
    salvarTema(noturno);
  });
}



const observadorRevelacao = 'IntersectionObserver' in window
  ? new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          observadorRevelacao.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
  : null;

function prepararRevelacao(elementos, colunas) {
  elementos.forEach((elemento, posicao) => {
    elemento.classList.add('revelar');
    elemento.style.setProperty('--atraso', `${(posicao % colunas) * 90}ms`);

    if (observadorRevelacao) {
      observadorRevelacao.observe(elemento);
    } else {
      elemento.classList.add('visivel');
    }
  });
}



function iniciarHistoria() {
  const botao = porId('botao-historia');
  const historia = porId('historia-completa');
  const rotulo = porId('rotulo-historia');

  botao.addEventListener('click', () => {
    // alterna a classe .revelado e devolve true quando a história ficou aberta
    const aberta = historia.classList.toggle('revelado');

    botao.setAttribute('aria-expanded', String(aberta));
    rotulo.textContent = aberta ? 'Ver menos' : 'Ver história completa';
  });
}



const blocoXp = porId('bloco-xp');
const barraXp = porId('barra-xp');
const textoXp = porId('texto-xp');
const mensagemXp = porId('mensagem-xp');
const botaoXp = porId('botao-xp');

function desenharXp() {
  barraXp.firstElementChild.style.setProperty('--v', `${estado.xp}%`);
  barraXp.setAttribute('aria-valuenow', String(estado.xp));
  textoXp.textContent = `${estado.xp} / ${XP_PARA_NIVEL} XP`;
}

function desenharNivel() {
  porId('nivel-xp').textContent = estado.nivel;
  porId('nivel-ficha').textContent = estado.nivel;
}

function mostrarMensagemXp(texto, tipo) {
  mensagemXp.textContent = texto;
  mensagemXp.className = `mensagem ${tipo}`;
}

function subirDeNivel(missao) {
  barraXp.firstElementChild.style.setProperty('--v', '100%');
  barraXp.setAttribute('aria-valuenow', String(XP_PARA_NIVEL));
  textoXp.textContent = `${XP_PARA_NIVEL} / ${XP_PARA_NIVEL} XP`;

  desenharNivel();
  blocoXp.classList.add('nivel-up');
  botaoXp.disabled = true;
  mostrarMensagemXp(
    `Nível up! Gale chegou ao nível ${estado.nivel}. ${missao.nome}: +${missao.xp} XP.`,
    'destaque-xp'
  );

  setTimeout(() => {
    blocoXp.classList.remove('nivel-up');
    botaoXp.disabled = false;
    desenharXp();
  }, 1300);
}

function iniciarXp() {
  desenharXp();
  desenharNivel();

  botaoXp.addEventListener('click', () => {
    const missao = missoes[estado.indiceMissao % missoes.length];
    estado.indiceMissao += 1;
    estado.xp += missao.xp;

    if (estado.xp >= XP_PARA_NIVEL) {
      estado.nivel += 1;
      estado.xp -= XP_PARA_NIVEL;
      subirDeNivel(missao);
    } else {
      const faltam = XP_PARA_NIVEL - estado.xp;
      mostrarMensagemXp(
        `${missao.nome}: +${missao.xp} XP. Faltam ${faltam} XP para o próximo nível.`,
        'sucesso'
      );
      desenharXp();
    }
  });
}



const gradeInventario = porId('grade-inventario');
const filtrosInventario = porId('filtros-inventario');
const contadorItens = porId('contador-itens');

let filtroAtual = 'Todos';

function criarCard(item) {
  const card = criar('article', `card-item ${classesRaridade[item.raridade]}`);

  if (item.raridade === 'Lendário') {
    card.classList.add('destaque');
  }

  const tipo = criar('p', 'tipo');
  const icone = criar('i', `fa-solid ${iconesTipo[item.tipo]}`);
  icone.setAttribute('aria-hidden', 'true');
  tipo.append(icone, item.tipo);

  card.append(
    criar('span', 'raridade', item.raridade),
    criar('h3', '', item.nome),
    criar('p', '', item.descricao),
    tipo
  );

  return card;
}

function atualizarContador(exibidos) {
  const total = itens.length;
  const palavra = total === 1 ? 'item conquistado.' : 'itens conquistados.';

  contadorItens.textContent = '';
  contadorItens.append(criar('strong', '', String(total)), ` ${palavra}`);

  if (exibidos !== total) {
    contadorItens.append(` Exibindo ${exibidos} de ${total}.`);
  }
}

function renderizarInventario() {
  const lista = filtroAtual === 'Todos'
    ? itens
    : itens.filter((item) => item.tipo === filtroAtual);

  gradeInventario.replaceChildren();

  lista.forEach((item) => {
    gradeInventario.appendChild(criarCard(item));
  });

  prepararRevelacao(gradeInventario.querySelectorAll('.card-item'), 3);
  atualizarContador(lista.length);
}

function criarFiltros() {
  const tipos = ['Todos', ...new Set(itens.map((item) => item.tipo))];

  tipos.forEach((tipo) => {
    const botao = criar('button', 'filtro', tipo);
    botao.type = 'button';
    botao.setAttribute('aria-pressed', String(tipo === filtroAtual));

    botao.addEventListener('click', () => {
      if (tipo === filtroAtual) { return; }

      filtroAtual = tipo;
      filtrosInventario.querySelectorAll('.filtro').forEach((outro) => {
        outro.setAttribute('aria-pressed', String(outro === botao));
      });
      renderizarInventario();
    });

    filtrosInventario.appendChild(botao);
  });
}



function emailValido(valor) {
  return REGEX_EMAIL.test(valor.trim());
}

function mostrarStatus(elemento, tipo, texto) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`;
}

function mostrarErroCampo(campo, texto) {
  porId(`erro-${campo.id}`).textContent = texto;
  campo.setAttribute('aria-invalid', 'true');
}

function limparErroCampo(campo) {
  porId(`erro-${campo.id}`).textContent = '';
  campo.removeAttribute('aria-invalid');
}

function problemaDoCampo(campo) {
  const valor = campo.value.trim();

  if (valor === '') {
    return mensagensCampoVazio[campo.id];
  }

  if (campo.type === 'email' && !emailValido(valor)) {
    return 'Digite um e-mail válido, como nome@exemplo.com.';
  }

  return '';
}

function validarCampo(campo) {
  const problema = problemaDoCampo(campo);

  if (problema) {
    mostrarErroCampo(campo, problema);
    return false;
  }

  limparErroCampo(campo);
  return true;
}

function simularEnvio(form, status, mensagemSucesso) {
  const botao = form.querySelector('button[type="submit"]');
  const rotulo = botao.querySelector('.rotulo');
  const textoOriginal = rotulo.textContent;
  const texto = mensagemSucesso();

  botao.disabled = true;
  rotulo.textContent = 'Enviando...';
  mostrarStatus(status, 'neutra', 'Enviando seu chamado...');

  setTimeout(() => {
    form.reset();
    botao.disabled = false;
    rotulo.textContent = textoOriginal;
    mostrarStatus(status, 'sucesso', texto);
  }, 800);
}

function ligarFormulario(form, campos, status, mensagemSucesso) {
  campos.forEach((campo) => {
    campo.addEventListener('input', () => {
      if (campo.hasAttribute('aria-invalid')) { validarCampo(campo); }
    });

    campo.addEventListener('blur', () => {
      if (campo.value.trim() !== '') { validarCampo(campo); }
    });
  });

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const invalidos = campos.filter((campo) => !validarCampo(campo));

    if (invalidos.length > 0) {
      const aviso = invalidos.length === 1
        ? 'Corrija o campo destacado para enviar.'
        : `Corrija os ${invalidos.length} campos destacados para enviar.`;

      mostrarStatus(status, 'erro-geral', aviso);
      invalidos[0].focus();
      return;
    }

    simularEnvio(form, status, mensagemSucesso);
  });
}

function iniciarFormularios() {
  const emailRapido = porId('email-rapido');

  ligarFormulario(
    porId('form-rapido'),
    [emailRapido],
    porId('status-rapido'),
    () => 'E-mail recebido! A Guilda entra em contato em breve.'
  );

  const nome = porId('nome');

  ligarFormulario(
    porId('form-contato'),
    [nome, porId('email'), porId('mensagem')],
    porId('status-contato'),
    () => {
      const primeiroNome = nome.value.trim().split(' ')[0];
      return `Chamado enviado, ${primeiroNome}! A Guilda responde em breve.`;
    }
  );
}



porId('saudacao').textContent = montarSaudacao(new Date().getHours());
criarBrasas(16);

iniciarMenu();
iniciarRolagemSuave();
iniciarRolagem();
iniciarSecaoAtiva();
iniciarTema();
iniciarHistoria();
iniciarXp();
iniciarFormularios();

criarFiltros();
renderizarInventario();

prepararRevelacao(document.querySelectorAll('.sobre'), 1);
prepararRevelacao(document.querySelectorAll('.xp'), 1);
prepararRevelacao(document.querySelectorAll('.atributo'), 2);
prepararRevelacao(document.querySelectorAll('.habilidades li'), 3);
prepararRevelacao(document.querySelectorAll('.contato-rapido, .formulario, .redes'), 1);
