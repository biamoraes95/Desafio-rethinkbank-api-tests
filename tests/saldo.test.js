const api = require('../helpers/apiClient');
const { generateUser } = require('../helpers/userUtils');

describe('Consulta de saldo', () => {
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

  it('deve retornar o saldo inicial do usuário', async () => {
    const response = await api
      .get('/points/saldo')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.normal_balance).toBe(100);
    expect(response.body.piggy_bank_balance).toBe(0);
  });

  it('deve atualizar o saldo da caixinha após depósito', async () => {
    const deposit = await api
      .post('/caixinha/deposit')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 30 });

    expect(deposit.status).toBe(200);

    const saldoResponse = await api
      .get('/points/saldo')
      .set('Authorization', `Bearer ${token}`);

    console.log(saldoResponse.body);

    expect(saldoResponse.status).toBe(200);
    expect(saldoResponse.body.normal_balance).toBe(70); // 100 - 30
    expect(saldoResponse.body.piggy_bank_balance).toBe(30);
  });
});
