const api = require('../helpers/apiClient');
const { generateUser } = require('../helpers/userUtils');

describe('Exclusão de conta', () => {
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

  it('deve excluir a conta com sucesso', async () => {
    const response = await api
      .delete('/account')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: user.password });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Conta marcada como deletada/i);
  });

it('não deve permitir login após exclusão', async () => {
  const user = generateUser();
  const cadastro = await api.post('/cadastro').send(user);
  await api.get(`/confirm-email?token=${cadastro.body.confirmToken}`);

  const login = await api.post('/login').send({
    email: user.email,
    password: user.password
  });

  const token = login.body.token;

  await api
    .delete('/account')
    .set('Authorization', `Bearer ${token}`)
    .send({ password: user.password });

  const response = await api.post('/login').send({
    email: user.email,
    password: user.password
  });

  console.log('🧪 Login após exclusão:', response.status, response.body);

  expect(response.status).not.toBe(200); // Falhar se ainda retornar sucesso
  expect(response.body?.error || response.body?.message || '').toMatch(/não encontrado|inválido|inativo/i);
});
});
