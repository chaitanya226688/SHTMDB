import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import AppConstants from '../constants/AppConstants';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import styles from './HomeScreenStyles';
import { useNavigation } from '@react-navigation/native';

const tabsMap = {
    "now_playing": "Now Playing", "popular": "Popular", "top_rated": "Top Rated", "upcoming": "Upcoming"
};

const HomeScreen = () => {
    return (
        <AuthProvider>
            <HomeScreenItem />
        </AuthProvider>
    );
};

const HomeScreenItem = () => {
    const tabsList = Object.keys(tabsMap);
    const [isLoading, setIsLoading] = useState(false);
    const { width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState(tabsList[0]);
    const tabRef = useRef();
    const tabViewRef = useRef();
    const { tabsData, setTabsData } = useContext(AuthContext);

    useEffect(() => {
        FetchAllMovies();
    }, []);

    const FetchAllMovies = () => {
        setIsLoading(true);
        Promise.all(tabsList.map(tab => FetchMovies(tab))).then(response => {
            const tabsDataItem = {};
            response.forEach((data, index) => {
                tabsDataItem[tabsList[index]] = data;
            });
            setTabsData({ ...tabsDataItem });
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
            console.error(err);
        });
    };

    useEffect(() => {
        const tabIndex = Math.max(0, tabsList.indexOf(activeTab) - 1);
        tabRef?.current?.scrollToIndex({ animated: true, index: tabIndex });
    }, [activeTab]);

    const setTabIndex = (tabName) => {
        const tabIndex = tabsList.indexOf(tabName);
        tabViewRef?.current?.scrollToIndex({ animated: true, index: tabIndex });
    };

    return (
        <SafeAreaView>
            <FlatList
                ref={tabRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabContainer}
                data={tabsList}
                renderItem={({ item }) => (
                    <TabItem item={tabsMap[item]} isActive={item === activeTab} onPress={() => setTabIndex(item)} />
                )}
            />
            {tabsData && (
                <FlatList
                    ref={tabViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    data={tabsList}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => tabsData[item] ? <TabViewPage name={item} item={tabsData[item]} /> : <EmptyTabItem />}
                    onMomentumScrollEnd={(event) => {
                        setActiveTab(tabsList[Math.round(event.nativeEvent.contentOffset.x / width)]);
                    }}
                />
            )}
            {isLoading && <LoadingScreen />}
        </SafeAreaView>
    );
};

export const FetchMovies = async (tabName, pageNumber = 1) => {
    try {
        const response = await fetch(`${AppConstants.FETCH_BASE_URL}${tabName}?language=en-US&page=${pageNumber}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${AppConstants.FETCH_API_KEY}` },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        // console.error('Error fetching movies:', error);
        return null;
    }
};

const TabItem = ({ item, isActive, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={[styles.tabItem, isActive ? styles.activeTab : styles.inactiveTab]}>
            <Text style={styles.tabText}>{item}</Text>
        </View>
    </TouchableOpacity>
);

const TabViewPage = React.memo(({ name, item }) => {
    const { width } = useWindowDimensions();
    const { tabsData, setTabsData } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation()

    const FetchMoviesList = (name, page) => {
        if (page === 1) setRefreshing(true);
        FetchMovies(name, page).then(response => {
            if (response) {
                tabsData[name].results = page === 1 ? response.results : [...tabsData[name].results, ...response.results];
                tabsData[name].page = page;
                setTabsData({ ...tabsData });
            }
            setRefreshing(false);
        }).catch(() => setRefreshing(false));
    };

    const onMoviePress = (item) => {
        navigation.navigate('MovieScreen', { dataItem: item })
    }

    return (
        <View style={{ width }}>
            <FlatList
                data={item.results}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => <MovieItem item={item} onPress={() => onMoviePress(item)} />}
                refreshing={refreshing}
                onRefresh={() => FetchMoviesList(name, 1)}
                onEndReached={() => FetchMoviesList(name, item.page + 1)}
                onEndReachedThreshold={0.5}
                getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
                ListFooterComponent={<ListFooterComponent />}
            />
        </View>
    );
});

const ListFooterComponent = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator style={{ marginTop: 20, marginBottom: 100 }} />
    </View>
);

const MovieItem = React.memo(({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} >
        <View style={styles.movieItemContainer}>
            <View style={styles.movieImageWrapper} >
                <Image style={styles.movieImage} source={{ uri: AppConstants.BASE_IMAGE_PATH + item.backdrop_path }} />
                <View style={styles.movieBackgroundTopWrapper} />
            </View>
            <View style={styles.movieBackgroundWrapper} >
                <Image style={styles.movieImage} source={{ uri: AppConstants.BASE_IMAGE_PATH + item.poster_path }} />
            </View>
            <View style={styles.movieDetails}>
                <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.movieReleaseDate}>{moment(item.release_date).format('MMM D, YYYY')}</Text>
                <View style={styles.movieRatingContainer}>
                    <Text style={styles.movieRatingText}>{item.vote_average.toFixed(1)} / 10</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
));

const LoadingScreen = () => (
    <Modal transparent>
        <View style={styles.loadingScreen}>
            <View style={styles.loadingContainer}>
                <ActivityIndicator color='white' style={{ marginRight: 10 }} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        </View>
    </Modal>
);

const EmptyTabItem = () => (
    <View style={{ width: '100%', height: '100%' }}>
        <Text>No Data Found</Text>
    </View>
);

export default HomeScreen;