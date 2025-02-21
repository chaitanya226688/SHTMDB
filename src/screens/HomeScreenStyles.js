import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        marginTop: 20,
    },
    tabItem: {
        width: 140,
        height: 40,
        marginBottom: 4,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderBottomWidth: 2,
    },
    activeTab: {
        borderBottomColor: 'black',
        opacity: 1,
    },
    inactiveTab: {
        borderBottomColor: 'transparent',
        opacity: 0.5,
    },
    tabText: {
        fontWeight: '600',
        fontSize: 16,
    },
    movieItemContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        height: 160,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    movieImageWrapper: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
    movieBackgroundWrapper: { width: 100, height: '100%', borderWidth: 1.5, borderColor: 'white', borderRadius: 10, overflow: 'hidden' },
    movieBackgroundTopWrapper: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
    movieImageContainer: {
        width: 100,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'white',
    },
    movieImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ddd',
    },
    movieDetails: {
        marginLeft: 10,
        flex: 1,
        paddingVertical: 4
    },
    movieTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
        maxWidth: '90%',
    },
    movieReleaseDate: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    movieRatingContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#FFD700',
        borderRadius: 6,
        alignSelf: 'baseline',
        marginTop: 4,
    },
    movieRatingText: {
        fontSize: 10,
        fontWeight: '800',
    },
    loadingScreen: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default styles;
