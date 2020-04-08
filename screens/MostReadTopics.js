import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { Base_Url, AppVersion } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import DatePicker from 'react-native-datepicker'
import { Item } from 'native-base';
import ModalDropdown from 'react-native-modal-dropdown';
import { Picker } from 'react-native-picker-dropdown'



class MostReadTopics extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'Home',
      selected: '1',
      choosenIndex: 0,
      spinner: false,
      date: new Date(),
      month : 'Oct',
      selectedMonth: '10',
      selectedYear: '2019',
      readTopic: [],
      selectedChild: { username: '' },
      selectMonth: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      selectYear: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010'
        , '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'
        , '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']
    };
    this.monthModal = [];
    this.yearModal = [];
    this.childModal = [];
  }


  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {
        console.log("user_token home", value, childs)
        var childsss = JSON.parse(childs);
        var username = [];
        var userID = [];
        for (var i in childsss) {
          username[i] = childsss[i].username;
          userID[i] = childsss[i].id;
        }

        this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0], username: username, userID: userID })
        this.getMostReadTopic();

      }).done();
    }).done();


  }

  getMostReadTopic() {


    console.log("getMost ======>>>>", this.state.selectedYear, this.state.selectedMonth, this.state.selectedChild.id)
    console.log("======>>>>", "AAYAAAAAA")

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone, spinner: true });
    fetch(Base_Url + 'getChildMostReadTopics', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: this.state.selectedChild.id,
        month: this.state.selectedMonth,
        year: this.state.selectedYear,      
      })
    })
      // .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props.navigation.navigate('Login');
          this.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;

        console.log("getMostReadTopic===>>>>>", JSON.stringify(responseJson.customDict));

        if (responseJson.status == 1) {
          this.setState({ spinner: false, readTopic: responseJson.customDict, refreshing: !this.state.refreshing });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false });
        }
      }).catch((error) => {
        console.log("Most read", error);
        this.setState({ spinner: false });
      });
  }



  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }


  selectChild = (index, value) => {
    console.log("========>>>>", index)
    for (var i in this.state.childs) {
      if (value == this.state.childs[i].username) {
        this.setState({ selectedChild: this.state.childs[i] })
      }
    }
    let that = this;

    setTimeout(function () { that.getMostReadTopic() }, 1000);
   

  }


  selectMonthClick = (index, value) => {
    let that = this;
    setTimeout(function () { that.setState({ selectedMonth: parseInt(index) + 1 }), that.getMostReadTopic() }, 500);
  }


  selectYearClick = (index, value) => {
    let that = this;
    setTimeout(function () { that.setState({ selectedYear: value }), that.getMostReadTopic() }, 500);
    console.log("dateeee ayiiii", index, value)
    
  }




  render() {
    const { selectedYear, selectedMonth } = this.state;
    return (
      <View>
        <Spinner
          visible={this.state.spinner}
        />

        <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 20 }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: 40, height: 35 }}>
            <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 35 }} />
          </TouchableOpacity>
          <View style={{ width: '95%', flexDirection: 'column' }}>
            <Text style={{ fontSize: 25, textTransform: 'uppercase', color: '#527CF3', fontFamily: 'BigJohn', justifyContent: 'center', marginLeft: 25, marginTop: 5 }}>Most Read Topics</Text>
            <View style={{ width: '95%', flexDirection: 'row', marginTop: 10, marginLeft: 25, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />
          </View>
        </View>

        <View style={{ width: '100%', flexDirection: 'row', marginTop: 20, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />

        <View style={{ height: '100%', flexDirection: 'column' }}>
          <View style={{ height: '14%' }}>
            <Text style={{ color: 'black', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Roman', fontWeight: '200', paddingTop: 15, paddingLeft: 10 }}>Reading Report</Text>

            <View style={{ flexDirection: 'row', padding: 10 }}>
              <TouchableOpacity style={{ width: 100, borderColor: '#BDBDBD', borderRadius: 10, borderWidth: 1, padding: 10, marginLeft: 5, marginRight: 5, alignItems: 'center', flexDirection: 'row' }}
                onPress={() => this.monthModal.show()}>

                <ModalDropdown
                  defaultValue={this.state.month}
                  ref={ref => { this.monthModal = ref }}
                  style={{ width: 90, justifyContent: 'center' }}
                  textStyle={{
                    color: '#737373',
                    fontSize: 20,
                    width: '100%',
                    marginTop: 5,
                    fontFamily: 'HelveticaNeueLTStd-Roman'
                  }}
                  dropdownTextStyle={{
                    color: '#737373',
                    fontSize: 20,
                    padding: 10,
                    fontFamily: 'HelveticaNeueLTStd-Roman',
                  }}
                  onSelect={this.selectMonthClick}
                  dropdownStyle={{ width: 70, height: 150, backgroundColor: '#fff', borderWidth: 1, borderColor: '#737373' }}
                  options={this.state.selectMonth}
                />
                <Image source={require('../assets/images/down.png')} style={{ position: 'absolute', right: 5 }} />
              </TouchableOpacity>




              <TouchableOpacity style={{
                width: 90, borderColor: '#BDBDBD', borderRadius: 10, borderWidth: 1, padding: 10, marginLeft: 5, marginRight: 5, alignItems: 'center',
                flexDirection: 'row' }} onPress={() => this.yearModal.show()}>
                <ModalDropdown
                  defaultValue={this.state.selectedYear}
                  ref={ref => { this.yearModal = ref }}
                  style={{ width: 80, justifyContent: 'center' }}
                  textStyle={{
                    color: '#737373',
                    fontSize: 20,
                    width: '100%',
                    marginTop: 5,
                    fontFamily: 'HelveticaNeueLTStd-Roman'
                  }}
                  dropdownTextStyle={{
                    color: '#737373',
                    fontSize: 20,
                    padding: 10,
                    fontFamily: 'HelveticaNeueLTStd-Roman',
                  }}
                  onSelect={this.selectYearClick}
                  dropdownStyle={{ width: 70, height: 150, backgroundColor: '#fff', borderWidth: 1, borderColor: '#737373' }}
                  options={this.state.selectYear}
                />
                <Image source={require('../assets/images/down.png')} style={{ position: 'absolute', right: 5 }} />
              </TouchableOpacity>


              <TouchableOpacity style={{ width: 150, borderColor: '#BDBDBD', borderRadius: 10, borderWidth: 1, padding: 10, marginLeft: 5,
               marginRight: 5, alignItems: 'center', flexDirection: 'row' }} onPress={() => this.childModal.show()}>
                <ModalDropdown
                  defaultValue={this.state.selectedChild.username}
                  ref={ref => { this.childModal = ref }}
                  style={{ width: 130, justifyContent: 'center' }}
                  textStyle={{
                    color: '#737373',
                    fontSize: 20,
                    width: '100%',
                    marginTop: 5,
                    fontFamily: 'HelveticaNeueLTStd-Roman'
                  }}
                  dropdownTextStyle={{
                    color: '#737373',
                    fontSize: 20,
                    padding: 10,
                    width: '100%',
                    fontFamily: 'HelveticaNeueLTStd-Roman',
                  }}
                  onSelect={this.selectChild}
                  dropdownStyle={{ width:130, height: 100, backgroundColor: '#fff', borderWidth: 1, borderColor: '#737373' }}
                  options={this.state.username}
                />
                <Image source={require('../assets/images/down.png')} style={{ position: 'absolute', right: 5 }} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: '65%', padding: 10, flexDirection: 'row' }}>

            <Image source={require('../assets/images/history_bg.png')} style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }} />


            {this.state.readTopic.length > 0 ?

              <ScrollView style={{ width: '55%', paddingRight: 10 }}>
                <View style={{ flexDirection: 'column' }}>
                  {this.state.readTopic.map((mainItem, key) => (

                    key == '0' ?
                      <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 40 }}>
                        <ImageBackground source={require('../assets/images/poly1.png')} style={{ width: 63, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={styles.hashStyle}>#1</Text>
                        </ImageBackground>
                        <View style={{ flexDirection: 'column', marginLeft: 10 , marginRight :40 }}>
                          <Text style={{ fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold', color: '#70CCCF' }}>{mainItem.interestName}</Text>
                          <View>
                            <Text style={styles.topicDes}>Subtopics: 
                              {mainItem.articles.map((mainItemm, keyy) => (
                                <Text style={styles.topicDes}> {mainItemm.displayTitle}{mainItem.articles.length - 1 !== keyy ? <Text>,</Text> : null }</Text>
                              ))}
                            </Text>
                          </View>
                        </View>
                      </View>
                      :

                      key == '1' ?

                        <View style={{ flexDirection: 'row', marginTop: 30 }}>
                          <ImageBackground source={require('../assets/images/poly2.png')} style={{ width: 63, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.hashStyle}>#2</Text>
                          </ImageBackground>
                          <View style={{ flexDirection: 'column', marginLeft: 10 , marginRight :40 }}>
                            <Text style={{ fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold', color: '#D75F68' }}>{mainItem.interestName}</Text>
                            <View>
                              <Text style={styles.topicDes}>Subtopics:
                              {mainItem.articles.map((mainItemm, keyy) => (
                                  // <Text style={styles.textUserInfo}>{mainItemm.interest + ", "}</Text>
                                  <Text style={styles.topicDes}> {mainItemm.displayTitle}{mainItem.articles.length - 1 !== keyy ? <Text>,</Text> : null }</Text>
                                ))}
                              </Text>
                            </View>
                          </View>
                        </View>

                        :

                        key == '2' ?

                          <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 30 }}>
                            <ImageBackground source={require('../assets/images/poly3.png')} style={{ width: 63, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={styles.hashStyle}>#3</Text>
                            </ImageBackground>
                            <View style={{ flexDirection: 'column', marginLeft: 10 , marginRight :40 }}>
                              <Text style={{ fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold', color: '#65348D' }}>{mainItem.interestName}</Text>
                              <View>
                                <Text style={styles.topicDes}>Subtopics:
                              {mainItem.articles.map((mainItemm, keyy) => (
                                    // <Text style={styles.textUserInfo}>{mainItemm.interest + ", "}</Text>
                                    <Text style={styles.topicDes}> {mainItemm.displayTitle}{mainItem.articles.length - 1 !== keyy ? <Text>,</Text> : null }</Text>
                                  ))}
                                </Text>
                              </View>
                            </View>
                          </View>
                          :



                          key == '3' ?

                            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                              <ImageBackground source={require('../assets/images/poly4.png')} style={{ width: 63, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={styles.hashStyle}>#4</Text>
                              </ImageBackground>
                              <View style={{ flexDirection: 'column', marginLeft: 10 , marginRight :40 }}>
                                <Text style={{ fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold', color: '#65348D' }}>{mainItem.interestName}</Text>
                                <View>
                                  <Text style={styles.topicDes}>Subtopics:
                              {mainItem.articles.map((mainItemm, keyy) => (
                                      // <Text style={styles.textUserInfo}>{mainItemm.interest + ", "}</Text>
                                      <Text style={styles.topicDes}> {mainItemm.displayTitle}{mainItem.articles.length - 1 !== keyy ? <Text>,</Text> : null }</Text>
                                    ))}
                                  </Text>
                                </View>
                              </View>
                            </View>

                            :
                            null



                  ))}




                </View>
              </ScrollView>
              :


              <View style={{ width: '55%', flexDirection: 'column', paddingLeft: 20, justifyContent: 'center' }}>

                <Text style={{ color: 'black', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Roman', fontWeight: '200', paddingLeft: 10, alignSelf: 'center' }}>No Read Topics for this month</Text>


              </View>

            }



          </View>

        </View>

      </View>
    );
  }
}



export default MostReadTopics;

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

  hashStyle: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'HelveticaNeueLTStd-Md'
  },
  topicDes: {
    fontSize: 18,
    fontFamily: 'HelveticaNeueLTStd-Roman',
    color: '#969696',
    paddingRight: 10
  },
  pickerStyle: {
    justifyContent: 'center',
    width: 170,
    borderColor: '#BDBDBD',
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 5,
    alignItems: 'center',
  },


  textStyle: {
    margin: 24,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickerStylee: {
    width: 70,
    color: '#344953',
    justifyContent: 'center',
    height: 48,
  }
});