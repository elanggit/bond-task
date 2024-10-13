// file: PlayerContainer.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import PlayerContainer from './PlayerContainer';
import {
  PLAYER_API_HOST,
  FAVORITE_PLAYER_API,
} from '../../constants/apiUrls';

const mock = new MockAdapter(axios);

describe('PlayerContainer', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('renders loading state initially', () => {
    render(<PlayerContainer />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders players and favorite players', async () => {
    mock.onGet(PLAYER_API_HOST).reply(200, {
      players: [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          position: 'Forward',
          height: '6-5',
          weight: '200',
          team: { full_name: 'Team A' },
        },
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          position: 'Guard',
          height: '5-9',
          weight: '150',
          team: { full_name: 'Team B' },
        },
      ],

      nextCursor: 2,
    });

    mock.onGet(FAVORITE_PLAYER_API).reply(200, {
      players: [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          position: 'Forward',
          height: '6-5',
          weight: '200',
          team: { full_name: 'Team A' },
        },
      ],
    });

    render(<PlayerContainer />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Players')).toBeInTheDocument();
    });
  });

  test('handles search input and keydown', async () => {
    mock.onGet(PLAYER_API_HOST).reply(200, {
      players: [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          position: 'Forward',
          height: '6-5',
          weight: '200',
          team: { full_name: 'Team A' },
        },
      ],
      nextCursor: 2,
    });

    render(<PlayerContainer />);

    const searchInput = screen.getByPlaceholderText(
      'Search for players by first or last name'
    );
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles favorite player click', async () => {
    mock.onGet(PLAYER_API_HOST).reply(200, {
      players: [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          position: 'Forward',
          height: '6-5',
          weight: '200',
          team: { full_name: 'Team A' },
        },
      ],
      nextCursor: 2,
    });

    mock.onGet(FAVORITE_PLAYER_API).reply(200, {
      players: [],
    });

    mock.onPost(`${PLAYER_API_HOST}/addFavorite`).reply(200, {});

    render(<PlayerContainer />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const favoriteButton = screen.getByText('John Doe').closest('button');
    if (favoriteButton) {
      fireEvent.click(favoriteButton);
    }

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    await waitFor(() => {
      expect(mock.history.post[0].url).toBe(`${PLAYER_API_HOST}/addFavorite`);
    });
  });
});
