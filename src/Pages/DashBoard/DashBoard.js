import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, FlatList } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { BLACK, BLUE, BRAND, GRAY, WHITE } from '../../constants/color';
import { appStyles } from '../../styles/AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import Header from '../../components/Header';
import { Icon } from 'react-native-elements';
import { BAS_URL } from '../../constants/url';
import { GETNETWORK } from '../../utils/Network';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from "react-native-gifted-charts";
import { BOLD, EXTRABOLD, LIGHT, REGULAR, SEMIBOLD } from '../../constants/fontfamily';

const DashBoard = ({ navigation }) => {

    const [JobList, SetJobList] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // Loading state
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            GetJobList();
            GetDashboard();
        }, [navigation])
    );

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, []);

    // Fetch Job List
    const GetJobList = () => {
        const url = `${BAS_URL}welding/jobmaster/joblist/`;
        GETNETWORK(url, true).then(
            (response) => {
                if (response.status === 'success') {
                    SetJobList(response.data);
                } else {
                    console.log('Error:', response.message);
                }
            }
        );
    };

    // Fetch Dashboard Data
    const GetDashboard = () => {
        const url = `${BAS_URL}welding/api/v1/dashboard/`;
        GETNETWORK(url, true).then(
            (response) => {
                if (response.status === 'success') {

                    setDashboardData(response.data);
                } else {
                    console.log('Error:', response.message);
                }
            }
        );
    };

    // Refresh the Data
    const refresh = async () => {
        setRefreshing(true);
        await GetDashboard();
        await GetJobList();
        setRefreshing(false);
    };

    // Render Stats Cards
    // Function to generate a random color in hex format
    const getRandomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor}`;
    };

    // Render Stats Cards
    const renderStatsCards = () => {
        if (!dashboardData) return null;

        return (
            <View style={styles.statsContainer}>
                <FlatList
                    data={dashboardData.status_count} // Use status_count here
                    numColumns={4} // Set to 4 columns for grid layout
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{
                            ...styles.statsCard,
                            borderTopColor: getRandomColor(), // Apply random borderTopColor
                            borderTopWidth: 8,  // Add width to the border
                        }}>

                            <Text
                                style={{ ...styles.statsName }}
                                numberOfLines={1} // Limit to 1 line
                                ellipsizeMode="tail" // Add ellipsis at the tail if text overflows
                            >
                                {item.name}
                            </Text>
                            <Text style={styles.statsFigure}>{item.count}</Text> {/* Displaying count instead of figure */}
                        </View>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                />
            </View>
        );
    };




    // Render Job Status Bar Chart
    const renderJobStatusChart = () => {
        if (!dashboardData) return null;
        const data = dashboardData.status_count.map(status => ({
            label: status.name,
            value: status.count,
            frontColor: '#4CAF50',
        }));
        return (
            <BarChart
                data={data}
                barWidth={30}
                noOfSections={4}
                isAnimated
                hideYAxisText
            />
        );
    };

    // Render Pie Chart for Units Overview
    const LabelLineConfig = {
        length: 15,                   // Length of the line pointing to the label
        tailLength: 10,               // Length of the tail part
        color: 'black',               // Label color
        thickness: 2,                 // Line thickness
        labelComponentWidth: 30,      // Label width
        labelComponentHeight: 15,     // Label height
        labelComponentMargin: 5,      // Margin around the label component
        avoidOverlappingOfLabels: true, // Ensures labels don't overlap
    };

    const renderStatusPieChart = () => {
        if (!dashboardData || !dashboardData.status_count) return null;

        // Map status_count data to pie chart format
        const pieData = dashboardData.status_count.map(status => ({
            value: status.count,
            label: status.name,  // Using the name as the label for each slice
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color for each slice
        }));

        return (
            <PieChart
                data={pieData}
                donut
                innerCircleColor={WHITE}
                innerCircleBorderWidth={4}
                innerCircleRadius={50}
                showText={true}  // Enable text display on the slices
                textColor={BLACK}  // Text color on the pie chart
                textSize={12}      // Font size for the labels
                labelLineConfig={LabelLineConfig}  // Apply custom label line configuration
            />
        );
    };

    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>

                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            alignItems: 'center',
                            paddingBottom: 20,
                        }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                        }
                    >


                        <View style={{ flex: 1, width: WIDTH, backgroundColor: WHITE }}>
                            <LinearGradient
                                colors={[BRAND, WHITE]}
                                start={{ x: 0.7, y: 0 }}
                                end={{ x: 0.3, y: 1.8 }}
                                style={{
                                    width: '100%',
                                    height: HEIGHT * 0.3,
                                    alignItems: 'center',
                                    zIndex: 5,
                                    // paddingBottom: 50,
                                }}
                            >
                                <View style={{ width: '100%', height: '20%', alignItems: 'flex-start', padding: 10 }}>
                                    <Icon
                                        name='menu'
                                        size={35}
                                        color={WHITE}
                                        onPress={() => navigation.toggleDrawer()}
                                    />
                                </View>
                                <View style={{ width: '70%', height: '40%', alignItems: 'center', padding: 10 }}>
                                    <Text style={{ fontSize: 17, color: WHITE, fontFamily: REGULAR }}>{dashboardData?.stats[0]?.name}</Text>
                                    <Text style={{ fontSize: 40, color: WHITE, fontFamily: REGULAR }}>{dashboardData?.stats[0]?.figure}({dashboardData?.stats[0]?.total_monthly})</Text>
                                    <Text style={{ fontSize: 15, color: WHITE, fontFamily: LIGHT }}>
                                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </Text>
                                </View>
                                <View style={{ width: '100%', height: '40%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
                                    {dashboardData?.stats.slice(1).map((item, index) => (
                                        <View key={index} style={{ width: '33%', height: '70%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                                            <Text style={{ fontSize: RFValue(10), color: WHITE, fontFamily: SEMIBOLD }}>{item.name}</Text>
                                            <Text style={{ fontSize: 14, color: WHITE, fontFamily: REGULAR }}>{item.figure}({item.total_monthly})</Text>
                                        </View>
                                    ))}
                                </View>
                            </LinearGradient>

                            {/* Stats Cards Section */}
                            {renderStatsCards()}

                            {/* table to be build */}
                            <View style={styles.tableContainer}>
                                <View
                                    style={{
                                        height: HEIGHT * 0.05,
                                        width: WIDTH,
                                        backgroundColor: BRAND,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 10,
                                    }}
                                >
                                    <Text style={styles.tableTitle}>Unit Overview</Text>
                                </View>

                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, { backgroundColor: '#f2f2f2' }]}>Unit No</Text>  {/* Light gray background */}
                                    <Text style={[styles.tableHeaderText, { backgroundColor: '#d6eaf8' }]}>Accepted</Text> {/* Light blue background */}
                                    <Text style={[styles.tableHeaderText, { backgroundColor: '#d5f5e3' }]}>Repair</Text>   {/* Light green background */}
                                    <Text style={[styles.tableHeaderText, { backgroundColor: '#f9e79f' }]}>Retake</Text>   {/* Light yellow background */}
                                    <Text style={[styles.tableHeaderText, { backgroundColor: '#f8c471' }]}>Total Jobs</Text> {/* Light orange background */}
                                </View>

                                <FlatList
                                    data={dashboardData?.unit_count} // Use unit_count data
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.tableRow}>
                                            <Text style={[styles.tableText, { backgroundColor: '#f2f2f2' }]}>{item.unit_no}</Text>  {/* Light gray background */}
                                            <Text style={[styles.tableText, { backgroundColor: '#d6eaf8' }]}>{item.accepted_count}</Text> {/* Light blue background */}
                                            <Text style={[styles.tableText, { backgroundColor: '#d5f5e3' }]}>{item.repair_count}</Text>   {/* Light green background */}
                                            <Text style={[styles.tableText, { backgroundColor: '#f9e79f' }]}>{item.retake_count}</Text>   {/* Light yellow background */}
                                            <Text style={[styles.tableText, { backgroundColor: '#f8c471' }]}>{item.total_jobs}</Text> {/* Light orange background */}
                                        </View>
                                    )}
                                />
                            </View>


                            {/* Units Pie Chart */}
                            <View style={styles.chartContainer}>
                                <View
                                    style={{
                                        height: HEIGHT * 0.05,
                                        width: WIDTH,
                                        backgroundColor: BRAND,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 10

                                    }}
                                >


                                    <Text style={styles.tableTitle}>Job Status Overview</Text>
                                </View>
                                {renderStatusPieChart()}
                            </View>





                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    headerGradient: {
        width: '100%',
        height: HEIGHT * 0.35,
        alignItems: 'center',
        zIndex: 5,
        paddingBottom: 50,
    },
    balanceContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    balanceTitle: {
        fontSize: 18,
        color: WHITE,
        fontFamily: REGULAR,
    },
    balanceValue: {
        fontSize: 42,
        color: WHITE,
        fontFamily: EXTRABOLD,
    },
    balanceDate: {
        fontSize: 14,
        color: WHITE,
        fontFamily: LIGHT,
    },
    statsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        justifyContent: 'space-around',
        // marginVertical: 20,
        // marginRight: 20,
    },
    statsCard: {
        backgroundColor: WHITE,
        borderWidth: 1,

        borderRadius: 10,
        margin: 8,
        marginTop: 15,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        width: WIDTH * 0.2,
        justifyContent: 'center',
        alignSelf: 'center',

        alignItems: 'center',
    },
    statsName: {
        fontSize: RFValue(11),
        color: BLACK,
        fontFamily: REGULAR,

    },
    statsFigure: {
        fontSize: 24,
        color: BLACK,
        fontFamily: BOLD,
        marginVertical: 5,
    },
    statsMonthly: {
        fontSize: 12,
        color: GRAY,
    },
    chartContainer: {
        marginTop: 20,
        width: WIDTH,
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    chartTitle: {
        fontSize: 18,
        color: BLACK,
        fontFamily: SEMIBOLD,
        marginBottom: 10,
    },
    tableContainer: {
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 20,
        backgroundColor: WHITE,
        paddingBottom: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    tableTitle: {
        fontSize: RFValue(18),
        color: WHITE,
        fontFamily: BOLD,
        textAlign: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: GRAY,
        marginBottom: 10,
        marginTop: 10,
    },
    tableHeaderText: {
        fontSize: 14,
        color: BLACK,
        fontFamily: BOLD,
        flex: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: GRAY,
    },
    tableText: {
        fontSize: 14,
        color: BLACK,
        fontFamily: REGULAR,
        flex: 1,
        textAlign: 'center',
    },

});

export default DashBoard;
