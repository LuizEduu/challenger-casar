# Projeto NestJS com Prisma, Docker, Postgres e Vitest

Este projeto é uma aplicação backend construída com **NestJS**, utilizando **Prisma** como ORM para interagir com o banco de dados **PostgreSQL**, e **Docker** para containerização e infraestrutura. A aplicação segue o padrão da **Clean Architecture**, proporcionando uma estrutura flexível e de fácil manutenção.

## Modelagem DER e proposta de arquitetura

![Modelo DER](./assets/der_model.png)
![System design](./assets/system_design.png)

No system design eu pensei em uma arquitetura inicial e implementável, porém alguns pontos a considerar

- autenticação: caso fosse exigido autenticação no projeto eu utilizaria um serviço como keycloack para cuidar dessa parte.

- cache: Inicialmente pensei em utilizar cache em alguns pontos com redis para melhorar a performace da aplicação, porém pensando mais a fundo
  fiquei com duvidas onde implementar esse cache e como, isso pode ser um ponto a ser discutido na apresentação do projeto e está aberto a melhorias.

## Tecnologias

- **NestJS**: Framework para construção de aplicações Node.js.
- **Prisma**: ORM para Node.js e TypeScript, utilizado para gerenciar o banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Para containerização da aplicação e infraestrutura.
- **Vitest**: Framework de testes para Node.js.
- **Nginx**: Servindo como load balancer e proxy reverso.
- **CUID**: utilizei CUID para geraçãos dos ids dos registros, pois ele foi projeto para baixo risco de colisão e principalmente para escalabilidade horizontal
- **PNPM**: utilizo o pnpm como gerenciador de pacotes por ser mais rápido que os demais

- Utilizei a versão mais recente do Nodejs, recomendo executar na versão 22 caso queira executar o projeto localmente

## Arquitetura

A arquitetura escolhida é a **Clean Architecture**, que visa desacoplar as diferentes camadas do sistema para proporcionar maior flexibilidade e facilidade de manutenção. Com isso, optei por modelar a aplicação de acordo com as intenções dos usuários, utilizando **use cases** para expor essas intenções de maneira clara e direta.

### Decisões Arquiteturais

- **Clean Architecture**: Utilizei esse padrão para ter maior controle sobre a organização do código e liberdade para implementar os casos de uso de maneira isolada, sem depender diretamente de detalhes de implementação como banco de dados ou frameworks.

- **PostgreSQL e Prisma**: optei por essas tecnologias devido ao nosso maior domínio sobre elas, mas reconhecemos que para um sistema de grande escala, pode não ser a melhor escolha para gerenciar todas as funcionalidades. Em uma versão mais robusta do sistema, outras soluções de banco e até mesmo realizar as consultas SQL puras/na mão poderiam ser consideradas.
  Um dos problemas que tive com o prisma foi justamente para realizar uma consulta mais complexa com joins entre outras tabelas, tive problemas e optei por separar em mais de uma consulta, na minha opinião é um ponto negativo, tanto para manutenabilidade e principalmente para performance

- **Docker**: A infraestrutura é gerida por meio de Docker, com o Nginx atuando como **load balancer** e **proxy reverso**, distribuindo as requisições para duas instâncias da aplicação Node. Essa abordagem facilita a escalabilidade e a gestão do sistema em produção.

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```bash
# Ambiente
NODE_ENV=dev

# Banco de Dados
DATABASE_URL="postgresql://docker:docker@postgres:5432/thoughts?schema=public"

# Porta
PORT=3000
```

## Como executar a aplicação

- **É importante realizar o passo anterior e criar o arquivo .env na raiz do projeto antes de seguir**

### Subir a infraestrutura com Docker Compose

docker compose up -d

## Para executar utilizando os containers docker (Recomendado)

- docker exec -it nodejs1 ou nodejs2 bash para acessar o container node

### Rodar o seed com dados de usuários para testes

pnpm run seed

### Executar a aplicação em modo de desenvolvimento

pnpm run start:dev

### Executar os testes unitários

pnpm run test

### Executar os testes de integração

pnpm run test:e2e

## Para executar localmente

- Para executar a aplicação localmente é necessário realizar 2 passos

- mudar o valor na variável de ambiente no **.env** DATABASE_URL para **DATABASE_URL="postgresql://docker:docker@localhost:5432/thoughts?schema=public"**
  para a aplicação conseguir se conectar no banco.
- no arquivo **health-check.controller.e2e-spec.ts** é necessário mudar a url da chamada para localhost:8080 pois o teste está configurado para se conectar no nginx pelo container node.

### instalar pnpm

npm install -g pnpm

### instalar os pacotes da aplicação

pnpm i

### Rodar o seed com dados de usuários para testes

pnpm run seed

### Executar a aplicação em modo de desenvolvimento

pnpm run start:dev

### Executar os testes unitários

pnpm run test

- Aqui nos testes unitários dos repositorios optei por utilizar também o postgres para ter uma fidelidade maior com o ambiente produtivo
  temos também a possibilidade de migrar para um sqlite e otimizar um pouco mais essas execuções, não dependendo do postgres ou docker para isso

### Executar os testes de integração

pnpm run test:e2e

## executar as chamadas HTTP

na raiz do projeto tem um arquivo **api.http** que pode ser usado para executar as chamadas basta utilizar o vscode e instalar a extensão
REST Client https://marketplace.visualstudio.com/items?itemName=humao.rest-client

## Sessão critica

Aqui deixo os pontos de melhoria que na minha visão para uma aplicação real seriam fundamentais para boa escabalidade, resiliência e performance

- Utilizar um banco de dados baseado em grafos assim em um ambiente mais complexo e produtivo eu tenho maior controle
  com esses relacionamentos entre usuários, postagens, comentários e conforme isso escalar vai crescer exponencialmente

- Alterar a arquitetura de rest para graphql, na minha opinião é um ótimo caso de uso para a tecnologia, diminuindo a quantidade de requisições necessárias e também problemas de Apis Rest como **Overfetching** e **Underfetching**

- Microsserviços (consigo separar em contextos e em partes menores) facilitando a manutenção e escalabilidade de partes especifícas do ecossistema

- Serviços de mensageria para comunicação entre esses microsserviços (Kafka ou RabbitMQ por exemplo) junto com uma arquitetura baseada em eventos

- Service mesh ( para cuidar de health checks, cuidar da comunicação entre os MS, gerenciando o tráfego por exemplo)

- Analisar e aplicar cache em mais pontos da aplicação ex cache das sessões dos usuários

- Utilizar Kubernetes para gerenciar os containers da aplicação, garantindo maior escabilidade e resiliencia

- Caso queira manter o banco relacional utilizar particionamentos/sharding para lidar com grande volume de dados

- CND para diminuir a latencia e oferecer o conteúdo com mais rapidez aos usuários, se mantendo mais próximo deles

- Escalabilidade horizontal, utilizando KC8 para gerenciar os pods, criando ou desturindo instancias dos meus servers e aqui entra a vantagem de CUID, pois ele foi originalmente já pensado em escalabilidade horizontal

- Monitoramento e logs com serviços Prometheus, Grafana. Garantindo uma boa observabilidade dos pontos de melhoria do serviço

- Logs centralizados (por exemplo, ELK stack — Elasticsearch, Logstash, Kibana) para monitorar logs de todos os serviços

- Testes de carga

- Utilizar IAC(Infra as Code) com produtos como terraform ou ansible para gerenciamento de toda essa infra complexa

- Testes de segurança para mitigar o máximo possível de possíveis pontos de falha e alvo de ataques

## Pontos de falha

Na minha opinião, o que falharia primeiro seria o feed inicial da plataforma, pois envolve postagens, comentários e dados do usuário.
Cada postagem tem comentários, cada comentários em uma solução mais real tem respostas, retwitters, imagens e vídeos.
Dessa forma sem uma escalabilidade e infra de acordo seria um ponto de falha em altos acessos.
