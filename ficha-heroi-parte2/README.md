# Ficha de Herói: Cavaleiro Gale

Página web em formato de ficha de RPG de um cavaleiro original, inspirado na estética sombria de Dark Souls, mas com um herói protetor e gentil.

- **Parte 1:** estrutura em HTML e layout responsivo em CSS.
- **Parte 2:** comportamento com JavaScript (menu, inventário dinâmico, XP, formulários e outras interações).

## Estrutura de pastas

```
ficha-heroi/
├── index.html
├── style.css
├── script.js
├── gale.svg
└── README.md
```

## Universo e identidade visual

- **Personagem:** Gale, Cavaleiro Guardião da Chama Pálida.
- **Paleta (variáveis em `:root`):** azul da capa, prata do aço, ouro envelhecido e laranja de brasa sobre fundo quase preto.
- **Modo noturno da guilda:** a classe `noturno` no `<body>` troca as mesmas variáveis por uma paleta de fogueira (marrom queimado e laranja). Nenhum estilo novo foi criado, só novos valores para as variáveis que já existiam.
- **Fontes (Google Fonts):** Cinzel nos títulos e IM Fell English nos textos.
- **Ícones:** Font Awesome 6.

## Decisões de UI/UX

### Princípios estáticos (Parte 1)

1. **Hierarquia visual:** o nome do herói é o maior elemento da página, em ouro e com brilho de brasa. Depois vêm os títulos de seção e, por fim, o texto corrido.
2. **Contraste e legibilidade:** texto claro sobre fundo escuro. As fontes mais estilizadas ficam só nos títulos, e o corpo usa tamanho maior e entrelinha de 1.7 para compensar a fonte antiga.
3. **Consistência:** todos os cards seguem o mesmo padrão (borda, espaçamento e raio das bordas), e a cor da borda indica a raridade do item (comum, raro ou lendário).
4. **Affordance e feedback:** menu, botões e cards mudam de cor e crescem levemente no `hover`. Links, botões e campos também têm destaque no foco do teclado (`:focus-visible`).
5. **Área de toque (Lei de Fitts):** itens do menu, botões, filtros e campos têm no mínimo 44 a 48 px de altura.
6. **Proximidade (Gestalt):** em cada atributo, ícone, nome, valor e barra ficam juntos e separados dos outros atributos por um espaço maior.
7. **Fluxo de leitura:** as seções seguem a ordem do menu, que leva do herói (quem é) até o contato com a guilda.

### Princípios de interação (Parte 2)

1. **Visibilidade do estado do sistema**
   - O menu hambúrguer troca de ícone (três barras viram um X) e informa `aria-expanded`.
   - O link da seção que está na tela fica dourado e sublinhado no menu.
   - A barra fina no fim do menu mostra quanto da página já foi lida.
   - O filtro ativo do inventário fica azul e ganha um ✓, então o estado não depende só da cor.
   - O botão do modo noturno muda de cor quando está ligado (`aria-pressed`).
2. **Feedback imediato**
   - Cada missão concluída mostra na hora qual foi a missão, quanto XP rendeu e quanto falta para o próximo nível.
   - Ao subir de nível, a barra enche, brilha em dourado e a mensagem "Nível up!" aparece.
   - O botão de envio dos formulários mostra "Enviando..." e depois a confirmação.
3. **Prevenção de erros**
   - O formulário avisa que todos os campos são obrigatórios antes de o usuário errar.
   - Campos vazios ou com e-mail inválido recebem mensagem específica ("Informe seu nome.", "Digite um e-mail válido, como nome@exemplo.com.").
   - O foco vai para o primeiro campo com erro, e o erro some assim que o usuário corrige.
   - O formulário nunca falha em silêncio e não usa `alert()`.
4. **Controle e liberdade do usuário**
   - O menu fecha com o botão, com a tecla Esc, com clique fora ou ao escolher um link.
   - "Ver história completa" vira "Ver menos" e pode ser fechado quando quiser.
   - O filtro "Todos" desfaz qualquer filtro de uma vez.
   - Quem ativou "reduzir movimento" no sistema recebe a página sem animações.
5. **Consistência com a Parte 1:** os novos estados (ativo, aberto, revelado, erro) reaproveitam as cores, bordas, raios e transições já definidos nas variáveis CSS.
6. **Movimento com propósito:** a animação de entrada do nome acontece uma vez, as brasas sobem no cabeçalho, as barras de atributo enchem quando aparecem na tela e os cards entram escalonados. Todo o resto do movimento responde a uma ação do usuário.

## Requisitos atendidos

### Parte 1

- HTML semântico: `header`, `nav`, `main`, `section`, `article`, `footer`, `h1` a `h3`, `p`, `img`, `a`, `ul`, `form`.
- Imagem com `alt` descritivo.
- CSS externo, com blocos comentados por seção.
- Flexbox no menu, Grid no inventário e `media queries` para 1, 2 e 3 colunas.
- Variáveis CSS usadas em vários elementos.
- Barras de atributo feitas só com HTML e CSS (`div` com `width` em porcentagem).
- `transition` em menu, botões e cards, e pseudo-elemento `::before` nos cards.
- Item de destaque lendário, links de comunidade e biografia com avatar.

### Parte 2: obrigatórios

| Requisito | Onde está |
| --- | --- |
| Menu responsivo funcional | `#botao-menu` no `index.html`; função `alternarMenu()` no `script.js` alterna a classe `menu-aberto`; estilos na seção 4 e 11 do `style.css` |
| Inventário dinâmico | array `itens` (7 objetos com nome, tipo, raridade e descrição); `forEach` em `renderizarInventario()` cria os cards com `createElement`; filtros por tipo gerados em `criarFiltros()` |
| Barra de XP interativa | botão "Completar missão" (`iniciarXp()`); `if` verifica se chegou a 100 XP e mostra "Nível up!" |
| "Ver mais" em Sobre o Herói | `iniciarHistoria()`: operador ternário alterna entre "Ver história completa" e "Ver menos" e a classe `.revelado` abre e fecha o texto |
| Formulário de contato | `ligarFormulario()`: `preventDefault()`, campos obrigatórios, validação de e-mail e mensagens na tela |
| Feedback visual e depuração | transições CSS combinadas com classes alternadas pelo JavaScript; todos os `console.log` foram removidos antes da entrega |
| Princípios de UI/UX | seção "Princípios de interação (Parte 2)" acima |

### Parte 2: adicionais

- **Contador dinâmico:** "7 itens conquistados" calculado a partir de `itens.length` e atualizado ao filtrar.
- **Modo noturno da guilda:** botão no menu troca a classe `noturno` no `<body>`.
- **Scroll suave:** `scrollIntoView` com `behavior: 'smooth'` em todos os links internos.
- **Saudação dinâmica:** "Bom dia, viajante", "Boa tarde, viajante" ou "Boa noite, guerreiro(a)", conforme a hora do visitante.

### Ajustes pedidos na avaliação

- **Menu fixo:** o `nav` usa `position: sticky` e acompanha a rolagem.
- **Menos estático, mais movimento:** brasas no cabeçalho, entrada do título, revelação dos blocos ao rolar, barras que enchem e barra de progresso de leitura.
- **Responsividade com menu sanduíche:** abaixo de 992 px o menu vira hambúrguer.
- **Contato rápido:** barra com um único campo de e-mail e validação própria, acima do formulário completo.

### Pesquisa complementar (não vista diretamente em aula)

- **`IntersectionObserver`:** revela os blocos ao entrar na tela e marca a seção ativa no menu.
- **`localStorage`:** guarda a escolha do modo noturno entre visitas.
- **`requestAnimationFrame`:** atualiza a barra de progresso de leitura sem pesar na rolagem.

## Como testar

1. Abra o `index.html` no navegador (é preciso estar conectado à internet para carregar as fontes e os ícones).
2. **Desktop (acima de 992 px):** menu horizontal fixo; role a página e veja o nome "Gale" aparecer no menu.
3. **Mobile (abaixo de 992 px):** use as DevTools (F12, ícone de celular) e teste o hambúrguer, o filtro do inventário e os formulários.
4. Abra o Console das DevTools e confirme que não há erros nem logs.

Observação: os formulários não têm servidor. O envio é simulado, mas toda a validação e as mensagens de feedback funcionam de verdade.
