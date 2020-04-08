
import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, ImageBackground , ScrollView } from 'react-native';
import { Base_Url, AppVersion } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import SplashScreen from 'react-native-splash-screen'



class Myprofile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'Home',
      selected: '1',
      userData: {},
      childData: [],
      childInterests: [],
      spinner: true
    };
  }


  componentDidMount() {
    SplashScreen.hide();
    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {
        console.log("user_token home", value, childs)
        var childsss = JSON.parse(childs);
        this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0] })
        this.getUserProfile();

      }).done();
    }).done();


  }

  componentWillReceiveProps(){
    this.getUserProfile();
  }


  getUserProfile() {

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'getUserProfile', {
      method: "GET",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
         console.log("getUserList===>>>>>", JSON.stringify(responseJson.data.childs));


        if (responseJson.status == 1) {
          this.setState({ spinner: false, userData: responseJson.data, childData: responseJson.data.childs });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false });
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  

  _onAccountEdit = (screen , userData) => {
    this.props.navigation.navigate(screen , {userData :userData})
  }

  _onPress = (screen , childArray , numberOfChilds) => {
    this.props.navigation.navigate(screen , { childArray : childArray ,numberOfChilds :numberOfChilds})
  }
  
  render() {
    return (
      <View style={{ flex: 1 }}>

        <Spinner
          visible={this.state.spinner} />

        <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 20 }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: 40, height: 35 }}>
            <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 35 }} />
          </TouchableOpacity>
          <View style={{ width: '95%', flexDirection: 'column' }}>
            <Text style={{ fontSize: 25, textTransform: 'uppercase', color: '#527CF3', fontFamily: 'BigJohn', justifyContent: 'center', marginLeft: 25, marginTop: 5 }}>My Profile</Text>

            <View style={{ width: '95%', flexDirection: 'row', marginTop: 10, marginLeft: 25, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />

          </View>
        </View>



        <ImageBackground source={require('../assets/images/new_bg.png')} style={{ width: '100%', height: '100%' }}>
        <ScrollView >
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
            <View style={{ width: '60%', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../assets/images/logo_myprofile.png')} style={{height: 150, width: 150}} />
            </View>
          </TouchableOpacity>
        
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, paddingLeft: 100, paddingRight: 100,marginBottom:100 }}>

            <View style={{ width: '50%', height: '100%', flexDirection: 'column', marginRight: 20 }}>



              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.textBold}>Account Info</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 5 }} onPress={(nn) => this._onAccountEdit('EditAccountInfo' , this.state.userData)}>
                  <Text style={{ color: 'black', textDecorationLine: 'underline', fontSize: 20, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 5, marginBottom: 5, borderBottomColor: 'white', borderBottomWidth: 4 }} />


              <Text style={styles.textAccount}>Name</Text>
              <Text style={styles.textAccountInfo}>{this.state.userData.name}</Text>


              <Text style={styles.textAccount}>Email</Text>
              <Text style={styles.textAccountInfo}>{this.state.userData.email}</Text>

              <Text style={styles.textAccount}>Location</Text>
              <Text style={styles.textAccountInfo}>{this.state.userData.location}</Text>


            </View>



            <View style={{ width: '50%', height: '100%', flexDirection: 'column', marginLeft: 20 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.textBold}>User Info</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 5 }} onPress={(nn) => this._onPress('UpdateChildProfile' , this.state.childData ,this.state.childData.length )}>
                  <Text style={{ color: 'black', textDecorationLine: 'underline', fontSize: 20, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Add or Edit Child Profiles</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 5, marginBottom: 5, borderBottomColor: 'white', borderBottomWidth: 4 }} />



              {this.state.childData.map((mainItem, key) => ( 
                 <View>
                      <Text style={styles.textAccountInfo}>{mainItem.username + ", " + mainItem.age + " years old" + ", "}
                      <Text>{mainItem.gender.charAt(0) == 'M' ? 'boy' :'girl'}</Text>
                      </Text>
                      <View > 
                          <Text style={styles.textUser}>Interests: 
                              {mainItem.interests.map((mainItemm, keyy) =>  (
                            
                               
                               <Text style={styles.textUserInfo}> {mainItemm.interest}{mainItem.interests.length - 1 !== keyy ? <Text>, </Text> : null }</Text>
                                
                              ))}

                              </Text>
                          
                    </View>
                </View>


              ))}

            </View>

          </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}



export default Myprofile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonContainer: {
    width: '65%',
    height: 60,
    paddingTop: 5,
    justifyContent: 'center',
    paddingBottom: 5,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#527BF3',
    justifyContent: 'center',
    fontFamily: 'HelveticaNeueLTStd-Md'
  },
  singUp: {
    marginTop: 30,
    fontSize: 20,
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Md'
  },
  textAccount: {
    marginTop: 10,
    textTransform: 'uppercase',
    fontSize: 20,
    fontFamily: 'HelveticaNeueLTStd-Roman',
    color: 'black'
  },
  textAccountInfo: {
    color: 'white',
    fontSize: 24,
    marginTop: 15,
    fontFamily: 'HelveticaNeueLTStd-Roman',
  },
  textBold: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'HelveticaNeueLTStd-Md',
    textTransform: 'capitalize',
    fontWeight: 'bold'
  },
  textUser: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'HelveticaNeueLTStd-Roman',
    },
  textUserInfo: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'HelveticaNeueLTStd-Roman',
  }
});