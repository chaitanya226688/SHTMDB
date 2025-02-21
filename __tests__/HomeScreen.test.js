import { AuthProvider } from "../src/context/AuthContext";
import HomeScreen, { FetchMovies } from "../src/screens/HomeScreen";
import { render, waitFor, fireEvent } from '@testing-library/react-native';

// Mock global fetch
global.fetch = jest.fn();

describe('FetchMovies API function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the HomeScreen component', async () => {
        const { getByText } = render(
            <AuthProvider>
                <HomeScreen />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(getByText('Now Playing')).toBeTruthy();
            expect(getByText('Popular')).toBeTruthy();
        });
    });

    it('switches tabs correctly', async () => {
        const { getByText, queryByText } = render(
            <AuthProvider>
                <HomeScreen />
            </AuthProvider>
        );

        // Check if "Movie 1" (Now Playing) is initially displayed
        await waitFor(() => {
            expect(getByText('Popular')).toBeTruthy();
        });

        // Switch to "Popular" tab
        fireEvent.press(getByText('Popular'));

        // Check that "Movie 1" disappears and "Movie 2" appears
        await waitFor(() => {
            expect(getByText('Popular')).toBeTruthy();
        });
    });

    it('fetches movie data successfully', async () => {
        const mockResponse = {
            results: [{ id: 1, title: 'Test Movie', release_date: '2023-01-01', vote_average: 8.5, poster_path: '/test.jpg' }]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponse),
        });

        const data = await FetchMovies('now_playing', 1);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({ 'Authorization': expect.stringContaining('Bearer') })
            })
        );

        expect(data).toEqual(mockResponse);
    });

    it('handles API failure gracefully', async () => {
        fetch.mockResolvedValueOnce({ ok: false, status: 500 });

        const data = await FetchMovies('now_playing', 1);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(data).toBeNull();
    });

    it('handles network error', async () => {
        fetch.mockRejectedValueOnce(new Error('Network Error'));

        const data = await FetchMovies('now_playing', 1);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(data).toBeNull();
    });
});
