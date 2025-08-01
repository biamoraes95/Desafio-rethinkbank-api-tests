const api = require('../helpers/apiClient');
const { generateUser } = require('../helpers/userUtils');

describe('Login do usuário', () => {
  let newUser;
  let confirmToken;

  beforeAll(async () => {
    // 1. Cadastrar usuário
    newUser = generateUser();
    const cadastro = await api.post('/cadastro').send(newUser);
    confirmToken = cadastro.body.confirmToken;

    // 2. Confirmar e-mail
    await api.get(`/confirm-email?token=${confirmToken}`);
  });

  it('deve realizar login com sucesso', async () => {
    const response = await api.post('/login').send({
      email: newUser.email,
      password: newUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('não deve permitir login com senha incorreta', async () => {
    const response = await api.post('/login').send({
      email: newUser.email,
      password: 'SenhaErrada@123',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Credenciais inválidas');
  });

  it('não deve permitir login com e-mail não cadastrado', async () => {
    const response = await api.post('/login').send({
      email: 'naoexiste@example.com',
      password: 'Senha@123',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Credenciais inválidas');
  });

  it('não deve permitir login antes da confirmação de e-mail', async () => {
    const tempUser = generateUser();

    // Apenas cadastro, sem confirmação
    await api.post('/cadastro').send(tempUser);

    const response = await api.post('/login').send({
      email: tempUser.email,
      password: tempUser.password,
    });
    // console.log(response.body); // pode remover após validar

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('E-mail não confirmado');
  });
});
