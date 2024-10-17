const { Pool } = require('pg');
const { initializeDatabase } = require('../../src/config/database');

jest.mock('pg', () => {
  const mClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  const mPool = {
    connect: jest.fn().mockResolvedValue(mClient),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Database Configuration', () => {
  let pool;
  let client;

  beforeEach(() => {
    pool = new Pool();
    client = pool.connect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the database successfully', async () => {
    const mockClient = await client;
    mockClient.query.mockResolvedValueOnce()  // BEGIN
                     .mockResolvedValueOnce()  // CREATE TABLE
                     .mockResolvedValueOnce(); // COMMIT

    await initializeDatabase();

    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS snippets'));
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should rollback and throw error on database initialization failure', async () => {
    const mockClient = await client;
    const error = new Error('Database error');
    mockClient.query.mockRejectedValueOnce(error)  // BEGIN
                     .mockResolvedValueOnce();     // ROLLBACK

    await expect(initializeDatabase()).rejects.toThrow('Database error');

    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(mockClient.release).toHaveBeenCalled();
  });
});