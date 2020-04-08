import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground, Modal , AsyncStorage} from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Icon, Footer, FooterTab, Content } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { Base_Url, AppVersion } from '../constants/common';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';





class Forgot extends Component {


  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: null,
      spinner: false,
      modalVisible: false,

    };
  }




  isValid() {
    const { email, password } = this.state;
    reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let valid = false;

    if (email.length > 0) {
      valid = true;
    }
    if (email.length === 0) {
      Toast.show('Please enter email address', Toast.LONG);
    } else if (reg.test(email) === false) {
      Toast.show('Please enter valid email address', Toast.LONG);
    }
    else {
      return valid;
    }



  }


  onForgot() {
    const { email } = this.state;
    console.log('callledd');
    if (this.isValid()) {
      this.setState({ spinner: true });

      var timzone = DeviceInfo.getTimezone();
      console.log("hiiii", timzone)
      this.setState({ timzone: timzone });

      fetch(Base_Url + 'sendResetPasswordLink', {
        method: "POST",
        headers: {
          'appVersion': AppVersion,
          'timezone': timzone,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          deviceId: 'abc',
          deviceType: 'i'
        })
      })

        .then((response) => response.json())
        .then((responseJson) => {
          this.data = responseJson;
          this.setState({ spinner: false});
          console.log(responseJson);

          if (responseJson.status == 1) {
            this.setState({ modalVisible: true});
          }
          else {
            Toast.show(responseJson.message, Toast.SHORT);
          }

        }).catch((error) => {
          console.log(error);
        });

    }
  }




  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }


  setModalVisible(visible) {
    this.setState({ modalVisible: visible , email :'' });
    AsyncStorage.removeItem('token');
  }




  render() {
    return (


      <ImageBackground source={require('../assets/images/bgimg.png')} style={{ width: '100%', height: '100%' }}>

        <Header style={{ backgroundColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.5)', borderBottomWidth: 0.5, elevation: 0, shadowOpacity: 0, height: 100 }}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
              <Image style={{ width: 45, height: 40, marginLeft: 10 }} source={require('../assets/images/leftarrow.png')} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 30, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Forgot Password</Text>
          </Body>
          <Right>

          </Right>
        </Header>


        <View>


          <ScrollView>

            <View style={styles.container}>

              <Spinner
                visible={this.state.spinner} />


              <View style={{ width: '60%' }}>

                <Text style={styles.instruction}>Just enter your registered email address and we {'\n'} will send you an email to reset your password.</Text>


                <View style={styles.viewStyle}>
                  <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../assets/images/mail.png')} />
                  </View>
                  <View style={{ width: '85%', height: 60, backgroundColor: 'white', borderTopRightRadius: 10, borderBottomRightRadius: 10, paddingLeft: 15 }}>
                    <TextInput style={styles.textInputStyle} placeholder="Registered Email Address" returnKeyType={"done"}
                      keyboardType='email-address'
                      onChangeText={(email) => this.setState({ email: !this.state.email ? email.replace(/\s/g, '') : email })}
                      value={this.state.email}
                      onSubmitEditing={this.onForgot.bind(this)} />
                  </View>
                </View>
               

                <TouchableOpacity onPress={this.onForgot.bind(this)} style={styles.buttonContainer}>
                  <Text style={{ color: '#527BF3', fontSize: 20, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold' }}>RESET PASSWORD</Text>
                </TouchableOpacity>

              </View>

            </View>
          </ScrollView>



          <Modal

            // animationType="slide"
            visible={this.state.modalVisible}
            transparent={true}>

            <View style={{
              height: '100%',
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 20,
              paddingRight: 20,
              padding: 20,
              backgroundColor: 'rgba(0,0,0,0.8)'
            }}>

              <View style={{
                width: '50%',
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 10,
                marginBottom: 10,
                backgroundColor: '#fff',
                height: 'auto',
                borderRadius: 10
              }}>


                <View style={{ paddingTop: 15, flexDirection: 'column', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={require('../assets/images/mail_snd.png')} style={{ padding: 20 }} />
                  <Text style={{ color: 'black', fontSize: 22, padding: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }}>An email has been sent to reset{'\n'}your password.</Text>
                  <Text style={{color:'#527BF3', fontFamily: 'HelveticaNeueLTStd-Md',fontSize:22 ,fontWeight:'bold' }}>{this.state.email}</Text>
                  <View style={{ width: '100%', marginTop: 20, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />
                  <TouchableOpacity onPress={() => { this.setModalVisible(false) ;  this._onPress('Login') }} style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <Text style={{ textTransform: 'uppercase', fontFamily: 'HelveticaNeueLTStd-Md', fontSize: 22, color: '#B8B8B8', fontWeight: 'bold' }}>x Close</Text>
                  </TouchableOpacity>
                </View>

              </View>

            </View>
          </Modal>
        </View>
      </ImageBackground>
    );
  }
}


export default Forgot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    width: '100%',
    marginTop: 100,
    marginBottom: 60,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'HelveticaNeueLTStd-Roman'
  },
  textInputStyle: {
    width: '100%',
    height: 60,
    fontSize: 24,
    color: '#737373',
    fontFamily: 'HelveticaNeueLTStd-Roman'

  },
  buttonContainer: {
    width: '100%',
    height: 60,
    paddingTop: 5,
    justifyContent: 'center',
    paddingBottom: 5,
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center'
  },
  viewStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  }
});