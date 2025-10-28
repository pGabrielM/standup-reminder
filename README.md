# 🪑 Stand Up Reminder - Extensão Chrome

Extensão moderna do Chrome para lembrá-lo de se levantar da cadeira regularmente e cuidar da sua saúde.

## ✨ Funcionalidades

### 🎯 Timer Personalizável
- ⏰ Configure o intervalo de tempo entre 1 e 480 minutos (8 horas)
- ⏱️ Contagem regressiva em tempo real com atualização dinâmica
- 📊 Anel de progresso circular com animações suaves

### 🎮 Controles Completos
- ▶️ **Iniciar**: Começa a contagem regressiva
- ⏸️ **Pausar**: Pausa o timer mantendo o tempo restante
- ⏯️ **Continuar**: Retoma de onde parou
- 🔄 **Resetar**: Volta ao tempo configurado

### 🔔 Notificações Inteligentes
- 🚨 Alertas sonoros quando o tempo acabar
- 💬 Notificações interativas com botões de ação
- 📱 Prioridade alta para não passar despercebido
- ✅ Botão "Já me levantei" para resetar
- ⏰ Botão "Adiar" direto na notificação

### ⏱️ Sistema de Adiamento Configurável
- 🕐 **Tempo de adiamento personalizável**: Configure de 1 a 120 minutos (padrão: 15 min)
- ➕ **Adiamento inteligente**: O tempo é ADICIONADO ao tempo restante (não substituído)
- ✨ **Animação profissional**: Efeito de confetti ao adiar para feedback visual
- 🎯 **Exemplo**: 30min restantes + adiar 15min = 45min restantes
- 🎨 **Quick-fill badges**: Clique em valores pré-definidos (5, 10, 15, 20, 30 min)

### 🎨 Ícone Dinâmico
- 🏷️ **Badge compacto**: Veja o tempo restante direto no ícone (45m, 1h, 1h30, 5h15)
- 📊 **Estados visuais**: Badge muda conforme o estado
  - Tempo restante durante timer ativo
  - ⏸ quando pausado
  - Vazio quando inativo

### 🌍 Suporte Multi-idioma
- 🇧🇷 **Português**: Interface completa traduzida
- 🇺🇸 **English**: Full English translation
- 🇪🇸 **Español**: Traducción completa
- � **Troca fácil**: Selecione o idioma nas configurações
- 💾 **Persistente**: Idioma escolhido é salvo automaticamente

### 💎 Interface Profissional
- 🌈 Design moderno com gradientes e glassmorphism
- 🎨 Feedback visual imediato em todas as ações
- ⭕ Anel de progresso circular animado
- 🎭 Cores que mudam baseado no estado
- 📱 Layout compacto otimizado (420x540px - sem scroll)
- 🎯 **Quick-fill badges**: Valores pré-definidos para configuração rápida (30min, 45min, 1h, 1h30, 2h)
- ⚠️ **Validações visuais**: Mensagens de erro em cards vermelhos (não em alertas genéricos)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 3** - Estilização moderna
- **Lucide React** - Ícones elegantes

### Build & Tools
- **Webpack 5** - Bundler
- **ESLint** - Linting
- **PostCSS** - Processamento CSS

### Chrome Extension
- **Manifest V3** - Última versão do manifest
- **Service Worker** - Background processing
- **Chrome Alarms API** - Timer preciso
- **Chrome Notifications API** - Notificações nativas
- **Chrome Storage API** - Persistência de dados

## 📦 Instalação para Desenvolvimento

### Pré-requisitos
- Node.js 18+ e npm

### Passos

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd standup-reminder
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o build**
```bash
# Para desenvolvimento (com watch mode - recompila automaticamente)
npm run dev

# Para produção (otimizado)
npm run build
```

4. **Carregue a extensão no Chrome**
   - Abra o Chrome e navegue até `chrome://extensions/`
   - Ative o **"Modo do desenvolvedor"** (canto superior direito)
   - Clique em **"Carregar sem compactação"**
   - Selecione a pasta `dist` do projeto

5. **Modo Desenvolvimento (Hot Reload)**
   - Deixe `npm run dev` rodando no terminal
   - Sempre que você editar um arquivo, o webpack recompilará automaticamente
   - Vá em `chrome://extensions/` e clique no botão **🔄 Atualizar** da extensão para ver as mudanças
   - Para o popup: feche e abra novamente
   - Para o service worker: recarregue a extensão

🎉 Pronto! A extensão está instalada e pronta para uso.

## 🚀 Como Usar

### Configuração Inicial

1. Clique no ícone da extensão na barra de ferramentas do Chrome
2. Clique no ícone de engrenagem ⚙️ para abrir as configurações
3. Defina o intervalo desejado em minutos (padrão: 60 minutos)
4. Clique em **"Salvar"**

### Controles Disponíveis

#### Iniciar Timer
- Clique em **"Iniciar Timer"** para começar a contagem
- O tempo restante será exibido no popup e no badge do ícone

#### Pausar/Continuar
- **Pausar**: Pausa a contagem do tempo
- **Continuar**: Retoma a contagem de onde parou

#### Resetar
- Reinicia o timer com o tempo total configurado
- Útil quando você já se levantou e quer reiniciar a contagem

#### Adiar 15 min
- Adia o próximo lembrete por 15 minutos adicionais
- Perfeito para quando você precisa de mais alguns minutos sentado

### Notificações

Quando o timer chegar a zero, você receberá uma notificação com:
- ✅ **"Já me levantei"**: Reseta o timer
- ⏰ **"Adiar 15 min"**: Adiciona 15 minutos ao timer

## 📁 Estrutura do Projeto

```
standup-reminder/
├── public/
│   ├── icons/               # Ícones da extensão
│   ├── manifest.json        # Manifest V3
│   └── popup.html          # HTML do popup
├── src/
│   ├── background/
│   │   └── service-worker.ts    # Service worker (background)
│   ├── popup/
│   │   ├── App.tsx             # Componente principal
│   │   └── index.tsx           # Entry point do popup
│   ├── styles/
│   │   └── globals.css         # Estilos globais Tailwind
│   ├── types/
│   │   └── timer.ts            # Types do TypeScript
│   └── utils/
│       └── timer-utils.ts      # Utilitários do timer
├── dist/                    # Build output (gerado)
├── package.json
├── tsconfig.json
├── webpack.config.js
├── tailwind.config.js
└── .eslintrc.js
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com watch mode (recompila ao editar arquivos)
npm run dev

# Build de produção (otimizado e sem eval)
npm run build

# Linting
npm run lint

# Correção automática de lint
npm run lint:fix
```

## 🔄 Workflow de Desenvolvimento

### Modo Development (Recomendado para desenvolvimento)

1. Execute `npm run dev` em um terminal (deixe rodando)
2. Carregue a extensão no Chrome apontando para a pasta `dist/`
3. Edite os arquivos em `src/`
4. O webpack recompilará automaticamente
5. Vá em `chrome://extensions/` e clique em **🔄 Atualizar** na extensão
6. Reabra o popup ou recarregue a página para ver as mudanças

**Nota**: Sempre use `npm run build` (produção) antes de publicar, pois o modo dev gera arquivos maiores com source maps.

## 🎨 Personalizações

### Alterar o Intervalo Padrão

Edite `src/types/timer.ts`:
```typescript
export const DEFAULT_INTERVAL = 60; // Altere para o valor desejado em minutos
```

### Alterar o Tempo de Adiamento

Edite `src/types/timer.ts`:
```typescript
export const SNOOZE_TIME = 15; // Altere para o valor desejado em minutos
```

### Personalizar Cores

Edite `tailwind.config.js` para alterar o tema de cores:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Suas cores personalizadas
      },
    },
  },
}
```

## 🧪 Testando a Extensão

1. Certifique-se de que a extensão está carregada no Chrome
2. Clique no ícone da extensão
3. Configure um intervalo curto (ex: 1 minuto) para testar
4. Inicie o timer
5. Aguarde a notificação aparecer
6. Teste todos os botões:
   - Pausar/Continuar
   - Resetar
   - Adiar
   - Botões da notificação

## 📝 Desenvolvimento

### Adicionar Novas Funcionalidades

1. **Service Worker** (`src/background/service-worker.ts`): Lógica de background
2. **Popup UI** (`src/popup/App.tsx`): Interface do usuário
3. **Utils** (`src/utils/timer-utils.ts`): Funções auxiliares

### Debug

- **Service Worker**: `chrome://extensions/` → Detalhes da extensão → "Inspecionar visualizações" → service worker
- **Popup**: Clique direito no popup → "Inspecionar"

### Problemas Comuns

#### Service Worker Registration Failed (Status Code 15)
- **Causa**: Webpack usando `eval()` no modo development, que não é permitido em extensões
- **Solução**: Use `npm run build` (produção) para instalar a extensão, não o dev
- **Alternativa**: O modo dev agora usa `cheap-module-source-map` em vez de `eval`

#### CSP Error: "unsafe-eval"
- **Causa**: Extensões Chrome não permitem `eval()` por segurança
- **Solução**: Sempre use build de produção (`npm run build`) antes de instalar no Chrome

## 🚢 Publicar na Chrome Web Store

1. Execute o build de produção:
```bash
npm run build
```

2. Crie um arquivo ZIP da pasta `dist`:
```bash
cd dist && zip -r ../standup-reminder.zip . && cd ..
```

3. Acesse o [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. Pague a taxa única de registro (US$ 5)
5. Faça upload do arquivo ZIP
6. Preencha as informações necessárias
7. Envie para revisão

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📄 Licença

MIT License - sinta-se livre para usar este projeto como quiser.

## 💡 Dicas de Saúde

A posição sentada prolongada pode causar:
- Dores nas costas
- Problemas de circulação
- Tensão muscular
- Fadiga

**Recomendações:**
- Levante-se a cada 60 minutos
- Faça alongamentos simples
- Caminhe por alguns minutos
- Mantenha uma boa postura

---

Desenvolvido com ❤️ para promover hábitos saudáveis no trabalho!
