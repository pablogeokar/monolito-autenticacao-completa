Esta API foi desenvolvida com o propósito de mostrar como funciona uma API com autenticação e autorização usando JWT. Possui integração com o Prisma ORM e o Fastify. Caso não desejo utilizar o Prisma ORM, basta remover o módulo `src/modules/prisma`, dentro do arquivo `src/server.ts` remover as referências ao módulo, lembrando também de remover a pasta `prisma` e remover a referência do prisma dentro de `src/@types/fastify.d.ts`. Fazendo estas alterações a API estará funcional para você adaptar qualquer ORM. Não esquecendo tambem de alterar remover as dependências prisma e @prisma/client do seu projeto.

## Comandos úteis

- `dev`: Executa o servidor em modo de desenvolvimento
- `build`: Gera o arquivo `dist/server.js` que é o arquivo que o Fastify busca quando é iniciado
- `prisma generate`: Gerencia o schema do Prisma ORM
- `prisma migrate dev`: Aplica alterações no schema do Prisma ORM
- `prisma migrate deploy`: Aplica alterações no schema do Prisma ORM (para produção)
- `g`: Executa a cli da API para a criação dos módulos
