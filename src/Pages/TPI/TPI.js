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
} from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { BRAND } from "../../constants/color";
import Header from "../../components/Header";
import { MyStatusBar, WIDTH } from "../../constants/config";
import { appStyles } from "../../styles/AppStyles";
import { GETNETWORK } from "../../utils/Network";
import { BAS_URL } from "../../constants/url";

const QualityVerification = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility


    // Fetch API data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const url = `${BAS_URL}welding/api/v1/to-be-tpiinspection-list/`;
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
                            title="TPI"
                        />
                        <View
                            style={{
                                flex: 1,
                                width: WIDTH,
                                alignSelf: 'center',
                                alignItems: 'center',
                            }}
                        >

                            {loading ? (
                                <ActivityIndicator size="large" color={BRAND} />
                            ) : (
                                <View
                                    style={{
                                        flex: 1,
                                        width: WIDTH,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                    }}
                                >

                                    <FlatList
                                        data={data}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderItem}
                                        contentContainerStyle={{ paddingBottom: 20 }}
                                        ListEmptyComponent={
                                            <View style={styles.emptyList}>
                                                <Text style={styles.emptyListText}>No data available</Text>

                                            </View>
                                        }
                                    />
                                </View>

                            )}
                        </View>
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
                        <Text style={styles.modalTitle}>Submit Report</Text>

                        {/* DropDownPicker for welder selection */}


                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    cancelButton: {
        backgroundColor: '#f44336',  // Red
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyList: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
        alignSelf: 'center',
    }
})
