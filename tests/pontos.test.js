const api = require('../helpers/apiClient');
const { generateUser } = require('../helpers/userUtils');

describe('Envio de pontos', () => {
  jest.setTimeout(15000); // 15 segundos

  let sender;
  let recipient;
  let senderToken;

  beforeAll(async () => {
    sender = generateUser();
    const res1 = await api.post('/cadastro').send(sender);
    await api.get(`/confirm-email?token=${res1.body.confirmToken}`);
    const login = await api.post('/login').send({
      email: sender.email,
      password: sender.password,
    });
    senderToken = login.body.token;

    recipient = generateUser();
    const res2 = await api.post('/cadastro').send(recipient);
    await api.get(`/confirm-email?token=${res2.body.confirmToken}`);
  });

  it('deve enviar pontos com sucesso', async () => {
    const response = await api
      .post('/points/send')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        recipientCpf: recipient.cpf,
        amount: 50,
      });

    console.log(response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Pontos enviados com sucesso.');
  });

  it('não deve permitir envio para CPF não cadastrado', async () => {
    const response = await api
      .post('/points/send')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        recipientCpf: '11122233344', // válido mas não cadastrado
        amount: 10,
      });

    console.log(response.status, response.body);
    expect(response.status).toBe(404); // ou ajuste conforme resposta real
    expect(response.body.message || response.body.error).toMatch(/não encontrado/i);
  });

  it('não deve permitir envio sem saldo suficiente', async () => {
    const response = await api
      .post('/points/send')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        recipientCpf: recipient.cpf,
        amount: 9999, // acima dos 100 iniciais
      });

    console.log(response.status, response.body);
    expect(response.status).toBe(400);
    expect(response.body.message || response.body.error).toMatch(/saldo.*insuficiente/i);
  });
});
