# Rethink Bank API - Testes Automatizados

## Sobre
Este repositório contém testes end-to-end automatizados para a API do Rethink Bank, cobrindo toda a jornada do usuário: cadastro, confirmação de e-mail, login, envio de pontos, uso da caixinha, consulta de saldo e exclusão de conta.

## Tecnologias utilizadas

- **Node.js** – Ambiente de execução JavaScript para rodar os testes.
- **Jest** – Framework de testes para JavaScript.
- **Supertest** – Biblioteca para testar APIs HTTP.
- **dotenv** – Carregamento de variáveis de ambiente.
- **faker-br** – Geração de dados fictícios brasileiros para os testes.

## Como rodar os testes

1. Instale as dependências:
```sh
   npm install
   ```
2. Execute todos os testes:
   ```sh
   npm test
   ```

## Jornada do usuário testada

- Cadastro de usuário
- Confirmação de e-mail
- Login
- Envio de pontos a outro usuário
- Depósito na caixinha
- Consulta de saldo geral
- Exclusão de conta

## Evidências de execução

```
PASS  tests/pontos.test.js
PASS  tests/login.test.js
PASS  tests/cadastro.test.js
PASS  tests/caixinha.test.js
PASS  tests/helloWorld.test.js
FAIL  tests/saldo.test.js
FAIL  tests/excluirConta.test.js
Test Suites: 2 failed, 5 passed, 7 total
Tests:       2 failed, 13 passed, 15 total
```

## Respostas do desafio

### a) Há bugs? Se sim, quais são e quais os cenários esperados?

**Sim, foram encontrados bugs:**

1. **Depósito na caixinha não desconta do saldo normal**

- **Esperado:** após depositar 30 pontos, saldo normal = 70 e caixinha = 30.
- **Observado:** saldo normal permanece 100 e caixinha permanece 0.

2. **Login permitido após exclusão de conta**

- **Esperado:** usuário não deveria conseguir logar após excluir a conta.
- **Observado:** login retorna status 200 e um novo token normalmente.

### b) Se houver bugs, classifique-os em nível de criticidade
- **Bug 1 (Saldo):** Média/Alta. Pode causar confusão e uso indevido do saldo.
- **Bug 2 (Exclusão de conta):** Alta. Falha de segurança, pois impede a exclusão efetiva da conta.

### c) Diante do cenário, o sistema está pronto para subir em produção?

**Não.**
Os bugs encontrados afetam diretamente a experiência e a segurança do usuário.
É necessário corrigir esses pontos antes de liberar para produção.

## Observações

- Os testes automatizados cobrem toda a jornada do usuário, incluindo cenários de sucesso e erro.
- Caso a API seja corrigida, basta rodar novamente os testes para validar o comportamento esperado.