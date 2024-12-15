# Projeto NestJS com Prisma, Docker, Postgres e Vitest

Este projeto é uma aplicação backend construída com **NestJS**, utilizando **Prisma** como ORM para interagir com o banco de dados **PostgreSQL**, e **Docker** para containerização e infraestrutura. A aplicação segue o padrão da **Clean Architecture**, proporcionando uma estrutura flexível e de fácil manutenção.

## Modelagem DER e proposta de arquitetura

![Modelo DER](./assets/der_model.png)
![System design](./assets/system_design.png)

No system design eu pensei em uma arquitetura inicial e implementável, porém alguns pontos a considerar

- autenticação: caso fosse exigido autenticação no projeto eu utilizaria um serviço como keycloack para cuidar dessa parte.

- cache: Inicialmente pensei em utilizar cache em alguns pontos com redis para melhorar a peformace da aplicação, porém pensando mais a fundo
  fiquei com duvidas onde implementar esse cache e como, isso pode ser um ponto a ser discutido na apresentação do projeto e está aberto a melhorias.

## Tecnologias

- **NestJS**: Framework para construção de aplicações Node.js.
- **Prisma**: ORM para Node.js e TypeScript, utilizado para gerenciar o banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Para containerização da aplicação e infraestrutura.
- **Vitest**: Framework de testes para Node.js.
- **Nginx**: Servindo como load balancer e proxy reverso.
- **CUID**: utilizei CUID para geraçãos dos ids dos registros pois ele foi projeto principalmente para escalabilidade horizontal
- **PNPM**: utilizo o pnpm como gerenciador de pacotes por ser mais rápido que os demais

## Arquitetura

A arquitetura escolhida é a **Clean Architecture**, que visa desacoplar as diferentes camadas do sistema para proporcionar maior flexibilidade e facilidade de manutenção. Com isso, optamos por modelar a aplicação de acordo com as intenções dos usuários, utilizando **use cases** para expor essas intenções de maneira clara e direta.

### Decisões Arquiteturais

- **Clean Architecture**: Utilizamos esse padrão para ter maior controle sobre a organização do código e liberdade para implementar os casos de uso de maneira isolada, sem depender diretamente de detalhes de implementação como banco de dados ou frameworks.
- **PostgreSQL e Prisma**: Optamos por essas tecnologias devido ao nosso maior domínio sobre elas, mas reconhecemos que para um sistema de grande escala, pode não ser a melhor escolha para gerenciar todas as funcionalidades. Em uma versão mais robusta do sistema, outras soluções de banco de dados poderiam ser consideradas.
- **Docker**: A infraestrutura é gerida por meio de Docker, com o Nginx atuando como **load balancer** e **proxy reverso**, distribuindo as requisições para duas instâncias da aplicação Node. Essa abordagem facilita a escalabilidade e a gestão do sistema em produção.

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```bash
# Ambiente
NODE_ENV=dev

# Banco de Dados
DATABASE_URL="postgresql://docker:docker@localhost:5432/thoughts?schema=public"

# Porta
PORT=3000
```

## Como executar a aplicação

### instalar pnpm

npm install -g pnpm

### instalar os pacotes da aplicação

pnpm i

### Subir a infraestrutura com Docker Compose

docker compose up -d

### Executar a aplicação em modo de desenvolvimento

pnpm run start:dev

### Rodar o seed com dados de usuários para testes

pnpm run seed

### Executar os testes unitários

pnpm run test

### Executar os testes de integração

pnpm run test:e2e

## Sessão critica

Aqui deixo os pontos de melhoria que na minha visão para uma aplicação real seria importante e fundamental para boa escabalidade e peformance
Propostas de melhorias para oferecer maior escabilidade e resiliencia

- Utilizar um banco de dados baseado em grafos assim em um ambiente mais complexo e produtivo eu tenho maior controle
  com esses relacionamentos entre usuários, postagens, comentários e conforme isso escalar vai crescer exponencialmente

- Alterar a arquitetura de rest para graphql, na minha opinião é um ótimo caso de uso para a tecnologia, diminuindo a quantidade de requisições necessárias

- Microsserviços (consigo separar em contextos e em partes menores)

- Serviços de mensageria para comunicação entre esses microsserviços (Kafka ou RabbitMQ por exemplo) event driven arch

- Service mesh ( para cuidar de health checks, cuidar da comunicação entre os MS, gerenciando o tráfego por exemplo)

- Analisar e caso possível aplicar cache em mais pontos da aplicação ex cache das sessões dos usuários

- Utilizar Kubernetes para gerenciar os containers da aplicação, garantindo maior escabilidade e resiliencia

- Caso queira manter o banco relacional utilizar particionamentos/sharding para lidar com grande volume de dados

- CND para diminuir a latencia e oferecer o conteúdo com mais rapidez aos usuários, se mantendo mais próximo deles

- Escalabilidade horizontal, utilizando KC8 para gerenciar os pods, criando ou desturindo instancias dos meus servers

- Monitoramento e logs com serviços Prometheus, Grafana. Garantindo uma boa observabilidade dos pontos de melhoria do serviço

- Logs centralizados (por exemplo, ELK stack — Elasticsearch, Logstash, Kibana) para monitorar logs de todos os serviços

- Testes de carga

- Utilizar IAC(Infra as Code) com terraform para gerenciamento de toda essa infra complexa

## Pontos de falha

Na minha opinião, o que falharia primeiro seria o feed da plataforma, pois envolve postagens, comentários e dados do usuário.
Cada postagem tem comentários, cada comentários em uma solução mais real tem respostas, retwitters, imagens e vídeos.
Dessa forma sem uma escalabilidade e infra de acordo seria um ponto de falha em altos acessos.
