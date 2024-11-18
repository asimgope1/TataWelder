import {
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { BRAND, RED } from '../../constants/color';
import Header from '../../components/Header';
import { HEIGHT, MyStatusBar } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { GETNETWORK, POSTNETWORK } from '../../utils/Network';
import { BAS_URL } from '../../constants/url';
import { Icon } from 'react-native-elements';

const JobApproval = ({ navigation }) => {
    const [JobList, SetJobList] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state to manage data fetching

    const handleApproval = async (item) => {
        const payload = {
            "jobsl": item.jobsl,  // Use the jobsl from the selected item
            "approved_status": "Approved"
        };

        // The API endpoint URL
        const url = `${BAS_URL}welding/jobmaster/update-job/`;

        try {
            // Make the POST request using POSTNETWORK
            const response = await POSTNETWORK(url, payload, true); // Assuming `true` for token if it's needed

            console.log('Cancel Result:', response);

            if (response.status === 'success') {
                // Handle a successful cancellation
                GetJobList();
                alert('Job successfully Approved');
                // Optionally, refresh the job list to update the UI
                // GetJobList();
            } else {
                alert('Failed to Approved the job');
            }
        } catch (error) {
            console.error('Cancel Error:', error);
            alert('An error occurred while Approving the job');
        }
    };

    const handleCancel = async (item) => {
        // The payload for the cancel request
        const payload = {
            "jobsl": item.jobsl,  // Use the jobsl from the selected item
            "approved_status": "Cancelled"
        };

        // The API endpoint URL
        const url = `${BAS_URL}welding/jobmaster/update-job/`;

        try {
            // Make the POST request using POSTNETWORK
            const response = await POSTNETWORK(url, payload, true); // Assuming `true` for token if it's needed

            console.log('Cancel Result:', response);

            if (response.status === 'success') {
                // Handle a successful cancellation
                GetJobList();
                alert('Job successfully cancelled');
                // Optionally, refresh the job list to update the UI
                // GetJobList();
            } else {
                alert('Failed to cancel the job');
            }
        } catch (error) {
            console.error('Cancel Error:', error);
            alert('An error occurred while cancelling the job');
        }
    };

    useEffect(() => {
        GetJobList();
    }, []);

    const styles = {
        cardTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 4,
        },
        cardSubtitle: {
            fontSize: 14,
            color: '#555',
            marginBottom: 4,
        },
        cardDate: {
            fontSize: 12,
            color: '#888',
        },
        buttonText: {
            color: 'white',
            fontWeight: '600',
            textAlign: 'center',
        },
    };

    const GetJobList = async () => {
        const url = `${BAS_URL}welding/jobmaster/joblist/`;
        setLoading(true); // Start loading
        try {
            const response = await GETNETWORK(url, true);
            if (response.status === 'success') {
                console.log('JobApproval', response.data);
                SetJobList(response.data);
            } else {
                console.log('Error:', response.message);
            }
        } catch (error) {
            console.error('Network Error:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                disabled={true}
                style={{
                    backgroundColor: '#f9f9f9',
                    borderRadius: 8,
                    padding: 15,
                    marginVertical: 8,
                    marginHorizontal: 10,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    {/* Icon Section */}
                    <Icon
                        name={'task'}
                        type='material'
                        color={'#555'}
                        size={28}
                        containerStyle={{ marginRight: 15 }}
                    />

                    {/* Job Description Section */}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>Job Number: {item.job_number}</Text>
                        <Text style={styles.cardSubtitle}>Job Desc: {item.job_desc_number}</Text>
                        <Text style={styles.cardDate}>Job Date: {item.job_offer_date}</Text>
                        <Text style={styles.cardDate}>Unit Number: {item.unit_number}</Text>
                    </View>
                </View>

                {/* Buttons Section */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 15,
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    paddingTop: 10,
                }}>
                    {/* Approve Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'green',
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            borderRadius: 5,
                        }}
                        onPress={() => handleApproval(item)}
                    >
                        <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'red',
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            borderRadius: 5,
                        }}
                        onPress={() => handleCancel(item)}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 20,
                        }}
                    >
                        <Header
                            onMenuPress={() => navigation.toggleDrawer()}
                            title="Job-Approval"
                        />

                        <View style={{ width: '100%', zIndex: 1000 }}>
                            {loading ? (
                                <ActivityIndicator size="large" color={BRAND} />
                            ) : (
                                <FlatList
                                    data={JobList}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ paddingTop: 10 }}
                                    ListFooterComponent={
                                        <View style={{ height: HEIGHT * 0.05 }} />
                                    }
                                />
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>
    );
};

export default JobApproval;
