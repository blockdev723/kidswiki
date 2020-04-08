import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground, Modal, FlatList, RefreshControl, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Icon, Footer, FooterTab, Content } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { CheckBox } from 'react-native-elements';
import { Base_Url, AppVersion } from '../constants/common';
import { identifier } from '@babel/types';
import DeviceInfo from 'react-native-device-info';
import ModalDropdown from 'react-native-modal-dropdown';
import Toast, { DURATION } from 'react-native-easy-toast';


class UpdateChildProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flatData: [],
      error: null,
      spinner: false,
      username: [],
      age: [],
      gender: [],
      interests: '0',
      pickerData: [{ data: [] }],
      currentIndexx: 0,
      selectedFruits: [],
      selectedFruits1: [],
      deleteArray: [{ deleted: [] }],
      sendInterests: [],
      currentSelect: [],
      language: 'java',
      modalVisible: false,
      isChecked: [],
      selectedLists: [],
      childArrayyy: [],
      refreshing: false,
      selectedText: ['Interests', 'Interests', 'Interests', 'Interests', 'Interests'],
      ItemIndex: '',
      user_token: '',
      addInterests: [],

    };
    this.modall = [];
  }

  setListModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  showModal = (index) => {


    console.log("ShowNodal", this.state.gender)

    this.setListModalVisible(true)
    this.setState({ currentIndexx: index })
    // console.log("this.state.currentIndexx",this.state.currentIndexx, this.state.pickerData)
  }

  closeModal = () => {

    console.log("Dismiss", this.state.gender)

    var selectedddd = [];
    for (var i in this.state.pickerData[this.state.currentIndexx].data) {
      if (this.state.pickerData[this.state.currentIndexx].data[i].checked) {
        selectedddd.push(this.state.pickerData[this.state.currentIndexx].data[i].name)
      }
    }
    if (selectedddd.length < 4) {
      alert("please select atleast 4 interest")
    }
    else {
      this.setListModalVisible(false)
      var alredySelectText = this.state.selectedText;

      var selectedText = this.state.selectedText;
      selectedText[this.state.currentIndexx] = selectedddd.join(', ');
      var sendInterests = this.state.sendInterests;
      sendInterests[this.state.currentIndexx] = selectedddd.join(',');
      this.setState({ selectedText: selectedText, refreshing: !this.state.refreshing, sendInterests: sendInterests, alredySelectText: alredySelectText })
    }

  }




  componentWillMount() {

    const { navigation } = this.props;
    var numberOfChilds = navigation.getParam('numberOfChilds');
    var childArray = navigation.getParam('childArray');
    var Flatdataaaa = [];
    var username = [];
    var age = [];
    var gender = [];
    var selectedText = [];
    var sendInterests = [];
    var userId = [];
    for (var i in childArray) {
      Flatdataaaa.push(i)
      username[i] = childArray[i].username;
      age[i] = childArray[i].age;
      gender[i] = childArray[i].gender;
      userId[i] = childArray[i].id;
      var childInterestName = [];
      for (var j in childArray[i].interests) {
        childInterestName.push(childArray[i].interests[j].interest)
      }
      selectedText[i] = childInterestName.join(', ');
      sendInterests[i] = childInterestName.join(',');


    }


    this.setState({ numberOfChilds: numberOfChilds, flatData: Flatdataaaa, username: username, age: age, gender: gender, selectedText: selectedText, sendInterests: sendInterests, userId: userId, alreadySelected: selectedText, childArrayyy: childArray })

    AsyncStorage.getItem("token").then((value) => {
      this.setState({ user_token: value })
      let that = this;
      this.getInterestData(value);
    }).done();

  }


  getInterestData(value) {
    this.setState({ spinner: true });
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });

    fetch(Base_Url + 'getInterestList', {
      method: "GET",
      headers: {
        'Authorization': value,
        'appVersion': AppVersion,
        'timezone': timzone,
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        var pickerData = [];
        var deleteArray = [];
        const { navigation } = this.props;
        var childArray = navigation.getParam('childArray');
        for (var i in childArray) {
          pickerData[i] = {};
          deleteArray.push({ deleted: [] })
          var dataaaa = [];
          for (var j in responseJson.data) {
            var checkTrue = false;
            for (var k in childArray[i].interests) {
              if (childArray[i].interests[k].interest == responseJson.data[j]) {
                checkTrue = true;
              }
            }
            if (checkTrue) {
              dataaaa.push({ name: responseJson.data[j], checked: true });
            }
            else {
              dataaaa.push({ name: responseJson.data[j], checked: false });
            }
          }
          pickerData[i].data = dataaaa;
        }
  
        this.setState({ spinner: false, pickerData: pickerData, allInterests: responseJson.data, deleteArray: deleteArray });
       
      }).catch((error) => {
        console.log(error);
      });




  }





  isValid = () => {
    const { username, age, gender, interests } = this.state;
    let valid = false;

    if (username.length > 0 && age.length > 0) {
      valid = true;
    }

    if (username.length === 0) {
      this.refs.toast.show('Please enter username', 1000);
    } else if (age.length === 0) {
      this.refs.toast.show('Please enter age', 1000);
    }
    else {

      return valid;
    }

  }




  onViewableItemsChanged = (viewableItems, changed) => {

    this.setState({ ItemIndex: viewableItems.index })

  }



  onUpdateChildProfile = () => {

    var currentUserName = this.state.username[this.state.flatData.length - 1];
    var currentAge = this.state.age[this.state.flatData.length - 1];
    var currentGender = this.state.gender[this.state.flatData.length - 1];
    var selectedInterest = this.state.selectedText[this.state.flatData.length - 1];
    var reg = /^[0-9\b]+$/


    console.log("hiiiii currentGender", currentUserName, currentAge, currentGender, selectedInterest)

    if (!currentUserName || currentUserName.length === 0) {
      this.refs.toast.show('Please enter username', 1000);
    }
    else if (!currentAge || currentAge.length === 0) {
      this.refs.toast.show('Please enter age', 1000);
    }
    else if (!currentGender || currentGender == 'Gender') {
      this.refs.toast.show('Please select gender', 1000);
    }
    else if (!selectedInterest || selectedInterest.length === 0 || selectedInterest == 'Interests') {
      this.refs.toast.show('Please Select Interests', 1000);

    }
    else if (reg.test(currentAge) === false) {
      this.refs.toast.show('Please enter valid age', 1000);

    }

    else {
      console.log(this.state.deleteArray)
      var arrayTest = [];
      for (var i in this.state.username) {

        var selectedIntrest = this.state.sendInterests[i].split(',');

        console.log(selectedIntrest, this.state.childArrayyy[i])
        for (var j in selectedIntrest) {
          if (this.state.childArrayyy[i]) {
            for (var k in this.state.childArrayyy[i].interests) {
              if (selectedIntrest[j] == this.state.childArrayyy[i].interests[k].interest) {
                selectedIntrest.splice(j, 1);
              }
            }
          }

        }

        arrayTest.push({ username: this.state.username[i], age: this.state.age[i], gender: this.state.gender[i], id: this.state.userId[i] ? this.state.userId[i] : '', addInterests: selectedIntrest, deleteInterests: this.state.deleteArray[i].deleted })
        // console.log("Array======>>>>>>", arrayTest)
      }
      var childss = [];
      for (var i in this.state.username) {
        var interestsssss = this.state.sendInterests[i].split(',');
        childss.push({ username: this.state.username[i], age: this.state.age[i], gender: this.state.gender[i], interests: interestsssss })
      }


      //  console.log("hello last final array ", childss)

      var timzone = DeviceInfo.getTimezone();
      this.setState({ timzone: timzone, spinner: true });

      fetch(Base_Url + 'editChildProfile', {
        method: "POST",
        headers: {
          'Authorization': this.state.user_token,
          'appVersion': AppVersion,
          'timezone': timzone,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          "deleteChilds": [],
          "childs": arrayTest

        })

      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.data = responseJson;
          this.setState({ spinner: false });

          let that = this;

          if (responseJson.status == 1) {
            AsyncStorage.setItem('childs', JSON.stringify(responseJson.childArray));           
            that.refs.toast.show(responseJson.message, 300);
            setTimeout(function () { that.props.navigation.navigate('Myprofile', { refresh: 'refresh' }) }, 200);


          } else {
            that.refs.toast.show(responseJson.message, 1000);

          }

        }).catch((error) => {
          console.log(error);
        });

    }

  }


  isIconCheckedOrNot = (item, index) => {
    var pickerData = this.state.pickerData;
    var deleteArray = this.state.deleteArray;
    pickerData[this.state.currentIndexx].data[index].checked = !pickerData[this.state.currentIndexx].data[index].checked;
    if (pickerData[this.state.currentIndexx].data[index].checked) {

      if (this.state.childArrayyy[this.state.currentIndexx]) {
        this.state.childArrayyy[this.state.currentIndexx].interests.some(itemm => {
          if (itemm.interest === pickerData[this.state.currentIndexx].data[index].name) {
            if (deleteArray[this.state.currentIndexx].deleted.includes(itemm.id)) {
              console.log("deleteInclude")
              deleteArray[this.state.currentIndexx].deleted.splice(deleteArray[this.state.currentIndexx].deleted.indexOf(itemm.id), 1)
            }
          }

        })
      }
    }
    else {
      if (this.state.childArrayyy[this.state.currentIndexx]) {
        this.state.childArrayyy[this.state.currentIndexx].interests.some(itemm => {
          if (itemm.interest === pickerData[this.state.currentIndexx].data[index].name) {
            deleteArray[this.state.currentIndexx].deleted.push(itemm.id)
          }

        })
      }
    }
    console.log("deleteArray=====>>>", deleteArray)
    this.setState({ pickerData: pickerData, isRefreshing: !this.state.isRefreshing, deleteArray: deleteArray })
    
  }



  _onRefresh = () => {
    this.setState({ refreshing: true });
    fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  changePickerValue = (itemValue, itemPosition) => {
    this.setState({ language: itemValue, choosenIndex: itemPosition })
  }



  updateUser = (username, index) => {

    var usernameee = this.state.username;
    // usernameee[index] = !usernameee[index] ? username.replace(/\s/g, '') : username;
    usernameee[index] = username.replace(/\s/g, '');
    this.setState({ username: usernameee, refreshing: !this.state.refreshing })
    // alert(JSON.stringify(this.state.username[index]))


  }


  updateAge = (age, index) => {
    var ageeeee = this.state.age;
    ageeeee[index] = age;
    this.setState({ age: ageeeee, refreshing: !this.state.refreshing })
  }


  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }


  addMore = () => {


    var currentUserName = this.state.username[this.state.flatData.length - 1];
    var currentAge = this.state.age[this.state.flatData.length - 1];
    var currentGender = this.state.gender[this.state.flatData.length - 1];
    var selectedInterest = this.state.selectedText[this.state.flatData.length - 1];
    // console.log("hiiiii selectedInterest", selectedInterest)
    var reg = /^[0-9\b]+$/
    if (!currentUserName || currentUserName.length === 0) {
      that.refs.toast.show('Please enter username', 1000);
    }
    else if (!currentAge || currentAge.length === 0) {
      that.refs.toast.show('Please enter age', 1000);
    }
    else if (!currentGender || currentGender.length === 0) {
      that.refs.toast.show('Please select gender', 1000);
    }
    else if (!selectedInterest || selectedInterest.length === 0 || selectedInterest == 'Interests') {
      that.refs.toast.show('Please Select Interests', 1000);
    }
    else if (reg.test(currentAge) === false) {
      that.refs.toast.show('Please enter valid age', 1000);
    }


    else {
      var pickerData = this.state.pickerData;
      var deleteArrayy = this.state.deleteArray;
      deleteArrayy.push({ deleted: [] })
      // dataaaaaaa.push({name: responseJson.data[j], checked: false}) ;
      var dataaaaaaa = [];
      for (var i in this.state.allInterests) {
        dataaaaaaa.push({ name: this.state.allInterests[i], checked: false });
      }
      pickerData.push({ data: dataaaaaaa })
      // console.log("pickerData",pickerData)

      var selectedInterest = this.state.selectedText;
      selectedInterest[this.state.flatData.length] = 'Interests';
      var allGender = this.state.gender;
      allGender[this.state.flatData.length] = 'Gender';

      var flatData = this.state.flatData;


      // console.log(flatData)
      flatData.push('1')
      this.setState({ flatData: flatData, refreshing: !this.state.refreshing, gender: allGender, isChecked: [], selectedInterest: selectedInterest, currentSelect: [], selectedLists: [], pickerData: pickerData, isRefreshing: !this.state.isRefreshing, deleteArray: deleteArrayy })
    }

  }





  selectGender = (index, value) => {
    var genderr = this.state.gender;
    genderr[this.state.flatData.length - 1] = value;
    // this.state.flatData.length - 1
    this.setState({ gender: genderr })
    console.log("genderrrrrr", this.state.gender, this.state.currentIndexx)
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
          <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 25, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Update Child Profile</Text>
          </Body>
          <Right>

          </Right>
        </Header>


        <KeyboardAvoidingView
          behavior="padding" enabled>

          {/* <View> */}
          <ScrollView
            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}>
            <View style={styles.container}>

              <Spinner
                visible={this.state.spinner} />

              <View style={{ width: '60%', marginTop: 50, paddingBottom: 70 }}>
                <FlatList
                  onViewableItemsChanged={this.onViewableItemsChanged}
                  data={this.state.flatData}
                  refreshing={this.state.refreshing}
                  renderItem={({ item, index }) =>



                    <View style={{ marginTop: 40 }}>

                      <View style={styles.viewStyle}>
                        <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', borderTopLeftRadius: 10, alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                          <Image source={require('../assets/images/user.png')} />
                        </View>
                        <View style={{ width: '85%', height: 60, backgroundColor: 'white', borderTopRightRadius: 10, paddingLeft: 10, borderBottomWidth: 1, borderColor: '#dcdcdc' }}>
                          <TextInput style={styles.textInputStyle} placeholder="Username" returnKeyType={"next"}
                            onSubmitEditing={() => { this.age.focus(); }}
                            value={this.state.username[index]}
                            onChangeText={(username) => this.updateUser(username, index)} />


                        </View>
                      </View>


                      <View style={styles.viewStyle}>
                        <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                          <Image source={require('../assets/images/cal.png')} />
                        </View>
                        <View style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 10, borderBottomWidth: 1, borderColor: '#dcdcdc' }}>
                          <TextInput style={styles.textInputStyle} placeholder="Age" returnKeyType={"done"}
                            keyboardType='numeric'
                            maxLength={2}
                            ref={(input) => { this.age = input; }}
                            value={this.state.age[index]}
                            onChangeText={(age) => this.updateAge(age, index)} />
                        </View>
                      </View>

                      <View style={styles.viewStyle}>
                        <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                          <Image source={require('../assets/images/gender.png')} />
                        </View>
                        <TouchableOpacity activeOpacity={1} style={{
                          width: '85%', height: 60, backgroundColor: 'white',
                          paddingLeft: 10, borderBottomWidth: 1, flexDirection: 'row', borderColor: '#dcdcdc'
                        }} onPress={() => this.modall[index].show()}>
                          <ModalDropdown
                            defaultValue={this.state.gender[index]}
                            ref={ref => { this.modall[index] = ref }}
                            style={{ height: 60, width: '92%', justifyContent: 'center' }}
                            textStyle={{
                              color: '#737373',
                              fontSize: 20,
                              width: '100%',
                              fontFamily: 'HelveticaNeueLTStd-Roman'
                            }}
                            dropdownTextStyle={{
                              color: '#737373',
                              fontSize: 20,
                              padding: 10,
                              width: '100%',
                              fontFamily: 'HelveticaNeueLTStd-Roman',
                            }}
                            onSelect={this.selectGender}
                            dropdownStyle={{ width: '50%', height: 100, backgroundColor: '#fff', borderWidth: 1, borderColor: '#737373' }}
                            options={['M', 'F']}
                          />
                          <Image source={require('../assets/images/down.png')} style={{ marginTop: 25 }} />
                        </TouchableOpacity>
                      </View>


                      <View style={styles.viewStyle}>
                        <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 10 }}>
                          <Image source={require('../assets/images/like.png')} />
                        </View>
                        <TouchableOpacity style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 10, borderBottomRightRadius: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}
                          onPress={() => this.showModal(index)}>

                          {this.state.selectedText[index].length > 45 ?
                            <Text style={{
                              width: '92%', fontSize: 20, color: 'black',
                              fontFamily: 'HelveticaNeueLTStd-Roman'
                            }} >{this.state.selectedText[index].substring(0, 45)}
                              <Text>...</Text>
                            </Text>
                            :

                            <Text style={{
                              width: '92%', fontSize: 20, color: this.state.selectedText[index] === 'Interests' ? '#dcdcdc' : '#737373',
                              fontFamily: 'HelveticaNeueLTStd-Roman'
                            }} >{this.state.selectedText[index]}
                            </Text>}
                          <Image source={require('../assets/images/down.png')} />

                        </TouchableOpacity>
                      </View>



                    </View>


                  }

                  ItemSeparatorComponent={this.renderSeparator}
                />

                {this.state.flatData.length < 5 ?
                  <Text style={styles.addChild} onPress={this.addMore}>+ Add Another Child</Text>
                  : null}

                <TouchableOpacity onPress={() => { this.onUpdateChildProfile() }} style={styles.buttonContainer}>
                  <Text style={{ color: '#527BF3', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>SUBMIT</Text>
                </TouchableOpacity>




              </View>

            </View>
          </ScrollView>





          <Modal
            visible={this.state.modalVisible}
            transparent={true}>

            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)'
            }}>

              <View style={{
                width: '60%',
                height: '60%',
              }}>


                <View style={{ flexDirection: 'column', backgroundColor: 'white', borderRadius: 10 }}>

                  <FlatList
                    data={this.state.pickerData[this.state.currentIndexx].data}
                    renderItem={({ item, index }) =>
                      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} onPress={() => this.isIconCheckedOrNot(item, index)}>
                        <CheckBox
                          title={item.name}
                          checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} style={{ width: 30, height: 30 }} />}
                          uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} style={{ width: 30, height: 30 }} />}
                          containerStyle={{ backgroundColor: 'tranparent', borderWidth: 0 }}
                          checked={item.checked}
                          onPress={() => this.isIconCheckedOrNot(item, index)}
                          textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', fontSize: 22, fontWeight: '100', paddingLeft: 10 }} />
                      </TouchableOpacity>

                    }
                    ItemSeparatorComponent={this.renderSeparator}
                    horizontal={false}
                    refreshing={this.state.isRefreshing}

                  />


                  <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 15, backgroundColor: '#527BF3' }} onPress={() => { this.closeModal(this) }}>
                    <Text style={{ fontSize: 18, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold' }}>SUBMIT</Text>
                  </TouchableOpacity>

                </View>

              </View>

            </View>

          </Modal>







          {/* </View> */}
        </KeyboardAvoidingView>

        <Toast ref="toast" />
      </ImageBackground>
    );
  }
}


export default UpdateChildProfile;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },
  textInputStyle: {
    width: '100%',
    height: 60,
    fontSize: 20,
    color: '#737373',
    fontFamily: 'HelveticaNeueLTStd-Roman'

  },
  textInputStyle2: {
    width: '92%',
    height: 60,
    fontSize: 20,
    color: '#737373',
    fontFamily: 'HelveticaNeueLTStd-Roman'

  },

  buttonContainer: {
    width: '100%',
    height: 60,
    paddingTop: 15,
    justifyContent: 'center',
    paddingBottom: 5,
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  viewStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  account: {
    marginTop: 30,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',

  },

  textUndeline: {
    marginTop: 30,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Roman'


  },
  addChild: {
    alignSelf: 'flex-end',
    marginTop: 30,
    fontSize: 20,
    color: 'white',
    textDecorationLine: 'underline',


  }
});