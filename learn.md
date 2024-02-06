# Este arquivo

Neste arquivo eu escrevi, de acordo com o progresso do [Next Level Week](https://www.rocketseat.com.br/eventos/nlw) da [rocketseat](https://www.rocketseat.com.br/), meu aprendizado durante a trilha de NodeJs. Servindo até como um tutorial.

# Como criar um projeto NodeJs do zero.

- Verifique sua versão do Node no _terminal_. Caso não tenha, [instale-o](https://nodejs.org/en).
```
    $ node --version
```

---
- Crie um arquivo à partir do npm para configurar seu projeto:

```
    $ npm init -y
```
---

- Instale e use o *TypeScript* com o NodeJs:

```
    $ npm install typescript @types/node -D
```
> `-D` significa 'development'
---

- Agora, configure para suporte ao `tsc` (tsconfig.json):

```
    $ npx tsc --init
```
---

Acesse [Node-Target-Mapping](https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping) para mapear seu arquivo `tsconfig.json`.

- Neste link, procure a versão do node que seja compatível com a sua, e modifique os itens do arquivo `tsconfig.json` conforme sua versão:

```json
    {
        "compilerOptions": {
            "lib": ["ES20XX"],
            "module": "nodeXX",
            "target": "ES20XX"
        }
    }
```

## Importante:

O NodeJs não compreende o *TypeScript* nativamente, precisamos de uma dependência para que arquivos `.ts` sejam interpretados como `.js` de forma correta, para isso instale:

```
    $ npm install tsx -D
```

## :rocket: Tudo configurado, bora começar!

Na raiz do seu projeto, crie uma pasta chamada `src` e dentro dela cria outra pasta chamada `http` com um arquivo `server.ts`:

```
    > src
        > http
            -server.ts
    > node_modules
    | package-lock.json
    | package.json
    | tsconfig.json
```

### Você está sendo filmado!

Vamos fazer uma pequena configuração no nosso projeto. Toda vez que modificarmos um arquivo, nosso servidor irá reiniciar observando toda e qualquer modificação!

- Para isso, abra o arquivo `package.json` e adicione em "scripts" o seguinte código:

```package.json
    {
        // resto do código
        "scripts": {
            "test" : "echo \"Error: no test specified\" && exit 1",
            "dev": "tsx watch src/http/server.ts"
        }
    }
```

E isso funciona?
> Sim, meu javoscripto, isso funciona.

- Modifique apenas o "dev", onde o argumento após o watch é o caminho para o arquivo do `server.ts`.

Vamos testar:

- Abra um _terminal_ e digite: `npm run dev`.

- No arquivo `server.ts` escreva:

```
    console.log("Hello world!")
```

> Viu que detectou quando houve qaulquer mudança e reiniciou? Isso será bem útil...

### Framework: fastify

Vamos criar nossa aplicação com o `fastfy framework`:

- Instale o fastify:
```
    $ npm install fastify
```

- Modifique o `server.ts` com nossa aplicação fastify:

```tsx
import fastify from 'fastify';

const app = fastify();

app.listen({ port: 3333 })
    .then( () => {
        console.log('HTTP server bixo piruleta funciona hehehe!')
    })
```

- Execute novamente:

```
    $ npm run dev
```

> Rapaz, isso tá `on` mesmo?
> Tá sim, acesse no navegador `localhost:3333`. e veja que o servidor agora retorna uma mensagem...

- Adicione o seguinte código no `server.ts`:

```tsx
    app.get('/hello', () => {
        return "Hello World!"
    })
```
> Estamos falando para nossa aplicação que a rota '/hello' deve executar um função que retorna uma string com valor "Hello World!"

### Vamos criar um container docker para nossa aplicação.

- Verifique se você tem o docker instalado. Caso não tenha, [instale-o](https://www.docker.com/get-started/).

```
    $ docker -v
```

- Na raiz do seu projeto, crie um arquivo chamado `docker-compose.yml` com o seguinte código:

```
    version: '3.7'

    services:
    postgres:
        image: bitnami/postgresql:latest
        ports:
        - '5432:5432'
        environment:
        - POSTGRES_USER=docker
        - POSTGRES_PASSWORD=password123
        - POSTGRES_DB=person
        volumes:
        - person_pg_data:/bitnami/postgresql

    volumes:
    person_pg_data:
```

> Esse arquivo vai basicamente criar um container docker para nossa aplicação, de forma que a acessar `localhost:5432`, essa porta é mapeada no container docker com porta 5432.

- No terminal, use o comando `docker compose up -d` para ele criar o container.

- Se tudo funcionou, verifique se o container está rodando: `docker ps`.

### Agora, precisamos conectar nossa aplicação ao banco de dados.

Para isso, instalaremos o `prisma` como ORM.

```
    $ npm install prisma -D
```

- Agora, o prisma precisa de uma inicialização:

```
    $ npx prisma init
```

Veja que foi criado um arquivo `.env` na raiz do projeto. Esse arquivo contém a URL do nosso banco de dados. Porém precisamos alterar essa URL com os dados corretos:

- Sua URL provavelmente se parece assim:
```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

- Devemos trocar `johndoe` para o usuário descrito no `docker-compose.yml` e `randompassword` para a senha deste mesmo arquivo. Além disso, troque `mydb` pelo banco de dados informado.

> no meu caso:

```dotenv
    DATABASE_URL="postgresql://docker:password123@localhost:5432/person?schema=public"
```

**Models**

Vamos aos models (schema). Observe que na raiz do seu projeto, surgiu uma pasta chamada `prisma` e dentro dela tem um arquivo `schema.prisma`. Este arquivo conterá a descrição de nossos schemas.

- Vamos criar um exemplo de model:

```prisma
    model pessoa {
        id String @id @default(uuid())
        nome String
        email String @unique
        senha String
        createdAt DateTime @default(now())
    }
```

> Estamos criando um schema para pessoa. O campo id é do tipo uuid (formato longo) e por padrão é unico '@id'.

- Agora vamos migrar esse schema para nosso banco de dados.

```
    $ npx prisma migrate dev
```

> Provavelmente lhe pediu pra digitar alguma coisa, por padrao, gosto de utilizar o que estou fazendo. Nesse caso, por exemplo, eu digitei 'migrate poll'.

- Observe que uma nova pasta foi criada nos seus arquivos: `prisma/migrations/`. Esse arquivo contém uma pasta com o timestamp (tempo em inteiro) da data da migração que você fez bem como seu comentário; e dentro dessa pasta tem o schema escrito em `sql`. Legal né?



- **Visualização:** O prisma oferece uma interface integrada que nos mostra, no navegador, as nossas models:

```
    $ npx prisma studio
```

---

## Rotas

Podemos escrever, em `server.ts` nossa primeira rota de teste POST:
```tsx
    app.post('/person', ( request ) => {
        console.log(request.body);
    })
```

> Basicamente, essa rota de POST vai acessar o body da requisição e à partir dele, podemos fazer operações no nosso banco de dados...

- Mas antes de fazermos POTS, devemos validar cada entrada. para assegurar que, por exemplo, o nome(String) de uma pessoa não seja enviado ao servidor como um número(Int) ou outro tipo de dado.

- Vamos utilizar o `zod`: biblioteca para validações.

```
    $ npm install zod
```

- Após instalado, modifique o server para que fique dessa forma:

```tsx
    import fastify from 'fastify';
    import { z } from 'zod';

    const app = fastify();

    app.listen({ port: 3333 })
        .then( () => {
            console.log('HTTP server running')
    });

    app.post('/person/', ( request ) => {
        const createPollBody = z.object({
            name: z.string()
        });

        const { name } = createPollBody.parse(request.body);

        console.log(name);
    })
```

**Enviar para o DB:**

Para que nossas rotas realmente salvem no nosso banco de dados, devemos conectar o prisma ao banco de dados. O script abaixo mostra como fazer isso:

```tsx
    import fastify from 'fastify';
    import { z } from 'zod';
    improt { PrismaClient } from '@prisma/client';

    const app = fastify();

    const prisma = new PrismaClient();

    app.listen({ port: 3333 })
        .then( () => {
            console.log('HTTP server running')
    });

    app.post('/person/', ( request ) => {
        const createPollBody = z.object({
            name: z.string()
        });

        const { name } = createPollBody.parse(request.body);

        console.log(name);
    })
```

---

### StatusCode e Validações:

- Mas precisamos de algo mais... Quando enviamos requisições à servidores, sempre retornam um `statusCode` e/ou dados...

```tsx
    // resto do codigo
    return response.status(statuscode).send({})
```
> Onde **statuscode** é um inteiro que representa o status da resposta enviada ao cliente. Conforme esses [status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) pré-definidos.

---

#### Nossos métodos ficarão dessa forma

**POST:** Cadastrar uma pessoa.

```tsx
    app.post('/person/', ( request ) => {

        const createPollBody = z.object({
            name: z.string().min(6).max(50),
            email: z.string().email(),
            senha: z.string().min(6).max(20)
        });

        const { name, email, senha } = createPollBody.parse(request.body);

        prisma.poll.create({
            data: {
                name: name,
                email: email,
                senha: senha
            }
        })
        .then( result => {
            return response.status(201).send({
                name: result.name,
                email: result.email
            })
        })
        .catch( err => {
            console.log(err);
            return response.status(500).send({
                message: `Internal Server error`,
                error: err
            })
        })
    })
```

**GET:** Buscar uma pessoa pelo ID.
```tsx
    app.get('/persons/:id', (request, response) => {
        const { id } = request.params; // Obtenha o ID da URL
        // Aqui você fará a consulta ao banco de dados utilizando o Prisma
        prisma.person.findUnique({
            where: {
                id: id // Busca pelo ID fornecido na URL
            }
        })
        .then(person => {
            // Se uma pessoa for encontrada, retorne-a
            if (person) {
                return response.status(200).send(person);
            } else {
                // Se não houver correspondência para o ID, retorne um erro 404
                return response.status(404).send({
                    message: 'Person not found'
                });
            }
        })
        .catch(err => {
            // Em caso de erro, retorne um erro interno do servidor
            console.error(err);
            return response.status(500).send({
                message: `Internal Server error`,
                error: err
            });
        });
    });
```


**DELETE:** Excluir uma pessoa por ID
```tsx
    app.delete('/persons/:id', (request, response) => {
        const { id } = request.params; // Obtenha o ID da URL
        // Aqui você fará a exclusão no banco de dados utilizando o Prisma
        prisma.person.delete({
            where: {
                id: id // Exclui a pessoa com o ID fornecido na URL
            }
        })
        .then(() => {
            // Se a exclusão for bem-sucedida, retorne uma mensagem indicando sucesso
            return response.status(200).send({
                message: 'Person deleted successfully'
            });
        })
        .catch(err => {
            // Em caso de erro, retorne um erro interno do servidor
            console.error(err);
            return response.status(500).send({
                message: `Internal Server error`,
                error: err
            });
        });
    });
```

**PATCH:** Alterar parcialmente os dados de uma pessoa
```tsx
    app.patch('/persons/:id', (request, response) => {
        const { id } = request.params; // Obtenha o ID da URL
        const { name, email, senha } = request.body; // Obtenha os novos dados da pessoa a partir do corpo da requisição
    // Aqui você fará a atualização parcial no banco de dados utilizando o Prisma
        prisma.person.update({
            where: {
                id: id // Atualiza a pessoa com o ID fornecido na URL
            },
            data: {
            name: name || undefined, // Se name não estiver presente no corpo da requisição, mantenha o valor existente
            email: email || undefined, // Se email não estiver presente no corpo da requisição, mantenha o valor existente
            senha: senha || undefined // Se senha não estiver presente no corpo da requisição, mantenha o valor existente
            }
        })
        .then(() => {
            // Se a atualização for bem-sucedida, retorne uma mensagem indicando sucesso
            return response.status(200).send({
                message: 'Person updated successfully'
            });
        })
        .catch(err => {
            // Em caso de erro, retorne um erro interno do servidor
            console.error(err);
            return response.status(500).send({
                message: `Internal Server error`,
                error: err
            });
        });
    });
```

