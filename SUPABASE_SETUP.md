# Configuração do Supabase

## Passos para configurar o banco de dados:

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard/project/ggfqqxtbdnoazxzoiqya

2. **Execute o SQL para criar as tabelas**
   - No menu lateral, clique em "SQL Editor"
   - Cole e execute o conteúdo do arquivo `supabase_tables.sql`
   - Clique em "Run" para executar

3. **Verifique as tabelas criadas**
   - No menu lateral, clique em "Table Editor"
   - Você deve ver duas tabelas:
     - `config_settings` - Configurações do calculador
     - `farm_entries` - Registros de farm

4. **O projeto já está configurado!**
   - As variáveis de ambiente já estão no arquivo `.env.local`
   - O cliente Supabase já está configurado em `/lib/supabase.ts`

## Como usar:

1. Execute o projeto:
   ```bash
   npm run dev
   ```

2. O site agora salvará automaticamente todos os dados no Supabase ao invés do localStorage

## Estrutura das tabelas:

### config_settings
- `tc_value`: Valor do TC em gold
- `tc_price_reais`: Preço do TC em reais
- `tc_amount`: Quantidade de TC

### farm_entries
- `player_id`: ID do jogador (player1 = Imp, player2 = Juan)
- `player_name`: Nome do jogador
- `loot_gp`: Loot em gold
- `waste_gp`: Waste em gold
- `balance_gp`: Balance em gold
- `tc_value`: Valor do TC usado no cálculo
- `tc_quantity`: Quantidade de TC equivalente
- `reais_value`: Valor em reais
- `created_at`: Data/hora do registro