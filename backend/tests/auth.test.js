const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints & Validation Tests', () => {
  beforeAll(async () => {
    // Await database connection attempt / fallback initialization
    await new Promise(r => setTimeout(r, 2500));
  }, 10000);

  it('GET /api/health should return 200 OK with system observability metrics', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('database');
    expect(res.body).toHaveProperty('aiProvider');
  });

  it('POST /api/auth/register should fail on missing email or short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'invalid-email',
      password: '123'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/forgot-password should accept valid email requests', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({
      email: 'executive.test@aiemailassistant.com'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
