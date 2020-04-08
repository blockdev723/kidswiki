import React, { Component, PropTypes } from 'react';
import { Animated, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, AsyncStorage, ImageBackground, FlatList, Dimensions, Easing, WebView, ActivityIndicator } from 'react-native';
// import {Article} from './Article';
// import {Chat} from './Chat';
import { Home } from './Home';
import { Topics } from './Topics';
import { Favourite } from './Favourite';
import { Featuredlist } from './Featuredlist';
import { History } from './History';
import { Settings } from './Settings';
import { Base_Url, AppVersion } from '../constants/common';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements';

var { viewportHeight, viewportWidth } = Dimensions.get('window');
global.selectedChild = { username: '' }
global.combinedData = [];
global.firstBorderColor1 = ['#527CF3'];
global.firstBorderColor2 = ['#527CF3'];
global.firstBorderColor3 = ['#527CF3'];
global.borderWidth1 = []
global.borderWidth2 = [];
global.borderWidth3 = [];



const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};




class Sidenavigator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'Home',
      modalVisible: false,
      selected: '1',
      currentScreen: 'Home',
      selected: '1',
      popoverShow: false,
      visible: [],
      visible2: [],
      visible3: [],
      visible4: [],
      visibleFeature: [],
      currentKey: 0,
      refreshing: false,
      descriptionShow: false,
      newListShow: false,
      childs: [{ 'username': '' }],
      isFilterByTagPanelOpen: false,
      htmlForm: '',
      spinner: false,
      showData: true,
      listDataFirst: [],
      listDataSecond: [],
      listDataThird: [],
      listDataFourth: [],
      listDataFifth: [],
      combinedData: [],
      checked: [],
      onThisDay: {},
      listTitleFirst: '',
      listTitleSecond: '',
      listTitleThird: '',
      listTitleFourth: '',
      eventDate: '',
      thumbnail: '',
      on_this_day_text: '',
      listTopicFirst: '',
      listTopicSecond: '',
      listTopicThird: '',
      listTopicFourth: '',
      bgColor: [
        'red',
        'blue',
        'yellow',
      ],
      heighttt: 90,
      newFirstTitle: '',
      newSecondTitle: '',
      newThirdTitle: '',
      newFourthTitle: '',
      hasMoreFirst: false,
      hasMoreSecond: false,
      hasMoreThird: false,
      hasMoreFourth: false,
      user_token: '',
      nameFormatted: '',
      featuredArticles: [],
      selectedChild: { username: '' },
      onThisArticle: {},
      featuredImage: '',
      captionFull: '',
      nameOriginal: '',
      featureHasMore: false,
      hitViewableMethod: false,
      visibleHistory: [],
      visibleFeature: [],
      borderWidth1: [],
      borderWidth2: [],
      borderWidth3: [],
      firstBorderColor1: [],
      firstBorderColor2: [],
      firstBorderColor3: [],
      historyKey: 0,
      featuredKey: 0,
      historyWidth1: [],
      historyWidth2: [],
      historyWidth3: [],
      newListShow: false,
      featuredWidth1: [],
      featuredWidth2: [],
      featuredWidth3: [],
      userList: [],
      isChecked: false,
      listTitle: '',
      titleForApi: '',
    };
    this._onClickSetting = this._onClickSetting.bind(this);
    this._onClickSearch = this._onClickSearch.bind(this);
    this._onClickNotification = this._onClickNotification.bind(this);
    this._onClickChild = this._onClickChild.bind(this);
    this._onClickList = this._onClickList.bind(this);

  }



  componentWillReceiveProps(nextProps) {
    AsyncStorage.getItem("token").then((value) => {
      console.log("user_token side", value)
      this.setState({ user_token: value })
    }).done();
    global.myvar = 'true';
  }

  goNext = (screen, selected) => {
    this.setState({ currentScreen: screen, selected: selected })
  }

  goToSettings = () => {
    this.setModalVisible(false);
    this.goNext('Settings', '6')
  }


  getHomeData() {
    console.log("GETHOMEDATA==========>>>>>>>", global.user_token + "\n" + this.state.selectedChild.id)

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'getRowsByRecommendationEngine', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': global.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,
        maxRows: '4'
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        console.log("responseJson", AppVersion + "\n" + timzone + "\n" + global.user_token)
        console.log("responseJson.data.length", responseJson.data)
        if (responseJson.status == 1) {

          this.getUserList();
          var combinee = this.state.combinedData;
          var finalArray = combinee.concat(responseJson.data);
          // global.combinedData = finalArray;
          this.setState({ showData: true, spinner: false, combinedData: finalArray });
          var border1 = [], border2 = [], border3 = [], bordercolor1 = [], bordercolor2 = [], bordercolor3 = [], featuredBorder1 = [], featuredBorder2 = [], featuredBorder3 = []
            , historyBorder1 = [], historyBorder2 = [], historyBorder3 = [];
          for (var i in global.combinedData) {
            global.borderWidth1[i] = 4;
            global.borderWidth2[i] = 2;
            global.borderWidth3[i] = 2;
            global.firstBorderColor1[i] = i == 0 ? '#527CF3' : 'white';
            global.firstBorderColor2[i] = i == 0 ? '#BDBDBD' : 'white';
            global.firstBorderColor3[i] = i == 0 ? '#BDBDBD' : 'white';

          }

          AsyncStorage.setItem('homeData', JSON.stringify(global.combinedData));
        }
        else {
          let that = this;
          setTimeout(function () { that.setState({ spinner: false }) }, 1500);
          Toast.show(responseJson.message, Toast.SHORT);
        }


      }).catch((error) => {
        console.log(error);
      });

  }

  goToForgot = () => {
    this.setModalVisible(false);
    this.props.navigation.navigate('Forgot')
  }


  _onClickSetting(item) {
    this.props.navigation.navigate(item);
  }

  _onClickSearch(item) {
    this.props.navigation.navigate(item);
  }

  _onClickList(screen, item, titleApi, selectedChild, seed) {
    this.props.navigation.navigate(screen, { interest: item, titleForApi: titleApi, selectedChild: selectedChild, seed: seed });
  }

  _onClickNotification(item) {
    this.props.navigation.navigate(item);
  }

  _onClickChild(item) {
    this.props.navigation.navigate(item);
  }

  _onClickBrowse = (item,  browseLevelFirst , browseLevelSecond ) => {
    this.props.navigation.navigate(item, { browseLevelFirst: browseLevelFirst  , browseLevelSecond :browseLevelSecond});
  }



  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }
  setDummyModal = () => {

  }


  state = {
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }



  _onLogout = (token, screen) => {
    var _this = this
    var timezone = DeviceInfo.getTimezone();
    this.setState({ timezone: timezone });

    fetch(Base_Url + 'logOutWikiUser', {
      method: "GET",
      headers: {
        'appVersion': AppVersion,
        'timezone': timezone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token

      }
    })
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.status == 1) {
          AsyncStorage.removeItem('token');
          _this.props.navigation.navigate(screen)
          global.myvar = 'false'
          global.state = {
            currentScreen: 'Home',
            selected: '1',
            popoverShow: false,
            visible: [],
            visible2: [],
            visible3: [],
            visible4: [],
            visibleFeature: [],
            refreshing: false,
            descriptionShow: false,
            newListShow: false,
            childs: [{ 'username': '' }],
            isFilterByTagPanelOpen: false,
            htmlForm: '',
            spinner: false,
            showData: false,
            listDataFirst: [],
            listDataSecond: [],
            listDataThird: [],
            listDataFourth: [],
            listDataFifth: [],
            checked: [],
            onThisDay: {},
            listTitleFirst: '',
            listTitleSecond: '',
            listTitleThird: '',
            listTitleFourth: '',
            eventDate: '',
            thumbnail: '',
            on_this_day_text: '',
            listTopicFirst: '',
            listTopicSecond: '',
            listTopicThird: '',
            listTopicFourth: '',
            bgColor: [
              'red',
              'blue',
              'yellow',
            ],
            heighttt: 90,
            newFirstTitle: '',
            newSecondTitle: '',
            newThirdTitle: '',
            newFourthTitle: '',
            hasMoreFirst: false,
            hasMoreSecond: false,
            hasMoreThird: false,
            hasMoreFourth: false,
            user_token: '',
            nameFormatted: '',
            featuredArticles: [],
            selectedChild: { username: '' },
            onThisArticle: {},
            featuredImage: '',
            captionFull: '',
            nameOriginal: '',
            featureHasMore: false,

            visibleHistory: [],
            visibleFeature: [],
            borderWidth1: [],
            borderWidth2: [],
            borderWidth3: [],
            firstBorderColor1: [],
            firstBorderColor2: [],
            firstBorderColor3: [],
            historyKey: 0,
            featuredKey: 0,
            historyWidth1: [],
            historyWidth2: [],
            historyWidth3: [],
            newListShow: false,
            featuredWidth1: [],
            featuredWidth2: [],
            featuredWidth3: [],
            combinedData: [],
            userList: [],
            isChecked: false,
            listTitle: '',
            titleForApi: '',

          };
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

  showVisible = (index, position) => {

    console.log(index + "\n" + position)


    if (position == 0) {
      var visible = this.state.visible;
      visible[index] = !visible[index]
      for (var i in visible) {
        if (i != index) {
          visible[i] = false;
        }
      }
      this.setState({ visible: visible, visibleHistory: [], refreshing: !this.state.refreshing })
    }
    else if (position == 'history') {
      var visible = this.state.visibleHistory;
      visible[index] = !visible[index]
      for (var i in visible) {
        if (i != index) {
          visible[i] = false;
        }
      }
      this.setState({ visibleHistory: visible, visible: [], refreshing: !this.state.refreshing })
    }
    else if (position == 'feature') {
      var visible = this.state.visibleFeature;
      visible[index] = !visible[index]
      for (var i in visible) {
        if (i != index) {
          visible[i] = false;
        }
      }
      this.setState({ visibleFeature: visible, visible: [], visibleHistory: [], refreshing: !this.state.refreshing })
    }



  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    console.log("Visible items are");
    const found3 = viewableItems.some(el => el.index == 1);
    const found = viewableItems.some(el => el.index == 3);
    const found2 = viewableItems.some(el => el.index == 6);
    if (found) {
      global.borderWidth1[this.state.currentKey] = 2;
      global.borderWidth2[this.state.currentKey] = 4;
      global.borderWidth3[this.state.currentKey] = 2;
      global.firstBorderColor1[this.state.currentKey] = this.state.currentKey == 0 ? '#BDBDBD' : 'white';
      global.firstBorderColor2[this.state.currentKey] = this.state.currentKey == 0 ? '#527CF3' : 'white';
      global.firstBorderColor3[this.state.currentKey] = this.state.currentKey == 0 ? '#BDBDBD' : 'white';


    }
    if (found2) {
      global.borderWidth1[this.state.currentKey] = 2;
      global.borderWidth2[this.state.currentKey] = 2;
      global.borderWidth3[this.state.currentKey] = 4;
      global.firstBorderColor1[this.state.currentKey] = this.state.currentKey == 0 ? '#BDBDBD' : 'white';
      global.firstBorderColor2[this.state.currentKey] = this.state.currentKey == 0 ? '#BDBDBD' : 'white';
      global.firstBorderColor3[this.state.currentKey] = this.state.currentKey == 0 ? '#527CF3' : 'white';
    }
    if (found3) {
      global.borderWidth1[this.state.currentKey] = 4;
      global.borderWidth2[this.state.currentKey] = 2;
      global.borderWidth3[this.state.currentKey] = 2;
      global.firstBorderColor1[this.state.currentKey] = this.state.currentKey == 0 ? '#527CF3' : 'white';
      global.firstBorderColor2[this.state.currentKey] = this.state.currentKey == 0 ? '#BDBDBD' : 'white';
      global.firstBorderColor3[this.state.currentKey] = this.state.currentKey == 0 ? '#BDBDBD' : 'white';
    }


  }

  _getRandomColor() {
    var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
    this.setState({
      selectedColor: item,
    })
  }





  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
  }


  componentWillUnmount() {
    // Remember state for the next mount
    console.log('componentWillUnmount');
    // global.state = this.state;
  }



  componentDidMount() {

    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {

        console.log("user_token home", value, childs)
        var childsss = JSON.parse(childs);
        global.user_token = value;
        global.childs = childsss;
        global.selectedChild = childsss[0];
        this.setState({ spinner: true })
        this._getRandomColor()
        this.getHomeDataFirst();

      }).done();
    }).done();
    // }

  }



  getHomeDataFirst() {

    console.log("getHomeDataFirst=========>>>>>>", global.user_token + "\n" + global.selectedChild.id)

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'getRowsByRecommendationEngine', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': global.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,
        maxRows: '4'
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        console.log("responseJson", AppVersion + "\n" + timzone + "\n" + global.user_token)
        console.log("responseJson.data.length", responseJson.data)
        if (responseJson.status == 1) {

          this.getUserList();
          global.combinedData = responseJson.data;
          this.setState({ showData: true, spinner: false, combinedData: responseJson.data });
          var border1 = [], border2 = [], border3 = [], bordercolor1 = [], bordercolor2 = [], bordercolor3 = [], featuredBorder1 = [], featuredBorder2 = [], featuredBorder3 = []
            , historyBorder1 = [], historyBorder2 = [], historyBorder3 = [];

          setTimeout(function () {
            for (var i in global.combinedData) {
              global.borderWidth1[i] = 4;
              global.borderWidth2[i] = 2;
              global.borderWidth3[i] = 2;
              global.firstBorderColor1[i] = i == 0 ? '#527CF3' : 'white';
              global.firstBorderColor2[i] = i == 0 ? '#BDBDBD' : 'white';
              global.firstBorderColor3[i] = i == 0 ? '#BDBDBD' : 'white';
            }


          }, 100);

          console.log("COMBINEEE======>>>>>" + global.borderWidth1)
          AsyncStorage.setItem('homeData', JSON.stringify(global.combinedData));
        }
        else {

          let that = this;
          setTimeout(function () { that.setState({ spinner: false }) }, 1500);
          Toast.show(responseJson.message, Toast.SHORT);
        }


      }).catch((error) => {
        console.log(error);
      });

  }





  getUserList(item, pos) {

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'getUserLists', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': global.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,


      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;


        console.log("getUserList===>>>>>", responseJson.data);

        if (responseJson.status == 1) {
          var checkeddd = [];
          for (var i in responseJson.data) {
            checkeddd[i] = false;
          }

          this.setState({ showData: true, spinner: false, userList: responseJson.data, checked: checkeddd, checkPrev: checkeddd });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
  }









  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>

        <View style={{ width: '8%', height: '100%', backgroundColor: 'white' }}>
          <View style={{ width: '100%', backgroundColor: 'white', borderTopColor: '#DCDCDC', borderTopWidth: 1, marginTop: 20 }} />

          <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 35 }} onPress={() => this.goNext('Home', '1')}>
            <Image style={{ height: 39, width: 41 }} source={this.state.selected == '1' ? require('../assets/images/home_selected.png') : require('../assets/images/home.png')} />
            <Text style={this.state.selected == '1' ? styles.selectNavText : styles.sideNavText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }} onPress={() => this.goNext('Topics', '2')}>
            <Image style={{ height: 39, width: 41 }} source={this.state.selected == '2' ? require('../assets/images/topic_selected.png') : require('../assets/images/topics.png')} />
            <Text style={this.state.selected == '2' ? styles.selectNavText : styles.sideNavText}>Topics</Text>
          </TouchableOpacity>


          <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }} onPress={() => this.goNext('Favourite', '3')}>
            <Image style={{ height: 39, width: 41 }} source={this.state.selected == '3' ? require('../assets/images/favourite_selected.png') : require('../assets/images/favourite.png')} />
            <Text style={this.state.selected == '3' ? styles.selectNavText : styles.sideNavText}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }} onPress={() => this.goNext('Featuredlist', '4')}>
            <Image style={{ height: 40, width: 33 }} source={this.state.selected == '4' ? require('../assets/images/lists_selected.png') : require('../assets/images/lists.png')} />
            <Text style={this.state.selected == '4' ? styles.selectNavText : styles.sideNavText}>Lists</Text>
          </TouchableOpacity>


          <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }} onPress={() => this.goNext('History', '5')}>
            <Image style={{ height: 38, width: 38 }} source={this.state.selected == '5' ? require('../assets/images/history_selected.png') : require('../assets/images/history.png')} />
            <Text style={this.state.selected == '5' ? styles.selectNavText : styles.sideNavText}>History</Text>
          </TouchableOpacity>



          <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }} onPress={() => { this.setModalVisible(true) }}>
            <Image style={{ height: 39, width: 39 }} source={this.state.selected == '6' ? require('../assets/images/settings_selected.png') : require('../assets/images/settings.png')} />
            <Text style={this.state.selected == '6' ? styles.selectNavText : styles.sideNavText}>Settings</Text>
          </TouchableOpacity>

         

        </View>

        <View style={{ width: '0.1%', height: '100%', backgroundColor: '#DCDCDC', marginTop: 20 }} />

        <View style={{ width: '92%', height: '100%' }}>

          {this.state.currentScreen == 'Home' ?
            <ImageBackground source={require('../assets/images/new_bg.png')} style={{ width: '100%', marginTop: 60, height: viewportHeight, position: 'relative' }}>
              <View style={{ width: '100%', height: '100%' }}>

                <Spinner
                  visible={this.state.spinner}
                />



                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', position: 'absolute', zIndex: 999, top: -15, backgroundColor: '#fff', paddingBottom: 15, paddingLeft: 20 }}>

                  {this.state.popoverShow ?


                    <View style={{
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
                        data={global.childs}
                        renderItem={({ item, index }) => (
                          <View>
                            <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.selectChild(item)}>
                              <View style={{ width: 50, height: 50, borderRadius: 50 / 2, backgroundColor: index == 0 ? '#F45C5F' : index == 1 ? '#62C677' : '#527CF3', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
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

                  <View style={{ position: 'absolute', right: 10, flexDirection: 'row', zIndex: 999 }}>
                    <TouchableOpacity onPress={() => this.props._onClickSearch('Mysearch')} style={styles.iconBackground}>
                      <Image style={{ height: 27, width: 27 }} source={require('../assets/images/search.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconBackground}>
                      <Image style={{ width: 27, height: 27 }} source={require('../assets/images/notification.png')} />
                      <View style={styles.notifictaionCircle}>
                        <Text style={{ color: 'white', fontSize: 18, fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8 }}>2</Text>
                      </View>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.circle} onPress={() => { this.setPopupVisible(true) }}>
                      <Text style={{ fontSize: 22, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8, marginLeft: 1 }}>{global.selectedChild.username.substring(0, 1)}</Text>
                    </TouchableOpacity>

                  </View>


                </View>



                {this.state.showData ?
                  <ScrollView
                    onScroll={({ nativeEvent }) => {
                      if (isCloseToBottom(nativeEvent)) {
                        this.getHomeData()
                      }
                    }} style={{ marginTop: 30, position: 'relative' }}>


                    {this.state.combinedData.map((mainItem, key) => (

                      mainItem.type == 'interest' ?
                        <View style={{ width: '100%', flexDirection: 'column', paddingLeft: 20 }}>
                          <Text style={{ textTransform: 'uppercase', color: key == 0 ? '#527CF3' : 'white', fontSize: 25, fontFamily: 'BigJohn', marginLeft: 20 }}>{mainItem.interestName}<Text> / </Text> <Text style={{ textTransform: 'uppercase', color: key == 0 ? '#5d5d5d' : 'white', fontSize: 22, fontFamily: 'SlimJoe' }}>{mainItem.topic}</Text></Text>
                          <View style={{ width: '84%', flexDirection: 'row', marginTop: 5, marginLeft: 20 }}>
                            <View style={{ width: '28%', borderBottomColor: global.firstBorderColor1[key], borderBottomWidth: global.borderWidth1[key] }} />
                            <View style={{ width: '28%', borderBottomColor: global.firstBorderColor2[key], borderBottomWidth: global.borderWidth2[key], marginLeft: 10, marginRight: 10 }} />
                            <View style={{ width: '28%', borderBottomColor: global.firstBorderColor3[key], borderBottomWidth: global.borderWidth3[key] }} />

                          </View>


                          <FlatList
                            onScroll={(event, nn) => this.handleScroll(event, key)}
                            onScrollBeginDrag={() => this.setState({ currentKey: key })}
                            style={{ height: 320 }}
                            data={mainItem.data}
                            renderItem={({ item, index }) => index !== mainItem.data.length - 1 ?
                              <TouchableOpacity activeOpacity={1} style={styles.touchableStyle} onPress={(nn) => this.showVisible(item.pageId, 0)}>
                                {item.image ?
                                  <Image style={[styles.imageBookmarks, { height: this.state.visible[item.pageId] ? 270 : 250, width: this.state.visible[item.pageId] ? 320 : 300, marginRight: mainItem.hasMore ? 0 : 15 }]} source={{ uri: item.image }} />
                                  :
                                  <View style={[styles.imageBookmarks, { height: this.state.visible[item.pageId] ? 270 : 250, width: this.state.visible[item.pageId] ? 320 : 300, backgroundColor: this.state.selectedColor, }]}></View>
                                }
                                <Image source={require('../assets/images/gradient.png')} style={{ width: this.state.visible[item.pageId] ? 320 : 300, height: this.state.visible[item.pageId] ? 270 : 70, position: 'absolute', marginLeft: 20, bottom: this.state.visible[item.pageId] ? 30 : 50, borderRadius: 10 }} />

                                {this.state.visible[item.pageId] ?
                                  <View style={{ flexDirection: 'row', position: 'absolute', marginLeft: 20, right: 10, top: 20 }}>


                                    <TouchableOpacity style={{ paddingRight: 5, zIndex: 99999 }} onPress={(nn) => this.addToFavorite(item, mainItem.type, key, index)}>
                                      {item.isFavourite ?
                                        <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                                        :
                                        <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                                      }

                                    </TouchableOpacity>


                                    <TouchableOpacity style={{ paddingLeft: 5, zIndex: 999 }} onPress={(mm) => this.setShowNewListModal(true, item, mainItem.type)}>
                                      <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                                    </TouchableOpacity>
                                  </View> : null}

                                <View style={{ width: 300, justifyContent: 'center', position: 'absolute', bottom: this.state.visible[item.pageId] ? 40 : 60 }}>
                                  <Text numberOfLines={2} style={styles.textStyle}>{item.title_for_display}</Text>

                                  {this.state.visible[item.pageId] ?
                                    <View style={{ marginTop: 50 }}>
                                      <TouchableOpacity onPress={() => this.setShowDescriptionModal(item, mainItem.type, key, index, mainItem.interestName)} style={{ position: 'absolute', bottom: 0, right: -30, zIndex: 9999 }}>
                                        <Image source={require('../assets/images/arrow.png')} />
                                      </TouchableOpacity>
                                      <Text numberOfLines={4} style={styles.textDesStyle}>{item.summary}</Text>
                                    </View>
                                    : null}
                                </View>
                              </TouchableOpacity>

                              :
                              mainItem.hasMore ?
                                <TouchableOpacity style={styles.showMoreStyle} onPress={() => this.props._onClickList('SearchList', item.title_for_api, mainItem.interestName, global.selectedChild, 'seed')}>
                                  <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white' }}>Show more{'\n'}    Like This</Text>
                                  <Image style={{ width: 40, height: 40, marginLeft: 5, marginBottom: 8 }} source={require('../assets/images/triangle.png')} />
                                </TouchableOpacity>
                                : null


                            }
                            ItemSeparatorComponent={this.renderSeparator}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                          />
                        </View> :



                        mainItem.type == 'featured_list' ?
                          <View style={{ width: '100%', flexDirection: 'column', paddingLeft: 20 }}>
                            <Text style={{ textTransform: 'uppercase', color: key == 0 ? '#527CF3' : 'white', fontSize: 25, fontFamily: 'BigJohn', alignSelf: 'flex-start', marginTop: 15, marginLeft: 20 }}>{mainItem.listNameOriginal}</Text>
                            <View style={{ width: '84%', flexDirection: 'row', marginTop: 5, marginLeft: 20 }}>
                              <View style={{ width: '28%', borderBottomColor: global.firstBorderColor1[key], borderBottomWidth: global.borderWidth1[key] }} />
                              <View style={{ width: '28%', borderBottomColor: global.firstBorderColor2[key], borderBottomWidth: global.borderWidth2[key], marginLeft: 10, marginRight: 10 }} />
                              <View style={{ width: '28%', borderBottomColor: global.firstBorderColor3[key], borderBottomWidth: global.borderWidth3[key] }} />
                            </View>

                            <FlatList
                              onScroll={(event, nn) => this.handleScroll(event, key)}
                              onScrollBeginDrag={() => this.setState({ currentKey: key })}

                              refreshing={this.state.refreshing}
                              data={mainItem.data}
                              style={{ marginBottom: 30, height: 320 }}
                              keyExtractor={(item, index) => index}
                              renderItem={({ item, index }) => index !== mainItem.data.length - 1 ?
                                <TouchableOpacity activeOpacity={1} style={{
                                  shadowColor: '#000000',
                                  shadowOffset: {
                                    width: 0,
                                    height: 3
                                  },
                                  shadowRadius: 5,
                                  shadowOpacity: 0.5, marginTop: 10
                                }} onPress={(nn) => this.showVisible(item.pageId, 'feature')}>
                                  {item.image ?
                                    <Image style={[styles.imageBookmarks, { height: this.state.visibleFeature[item.pageId] ? 270 : 250, width: this.state.visibleFeature[item.pageId] ? 320 : 300, marginRight: mainItem.hasMore ? 0 : 15 }]} source={{ uri: item.image }} />
                                    :
                                    <View style={[styles.imageBookmarks, { height: this.state.visibleFeature[item.pageId] ? 270 : 250, width: this.state.visibleFeature[item.pageId] ? 320 : 300, backgroundColor: this.state.selectedColor, }]}></View>
                                  }
                                  <Image source={require('../assets/images/gradient.png')} style={{ width: this.state.visibleFeature[item.pageId] ? 320 : 300, height: this.state.visibleFeature[item.pageId] ? 270 : 70, position: 'absolute', marginLeft: 20, bottom: this.state.visibleFeature[item.pageId] ? 30 : 50, borderRadius: 10 }} />


                                  {this.state.visibleFeature[item.pageId] ?
                                    <View style={{ flexDirection: 'row', position: 'absolute', marginLeft: 20, right: 10, top: 20 }}>
                                      <TouchableOpacity style={{ paddingRight: 5 }} onPress={(nn) => this.addToFavorite(item, mainItem.type, key, index)}>
                                        {item.isFavourite ?
                                          <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                                          :
                                          <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                                        }
                                      </TouchableOpacity>

                                      <TouchableOpacity style={{ paddingLeft: 5 }} onPress={(mm) => this.setShowNewListModal(true, item, mainItem.type)}>
                                        <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                                      </TouchableOpacity>

                                    </View>
                                    : null}

                                  <View style={{ width: 250, justifyContent: 'center', position: 'absolute', bottom: this.state.visibleFeature[item.pageId] ? 40 : 60 }}>
                                    <Text numberOfLines={2} style={styles.textStyle}>{item.caption}</Text>



                                    {this.state.visibleFeature[item.pageId] ?
                                      <View style={{ marginTop: 50 }}>

                                        <TouchableOpacity onPress={() => this.setShowDescriptionModal(item, mainItem.type, key, index, '')} style={{ position: 'absolute', bottom: 0, right: -30, zIndex: 9999 }}>
                                          <Image source={require('../assets/images/arrow.png')} />
                                        </TouchableOpacity>
                                        <Text numberOfLines={4} style={styles.textDesStyle}>{item.summary}</Text>

                                      </View>
                                      : null}

                                  </View>

                                </TouchableOpacity>
                                :
                                mainItem.hasMore ?
                                  <TouchableOpacity style={styles.showMoreStyle} onPress={() => this.props._onClickList('FeaturedPicture', mainItem.listNameFormatted, mainItem.listNameOriginal, global.selectedChild, mainItem.seed)}>
                                    <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white' }}>Show more{'\n'}    Like This</Text>
                                    <Image style={{ width: 40, height: 40, marginLeft: 5, marginBottom: 8 }} source={require('../assets/images/triangle.png')} />
                                  </TouchableOpacity>
                                  : null

                              }


                              ItemSeparatorComponent={this.renderSeparator}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                            />


                          </View> :






                          mainItem.type == 'history' ?
                            <View style={{ width: '100%', flexDirection: 'column', paddingLeft: 20 }}>
                              <Text style={{ textTransform: 'uppercase', color: key == 0 ? '#527CF3' : 'white', fontSize: 25, fontFamily: 'BigJohn', alignSelf: 'flex-start', marginTop: 15, marginLeft: 20 }}>Because you read / <Text style={{ textTransform: 'uppercase', color: key == 0 ? '#5d5d5d' : 'white', fontSize: 22, fontFamily: 'SlimJoe' }}>{mainItem.becauseYouRead}</Text></Text>
                              <View style={{ width: '84%', flexDirection: 'row', marginTop: 5, marginLeft: 20 }}>
                                <View style={{ width: '28%', borderBottomColor: global.firstBorderColor1[key], borderBottomWidth: global.borderWidth1[key] }} />
                                <View style={{ width: '28%', borderBottomColor: global.firstBorderColor2[key], borderBottomWidth: global.borderWidth2[key], marginLeft: 10, marginRight: 10 }} />
                                <View style={{ width: '28%', borderBottomColor: global.firstBorderColor3[key], borderBottomWidth: global.borderWidth3[key] }} />
                              </View>



                              <FlatList
                                onScroll={(event, nn) => this.handleScroll(event, key)}
                                onScrollBeginDrag={() => this.setState({ currentKey: key })}


                                refreshing={this.state.refreshing}
                                data={mainItem.data}
                                style={{ marginBottom: 30, height: 320 }}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item, index }) => index !== mainItem.data.length - 1 ?
                                  <TouchableOpacity activeOpacity={1} style={styles.touchableStyle} onPress={(nn) => this.showVisible(item.pageId, 'history')}>
                                    {item.image ?
                                      <Image style={[styles.imageBookmarks, { height: this.state.visibleHistory[item.pageId] ? 270 : 250, width: this.state.visibleHistory[item.pageId] ? 320 : 300, marginRight: mainItem.hasMore ? 0 : 15 }]} source={{ uri: item.image }} />
                                      :
                                      <View style={[styles.imageBookmarks, { height: this.state.visibleHistory[item.pageId] ? 270 : 250, width: this.state.visibleHistory[item.pageId] ? 320 : 300, backgroundColor: this.state.selectedColor, }]}></View>
                                    }
                                    <Image source={require('../assets/images/gradient.png')} style={{ width: this.state.visibleHistory[item.pageId] ? 320 : 300, height: this.state.visibleHistory[item.pageId] ? 270 : 70, position: 'absolute', marginLeft: 20, bottom: this.state.visibleHistory[item.pageId] ? 30 : 50, borderRadius: 10 }} />


                                    {this.state.visibleHistory[item.pageId] ?
                                      <View style={{ flexDirection: 'row', position: 'absolute', marginLeft: 20, right: 10, top: 20 }}>
                                        <TouchableOpacity style={{ paddingRight: 5 }} onPress={(nn) => this.addToFavorite(item, mainItem.type, key, index)}>
                                          {item.isFavourite ?
                                            <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                                            :
                                            <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                                          }
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ paddingLeft: 5 }} onPress={(mm) => this.setShowNewListModal(true, item, mainItem.type)}>
                                          <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                                        </TouchableOpacity>

                                      </View>
                                      : null}

                                    <View style={{ width: 250, justifyContent: 'center', position: 'absolute', bottom: this.state.visibleHistory[item.pageId] ? 40 : 60 }}>
                                      <Text numberOfLines={2} style={styles.textStyle}>{item.title_for_display}</Text>



                                      {this.state.visibleHistory[item.pageId] ?
                                        <View style={{ marginTop: 50 }}>

                                          <TouchableOpacity onPress={() => this.setShowDescriptionModal(item, mainItem.type, key, index, '')} style={{ position: 'absolute', bottom: 0, right: -30, zIndex: 9999 }}>
                                            <Image source={require('../assets/images/arrow.png')} />
                                          </TouchableOpacity>
                                          <Text numberOfLines={4} style={styles.textDesStyle}>{item.summary}</Text>

                                        </View>
                                        : null}

                                    </View>

                                  </TouchableOpacity>
                                  :
                                  mainItem.hasMore ?
                                    <TouchableOpacity style={styles.showMoreStyle} onPress={() => this.props._onClickList('SearchList', item.title_for_api, 'Beacuse your read', global.selectedChild, 'seed')}>
                                      <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white' }}>Show more{'\n'}    Like This</Text>
                                      <Image style={{ width: 40, height: 40, marginLeft: 5, marginBottom: 8 }} source={require('../assets/images/triangle.png')} />
                                    </TouchableOpacity>
                                    : null


                                }

                                ItemSeparatorComponent={this.renderSeparator}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                              />

                            </View> :




                            mainItem.type == 'featured_picture' ?

                              <TouchableOpacity activeOpacity={1} style={{
                                shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowRadius: 5,
                                shadowOpacity: 0.5, flexDirection: 'column', backgroundColor: 'rgba(52, 52, 52, 0.2)', margin: 20, borderRadius: 10, height: 300
                              }}
                                onPress={(nn) => this.setShowDescriptionModalFeature(mainItem.data, mainItem.type, key, 'no', '')} >
                                <View style={{ flexDirection: 'row' }}>

                                  <View style={{ width: '50%', padding: 15 }}>
                                    <Text style={{ color: 'white', fontSize: 25, fontFamily: 'BigJohn' }}>Featured Picture</Text>
                                    <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5, marginTop: 10, marginBottom: 10 }} />
                                    <Text style={{ textTransform: 'none', color: 'white', fontSize: 20, fontFamily: 'HelveticaNeueLTStd-Roman' }}>{mainItem.data.caption_full}</Text>
                                  </View>
                                  <View style={{ width: '50%' }} >
                                    <Image source={{ uri: mainItem.data.image }} style={{ height: 300, borderRadius: 10 }} />
                                  </View>
                                </View>

                              </TouchableOpacity>
                              :





                              mainItem.type == 'On This Day' ?

                                <TouchableOpacity activeOpacity={1} style={{
                                  shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowRadius: 5,
                                  shadowOpacity: 0.5, flexDirection: 'column', backgroundColor: 'rgba(52, 52, 52, 0.2)', margin: 20, borderRadius: 10, height: 300
                                }}
                                  onPress={(nn) => this.setShowDescriptionModal(mainItem.data, mainItem.type, key, 'no', '')} >
                                  <View style={{ flexDirection: 'row' }}>

                                    <View style={{ width: '50%', padding: 15 }}>
                                      <Text style={{ color: 'white', fontSize: 25, fontFamily: 'BigJohn' }}>On this Day {'\n'}
                                        <Text style={{ textTransform: 'uppercase', color: 'white', fontSize: 26, fontFamily: 'SlimJoe' }}>{mainItem.data.eventDate}</Text> </Text>
                                      <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5, marginTop: 10, marginBottom: 10 }} />

                                      <Text style={{ textTransform: 'none', color: 'white', fontSize: 20, fontFamily: 'HelveticaNeueLTStd-Roman' }}>{mainItem.data.on_this_day_text}</Text>


                                    </View>

                                    <View style={{ width: '50%' }} >
                                      <Image source={{ uri: mainItem.data.thumbnail }} style={{ height: 300, borderRadius: 10 }} />
                                    </View>
                                  </View>

                                </TouchableOpacity>

                                : null


                    ))}



                    <ActivityIndicator size="large" color="white" />


                  </ScrollView>

                  : null}



                <Modal
                  coverScreen={true}
                  isVisible={this.state.visibleModal === 'sliding'}
                  backdropColor="tranparent"
                  animationIn="slideInRight"
                  animationOut="slideOutRight"
                  animationInTiming={1000}
                  animationOutTiming={1000}
                  backdropTransitionInTiming={800}
                  backdropTransitionOutTiming={800} >






                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Spinner
                      visible={this.state.spinner2} />

                    <TouchableOpacity activeOpacity={1} style={{ width: '15%', backgroundColor: this.state.transparentModal ? 'transparent' : 'rgba(255,255,255,0.5)' }} onPress={() => this.setState({ visibleModal: false, transparentModal: true })} />


                    <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10 }}>
                      <TouchableOpacity style={{ marginLeft: 20, marginTop: 15 }} onPress={() => this.setState({ visibleModal: false, transparentModal: true })}>
                        <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
                      </TouchableOpacity>

                      <View style={{ position: 'absolute', marginTop: 15, right: 10, flexDirection: 'row', flexDirection: 'row', padding: 10 }}>

                        <Text style={{ color: 'black' }}></Text>

                        <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>

                          <TouchableOpacity style={{ marginRight: 15 }} onPress={(nn) => this.addToFavorite(this.state.seachedItem, this.state.modalType, this.state.selectedKey, this.state.selectedIndex)}>
                            <Image style={{ width: 30, height: 31 }} source={require('../assets/images/star_plus.png')} />
                          </TouchableOpacity>

                          <TouchableOpacity style={{ marginRight: 15 }} onPress={(mm) => this.setShowNewListModal(true, this.state.seachedItem, this.state.modalType)}>
                            <Image style={{ width: 30, height: 32 }} source={require('../assets/images/lists_star.png')} />
                          </TouchableOpacity>


                        </View>

                      </View>


                      <View style={{ width: '100%', marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />

                      <ScrollView >
                        <WebView
                          style={{ height: 1000, marginLeft: '5%', marginRight: '1%' }}
                          javaScriptEnabled={true}
                          domStorageEnabled={true}
                          source={{ html: this.state.htmlForm }}
                        />

                      </ScrollView>


                    </View>
                    <Modal

                      animationType="slide"
                      visible={this.state.newListShow}
                      transparent={true}>

                      <View style={{
                        height: '100%',
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.8)'
                      }}>

                        <View style={{
                          width: '60%',
                          backgroundColor: '#fff',
                          height: 'auto',
                          borderRadius: 10,
                          flexDirection: 'column',
                        }}>



                          <Text style={{ color: 'black', fontSize: 22, marginTop: 15, marginBottom: 15, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman', fontWeight: 'bold' }}>Create New List</Text>

                          <View style={{ width: '100%', marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />

                          <ScrollView
                            style={{ height: 300 }}>
                            <View style={{ padding: 10 }}>

                              <FlatList
                                data={this.state.userList}
                                renderItem={({ item, index }) =>
                                  <CheckBox
                                    title={item.listName}
                                    checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                                    uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                                    checked={this.state.checked[index]}
                                    onPress={() => this.isIconCheckedOrNot(item, index)}
                                    containerStyle={{ backgroundColor: 'tranparent', borderWidth: 0 }}
                                    textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />

                                }

                                ItemSeparatorComponent={this.renderSeparator}
                                horizontal={false}
                                refreshing={this.state.refreshingCheck}
                              />


                              <CheckBox
                                title="Create New List"
                                checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                                uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                                checked={this.state.newListChecked}
                                onPress={() => { this.setState({ newListChecked: !this.state.newListChecked, checked: this.state.checkPrev, refreshingCheck: !this.state.refreshingCheck }); console.log("checked checked ", this.state.checkPrev) }}
                                containerStyle={{ backgroundColor: 'tranparent', borderWidth: 0 }}
                                textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />



                            </View>
                          </ScrollView>



                          <View style={{ padding: 10 }}>


                            {this.state.newListChecked ?
                              <View style={{ height: 60, borderRadius: 10, borderColor: '#E5E5E5', marginLeft: 20, marginRight: 20, borderWidth: 1 }}>
                                <TextInput style={{ width: '60%', height: 60, paddingLeft: 15, alignItems: 'center', fontSize: 20, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}
                                  placeholder="List Title"
                                  returnKeyType={"done"}
                                  ref={(input) => { this.password = input; }}
                                  onChangeText={(listTitle) => this.setState({ listTitle: !this.state.listTitle ? listTitle.replace(/\s/g, '') : listTitle })}
                                  value={this.state.listTitle} />
                              </View>
                              : null}


                            <TouchableOpacity style={styles.styleSubmit} onPress={(nn) => { this.setCreateList() }}>
                              <Text style={{ color: 'white', fontSize: 25, marginTop: 10, fontFamily: 'HelveticaNeueLTStd-Md' }}>SUBMIT</Text>
                            </TouchableOpacity>


                            <View style={{ width: '100%', paddingBottom: 10, marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />


                            <TouchableOpacity onPress={() => { this.setShowNewListModal(false, 'item') }} style={{ width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                              <Text style={{ color: '#B8B8B8', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>x CLOSE</Text>
                            </TouchableOpacity>

                          </View>

                        </View>
                      </View>
                    </Modal>


                  </View>




                </Modal>









                <Modal

                  animationType="slide"
                  visible={this.state.newListShow}
                  transparent={true}>

                  <View style={{
                    height: '100%',
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.8)'
                  }}>

                    <View style={{
                      width: '60%',
                      backgroundColor: '#fff',
                      height: 'auto',
                      borderRadius: 10,
                      flexDirection: 'column',
                    }}>



                      <Text style={{ color: 'black', fontSize: 22, marginTop: 15, marginBottom: 15, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman', fontWeight: 'bold' }}>Create New List</Text>

                      <View style={{ width: '100%', marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />

                      <ScrollView
                        style={{ height: 300 }}>
                        <View style={{ padding: 10 }}>

                          <FlatList
                            data={this.state.userList}
                            renderItem={({ item, index }) =>
                              <CheckBox
                                title={item.listName}
                                checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                                uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                                checked={this.state.checked[index]}
                                onPress={() => this.isIconCheckedOrNot(item, index)}
                                containerStyle={{ backgroundColor: 'tranparent', borderWidth: 0 }}
                                textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />

                            }

                            ItemSeparatorComponent={this.renderSeparator}
                            horizontal={false}
                            refreshing={this.state.refreshingCheck}
                          />


                          <CheckBox
                            title="Create New List"
                            checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                            uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                            checked={this.state.newListChecked}
                            onPress={() => { this.setState({ newListChecked: !this.state.newListChecked, checked: this.state.checkPrev, refreshingCheck: !this.state.refreshingCheck }); console.log("checked checked ", this.state.checkPrev) }}
                            containerStyle={{ backgroundColor: 'tranparent', borderWidth: 0 }}
                            textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />



                        </View>
                      </ScrollView>



                      <View style={{ padding: 10 }}>


                        {this.state.newListChecked ?
                          <View style={{ height: 60, borderRadius: 10, borderColor: '#E5E5E5', marginLeft: 20, marginRight: 20, borderWidth: 1 }}>
                            <TextInput style={{ width: '60%', height: 60, paddingLeft: 15, alignItems: 'center', fontSize: 20, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}
                              placeholder="List Title"
                              returnKeyType={"done"}
                              ref={(input) => { this.password = input; }}
                              onChangeText={(listTitle) => this.setState({ listTitle: !this.state.listTitle ? listTitle.replace(/\s/g, '') : listTitle })}
                              value={this.state.listTitle} />
                          </View>
                          : null}


                        <TouchableOpacity style={styles.styleSubmit} onPress={(nn) => { this.setCreateList() }}>
                          <Text style={{ color: 'white', fontSize: 25, marginTop: 10, fontFamily: 'HelveticaNeueLTStd-Md' }}>SUBMIT</Text>
                        </TouchableOpacity>


                        <View style={{ width: '100%', paddingBottom: 10, marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />


                        <TouchableOpacity onPress={() => { this.setShowNewListModal(false, 'item') }} style={{ width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                          <Text style={{ color: '#B8B8B8', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>x CLOSE</Text>
                        </TouchableOpacity>

                      </View>

                    </View>
                  </View>
                </Modal>


              </View>

            </ImageBackground>

            :
            null
          }
          {this.state.currentScreen == 'Topics' ?
            <Topics
              _onClickSearch={this._onClickSearch}
              _onClickNotification={this._onClickNotification}
              _onClickChild={this._onClickChild}
              _onClickBrowse={this._onClickBrowse}
            />
            :
            null
          }
          {this.state.currentScreen == 'Favourite' ?
            <Favourite
              _onClickSearch={this._onClickSearch}
              _onClickNotification={this._onClickNotification}
              _onClickChild={this._onClickChild}
            />
            :
            null
          }
          {this.state.currentScreen == 'Featuredlist' ?
            <Featuredlist
              _onClickSearch={this._onClickSearch}
              _onClickNotification={this._onClickNotification}
              _onClickChild={this._onClickChild}
            />
            :
            null
          }

          {this.state.currentScreen == 'History' ?
            <History

              _onClickSearch={this._onClickSearch}
              _onClickNotification={this._onClickNotification}
              _onClickChild={this._onClickChild}
            />
            :
            null
          }

          {this.state.currentScreen == 'Settings' ?
            <Settings

              _onClickSetting={this._onClickSetting}
              _onClickSearch={this._onClickSearch}
              _onClickNotification={this._onClickNotification}
              _onClickChild={this._onClickChild}

              _onLogout={this._onLogout}
            />
            :
            null
          }





          <Modal

            // animationType="slide"
            visible={this.state.modalVisible}
            transparent={true}>

            <TouchableOpacity
              activeOpacity={1}
              style={{
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.8)'
              }} onPress={() => { this.setModalVisible(false) }}>

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
                      onChangeText={(text) => this.setState({ text })} />
                  </View>
                </View>

                <Text onPress={() => { this.goToForgot() }} style={styles.forgotPassword}>Forgot Password?</Text>


                <TouchableOpacity onPress={() => { this.goToSettings() }} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30, borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center', backgroundColor: '#3F67DC', padding: 15 }}>
                  <Text style={{ color: 'white', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', marginTop: 5 }}>SUBMIT</Text>
                </TouchableOpacity>


                <View style={{ width: '100%', marginTop: 30, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />


                <TouchableOpacity onPress={() => { this.setModalVisible(false) }} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                  <Text style={{ color: '#B8B8B8', fontSize: 22, fontFamily: 'HelveticaNeueLTStd-Md', padding: 20 }}>x CLOSE</Text>
                </TouchableOpacity>



              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>


        </View>

      </View>





    );

  }


}


export default Sidenavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dontAccount: {
    width: '80%',
    marginTop: 30,
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'HelveticaNeueLTStd-Md'

  },
  imageAnimals: {
    width: 300,
    height: 200,
    marginLeft: 20,
    borderRadius: 10,

  },
  imageBookmarks: {
    width: 250,
    height: 150,
    marginLeft: 20,
    borderRadius: 10,

  }, textStyle: {
    fontSize: 20,
    color: 'white',
    position: 'absolute',
    marginLeft: 35,
    fontFamily: 'HelveticaNeueLTStd-Md',
    paddingBottom: 40,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#527CF3',
    color: 'white',
    fontSize: 18,
    fontFamily: 'HelveticaNeueLTStd-Md',
    justifyContent: 'center',
    alignItems: 'center'

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
    marginRight: 15

  },
  sideNavText: {
    marginTop: 5,
    color: '#9A9A9A',
    fontSize: 12,
    fontFamily: 'BigJohn',
  },
  selectNavText: {
    marginTop: 5,
    color: '#527CF3',
    fontSize: 12,
    fontFamily: 'BigJohn',

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
    bottom: 35
  },
  textInputStyle: {
    width: '100%',
    height: 60,
    fontSize: 24,
    color: 'black',
    fontFamily: 'HelveticaNeueLTStd-Roman'

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
  }



}); 