<div align="center">
  <img src="frontend/src/assets/logo.png" alt="Logo SmartMart" width="100">
  <h1>SmartMart Solutions</h1>
  
  <p>
    <strong>Sistema de Gestão de Varejo & Dashboard Analítico</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <br />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
    <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white" alt="SQLAlchemy" />
  </p>
</div>

<br />

## 📋 Sobre o Projeto

O **SmartMart Solutions** é uma aplicação Fullstack desenvolvida que tem como objetivo fornecer uma interface intuitiva para o time de operações comerciais gerenciar produtos, visualizar métricas de vendas e realizar importações de dados em massa.

O sistema foi projetado com foco em **UX/UI**, **Responsividade** e **Performance**, utilizando uma arquitetura moderna separando Frontend (SPA) e Backend (REST API).

---

## 🚀 Funcionalidades Principais

### 📊 Dashboard Interativo
- Visualização de métricas totais (Vendas e Receita).
- Gráficos de barras e linhas para análise mensal.
- Gráfico comparativo de receita por categoria.

### 📦 Gestão de Produtos
- **Listagem Completa:** Tabela paginada com visualização clara de preços e categorias.
- **Filtros Avançados:** Busca textual por nome e filtro dinâmico por categoria.
- **Edição Rápida:** Modal para alterar preço, nome ou categoria de um produto existente (PUT).
- **Exportação:** Download de relatórios em CSV, respeitando os filtros ativos na tela.

### 📥 Importação de Dados (Data Entry)
- **Upload via CSV:** Processamento em lote para Categorias, Produtos e Histórico de Vendas.
- **Inserção Manual:** Formulários dedicados para cadastro unitário de Produtos e criação rápida de Categorias.
- **Feedback Visual:** Notificações (Toasts) de sucesso ou erro em todas as operações.

### 📱 Interface Responsiva
- Layout adaptável para Desktop, Tablets e Mobile.
- Menu lateral (Sidebar) retrátil em dispositivos móveis.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Framework:** React + Vite
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Notificações:** React Toastify
- **Comunicação API:** Fetch API nativa

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Banco de Dados:** SQLite (via SQLAlchemy ORM)
- **Manipulação de Dados:** Pandas (para processamento de CSV)
- **Servidor:** Uvicorn

---

## 📸 Screenshots

<div align="center">
  <img src="https://github.com/user-attachments/assets/6be9deb0-df11-4738-aac8-e04fed2b28b0" alt="Preview" width="800" style="border-radius: 10px; margin-bottom: 20px;">
  <div style="display: flex; justify-content: center; gap: 20px;">
     <img src="https://github.com/user-attachments/assets/fa233f42-e7a7-42e5-8b03-eb647732c25f" alt="Lista de Produtos" width="48%" style="border-radius: 10px;">
     <img src="https://github.com/user-attachments/assets/4f6a0f3c-4e73-427d-932d-de7754266f80" alt="Tela de Importação" width="48%" style="border-radius: 10px;">
  </div>
</div>

---

## ⚙️ Instalação e Execução

Siga os passos abaixo para rodar o projeto localmente.

### Pré-requisitos
- Node.js (v18+)
- Python (v3.10+)
- Git

### 1. Clonar o Repositório
```bash
git clone [https://github.com/danieleksantos/smartmart-solutions.git](https://github.com/danieleksantos/smartmart-solutions.git)
cd smartmart-solutions
```

### 2. Configurar o Backend
```
# Entre na pasta do backend
cd backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor
uvicorn main:app --reload
```

O Backend rodará em: import.meta.env.VITE_API_URL Documentação automática (Swagger): import.meta.env.VITE_API_URL/docs

### 3. Configurar o Frontend
Abra um novo terminal na raiz do projeto:

```
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O Frontend rodará em: http://localhost:5173

📂 Estrutura de Pastas
```
smartmart-solutions/
├── backend/
│   ├── main.py          # Entry point e rotas da API
│   ├── crud.py          # Lógica de banco de dados
│   ├── models.py        # Modelos SQLAlchemy
│   ├── schemas.py       # Schemas Pydantic
│   └── database.py      # Configuração do SQLite
│
└── frontend/
    ├── src/
    │   ├── components/  # Componentes reutilizáveis (Sidebar, ProductList, etc.)
    │   ├── pages/       # Páginas principais (Dashboard, Products, ImportData)
    │   ├── assets/      # Imagens e estilos estáticos
    │   └── types/       # Definições de tipos TypeScript
    └── ...

```

📝 Decisões de Arquitetura
- SQLite: Escolhido pela simplicidade e facilidade de configuração local, ideal para prototipagem rápida solicitada no desafio.
- FastAPI + Pandas: O Pandas foi utilizado especificamente nas rotas de upload para garantir performance e facilidade na manipulação e limpeza de dados CSV antes da inserção no banco.
- Tailwind CSS: Utilizado para garantir desenvolvimento rápido de uma interface moderna e responsiva sem a necessidade de escrever CSS puro extenso.
- Separação de Responsabilidades: O Frontend foi dividido em Páginas (rotas) e Componentes isolados para facilitar a manutenção. A tela de "Importação" centraliza todas as entradas de dados para manter a tela de "Produtos" limpa para visualização.

- <div align="center"> <small>Daniele Karina dos Santos - 2026</small> </div>
