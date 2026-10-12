import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../../src/app/routes';
import { getHealth } from '../../src/services/api/health.api';

vi.mock('../../src/services/api/health.api', () => ({
  getHealth: vi.fn(),
}));

const getHealthMock = vi.mocked(getHealth);

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('AppRoutes', () => {
  beforeEach(() => {
    getHealthMock.mockReset();
    getHealthMock.mockReturnValue(new Promise(() => undefined));
  });

  it('renders the home page at /', () => {
    renderAt('/');

    expect(
      screen.getByRole('heading', { name: 'Production-Ready Full Stack Foundation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders the about page at /about', () => {
    renderAt('/about');

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders the not-found page for unknown paths', () => {
    renderAt('/does-not-exist');

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
  });
});
