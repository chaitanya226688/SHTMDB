import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AppConstants from '../src/constants/AppConstants';
import { AuthProvider } from '../src/context/AuthContext';
import HomeScreen from '../src/screens/HomeScreen';

jest.mock('../src/constants/AppConstants', () => ({
    FETCH_BASE_URL: 'https://api.themoviedb.org/3/movie/',
    FETCH_API_KEY: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTAyODFkZjYwMzU0ZjUzZTNhNzIwNmU1NDM5MTg3MiIsIm5iZiI6MTc0MDExMjA1My40Mywic3ViIjoiNjdiODAwYjU0NDRkZDdmY2VmYmE0NzZmIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.A00TRpe579X3liSSOW_P1DQmOCecqWuK3iuk_kKJ3c4',
    BASE_IMAGE_PATH: 'https://image.tmdb.org/t/p/w500'
}));

jest.mock('../src/screens/HomeScreen', () => ({
    ...jest.requireActual('../screens/HomeScreen'),
    FetchMovies: jest.fn()
}));

describe('HomeScreen', () => {
    test('renders correctly', () => {
        const { getByText } = render(
            <AuthProvider>
                <HomeScreen />
            </AuthProvider>
        );
        expect(getByText('Now Playing')).toBeTruthy();
        expect(getByText('Popular')).toBeTruthy();
        expect(getByText('Top Rated')).toBeTruthy();
        expect(getByText('Upcoming')).toBeTruthy();
    });

    test('fetches movies data', async () => {
        FetchMovies.mockResolvedValue({ results: [{ id: 1, title: 'Test Movie', release_date: '2022-01-01', vote_average: 8.5, poster_path: '/test.jpg' }] });

        const { getByText, findByText } = render(
            <AuthProvider>
                <HomeScreen />
            </AuthProvider>
        );

        expect(getByText('Loading...')).toBeTruthy();
        await waitFor(() => expect(findByText('Test Movie')).toBeTruthy());
    });

    test('changes tabs when clicked', () => {
        const { getByText } = render(
            <AuthProvider>
                <HomeScreen />
            </AuthProvider>
        );
        const popularTab = getByText('Popular');
        fireEvent.press(popularTab);
        expect(popularTab).toBeTruthy();
    });
});
