const api = require('../helpers/apiClient');
const generateUser = require('../helpers/generateUser');

describe('Cadastro e confirmação de e-mail', () => {
  let newUser;

  beforeEach(() => {
    newUser = generateUser(); // Garante usuário novo por teste
  });

  it('deve cadastrar com sucesso um novo usuário', async () => {
    const response = await api.post('/cadastro').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('confirmToken');
  });

  it('deve confirmar o e-mail com sucesso após o cadastro', async () => {
    const cadastroResponse = await api.post('/cadastro').send(newUser);
    const confirmToken = cadastroResponse.body.confirmToken;

    const confirmResponse = await api.get(`/confirm-email?token=${confirmToken}`);
    
    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.text).toContain('E-mail confirmado com sucesso');
  });
});
