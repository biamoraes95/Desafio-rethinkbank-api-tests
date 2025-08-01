function generateUser() {
  const timestamp = Date.now();
  return {
    cpf: `${Math.floor(10000000000 + Math.random() * 89999999999)}`,
    full_name: 'Ana Moraes',
    email: `ana.moraes+${timestamp}@example.com`,
    password: 'Senha@123',
    confirmPassword: 'Senha@123'
  };
}

module.exports = { generateUser };
