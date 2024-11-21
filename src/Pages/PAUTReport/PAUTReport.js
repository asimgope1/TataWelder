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
import { BRAND, WHITE } from "../../constants/color";
import Header from "../../components/Header";
import { HEIGHT, MyStatusBar } from "../../constants/config";
import { appStyles } from "../../styles/AppStyles";
import { GETNETWORK } from "../../utils/Network";
import { BAS_URL } from "../../constants/url";
import { Icon } from "react-native-elements";

const PAUTReport = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [filterCriteria, setFilterCriteria] = useState('');


    // Fetch API data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const url = `${BAS_URL}welding/api/v1/to-be-paut-list/`;
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
                <Text style={styles.buttonText}>Submit</Text>
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
                            title="PAUT-Report"
                        />

                        {loading ? (
                            <ActivityIndicator size="large" color={BRAND} />
                        ) : (
                            <>

                                <View style={styles.filterContainer}>
                                    {/* Left side content, 70% width */}
                                    <View style={styles.leftContent}>
                                        {/* <TouchableOpacity style={styles.filterButton}> */}
                                        <TextInput
                                            style={styles.filterTextInput}
                                            placeholder="Enter Filter Criteria"
                                            placeholderTextColor="#888"
                                            value={filterCriteria}
                                            editable={false}
                                            multiline
                                        // onChangeText={(text) => setFilterCriteria(text)}
                                        />
                                        {/* </TouchableOpacity> */}
                                    </View>

                                    {/* Right side buttons, 30% width */}
                                    <View style={styles.rightButtons}>
                                        <TouchableOpacity
                                            style={styles.selectButton}
                                            onPress={() => handleFilter('select')}
                                        > <Icon
                                                name={'filter-alt'}
                                                type='material'
                                                color={WHITE}
                                                size={24}
                                                containerStyle={{ marginBottom: 5 }}
                                            />
                                            <Text style={{
                                                color: '#fff',
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                            }}>Filter</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ ...styles.clearButton, backgroundColor: filterCriteria.length > 0 ? '#FF6347' : '#4CAF50' }}
                                            onPress={() => handleFilter('clear')}
                                        >
                                            <Icon
                                                name={'delete'}
                                                type='material'
                                                color={WHITE}
                                                size={24}
                                                containerStyle={{ marginBottom: 5 }}
                                            />
                                            <Text style={{
                                                color: '#fff',
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                            }}>Clear </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <FlatList
                                    data={data}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderItem}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <Text style={styles.emptyListText}>
                                                No data available
                                            </Text>

                                        </View>
                                    }

                                />
                            </>
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
                        <Text style={styles.modalTitle}>Submit Report</Text>

                        {/* DropDownPicker for welder selection */}
                        <View style={styles.dropdownStyle}>
                            <Text style={styles.dropdownLabel}>Report Number:</Text>
                            <Text style={styles.dropdownValue}>#12345</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Report Date:</Text>
                            <Text style={styles.infoValue}>2024-11-20</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Report Time:</Text>
                            <Text style={styles.infoValue}>14:35</Text>
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

export default PAUTReport;

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
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
    dropdownStyle: {
        width: '100%',
        marginBottom: 15,
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    dropdownLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    dropdownValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#333',
        marginTop: 5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '400',
        color: '#333',
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
        backgroundColor: '#FF3B30', // Red for cancel button
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    filterContainer: {
        width: '100%',
        height: HEIGHT * 0.07,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    // Left content (70% width)
    leftContent: {
        flex: 0.7,
        justifyContent: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterTextInput: {
        width: '95%', // Full width inside the TouchableOpacity
        padding: 10,
        fontSize: 16,
        color: '#333', // Text color
        backgroundColor: '#F0F0F0', // Light background color for input
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    filterText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
    },
    // Right side buttons (30% width)
    rightButtons: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // Select Filter button
    selectButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginRight: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButton: {
        padding: 10,
        backgroundColor: '#FF6347', // Different color for clear action
        borderRadius: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // buttonText: {
    // color: '#fff',
    // fontSize: 12,
    // fontWeight: 'bold',
    // },
    dropdown: {
        width: '100%',
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownContainer: {
        borderColor: '#ccc',
    },
    previewContainer: {
        width: '100%',
        height: 70,
        borderRadius: 8,
        elevation: 10,
        backgroundColor: WHITE,
        marginTop: 20,
        alignItems: 'center',
    },
    previewText: {
        fontSize: 14,
        color: 'black',
        marginTop: 5,
    },
    apiCallButton: {
        backgroundColor: 'cyan',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
        marginTop: 15,
        alignSelf: 'center',
    },
});

