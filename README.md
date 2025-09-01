# Tibia Farm Calculator 🎮

Uma aplicação web para gerenciar e calcular farms do Tibia, convertendo valores de gold para reais.

## 🚀 Funcionalidades

- **Registro de Farms**: Registre farms com valor em gold e horas trabalhadas
- **Conversão Automática**: Converte gold → TC → R$
- **Cálculo de R$/hora**: Calcula automaticamente o valor por hora farmada
- **Multi-jogador**: Suporte para múltiplos jogadores (Imp e Juan)
- **Estatísticas Detalhadas**: 
  - Total de farms realizados
  - Total de horas farmadas
  - Média de R$/hora
  - Melhor e pior farm
- **Edição de Registros**: Edite farms existentes e ajuste valores de TC
- **Atualização em Massa**: Atualize o valor do TC de todos os registros de uma vez
- **Interface Moderna**: Design escuro e responsivo

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados e autenticação
- **Lucide React** - Ícones

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/OnlyIMP/tibiaplanilha.git
cd tibiaplanilha
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` com:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Execute o projeto:
```bash
npm run dev
```

## 🗄️ Configuração do Banco de Dados

Execute o SQL disponível em `supabase_tables.sql` e `UPDATE_DATABASE.sql` no seu projeto Supabase.

## 📱 Como Usar

1. **Configure os valores**: Defina o valor do TC, preço em reais e quantidade
2. **Registre um farm**: Insira o valor em gold e as horas farmadas
3. **Visualize estatísticas**: Acompanhe seu desempenho no painel de estatísticas
4. **Edite registros**: Clique no ícone de editar para ajustar valores
5. **Atualize TC em massa**: Use o botão especial quando o valor do TC mudar

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido com ❤️ para a comunidade Tibiana