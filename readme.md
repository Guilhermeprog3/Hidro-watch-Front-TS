# 💧 Hidro‑Watch — Porque cada gota importa

Hidro‑Watch é uma solução móvel completa e **open‑source** para o monitoramento inteligente da qualidade da água. Construído em **React Native** com **Expo** e **TypeScript**, o aplicativo conecta‑se a dispositivos de hardware via Bluetooth/Wi‑Fi, exibindo medições em tempo real, relatórios semanais e alertas automáticos. Tudo isso em uma interface fluida, personalizável e pronta para produção.

---

## ✨ Funcionalidades Principais

| 🔑 | Funcionalidade                  | Descrição                                                                           |
| -- | ------------------------------- | ----------------------------------------------------------------------------------- |
| 🔐 | **Autenticação Completa**       | Cadastro com verificação de e‑mail, login seguro e fluxo de recuperação de senha.   |
| 📱 | **Dashboard Intuitivo**         | Resumo dos dispositivos, status online/offline e atalhos para ações rápidas.        |
| ➕  | **Adição por QR Code**          | Escaneie um QR Code para vincular novos dispositivos em segundos.                   |
| 📊 | **Monitoramento em Tempo Real** | Acompanhe valores de **pH**, **Turbidez**, **Temperatura** e **TDS** em tempo real. |
| 📈 | **Relatórios Semanais**         | Gráficos interativos com médias semanais para detectar tendências e anomalias.      |
| ❤️ | **Favoritos**                   | Marque dispositivos críticos e acesse‑os rapidamente.                               |
| 🔍 | **Busca Avançada**              | Pesquise em *Meus Dispositivos*, *Favoritos* e *Histórico*.                         |
| 🎨 | **Temas Customizáveis**         | Escolha entre os temas **Hidro**, **Light** ou **Dark**.                            |
| 🔔 | **Notificações Push**           | Receba alertas instantâneos sobre anomalias de qualidade da água.                   |
| 👤 | **Perfil de Usuário**           | Gerencie dados pessoais e foto de perfil diretamente no app.                        |

---

## 🛠️ Tecnologias & Bibliotecas

- **Framework:** React Native + Expo
- **Linguagem:** TypeScript
- **Navegação:** React Navigation (Native Stack, Bottom Tabs)
- **Estilização:** StyleSheet • Expo Linear Gradient
- **HTTP Client:** Axios
- **Gerenciamento de Estado:** React Context API
- **Gráficos:** `react-native-chart-kit`
- **Validação:** Zod
- **Armazenamento Local:** AsyncStorage • Expo Secure Store

---

## 🚀 Como Iniciar

### Pré‑requisitos

- **Node.js** ≥ 18
- **npm** ou **yarn**
- **Expo CLI**
  ```bash
  npm install -g expo-cli
  ```

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd hidro-watch-front-ts
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn
   ```
3. **Configure as variáveis de ambiente:** Edite `src/services/api.ts` e ajuste `baseURL` para o endereço do seu backend.
   ```ts
   export const api = axios.create({
     baseURL: "http://SEU_IP_AQUI:3333/",
   });
   ```
4. **Inicie o projeto com Expo:**
   ```bash
   npm start
   # ou
   expo start
   ```

> **Dica:** Use o aplicativo **Expo Go** (Android/iOS) para testar rapidamente no dispositivo físico.

---

## 📂 Estrutura do Projeto

```
/
├── assets/             # Imagens, fontes e recursos estáticos
├── src/
│   ├── colors/         # Paleta de cores e temas
│   ├── components/     # Componentes reutilizáveis (Headers, Lists, etc.)
│   ├── context/        # Context API para estado global
│   ├── hooks/          # Hooks customizados
│   ├── routes/         # Configuração de navegação (públicas, privadas, tabs)
│   ├── screens/        # Telas principais da aplicação
│   └── services/       # Integração com API e serviços externos
├── App.tsx             # Componente raiz
└── package.json        # Dependências e scripts
```

---

## 🖼️ Screenshots

> *Adicione aqui capturas de tela ou gifs demonstrando as principais telas do app.*

---

## 🤝 Contribuindo

Contribuições são **muito bem‑vindas**! Para contribuir:

1. Faça um *fork* do projeto.
2. Crie uma *branch* para a sua feature/bugfix:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas mudanças.
4. Envie um *pull request* 😄.

---

## 📜 Licença

Distribuído sob a licença **MIT**. Veja `LICENSE` para mais informações.

---

## 📬 Contato

- **Autor:** Guilherme Silva Rios
- **E‑mail:** [hidro-watch@gmail.com](mailto\:hidro-watch@gmail.com)
- **Portfólio:** [https://guilhermeriosdev.vercel.app](https://guilhermeriosdev.vercel.app)

> **Hidro‑Watch** — *cada gota conta para um futuro mais sustentável!* 🌍💧

