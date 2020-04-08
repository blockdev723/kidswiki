import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Icon, Footer, FooterTab, Content } from 'native-base';
import Toast from 'react-native-simple-toast';
import { Base_Url, AppVersion } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';





class Contactus extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'Home',
      selected: '1',
      email: '',
      subject: '',
      message: '',
      spinner: false,
      user_token: ''
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('email').then((email) => {
      console.log("user_token home", value)
      this.setState({ user_token: value , myEmail : email})
    }).done();
      }).done();


  }



  isValid() {
    const { email, subject, message } = this.state;
    reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let valid = false;

    if (subject.length > 0 && message.length > 0) {
      valid = true;
    }

   
    
    if (subject.length === 0) {
      Toast.show('Please enter subject', Toast.LONG);
    }
    else if (message.length === 0) {
      Toast.show('Please enter message', Toast.LONG);
    }
    else {
       return valid;
    }

  }


  onContactUs() {
    if (this.isValid()) {

      this.setState({ spinner: true });

      fetch(Base_Url + 'sendContactUsEmail', {
        method: "POST",
        headers: {
          'appVersion': AppVersion,
          'timezone': this.state.timzone,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.user_token
        },
        body: JSON.stringify({
          email: this.state.myEmail,
          subject: this.state.subject,
          message: this.state.message,

        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
        this.data = responseJson;
          console.log("ContactUS=======>>>>>>>>", this.data)
          this.setState({ spinner: false });

          Toast.show(this.data.message, Toast.SHORT);


          if (responseJson.status == '1') {
            this.props.navigation.navigate('VerticalTabBarTextExample')   
          }

        }).catch((error) => {
          console.log(error);
          this.setState({ spinner: false });
        });




    }
  }




  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }
  render() {
    return (
      <ImageBackground source={require('../assets/images/bgimg.png')} style={{ width: '100%', height: '100%' }}>
        <Header style={{ backgroundColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.5)', borderBottomWidth: 0.5, elevation: 0, shadowOpacity: 0 }}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
              <Image style={{ width: 40, height: 35, marginLeft: 10 }} source={require('../assets/images/leftarrow.png')} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
            <Text style={{ fontSize: 25, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Contact Us</Text>
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

                <View style={{marginTop: 30, marginBottom: 20}}>
                  <Text style={{fontSize: 22, color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman', alignSelf:'center', paddingLeft:20 , paddingRight: 20}}>Please feel free to contact us with any questions, comments or concerns you may have. We will reply to the email address we have linked to your account.</Text>
                  
                </View>


                <View style={styles.viewStyle}>
                  <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 , borderTopLeftRadius:10}}>
                    <Image source={require('../assets/images/subject.png')} />
                  </View>
                  <View style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 15, paddingRight: 15, borderBottomWidth: 1 , borderTopRightRadius: 10}}>
                    <TextInput style={styles.textInputStyle} placeholder="Subject" returnKeyType={"next"}
                      ref={(input) => { this.subject = input; }}
                      onSubmitEditing={() => { this.message.focus(); }}
                      onChangeText={(subject) => this.setState({ subject: !this.state.subject ? subject.replace(/\s/g, '') : subject })}
                      value={this.state.subject} />
                  </View>
                </View>


                <View style={styles.viewStyle}>
                  <View style={{ height: 180, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'flex-start', borderBottomLeftRadius: 10 }}>
                    <Image source={require('../assets/images/message.png')} style={{ marginTop: 10 }} />
                  </View>
                  <View style={{ width: '85%', height: 180, backgroundColor: 'white', alignSelf: 'flex-start', justifyContent: 'flex-start', paddingLeft: 15, paddingRight: 15, borderBottomRightRadius: 10 }}>
                    <TextInput style={styles.textInputMessageStyle}
                      placeholder="Message" returnKeyType={"done"}
                      multiline={true}
                      maxLength={500}
                      ref={(input) => { this.message = input; }}
                      onChangeText={(message) => this.setState({ message: !this.state.message ? message.replace(/\s/g, '') : message })}
                      value={this.state.message} />
                  </View>
                </View>



                <TouchableOpacity style={styles.buttonContainer} onPress={this.onContactUs.bind(this)}>
                  <Text style={{ color: '#527BF3', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>SUBMIT</Text>
                </TouchableOpacity>




              </View>

            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}



export default Contactus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 30,
    fontSize: 20,
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Roman'
  },

  textInputStyle: {
    width: '100%',
    height: 60,
    fontSize: 20,
    color: 'black',
    fontFamily: 'HelveticaNeueLTStd-Roman'
  },
  buttonContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    fontFamily: 'HelveticaNeueLTStd-Md'
  },
  viewStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  dontAccount: {
    marginTop: 30,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'HelveticaNeueLTStd-Roman'

  },
  singUp: {
    marginTop: 30,
    fontSize: 20,
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Md'
  },
  textInputMessageStyle: {
    width: '100%',
    height: 180,
    fontSize: 20,
    color: 'black',
    textAlignVertical: 'top',
    marginTop: 10,
    fontFamily: 'HelveticaNeueLTStd-Roman'
  }

});

