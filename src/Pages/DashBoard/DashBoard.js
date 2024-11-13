import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { Fragment } from 'react'
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { BLACK, BRAND, GRAY, WHITE } from '../../constants/color';
import { appStyles } from '../../styles/AppStyles';
import { Loader } from '../../components/Loader';
import { EXTRABOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './stylesDash';
import { RFValue } from 'react-native-responsive-fontsize';

import { FlatList } from 'react-native-gesture-handler';
import Header from '../../components/Header';
import { Icon } from 'react-native-elements';

const DashBoard = ({ navigation }) => {



    const renderItem = ({ item, navigation }) => {
        // Get today's date in a desired format (e.g., MM/DD/YYYY)
        const today = new Date().toLocaleDateString();

        return (
            <TouchableOpacity
                style={{ ...styles.cardContainer, borderLeftWidth: 5, borderLeftColor: BRAND }}
            // onPress={() => navigation.navigate('Details', { item: item })}
            >
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardSubTitle}>{item.subTitle}</Text>
                        <Text style={styles.cardDate}>{today}</Text>  {/* Date on the right */}
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={styles.cardBodyText}>{item.bodyText}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    };



    const WelderData = [
        {
            title: "Welding",
            subTitle: "Welding",
            bodyText: "Welding",
        },
        {
            title: "Welding",
            subTitle: "Welding",
            bodyText: "Welding",
        },
        {
            title: "Welding",
            subTitle: "Welding",
            bodyText: "Welding",
        },
        {
            title: "Welding",
            subTitle: "Welding",
            bodyText: "Welding",
        },
        {
            title: "Welding",
            subTitle: "Welding",
            bodyText: "Welding",
        },
        {
            title: "Welding",
            subTitle: "Welding",
            bodyText: "Welding",
        },
        {
            title: "Welding",
            subTitle: "Welding",
            bodyText: "Welding",
        },
    ]


    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                {/* <Loader visible={loader} /> */}

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>

                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            alignItems: 'center',
                            paddingBottom: 20, // Adjust padding bottom to ensure space for scrolling
                        }}>


                        <>
                            <Header
                                onMenuPress={() => navigation.toggleDrawer()}
                                title="Welder Jobs"
                            />


                            <View style={styles.bannerContainer}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['white', 'white']}
                                    style={styles.bannerCard}>
                                    <View style={styles.bannerContent}>
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Total</Text>
                                            <Text style={styles.sectionData}>
                                                10
                                            </Text>
                                        </View>
                                        <View style={styles.separator} />
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Pending</Text>
                                            <Text style={styles.sectionData}>
                                                15
                                            </Text>
                                        </View>
                                        <View style={styles.separator} />
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Completed</Text>
                                            <Text style={styles.sectionData}>
                                                20
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>



                            <View
                                style={{
                                    width: WIDTH * 0.9,
                                    // height: HEIGHT * 0.1,
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    marginTop: 20,
                                    paddingHorizontal: 20,
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={styles.sectionTitle}>Welder List</Text>
                            </View>


                            <View
                                style={{
                                    width: WIDTH,
                                    height: HEIGHT * 0.7,
                                    marginTop: 20, // Add top margin
                                    marginBottom: 20, // Add bottom m
                                    borderRadius: 10, // Add rounded corners for the elevated look
                                }}>
                                <FlatList
                                    data={WelderData} // Use the real data from Dashboard
                                    ListEmptyComponent={
                                        <Text style={{
                                            fontSize: RFValue(16),
                                            marginTop: 20,
                                            marginBottom: 20,
                                            textAlign: 'center',
                                            color: '#888888',
                                        }
                                        }>No Data Available</Text>
                                    }
                                    renderItem={renderItem}
                                    // refreshControl={
                                    //     <RefreshControl
                                    //         refreshing={refreshing}
                                    //         onRefresh={onRefresh}
                                    //         colors={['#215be9']} // Customize color
                                    //     />
                                    // }
                                    removeClippedSubviews={false} // Disable to prevent flickering
                                    initialNumToRender={10} // Start rendering only 10 items
                                    windowSize={5} // Optimize the rendering window
                                    ListFooterComponent={
                                        <View
                                            style={{
                                                height: HEIGHT * 0.05,
                                                width: '100%',
                                                // backgroundColor: '#f2f2f2',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingHorizontal: 20,
                                            }}
                                        />
                                    }
                                />
                            </View>










                        </>



                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>
    )
}

export default DashBoard