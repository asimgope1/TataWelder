import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { BLACK, BRAND, WHITE } from '../constants/color';
import { HEIGHT, WIDTH } from '../constants/config';
import { BOLD, REGULAR, SEMIBOLD } from '../constants/fontfamily';
import Header from '../components/Header';
import { RFValue } from 'react-native-responsive-fontsize';

// Define a larger set of colors for unique coloring of each item
const colors = [
    '#007AFF',  // Blue
    '#FCBE03',  // Pale Yellow
    '#FC6603',  // Orange
    '#34C759',  // Green
    '#FF3B30',  // Red
    '#5856D6',  // Purple
    '#FF9500',  // Amber
    '#AF52DE',  // Violet
    '#FF2D55',  // Pink
];

// Menu items
const menuItems = [
    { name: 'DashBoard', icon: 'dashboard', label: 'Dashboard' },
    { name: 'Registration', icon: 'receipt', label: 'Registration' },
    { name: 'New Job', icon: 'new-label', label: 'New Job' },
    { name: 'Job Approval', icon: 'thumb-up', label: 'Job Approval' },
    { name: 'RT Report', icon: 'menu-book', label: 'RT Report' },
    { name: 'PAUT-Report', icon: 'menu-book', label: 'PAUT Report' },
    { name: 'Quality Verification', icon: 'check-circle-outline', label: 'Q-Verification' },
    { name: 'TPI', icon: 'report-gmailerrorred', label: 'TPI-Verification' },
    { name: 'Final Approval', icon: 'thumbs-up-down', label: 'Final Approval' },
];

const CustomDrawerContent = (props) => {
    const { navigation } = props;  // Get the navigation prop from the drawer

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.drawerContainer}
        >

            {/* Header Section */}

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',  // Spread items across left and right ends
                    alignItems: 'center',
                    width: '100%',
                    margin: -5,
                    alignSelf: 'center',
                    backgroundColor: BRAND,
                    height: HEIGHT * 0.03,
                    paddingHorizontal: WIDTH * 0.05,  // Add some padding for space on the sides
                }}
            >
                {/* <Icon
                    name='menu'
                    size={35}
                    color={WHITE}
                    onPress={() => navigation.toggleDrawer()}
                />
                <Text
                    style={{
                        fontSize: RFValue(17),
                        fontFamily: BOLD,
                        color: WHITE,
                        marginLeft: 10,  // You can adjust this margin to add space between icon and text
                    }}
                >
                    Menu
                </Text> */}
            </View>




            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image URL for profile picture
                    style={styles.profileImage}
                />
                <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>John Doe</Text>
                    <Text style={styles.profileDepartment}>Software Development</Text>
                    <Text style={styles.profileEmail}>john.doe@example.com</Text>
                </View>
            </View>

            {/* Menu Section */}
            <View style={styles.gridContainer}>
                {menuItems.map((item, index) => (
                    <View key={index} style={styles.menuItemContainer}>
                        <TouchableOpacity
                            style={[
                                styles.menuItem,
                                { backgroundColor: colors[index % colors.length] }, // Assign a unique color
                            ]}
                            onPress={() => navigation.navigate(item.name)}
                        >
                            <View style={styles.iconContainer}>
                                <Icon name={item.icon} size={45} color={WHITE} />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.label}>{item.label}</Text>
                    </View>
                ))}
            </View>

            {/* Navigation Buttons Section */}
            <View style={styles.navigationButtonsContainer}>
                <TouchableOpacity
                    style={[styles.navigationButton, styles.homeButton]}
                    onPress={() => {
                        navigation.toggleDrawer();
                        navigation.navigate('DashBoard');
                    }} // Navigate to Home screen
                >
                    <Text style={styles.navigationButtonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navigationButton, styles.logoutButton]}
                    onPress={() => navigation.navigate('Login')} // Navigate to Login screen
                >
                    <Text style={styles.navigationButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>© 2024 Tata Power. All rights reserved.</Text>
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: WHITE,
    },
    // Profile styles
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: WHITE, // Light gray background for profile section
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
        backgroundColor: '#ddd',
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontFamily: BOLD,
        color: BLACK,
    },
    profileDepartment: {
        fontSize: 14,
        color: '#666',
        fontFamily: REGULAR,
        marginTop: 5,
    },
    profileEmail: {
        fontSize: 12,
        color: '#999',
        fontFamily: SEMIBOLD,
        marginTop: 5,
    },
    // Menu styles
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around', // Center items with even spacing
        paddingVertical: 20,
    },
    menuItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: WIDTH * 0.28, // Slightly adjusted to fit the screen better
        margin: 10,
    },
    menuItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 90,
        borderRadius: 15, // More rounded corners for modern look
        opacity: 0.95,
        margin: 10,
    },
    iconContainer: {
        marginBottom: 8,
    },
    label: {
        color: BLACK,
        fontSize: 14,
        fontWeight: '800',
        textAlign: 'center',
        marginTop: 5,
        // fontFamily: ,
    },
    // Navigation buttons
    navigationButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    navigationButton: {
        flex: 1,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginHorizontal: 10,
        backgroundColor: '#007AFF',
    },
    homeButton: {
        backgroundColor: '#34C759', // Green color for Home button
    },
    logoutButton: {
        backgroundColor: '#FF3B30', // Red color for Logout button
    },
    navigationButtonText: {
        color: WHITE,
        fontSize: 16,
        fontFamily: BOLD,
    },
    // Footer styles
    footerContainer: {
        padding: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#f9f9f9', // Light gray for footer
        marginTop: HEIGHT * 0.022,
        marginBottom: HEIGHT * 0.05,
    },
    footerText: {
        fontSize: 12,
        color: '#888',
        fontFamily: BOLD,
    },
});

export default CustomDrawerContent;
