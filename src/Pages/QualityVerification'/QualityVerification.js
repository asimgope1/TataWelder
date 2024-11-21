import {
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { BRAND } from "../../constants/color";
import Header from "../../components/Header";
import { MyStatusBar } from "../../constants/config";
import { appStyles } from "../../styles/AppStyles";
import { GETNETWORK } from "../../utils/Network";
import { BAS_URL } from "../../constants/url";

const QualityVerification = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [reportNumber, setReportNumber] = useState('');
    const [reportDate, setReportDate] = useState('');
    const [reportTime, setReportTime] = useState('');


    // Fetch API data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const url = `${BAS_URL}welding/api/v1/to-be-qualityinspection-list/`;
            GETNETWORK(url, true).then(
                (response) => {
                    if (response.status === 'success') {
                        setData(response.data)
                        console.log('data', response);
                        setLoading(false);
                        // SetJobList(response.data);
                    } else {
                        setLoading(false);
                        console.log('Error:', response.message);
                    }
                }
            );
        };

        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <View
            style={{
                padding: 15,
                marginVertical: 8,
                marginHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
                elevation: 5,
                backgroundColor: 'white'
            }}
        >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                Job Number: {item.job_number}
            </Text>
            <Text style={{ fontSize: 14, color: '#555' }}>
                Component Name: {item.component_name}
            </Text>
            <Text style={{ fontSize: 14, color: '#555' }}>
                Unit Number: {item.unit_number}
            </Text>
            <Text style={{ fontSize: 14, color: '#555' }}>
                Joint Number: {item.joint_number}
            </Text>
            <Text style={{ fontSize: 12, color: '#888' }}>
                Description Number: {item.job_desc_number || 'N/A'}
            </Text>

            <TouchableOpacity

                onPress={() => {
                    // setSelectedJob(item.sl);
                    setModalVisible(true);
                }}
                style={{
                    backgroundColor: 'green',
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                    borderRadius: 5,
                    marginTop: 10,
                }}
            >
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={"light-content"} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps={"handled"}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 20,
                        }}
                    >
                        <Header
                            onMenuPress={() => {
                                navigation.toggleDrawer();
                            }}
                            title="Quality-Verification"
                        />

                        {loading ? (
                            <ActivityIndicator size="large" color={BRAND} />
                        ) : (
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Verify Report</Text>

                        {/* Input for Report Number */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Report Number:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Report Number"
                                value={reportNumber} // State value for report number
                                onChangeText={(text) => setReportNumber(text)} // Update state
                            />
                        </View>

                        {/* Input for Report Date */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Report Date:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Report Date (YYYY-MM-DD)"
                                value={reportDate} // State value for report date
                                onChangeText={(text) => setReportDate(text)} // Update state
                            />
                        </View>

                        {/* Input for Report Time */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Report Time:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Report Time (HH:MM)"
                                value={reportTime} // State value for report time
                                onChangeText={(text) => setReportTime(text)} // Update state
                            />
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </Fragment>
    );
};

export default QualityVerification;

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
});


