const faker = require('faker-br');

module.exports = function generateUser() {
  const cpf = faker.br.cpf();
  const full_name = faker.name.firstName() + ' ' + faker.name.lastName();
  const email = faker.internet.email();
  const password = 'Senha@123';

  return {
    cpf,
    full_name,
    email,
    password,
    confirmPassword: password,
  };
};