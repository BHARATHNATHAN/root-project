import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from '../../src/pages/home/HomePage';
import { getHealth } from '../../src/services/api/health.api';

vi.mock('../../src/services/api/health.api', () => ({
  getHealth: vi.fn(),
}));

const getHealthMock = vi.mocked(getHealth);

describe('HomePage', () => {
  beforeEach(() => {
    getHealthMock.mockReset();
  });

  it('renders the application title', () => {
    getHealthMock.mockReturnValue(new Promise(() => undefined));
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: 'Production-Ready Full Stack Foundation' }),
    ).toBeInTheDocument();
  });

  it('shows a loading state', () => {
    getHealthMock.mockReturnValue(new Promise(() => undefined));
    render(<HomePage />);

    expect(screen.getByText('Checking backend health…')).toBeInTheDocument();
  });

  it('shows a successful health check', async () => {
    getHealthMock.mockResolvedValue({
      status: 'ok',
      service: 'backend',
      database: 'connected',
      timestamp: '2026-09-25T12:00:00.000Z',
    });

    render(<HomePage />);

    expect(await screen.findByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('2026-09-25T12:00:00.000Z')).toBeInTheDocument();
  });

  it('shows a failed health check', async () => {
    getHealthMock.mockRejectedValue(new Error('Unable to reach the server'));

    render(<HomePage />);

    expect(
      await screen.findByText('Health check failed. Unable to reach the server'),
    ).toBeInTheDocument();
  });
});
