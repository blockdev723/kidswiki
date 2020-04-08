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



class Createchildprofile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flatData: ['0'],
      error: null,
      spinner: false,
      username: [],
      age: [],
      gender: [],
      interests: '0',
      pickerData: [{data: []}],
      currentIndexx: 0,
      selectedFruits: [],
      selectedFruits1: [],
      sendInterests: [],
      currentSelect: [],
      language: 'java',
      modalVisible: false,
      isChecked: [],
      selectedLists: [],
      refreshing: false,
      selectedText: ['Interests'],
      ItemIndex: '',
      user_token: ''
    };

    this.modall = [];

  }

  setListModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  showModal = (index) => {
    this.setListModalVisible(true)
    this.setState({currentIndexx: index})
  }


  closeModal = () => {
    var selectedddd = [];
    for(var i in this.state.pickerData[this.state.currentIndexx].data){
          if(this.state.pickerData[this.state.currentIndexx].data[i].checked){
            selectedddd.push(this.state.pickerData[this.state.currentIndexx].data[i].name)
          }
    }
    if(selectedddd.length<4){
        alert("please select atleast 4 interest")
    }
    else{
          this.setListModalVisible(false)  
          var alredySelectText = this.state.selectedText ;

          var selectedText = this.state.selectedText;
          selectedText[this.state.currentIndexx] = selectedddd.join(', ');
          var sendInterests = this.state.sendInterests;
          sendInterests[this.state.currentIndexx] = selectedddd.join(',');
          this.setState({ selectedText: selectedText, refreshing: !this.state.refreshing, sendInterests: sendInterests , alredySelectText : alredySelectText })
    }
   
}

  componentWillMount() {
    AsyncStorage.getItem("token").then((value) => {
      console.log("user_token home", value)
      this.setState({ user_token: value , spinner: false  })
      this.getInterestData(value);
    }).done();

  }

  getInterestData(value) {
    console.log("this.state.user_token",value)
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
       
          pickerData[0] = {};
          var dataaaa = [];
          for(var j in responseJson.data){
              dataaaa.push({name: responseJson.data[j], checked: false}) ;
          }
          pickerData[0].data = dataaaa;
       
        console.log("pickerData at final ",pickerData, this.state.currentIndexx)
        this.setState({ spinner: false, pickerData: pickerData, allInterests: responseJson.data, });
      }).catch((error) => {
        console.log(error);
      });


  

  }






  isValid() {
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

    console.log("Visible items are", viewableItems);
    console.log("Changed in this iteration", changed);
  }



  onCreateChildProfile() {
    var currentUserName =  this.state.username[this.state.flatData.length - 1];
    var currentAge = this.state.age[this.state.flatData.length - 1];
    var currentGender = this.state.gender[this.state.flatData.length - 1];
    var selectedInterest = this.state.selectedText[this.state.flatData.length - 1];
    var reg = /^[0-9\b]+$/

    if (!currentUserName || currentUserName.length === 0) {
      this.refs.toast.show('Please enter username', 1000);
    }
    else if (!currentAge || currentAge.length === 0) {
      this.refs.toast.show('Please enter age', 1000);
    } 
    else if (reg.test(currentAge) === false) {
      this.refs.toast.show('Please enter valid age', 1000);
    }
    else if (!currentGender || currentGender.length === 0) {
      this.refs.toast.show('Please select gender', 1000);
    }
    else if (!selectedInterest || selectedInterest.length === 0 || selectedInterest == 'Interests') {
      this.refs.toast.show('Please Select Interests', 1000);
    }
   
    else {

      var childss = [];
      for (var i in this.state.username) {
        var interestsssss = this.state.sendInterests[i].split(',');
        childss.push({ username: this.state.username[i], age: this.state.age[i], gender: this.state.gender[i], interests: interestsssss })
      }

      var timzone = DeviceInfo.getTimezone();
      this.setState({ timzone: timzone , spinner: true });

      fetch(Base_Url + 'createChildProfile', {
        method: "POST",
        headers: {
          'Authorization': this.state.user_token,
          'appVersion': AppVersion,
          'timezone': timzone,
          'Content-Type': 'application/json',
        },


        body: JSON.stringify({ childs: childss })


      })
        .then((response) => response.json())
        .then((responseJson) => {
        this.data = responseJson;
          this.setState({ spinner: false });
          console.log(responseJson);
          if (responseJson.status == 1) {
            AsyncStorage.setItem('childs', JSON.stringify(responseJson.childArray));
            this.props.navigation.navigate('Subscription')
          } else {
            this.refs.toast.show(responseJson.message, 1000);
          }

        }).catch((error) => {
          console.log(error);        
          let that = this;
          setTimeout(function () { that.setState({ spinner: false}) }, 1500);
        });


    }

  }




 



  isIconCheckedOrNot = (item, index) => {
    var pickerData = this.state.pickerData;
    var deleteArray = this.state.deleteArray;
    pickerData[this.state.currentIndexx].data[index].checked = !pickerData[this.state.currentIndexx].data[index].checked;
  
    this.setState({pickerData: pickerData, isRefreshing: !this.state.isRefreshing})
    console.log("deleteArray",deleteArray)
    
  }




  _onRefresh = () => {
    this.setState({ refreshing: true });
    fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  changePickerValue = (itemValue, itemPosition) => {
    alert(itemValue)
    this.setState({ language: itemValue, choosenIndex: itemPosition })
  }



  updateUser = (username, index) => {
    var usernameee = this.state.username;
    usernameee[index] = username.replace(/\s/g, '') ;
    this.setState({ username: usernameee,refreshing: !this.state.refreshing  })
  }


  updateAge = (age, index) => {
   
    var ageeeee = this.state.age;
    ageeeee[index] = age;
    this.setState({ age: ageeeee })
  }


  

  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }


  addMore = () => {
    var currentUserName = this.state.username[this.state.flatData.length - 1];
    var currentAge = this.state.age[this.state.flatData.length - 1];
    var currentGender = this.state.gender[this.state.flatData.length - 1];
    var selectedInterest = this.state.selectedText[this.state.flatData.length - 1];
    console.log("hiiiii selectedInterest", selectedInterest)
    var reg = /^[0-9\b]+$/
    if (!currentUserName || currentUserName.length === 0) {
      this.refs.toast.show('Please enter username', 1000);
    }
    else if (!currentAge || currentAge.length === 0) {
      this.refs.toast.show('Please enter age', 1000);
    }
    else if (reg.test(currentAge) === false) {
      this.refs.toast.show('Please enter valid age', 1000);
    }
    else if (!currentGender || currentGender.length === 0) {
      this.refs.toast.show('Please select gender', 1000);

    }
    else if (!selectedInterest || selectedInterest.length === 0 || selectedInterest == 'Interests') {
      this.refs.toast.show('Please Select Interests', 1000);
    }

    else {

      var pickerData = this.state.pickerData;
      var dataaaaaaa = [];
      for(var i in this.state.allInterests){
        dataaaaaaa.push({name: this.state.allInterests[i], checked: false}) ;
      }
      pickerData.push({data: dataaaaaaa})

      var selectedInterest = this.state.selectedText;
      selectedInterest[this.state.flatData.length] = 'Interests';
      var flatData = this.state.flatData;
      flatData.push('1')
      this.setState({ flatData: flatData, refreshing: !this.state.refreshing, isChecked: [], selectedInterest: selectedInterest, currentSelect: [], selectedLists: [], pickerData: pickerData })
    }

  }





  selectGender = (index, value) => {
    var genderr = this.state.gender;
    genderr[this.state.flatData.length - 1] = value;
    this.setState({ gender: genderr })
  }






  render() {
    return (
      <ImageBackground source={require('../assets/images/bgimg.png')} style={{ width: '100%', height: '100%' }}>
        <Header style={{ backgroundColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.5)', borderBottomWidth: 0.5, elevation: 0, shadowOpacity: 0 }}>
          <Left style={{ flex: 1 }}>

          </Left>
          <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 22, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Create Child Profile</Text>
          </Body>
          <Right>

          </Right>
        </Header>


        <KeyboardAvoidingView
          behavior="padding" enabled>


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
                            value={this.state.username[index]}
                            onSubmitEditing={() => { this.age.focus(); }}
                            onChangeText={(username) => this.updateUser(username, index)} />


                        </View>
                      </View>


                      <View style={styles.viewStyle}>
                        <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                          <Image source={require('../assets/images/cal.png')} />
                        </View>
                        <View style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 10, borderBottomWidth: 1, borderColor: '#dcdcdc' }}>
                          <TextInput style={styles.textInputStyle} placeholder="Age" returnKeyType={"done"}
                            keyboardType="number-pad"
                            maxLength={2}
                            ref={(input) => { this.age = input; }}   
                            onChangeText={(age) => this.updateAge(age, index)}
                              />
                        </View>
                      </View>

       

                      <View style={styles.viewStyle}>
                        <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                          <Image source={require('../assets/images/gender.png')} />
                        </View>
                        <TouchableOpacity  activeOpacity={1} style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 10, borderBottomWidth: 1, flexDirection: 'row', borderColor: '#dcdcdc' }} onPress={() => this.modall[index].show()}>
                            <ModalDropdown          
                              defaultValue={('Gender')}
                              ref={ref => {this.modall[index] = ref}}
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
                              // options={this.state.categories}/>
                              options={['Male', 'Female']} />                    
                          <Image source={require('../assets/images/down.png')} style={{ marginTop: 25 }} />
                        </TouchableOpacity>
                      </View>


                      <View style={styles.viewStyle}>
                        <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 10 }}>
                          <Image source={require('../assets/images/like.png')} />
                        </View>
                        <TouchableOpacity style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 10, borderBottomRightRadius: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}
                          onPress={(nn)=>this.showModal(index)}>

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

                <TouchableOpacity onPress={() => { this.onCreateChildProfile() }} style={styles.buttonContainer}>
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
                      <TouchableOpacity  active style={{ flex: 1, flexDirection: 'row', borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }}  onPress={() => this.isIconCheckedOrNot(item, index)}>
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








        </KeyboardAvoidingView>

         <Toast ref="toast" />
      </ImageBackground>
    );
  }
}


export default Createchildprofile;




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