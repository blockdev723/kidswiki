import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, AsyncStorage, TouchableOpacity, Alert, FlatList, Modal, WebView, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Header, Left, Body, Right } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import { Base_Url, AppVersion } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';




export class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'Settings',
      selected: '1',
      popoverShow: false,
      user_token: '',
      selectedChild: { username: '' },
      visibleModal: false,
      modalVisible: false,
      spinner: false,
      password: ''
    };
  }



 

  componentWillReceiveProps(nextProps) {
    this.setState({ popoverShow: false })
    console.log("global.currenttt", global.currenttt)
    if (global.currenttt == 5) {

      console.log("propsssssssss", this.props)
      AsyncStorage.getItem("token").then((value) => {
        AsyncStorage.getItem('childs').then((childs) => {
          AsyncStorage.getItem("password").then((password) => {
            // console.log("user_token home", value + "" + password)

            console.log("user_token home", value, childs)
            var childsss = JSON.parse(childs);
            this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0], myPassword: password })

          }).done();
        }).done();
      }).done();


      this.setModalVisible(true)
    }
  }



  setPopupVisible(visible) {
    this.setState({ popoverShow: !this.state.popoverShow });
  }

  selectChild = (item) => {
    this.setPopupVisible(false)
    this.setState({ selectedChild: item })
    

  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  goToSettings = () => {
    const { password } = this.state;
    this.setState({ spinner: false });
    if (password.length === 0) {
      console.log(password.length)
      Toast.show('Please enter password', Toast.LONG);
    }
    else {
      if (this.state.myPassword != password) {
        console.log(this.state.myPassword, password)
        Toast.show('Password does not match', Toast.LONG);
      }
      else {
        console.log(this.state.myPassword, this.state.password)
        this.setState({ modalVisible: false, password: '' });
      }
    }

  }

  




  _showAlert = () => {
    Alert.alert(
      '',
      'Are you sure you want to logout ?',
      [
        //  {text: 'Ask me later', onPress: () => this._onPress()},
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this._onLogout(this.state.user_token, 'Login') },
        // { text: 'OK', onPress: () => this.props._onLogout(this.state.user_token, 'Login') },

      ],
      { cancelable: false }
    )

  }



  openModal = (title) => {
    if (title == 'Terms & Conditions') {
      this.setState({ modalTitle: title, visibleModal: true, webUri: 'https://kidsfirstwiki.com/terms' })
    } else {
      this.setState({ modalTitle: title, visibleModal: true, webUri: 'https://kidsfirstwiki.com/privacy' })
    }
  }


  _onPress = (screen) => {
    this.setState({ modalVisible: false })
    this.props._onForgotScreen(screen)
  }


  _onLogout = (token, screen) => {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone, spinner: true });
    fetch(Base_Url + 'logOutWikiUser', {
      method: "GET",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.status == 1) {
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('globalIndex');
          this.props._onLogout(screen)
          console.log("responseMessage", responseJson.message);
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false });
        }
      }).catch((error) => {
        console.log("error", error);
      });

  }

  render() {
    return (

      <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'row' }} onPress={() => this.setState({ popoverShow: false })}>

        <View style={{ width: '100%', height: '100%' }}>

          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 35, left: 20, right: 20, zIndex: 999 }}>


            {this.state.popoverShow ?
              <View style={{
                marginRight: 20,
                width: 180, position: 'absolute', right: 10, borderRadius: 5, top: 58, flexDirection: 'column', backgroundColor: 'white', shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
              }}>
                <Image style={{
                  height: 30, width: 26, position: 'absolute', top: -30, left: 140, zIndex: 9999, shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.4,
                  shadowRadius: 2,
                }} source={require('../assets/images/arrow_pop.png')} />
                <FlatList
                  data={this.state.childs}
                  renderItem={({ item, index }) => (
                    <View>
                      <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.selectChild(item)}>
                        <View style={{ width: 50, height: 50, borderRadius: 50 / 2, backgroundColor: index == 0 ? '#F45C5F' : index == 1 ? '#62C677' : '#527CF3', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                          <Text style={{ fontSize: 22, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8, marginLeft: 1 }}>{item.username.substring(0, 1)}</Text>
                        </View>
                        <Text style={{ color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginLeft: 10, marginRight: 10, fontSize: 20 }}>{item.username}</Text>
                      </TouchableOpacity>

                      <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 1 }} />

                    </View>
                  )}
                  refreshing={this.state.refreshing}
                />

              </View>
              : null}




            <View style={{ width: '100%', flexDirection: 'column' }}>
              <Text style={{ textTransform: 'uppercase', color: '#527CF3', fontSize: 25, fontFamily: 'BigJohn', marginLeft: 5 }}>Settings</Text>
              <View style={{ width: '71%', flexDirection: 'row', marginTop: 5, marginLeft: 5, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />
            </View>

            <View style={{ position: 'absolute', right: 30, flexDirection: 'row' }}>
             

            </View>

          </View>



          <View style={{ width: '100%', height: '100%', marginLeft: 20, marginTop: 60, marginRight: 40, backgroundColor: 'white' }}>

            <TouchableOpacity onPress={(nn) => { this.props._onClickSetting('Myprofile'); this.setState({ popoverShow: false }) }} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: 'black', fontSize: 24, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Edit Account and User Profiles</Text>
              <Image source={require('../assets/images/right_blackarrow.png')} style={{ position: 'absolute', right: 40 }} />
            </TouchableOpacity>

            <View style={{ width: '95%', marginTop: 20, borderBottomColor: '#DCDCDC', borderBottomWidth: 0.5 }} />


            <TouchableOpacity onPress={() => { this.props._onClickSetting('Changepassword'); this.setState({ popoverShow: false }) }} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: 'black', fontSize: 24, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Change Password</Text>
              <Image source={require('../assets/images/right_blackarrow.png')} style={{ position: 'absolute', right: 40 }} />
            </TouchableOpacity>

            <View style={{ width: '95%', marginTop: 20, borderBottomColor: '#DCDCDC', borderBottomWidth: 0.5 }} />


            <TouchableOpacity onPress={() => { this.props._onClickSetting('MostReadTopics'); this.setState({ popoverShow: false }) }} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: 'black', fontSize: 24, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Most Read Topics</Text>
              <Image source={require('../assets/images/right_blackarrow.png')} style={{ position: 'absolute', right: 40 }} />
            </TouchableOpacity>

            <View style={{ width: '95%', marginTop: 20, borderBottomColor: '#DCDCDC', borderBottomWidth: 0.5 }} />


            <TouchableOpacity onPress={() => { this.props._onClickSetting('Mysubscription'); this.setState({ popoverShow: false }) }} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: 'black', fontSize: 24, fontFamily: 'HelveticaNeueLTStd-Roman' }}>My Subscription</Text>
              <Image source={require('../assets/images/right_blackarrow.png')} style={{ position: 'absolute', right: 40 }} />
            </TouchableOpacity>

            <View style={{ width: '95%', marginTop: 20, borderBottomColor: '#DCDCDC', borderBottomWidth: 0.5 }} />


            <TouchableOpacity onPress={() => { this.props._onClickSetting('Contactus'); this.setState({ popoverShow: false }) }} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: 'black', fontSize: 24, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Contact Us</Text>
              <Image source={require('../assets/images/right_blackarrow.png')} style={{ position: 'absolute', right: 40 }} />
            </TouchableOpacity>

            <View style={{ width: '95%', marginTop: 20, borderBottomColor: '#DCDCDC', borderBottomWidth: 0.5 }} />


            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20 }} onPress={() => this.openModal('Privacy Policy')}>
              <Text style={{ color: 'black', fontSize: 24, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Privacy Policy</Text>
              <Image source={require('../assets/images/right_blackarrow.png')} style={{ position: 'absolute', right: 40 }} />
            </TouchableOpacity>

            <View style={{ width: '95%', marginTop: 20, borderBottomColor: '#DCDCDC', borderBottomWidth: 0.5 }} />


            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20 }} onPress={() => this.openModal('Terms & Conditions')}>
              <Text style={{ color: 'black', fontSize: 24, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Terms & Conditions</Text>
              <Image source={require('../assets/images/right_blackarrow.png')} style={{ position: 'absolute', right: 40 }} />
            </TouchableOpacity>

            <View style={{ width: '95%', marginTop: 20, borderBottomColor: '#DCDCDC', borderBottomWidth: 0.5 }} />


            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20 }} onPress={() => { this._showAlert(); this.setState({ popoverShow: false }) }}>
              <Text style={{ color: 'black', fontSize: 24, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Logout</Text>
              <Image source={require('../assets/images/right_blackarrow.png')} style={{ position: 'absolute', right: 40 }} />
            </TouchableOpacity>



          </View>
        </View>


        <Modal
          coverScreen={true}
          visible={this.state.visibleModal}>
          <Header style={{ backgroundColor: 'rgba(33,35,38,0.9)', elevation: 0, shadowOpacity: 0 }}>
            <Left style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.setState({ visibleModal: false })}>
                <Image style={{ width: 40, height: 30, marginLeft: 10 }} source={require('../assets/images/leftarrow.png')} />
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontSize: 25, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{this.state.modalTitle}</Text>
            </Body>
            <Right>

            </Right>
          </Header>
          <WebView
            source={{ url: this.state.webUri }} />
        </Modal>


        <Modal

          // animationType="slide"
          visible={this.state.modalVisible}
          transparent={true}>

          <Spinner
            visible={this.state.spinner} />
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>

            <KeyboardAvoidingView
              activeOpacity={1}
              style={{
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.8)'
              }}>


              <TouchableOpacity
                activeOpacity={1}
                style={{
                  width: '50%',
                  paddingLeft: 30,
                  paddingRight: 30,
                  backgroundColor: '#fff',
                  height: 'auto',
                  borderRadius: 10,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} onPress={this.setDummyModal}>



                <Text style={{ color: 'black', fontSize: 22, marginTop: 30, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Settings are secured with your{'\n'}account password.</Text>


                <View style={styles.viewStyle}>
                  <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                    <Image source={require('../assets/images/key.png')} />
                  </View>
                  <View style={{ width: '85%', height: 60, borderTopRightRadius: 10, borderBottomRightRadius: 10, paddingLeft: 15, borderColor: '#E5E5E5', borderWidth: 1 }}>
                    <TextInput style={styles.textInputStyle} placeholder="Password" returnKeyType={"done"}
                      secureTextEntry={true}
                      ref={(input) => { this.password = input; }}
                      onChangeText={(password) => this.setState({ password: password.replace(/\s/g, '') })}
                      value={this.state.password}
                      onSubmitEditing={this.goToSettings.bind(this)} />
                  </View>
                </View>

                {/* <Text onPress={() => { this.goToForgot() }} style={styles.forgotPassword}>Forgot Password?</Text> */}

                <Text style={styles.forgotPassword} onPress={() => this._onPress('Forgot')} >Forgot Password?</Text>
                <TouchableOpacity onPress={this.goToSettings.bind(this)} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30, borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center', backgroundColor: '#3F67DC', padding: 15 }}>
                  <Text style={{ color: 'white', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', marginTop: 5 }}>SUBMIT</Text>
                </TouchableOpacity>


                <View style={{ width: '100%', marginTop: 30, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />


                <TouchableOpacity onPress={() => { this.setModalVisible(false); this.props.closeModal() }} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                  <Text style={{ color: '#B8B8B8', fontSize: 22, fontFamily: 'HelveticaNeueLTStd-Md', padding: 20 }}>x CLOSE</Text>
                </TouchableOpacity>



              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>

      </TouchableOpacity>





    );
  }
}


export default Settings;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageAnimals: {
    width: 170,
    height: 130,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,

  }, textStyle: {
    fontSize: 16,
    color: 'white',
    marginLeft: 15,
    marginTop: 5,
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#F4F4F4',
    color: 'white',
    fontSize: 18,
    fontFamily: 'HelveticaNeueLTStd-Md',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10

  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#527CF3',
    justifyContent: 'center'
  },

  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    backgroundColor: '#F4F4F4',
    color: 'white',
    fontSize: 18,
    fontFamily: 'HelveticaNeueLTStd-Md',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15

  },
  sideNavText: {
    marginTop: 2,
    color: '#9A9A9A',
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  selectNavText: {
    marginTop: 2,
    color: '#527CF3',
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: '800',
    textTransform: 'uppercase'

  },
  notifictaionCircle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#527CF3',
    color: 'white',
    fontSize: 18,
    fontFamily: 'HelveticaNeueLTStd-Md',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 25,
    bottom: 30
  },
  viewStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    fontSize: 20,
    color: '#3F67DC',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Roman'
  },
  textInputStyle: {
    width: '100%',
    height: 60,
    fontSize: 24,
    color: 'black',
    fontFamily: 'HelveticaNeueLTStd-Roman'

  },

}); 
