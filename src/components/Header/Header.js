import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { RFValue } from 'react-native-responsive-fontsize'
import { MENU, PLUS } from '../../constants/imagepath'
import { HEIGHT, WIDTH } from '../../constants/config'
import { BLACK, BRAND, WHITE } from '../../constants/color'
import { EXTRABOLD } from '../../constants/fontfamily'
import { Icon } from 'react-native-elements'

const Header = ({ title, onMenuPress, onAddPress }) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[BRAND, BRAND]}
      style={styles.headerContainer}
    >
      <View style={styles.headerContent}>
        {/* Menu Icon */}
        {onMenuPress ? <TouchableOpacity onPress={onMenuPress}>
          <Image
            style={styles.icon}
            source={require('../../assets/images/hamburger.png')}
          />
        </TouchableOpacity> : <></>}

        {/* Title */}
        <Text style={{ ...styles.headerText, marginRight: onAddPress ? 0 : 30, }}>
          {title}
        </Text>

        {/* Add Icon */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '15%' }}>
          {onAddPress ? (
            <TouchableOpacity onPress={onAddPress}>
              <Icon
                name="check"         // Icon name, you can use any icon available in your library
                type="font-awesome"  // Icon type, e.g., 'font-awesome', 'material', etc.
                color="#4CAF50"      // Icon color, adjust as needed
                size={24}            // Icon size, adjust as needed
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity>
            {/* <Icon
              name="times"         // Second icon name
              type="font-awesome"  // Second icon type
              color="#F44336"      // Second icon color
              size={24}            // Second icon size
            /> */}
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

export default Header

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: HEIGHT * 0.12, // Dynamic height
    justifyContent: 'center',
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    paddingHorizontal: WIDTH * 0.05, // Padding for content
  },
  headerContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 25,
    height: 40,
    resizeMode: 'contain',
    tintColor: WHITE,
  },
  iconSmall: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: WHITE,
  },
  headerText: {
    color: WHITE,
    fontSize: RFValue(16),
    fontFamily: EXTRABOLD,
    textAlign: 'center',
    flex: 1, // Ensures the title is centered
    // Adjust margin to ensure space between icon and title
  },
})