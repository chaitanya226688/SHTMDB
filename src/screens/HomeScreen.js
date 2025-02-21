import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Modal, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import AppConstants from '../constants/AppConstants';

const tabsMap = {
    "now_playing": "Now Playing", "popular": "Popular", "top_rated": "Top Rated", "upcoming": "Upcoming"
}
const themeColor = "#000"
const HomeScreen = () => {
    const tabsList = Object.keys(tabsMap)
    const [isLoading, setIsLoading] = useState(false)
    const { width, height } = useWindowDimensions()
    const [activeTab, setActiveTab] = useState(tabsList[0])
    const tabRef = useRef()
    const tabViewRef = useRef()
    const [tabsData, setTabsData] = useState(null)

    useEffect(() => {
        FetchAllMovies()
    }, [])

    const FetchAllMovies = () => {
        setIsLoading(true)
        Promise.all(tabsList.map(element => FetchMovies(element))).then(response => {
            const tabsDataItem = {}
            response.map((element, index) => {
                tabsDataItem[tabsList[index]] = element
            })
            setTabsData({ ...tabsDataItem })
            setIsLoading(false)
        }).catch(err => {
            setIsLoading(false)
            console.error(err)
        })
    }

    const FetchMovies = async (tabName, pageNumber = 1) => {
        try {
            console.log('Fetch', tabName)
            const response = await fetch(AppConstants.FETCH_BASE_URL + '' + tabName + '?language=en-US&page=' + pageNumber, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + AppConstants.FETCH_API_KEY,
                }
            })
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
            const responseJson = await response.json()
            return Promise.resolve(responseJson)
        } catch (e) {
            console.log('error', e)
            return Promise.resolve(null)
        }
    }

    useEffect(() => {
        const tabIndex = tabsList.indexOf(activeTab) == 0 ? 0 : tabsList.indexOf(activeTab) - 1
        tabRef?.current?.scrollToIndex({ animated: true, index: tabIndex })
    }, [activeTab])

    const setTabIndex = (tabName) => {
        const tabIndex = tabsList.indexOf(tabName)
        tabViewRef?.current?.scrollToIndex({ animated: true, index: tabIndex })
    }

    return <>
        <SafeAreaView >
            <FlatList
                ref={tabRef}
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20 }}
                horizontal
                data={tabsList}
                renderItem={({ item }) => <TabItem item={tabsMap[item]} isActive={item == activeTab} onPress={() => { setTabIndex(item) }} />}
            />
            {tabsData != null && <FlatList
                onMomentumScrollEnd={(event) => { setActiveTab(tabsList[Math.round(event.nativeEvent.contentOffset.x / width)]) }}
                ref={tabViewRef}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={tabsList}
                renderItem={({ item }) => (tabsData[item] != null ? <TabViewPage item={tabsData[item]} /> : <EmptyTabItem />)}
            />}
            {isLoading && <LoadingScreen />}
        </SafeAreaView>
    </>
}

const EmptyTabItem = () => {
    return <View style={{ width: '100%', height: '100%' }} ><Text >No Data Found</Text></View>
}

const LoadingScreen = () => {
    return <Modal transparent={true} >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', alignItems: 'center', justifyContent: 'center' }} ><View style={{ flexDirection: 'row', alignItems: 'center' }} ><ActivityIndicator color={'white'} style={{ marginRight: 10 }} /><Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }} >Loading...</Text></View></View>
    </Modal>
}

const TabItem = ({ item, isActive, onPress }) => {
    return <TouchableOpacity onPress={onPress} >
        <View style={{ width: 140, height: 40, marginBottom: 10, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderBottomWidth: 2, borderBottomColor: isActive ? themeColor : 'transparent' }} >
            <Text style={{ fontWeight: '600', fontSize: 16 }} >{item}</Text>
        </View>
    </TouchableOpacity>
}

const TabViewPage = ({ item }) => {
    const { width, height } = useWindowDimensions()
    return <View style={{ width: width }} >
        <FlatList style={{ width: '100%' }} data={item.results} renderItem={({ item }) => <Text >{JSON.stringify(item)}</Text>} />
    </View>
}

export default HomeScreen;