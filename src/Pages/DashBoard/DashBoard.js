import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { Fragment } from 'react';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { BLACK, BRAND, GRAY, WHITE } from '../../constants/color';
import { appStyles } from '../../styles/AppStyles';
import { Loader } from '../../components/Loader';
import { BOLD, EXTRABOLD, LIGHT, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './stylesDash';
import { RFValue } from 'react-native-responsive-fontsize';

import { FlatList } from 'react-native-gesture-handler';
import Header from '../../components/Header';
import { Icon } from 'react-native-elements';

const DashBoard = ({ navigation }) => {
    const renderItem = ({ item }) => {
        const today = new Date().toLocaleDateString();
        const isCredit = item.type === "credit";

        return (
            <TouchableOpacity
                style={{ ...styles.cardContainer, borderLeftWidth: 5, borderLeftColor: isCredit ? 'green' : 'red' }}
            >
                <View style={styles.cardContent}>
                    {/* Left: Icon */}
                    <Icon
                        name={isCredit ? 'arrow-up-circle' : 'arrow-down-circle'}
                        type='feather'
                        color={isCredit ? 'green' : 'red'}
                        size={24}
                        containerStyle={{ marginRight: 10 }}
                    />

                    {/* Center: Description */}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.description}</Text>
                        <Text style={styles.cardDate}>{today}</Text>
                    </View>

                    {/* Right: Amount */}
                    <Text style={{
                        color: isCredit ? 'green' : 'red',
                        fontWeight: 'bold',
                        fontSize: 16
                    }}>
                        {isCredit ? '+' : '-'} ${item.amount}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const WelderData = [
        { type: "credit", description: "Salary", amount: 2000 },
        { type: "debit", description: "Groceries", amount: 150 },
        { type: "credit", description: "Freelance", amount: 500 },
        { type: "debit", description: "Utility Bill", amount: 120 },
        { type: "credit", description: "Bonus", amount: 700 },
        { type: "debit", description: "Restaurant", amount: 80 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
        { type: "credit", description: "Investment", amount: 300 },
    ];

    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>
                    <View
                        style={{
                            flex: 1,
                            width: WIDTH,
                            backgroundColor: WHITE,
                        }}>
                        {/* LinearGradient section */}
                        <LinearGradient
                            colors={[BRAND, WHITE]}
                            start={{ x: 0.7, y: 0 }}
                            end={{ x: 0.3, y: 1.8 }}
                            style={{
                                width: '100%',
                                height: HEIGHT * 0.35,
                                alignItems: 'center',
                                zIndex: 5,
                                paddingBottom: 50, // Adjust padding for overlap effect
                            }}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    height: '20%',
                                    alignItems: 'flex-start',
                                    padding: 10,
                                }}>
                                <Icon
                                    name='menu'
                                    size={35}
                                    color={WHITE}
                                    onPress={() => navigation.toggleDrawer()}
                                />



                            </View>
                            <View
                                style={{
                                    width: '70%',
                                    height: '40%',
                                    alignItems: 'center',
                                    padding: 10,
                                }}>
                                <Text style={{ fontSize: 17, color: WHITE, fontFamily: REGULAR }}>
                                    Current Balance
                                </Text>
                                <Text style={{ fontSize: 40, color: WHITE, fontFamily: REGULAR }}>
                                    $ 32000.00
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: WHITE,
                                        fontFamily: LIGHT,
                                    }}>
                                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </Text>
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    height: '40%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 5,
                                }}>
                                {/* Income Sections */}
                                {[...Array(3)].map((_, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            width: '33%',
                                            height: '70%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingHorizontal: 10,
                                        }}>
                                        <Text style={{ fontSize: 12, color: WHITE, fontFamily: REGULAR }}>
                                            Total Work
                                        </Text>
                                        <Text style={{ fontSize: 14, color: WHITE, fontFamily: REGULAR }}>
                                            $ 120000.00
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </LinearGradient>

                        {/* Overlapping FlatList section */}
                        <View
                            style={{
                                position: 'absolute',
                                top: HEIGHT * 0.3, // Adjust to overlap slightly above the gradient bottom
                                width: '100%',
                                height: HEIGHT * 0.72,
                                zIndex: 1000,
                            }}>
                            <FlatList
                                data={WelderData}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{
                                    // paddingTop: HEIGHT * 0.08, // Ensure the first item overlaps properly
                                }}
                                ListFooterComponent={
                                    <View style={{ height: HEIGHT * 0.05 }} />
                                }
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>
    );
};

export default DashBoard;
