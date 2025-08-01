const api = require('../helpers/apiClient');
const { generateUser } = require('../helpers/userUtils');

describe('Operações da caixinha', () => {
  let user;
  let token;

  beforeAll(async () => {
    user = generateUser();
    const cadastro = await api.post('/cadastro').send(user);
    await api.get(`/confirm-email?token=${cadastro.body.confirmToken}`);
    const login = await api.post('/login').send({
      email: user.email,
      password: user.password,
    });
    token = login.body.token;
  });

  it('deve depositar e consultar extrato da caixinha', async () => {
    const depositResponse = await api
      .post('/caixinha/deposit')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 30 });

    expect(depositResponse.status).toBe(200);
    expect(depositResponse.body.message).toMatch(/Depósito.*realizado/i);

    const extratoResponse = await api
      .get('/caixinha/extrato')
      .set('Authorization', `Bearer ${token}`);

    expect(extratoResponse.status).toBe(200);
    expect(Array.isArray(extratoResponse.body)).toBe(true);
    expect(extratoResponse.body[0].amount).toBe(30);
    expect(extratoResponse.body[0].type).toBe('deposit');
  });
});