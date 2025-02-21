import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import AppConstants from '../constants/AppConstants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const MovieScreen = ({ route }) => {
    const navigation = useNavigation();
    const { dataItem } = route.params;
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.backgroundImage}
                        source={{ uri: AppConstants.BASE_IMAGE_PATH + dataItem.backdrop_path }}
                    />
                    <View style={styles.overlay} />
                    <View style={[styles.headerContainer, { top: insets.top }]}>
                        <HeaderButton name="chevron-left" onPress={() => navigation.goBack()} />
                        <View style={styles.flexGrow} />
                        <HeaderButton name="heart" />
                    </View>
                    <View style={styles.posterContainer}>
                        <Image
                            style={styles.posterImage}
                            source={{ uri: AppConstants.BASE_IMAGE_PATH + dataItem.poster_path }}
                        />
                    </View>
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title} numberOfLines={2}>{dataItem.title}</Text>
                    <Text style={styles.releaseDate}>{moment(dataItem.release_date).format('MMM D, YYYY')}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>{dataItem.vote_average.toFixed(1)} / 10</Text>
                    </View>
                    <Text style={styles.overview}>{dataItem.overview}</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const HeaderButton = ({ onPress, name }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.headerButton}>
                <Icon name={name} size={18} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: 400,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ddd',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    headerContainer: {
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    flexGrow: {
        flex: 1,
    },
    posterContainer: {
        position: 'absolute',
        left: 20,
        bottom: 20,
        width: 100,
        height: 160,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'white',
        overflow: 'hidden',
    },
    posterImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ddd',
    },
    detailsContainer: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    releaseDate: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
    },
    ratingContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#FFD700',
        borderRadius: 6,
        alignSelf: 'baseline',
        marginTop: 4,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: '800',
    },
    overview: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
    },
    headerButton: {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MovieScreen;
