import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Image, ScrollView, Linking, Alert, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, ImageBackground, FlatList, Dimensions, Easing, WebView, ActivityIndicator } from 'react-native';
// import PopoverTooltip from 'react-native-popover-tooltip';
import { CheckBox } from 'react-native-elements';
import ModalWrapper from 'react-native-modal-wrapper';
import Spinner from 'react-native-loading-spinner-overlay';
import { Base_Url, AppVersion } from '../constants/common';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import axios from "axios";




const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

var { viewportHeight, viewportWidth } = Dimensions.get('window');
global.selectedChild = { username: '' }
global.combinedData = [];
global.firstBorderColor1 = ['#527CF3'];
global.firstBorderColor2 = ['#527CF3'];
global.firstBorderColor3 = ['#527CF3'];
global.borderWidth1 = []
global.borderWidth2 = [];
global.borderWidth3 = [];
global.colorIndex = 0;


const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};


const deviceWidth = Dimensions.get('window').width;


export class Home extends React.PureComponent {

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0)
    this.state = {
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
      spinnerList: false,
      showData: true,
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
      selectedChildPrev: { username: '' },
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
      count: 0,
      combinedData: [],
      showIndicator: false,
      spinnerModal: false,
      defaultChecked: true,
      viewHeight: 0,
      Height: 0,
      colorIndex: 0,
      articlesToOpen: [],
      responseModal: {}

    };
    this.fetchList = this.fetchList.bind(this);
    this.onEndReached = this.onEndReached.bind(this);

  }

  find_dimesions(layout) {
    const { x, y, width, height } = layout;
    this.setState({ viewHeight: height })
  }


  onNavigationChange(event) {
    if (event.target) {
      const htmlHeight = Number(event.target) //convert to number
      this.setState({ Height: htmlHeight });
    }
  }


  componentWillReceiveProps(nextProps) {
    if (global.currenttt == 0) {
      AsyncStorage.getItem("token").then((value) => {
        AsyncStorage.getItem('childs').then((childs) => {
          var childsss = JSON.parse(childs);
          global.user_token = value;
          global.selectedChild = childsss[global.colorIndex];
          global.childs = childsss;




          if (this.state.selectedChildPrev.id != undefined) {
            if (global.selectedChild.id != this.state.selectedChildPrev.id) {
              this.setState({ spinner: true, combinedData: [], count: 0 }, this._getRandomColor(), this.getHomeDataFirst())
         
            }
            else {
            }

          }

        }).done();
      }).done();

      this.setState({ popoverShow: false, refreshing: !this.state.refreshing })
    }
  }


  componentWillUnmount() {

  }



  componentDidMount() {

    if (global.myvar == 'true') {
      this.getUserList();

      // alert("AAYAAAAAAAAA")

    }
    else {

      AsyncStorage.getItem("token").then((value) => {
        AsyncStorage.getItem('childs').then((childs) => {
          AsyncStorage.getItem('globalIndex').then((globalIndex) => {

            var childsss = JSON.parse(childs);
            global.user_token = value;
            global.childs = childsss;


            if (globalIndex != null) {
              global.colorIndex = globalIndex;
            } else {
              global.colorIndex = global.colorIndex;
            }

            global.selectedChild = childsss[global.colorIndex];
            // global.selectedChild = childsss[0];
            this.setState({ spinner: true, selectedChildPrev: childsss[global.colorIndex] })
            this._getRandomColor()
            this.getHomeDataFirst();



          }).done();
        }).done();
      }).done();
    }
    this.animatedValue = new Animated.Value(0);

  }

  _getRandomColor = () => {
    var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
    this.setState({
      selectedColor: item,
    })
  }


  onViewableItemsChanged = ({ viewableItems, changed }) => {
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





  getHomeDataFirst = () => {


    console.log("---------------------    ", Base_Url)

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone, count: 0 });
    fetch(Base_Url + 'getRowsByRecommendationEngine/', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': global.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,
        maxRows: '4'
      })

    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props._onLogout('Login')
          this.setState({ spinner: false });
          return response.json();
        } else if (response.status === 423) {
          return response.json();
        }
        else if (response.status == 500) {
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;
     

        console.log("responseJson", responseJson)

        if (responseJson && responseJson.status && responseJson.status == 1) {

          var event = { nativeEvent: { contentOffset: { x: 400 } } }
          for (var key = 0; key < responseJson.data.length; key++) {
            this.handleScroll(event, key)
          }
          this.getUserList();
          this.setState({ combinedData: responseJson.data, refreshing: !this.state.refreshing, showData: true, spinner: false });


        }
        else {

          if (responseJson.app_version_error_code === '423') {
            this.showAppUpdateAlert(responseJson.url)

          }
          else {
            console.log("elseError", responseJson.message)
            let that = this;
            that.setState({ spinner: false })
            Toast.show(responseJson.message, Toast.SHORT);
          }
        }


      }).catch((error) => {
        console.log("RESPONSE===>>>>", error.message);
        console.log("RESPONSE===>>>>", error, responseJson.message);
        let that = this;
        setTimeout(function () { that.setState({ spinner: false, showIndicator: false }) }, 500);
      });

  }


  showAppUpdateAlert(link) {
    Alert.alert(
      'App Update',
      'Update app from App Store',
      [
        {
          text: 'Update App', onPress: () => {
            Linking.openURL(link).then((res) => {
              this.setState({ spinner: false })
            })
              .catch((err) => { console.log(err) });


          }
        },
      ],
      { cancelable: false },
    );

  }


  getHomeData = () => {
    if (this.state.count > 24) {
      this.setState({ showIndicator: false })
    }
    else {
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
          maxRows: '8'
        })

      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) {
            AsyncStorage.removeItem('token');
            this.props._onLogout('Login')
            this.setState({ spinner: false });
            return response.json();
          } else if (response.status === 423) {
            return response.json();
          }

          else if (response.status == 500) {
            console.log("500", response)
            console.log("500")
          }
        })
        .then((responseJson) => {
          this.data = responseJson;
          if (responseJson.status == 1) {
            this.getUserList();
            if (this.state.combinedData.length > 32) {
              this.setState({ showData: true, spinner: false, showIndicator: false });
            }
            else {

              var combinee = this.state.combinedData;
              var finalArray = combinee.concat(responseJson.data);

              var event = { nativeEvent: { contentOffset: { x: 400 } } }
              for (var key = 8; key < finalArray.length; key++) {
                this.handleScroll(event, key)
              }
              this.state.combinedData = finalArray;
              this.setState({ showData: true, spinner: false, showIndicator: false, count: this.state.count + 8 });
            }



          }
          else {
            console.log("elseError", responseJson.message)
            let that = this;
            that.setState({ spinner: false, showIndicator: false })
            Toast.show(responseJson.message, Toast.SHORT);
          }


        }).catch((error) => {
          console.log("RESPONSE_DATA===>>>>", error);
          console.log("RESPONSE_DATA===>>>>", error.message);
          let that = this;
          setTimeout(function () { that.setState({ spinner: false, showIndicator: false }) }, 500);
        });
    }

  }

  setShowDescriptionModal = (item, type, key, index, nameOfInterest) => {


    var articlesToOpen = this.state.articlesToOpen;
    articlesToOpen.push(item.title_for_api);

    if (item.title_for_api == this.state.prevTitle) {
      this.setState({ visibleModal: 'sliding', seachedItem: item, articlesToOpen: articlesToOpen, modalType: type, selectedKey: key, selectedIndex: index, transparentModal: true, popoverShow: false, prevTitle: item.title_for_api });

      let that = this;
      setTimeout(function () { that.setState({ transparentModal: false }) }, 800);

    }
    else {
      this.setState({ visibleModal: 'sliding', htmlForm: '', seachedItem: item, articlesToOpen: articlesToOpen, modalType: type, selectedKey: key, selectedIndex: index, transparentModal: true, popoverShow: false, prevTitle: item.title_for_api, relatedArticles: [] });
      let that = this;
      setTimeout(function () { that.setState({ transparentModal: false }) }, 800);
      setTimeout(function () { that.setState({ spinnerModal: true }) }, 1500);

      fetch(Base_Url + 'getArticleDetail', {
        method: "POST",
        headers: {
          'appVersion': AppVersion,
          'timezone': this.state.timzone,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': global.user_token
        },
        body: JSON.stringify({
          title: item.title_for_api,
          childId: global.selectedChild.id,
          interestName: nameOfInterest

        })
      })
        .then((response) => {
          if (response.status === 200) {
            // this.setState({ spinnerModal: false });
            return response.json();
          } else if (response.status === 401) {
            AsyncStorage.removeItem('token');
            this.props._onLogout('Login')
            this.setState({ visibleModal: false });
            return response.json();
          }
        })
        .then((responseJson) => {

          if (responseJson.status == 0) {
            Toast.show(responseJson.message, Toast.SHORT);
          } else {

            this.data = responseJson;
            if (responseJson.mobileHTML) {
              var htmlString = responseJson.mobileHTML;
              var filterHtmlString = htmlString.replace(new RegExp('href="//', 'g'), 'href="https://');
              var htmlTags = filterHtmlString.match(/<a [^>]+>([^<]+)<\/a>/g);
              var replacinggg = [];
              for (var j in htmlTags) {
                var splitString = htmlTags[j].split(" ")
                var split2 = htmlTags[j].split(">")[1];
                for (var i in this.state.banData) {
                  if (split2.split("<")[0].includes(this.state.banData[i].checktitle)) {
                    replacinggg.push(splitString[1]);
                  }
                }

              }
              var filterHtmlStringgggg = filterHtmlString;
              let unique = [...new Set(replacinggg)];
              for (var k in unique) {
                filterHtmlStringgggg = filterHtmlStringgggg.replace(new RegExp(unique[k], 'gi'), '');
              }

              var filterHtmlStringgggg22 = filterHtmlStringgggg;
              for (var i in this.state.banData) {
                filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(new RegExp("\\b" + this.state.banData[i].checktitle + "\\b", 'gi'), '[' + this.state.banData[i].replaceword + ']');
                // filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(this.state.banData[i].checktitle, '[' + this.state.banData[i].replaceword + ']');
              }
              var filterDisplayString = filterHtmlStringgggg22.replace(new RegExp('display: none;">', 'g'), 'display: block;">');
              var filterExternalLink = filterDisplayString.replace(new RegExp('rel="mw:ExtLink" href', 'g'), 'rel="mw:ExtLink" text');
              var openFacts = filterExternalLink.replace(new RegExp('pcs-collapse-table', 'g'), 'pcs-collapse-table');

              this.setState({ htmlForm: openFacts, htmlFormPrev: openFacts, responseModal: responseJson });



              var htmlString = this.state.htmlForm;
              var n = htmlString.indexOf("</head>");
              var kkkkk = new Date();
              var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + " " + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedstatic/uploaded_css_static.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
              this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });




            }
          }

        }).catch((error) => {
          Toast.show("Unable to open Article, Please try again", Toast.SHORT);
          console.log("homeDes", error);
          that.setState({ spinnerModal: false });

        });


    }
  }


  setShowDescriptionModalFeature = (item, type, key, index, nameOfInterest) => {

    var articlesToOpen = this.state.articlesToOpen;
    articlesToOpen.push(item.article);


    if (item.article == this.state.prevTitleFeatured) {
      this.setState({ visibleModal: 'sliding', seachedItem: item, articlesToOpen: articlesToOpen, modalType: type, selectedKey: key, selectedIndex: index, transparentModal: true, popoverShow: false, prevTitleFeatured: item.article });

      let that = this;
      setTimeout(function () { that.setState({ transparentModal: false }) }, 800);

    }
    else {


      this.setState({ visibleModal: 'sliding', htmlForm: '', seachedItem: item, articlesToOpen: articlesToOpen, modalType: type, selectedKey: key, selectedIndex: index, transparentModal: true, popoverShow: false, prevTitleFeatured: item.article, relatedArticles: [] });
      let that = this;
      setTimeout(function () { that.setState({ transparentModal: false }) }, 800);

      setTimeout(function () { that.setState({ spinnerModal: true }) }, 1500);

      fetch(Base_Url + 'getArticleDetail', {
        method: "POST",
        headers: {
          'appVersion': AppVersion,
          'timezone': this.state.timzone,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': global.user_token
        },
        body: JSON.stringify({
          title: item.article,
          childId: global.selectedChild.id,
          interestName: nameOfInterest


          //   pageId: item.id,
        })
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) {
            AsyncStorage.removeItem('token');
            that.props._onLogout('Login')
            that.setState({ spinner: false, visibleModal: false });
            return response.json();
          }
        })
        .then((responseJson) => {
          if (responseJson.status == 0) {
            Toast.show(responseJson.message, Toast.SHORT);
          } else {
            that.data = responseJson;
            if (responseJson.mobileHTML) {
              var htmlString = responseJson.mobileHTML;
              var filterHtmlString = htmlString.replace(new RegExp('href="//', 'g'), 'href="https://');
              var htmlTags = filterHtmlString.match(/<a [^>]+>([^<]+)<\/a>/g);
              var replacinggg = [];
              for (var j in htmlTags) {
                var splitString = htmlTags[j].split(" ")
                var split2 = htmlTags[j].split(">")[1];
                for (var i in this.state.banData) {
                  if (split2.split("<")[0].includes(this.state.banData[i].checktitle)) {
                    replacinggg.push(splitString[1]);
                  }
                }
              }
              var filterHtmlStringgggg = filterHtmlString;
              let unique = [...new Set(replacinggg)];
              for (var k in unique) {
                filterHtmlStringgggg = filterHtmlStringgggg.replace(new RegExp(unique[k], 'gi'), '');
              }

              var filterHtmlStringgggg22 = filterHtmlStringgggg;
              for (var i in this.state.banData) {
                filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(new RegExp("\\b" + this.state.banData[i].checktitle + "\\b", 'gi'), '[' + this.state.banData[i].replaceword + ']');
              }

              var filterDisplayString = filterHtmlStringgggg22.replace(new RegExp('display: none;">', 'g'), 'display: block;">');
              var filterExternalLink = filterDisplayString.replace(new RegExp('rel="mw:ExtLink" href', 'g'), 'rel="mw:ExtLink" text');
              var openFacts = filterExternalLink.replace(new RegExp('pcs-collapse-table', 'g'), 'pcs-collapse-table');

              this.setState({ htmlForm: openFacts, responseModal: responseJson, htmlFormPrev: openFacts });




              var htmlString = this.state.htmlForm;
              var n = htmlString.indexOf("</head>");
              var kkkkk = new Date();
              var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + " " + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedstatic/uploaded_css_static.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
              this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });


            }

          }

        }).catch((error) => {
          console.log("homeDesFeaured", error);
          Toast.show("Unable to open Article, Please try again", Toast.SHORT);
          that.setState({ spinnerModal: false });


        });
    }

  }


  showArticleDetailForLinks(article_name) {
    console.log("item.article", article_name)
    let that = this;
    setTimeout(function () { that.setState({ transparentModal: false }) }, 800);

    fetch(Base_Url + 'getArticleDetail', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': global.user_token
      },
      body: JSON.stringify({
        title: article_name,
        childId: global.selectedChild.id,
        interestName: ''
      })
    })

      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.status == 0) {
          Toast.show(responseJson.message, Toast.SHORT);
        } else {
          this.data = responseJson;
          var htmlString = responseJson.mobileHTML;
          var filterHtmlString = htmlString.replace(new RegExp('href="//', 'g'), 'href="https://');
          var htmlTags = filterHtmlString.match(/<a [^>]+>([^<]+)<\/a>/g);
          var replacinggg = [];
          for (var j in htmlTags) {
            var splitString = htmlTags[j].split(" ")
            var split2 = htmlTags[j].split(">")[1];
            for (var i in this.state.banData) {
              if (split2.split("<")[0].includes(this.state.banData[i].checktitle)) {
                replacinggg.push(splitString[1]);
              }
            }
          }
          var filterHtmlStringgggg = filterHtmlString;
          let unique = [...new Set(replacinggg)];
          for (var k in unique) {
            filterHtmlStringgggg = filterHtmlStringgggg.replace(new RegExp(unique[k], 'gi'), '');
          }

          var filterHtmlStringgggg22 = filterHtmlStringgggg;
          for (var i in this.state.banData) {
            filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(new RegExp("\\b" + this.state.banData[i].checktitle + "\\b", 'gi'), '[' + this.state.banData[i].replaceword + ']');
            // filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(new RegExp(this.state.banData[i].checktitle, 'g'), '[' + this.state.banData[i].replaceword + ']');
          }


          var filterDisplayString = filterHtmlStringgggg22.replace(new RegExp('display: none;">', 'g'), 'display: block;">');
          var filterExternalLink = filterDisplayString.replace(new RegExp('rel="mw:ExtLink" href', 'g'), 'rel="mw:ExtLink" text');
          var openFacts = filterExternalLink.replace(new RegExp('pcs-collapse-table', 'g'), 'pcs-collapse-table');

          this.setState({ htmlForm: openFacts, responseModal: responseJson, htmlFormPrev: openFacts });


          var htmlString = this.state.htmlForm;
          var n = htmlString.indexOf("</head>");
          var kkkkk = new Date();
          var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + " " + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedstatic/uploaded_css_static.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
          this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });

          if (responseJson.status == 1) {
            this.setState({ spinnerModal: false });
          }
          else {
            this.setState({ spinnerModal: false });

          }
        }

      }).catch((error) => {
        setTimeout(function () { that.setState({ spinnerModal: false }) }, 1000);
        console.log("Description", error);
      });

  }



  closeDescription = () => {
    this.setState({ descriptionShow: false });

  }


  selectChild = (item, index) => {
    if (item.id !== global.selectedChild.id) {
      this.setPopupVisible(false)
      this.state.combinedData = [];
      global.selectedChild = item;
      global.colorIndex = index;
      // AsyncStorage.removeItem('globalIndex');
      AsyncStorage.setItem("globalIndex", JSON.stringify(index));
      this.setState({ spinner: true, selectedChildPrev: item, combinedData: [], count: 0, refreshing: !this.state.refreshing })

      // this.setState({ spinner: true, selectedChildPrev: item, combinedData: [], count: 0, previousKey: 0, refreshing: !this.state.refreshing })
      let that = this;
      setTimeout(function () { that.getHomeDataFirst() }, 500);
    } else {
      this.setPopupVisible(false)
    }


  }



  // this.setPopupVisible(false)
  // this.state.combinedData = [];
  // global.selectedChild = item;
  // this.setState({ spinner: true })
  // let that = this;
  // setTimeout(function () { that.getHomeData() }, 500);

  handleScroll(event, key) {
    const found3 = event.nativeEvent.contentOffset.x < 500;
    const found = event.nativeEvent.contentOffset.x > 500 && event.nativeEvent.contentOffset.x < 1400;
    const found2 = event.nativeEvent.contentOffset.x > 1400;
    if (found) {
      global.borderWidth1[key] = 2;
      global.borderWidth2[key] = 4;
      global.borderWidth3[key] = 2;
      global.firstBorderColor1[key] = key == 0 ? '#BDBDBD' : 'white';
      global.firstBorderColor2[key] = key == 0 ? '#527CF3' : 'white';
      global.firstBorderColor3[key] = key == 0 ? '#BDBDBD' : 'white';
      this.setState({ refreshing: !this.state.refreshing })
    }
    if (found2) {

      global.borderWidth1[key] = 2;
      global.borderWidth2[key] = 2;
      global.borderWidth3[key] = 4;
      global.firstBorderColor1[key] = key == 0 ? '#BDBDBD' : 'white';
      global.firstBorderColor2[key] = key == 0 ? '#BDBDBD' : 'white';
      global.firstBorderColor3[key] = key == 0 ? '#527CF3' : 'white';
      this.setState({ refreshing: !this.state.refreshing })
    }
    if (found3) {

      global.borderWidth1[key] = 4;
      global.borderWidth2[key] = 2;
      global.borderWidth3[key] = 2;
      global.firstBorderColor1[key] = key == 0 ? '#527CF3' : 'white';
      global.firstBorderColor2[key] = key == 0 ? '#BDBDBD' : 'white';
      global.firstBorderColor3[key] = key == 0 ? '#BDBDBD' : 'white';
      this.setState({ refreshing: !this.state.refreshing })
    }


  };



  


  showVisible = (index, position, item, mainItemType, key, indexNew, mainItemInterestName) => {
    this.setState({ popoverShow: false, previousKey: key });
    this.state.combinedData[key].data[indexNew].visible = !this.state.combinedData[key].data[indexNew].visible;
    if ((this.state.previousKey || this.state.previousKey == 0) && this.state.prevIndexxx != 'undefined' && this.state.previousKey != 'undefined') {
      this.state.combinedData[this.state.previousKey].data[this.state.prevIndexxx].visible = false;
    }

    if (this.state.previousKey == key && this.state.prevIndexxx == indexNew) {
      this.setShowDescriptionModal(item, mainItemType, key, index, mainItemInterestName)
      this.state.combinedData[key].data[indexNew].visible = true;
    }
    this.setState({ refreshing: !this.state.refreshing, prevIndexxx: indexNew, previousKey: key })

  }







  addToFavorite = (item, type, key, index) => {

    var isFavourite, favoArrayData;
    if (item.isFavourite == true) {
      isFavourite = 0;
      favoArrayData = false;
    } else {
      isFavourite = 1;
      favoArrayData = true;
    }

    var titleForApi, titleForDisplay, articleImage

    if (type == 'On This Day') {
      titleForApi = item.title_for_api;
      titleForDisplay = item.title_display;
      articleImage = item.thumbnail;
      // this.state.combinedData[key].isFavourite = favoArrayData;  old
      this.state.combinedData[this.state.previousKey].isFavourite = favoArrayData;

    } else if (type == 'featured_picture') {
      titleForApi = item.article;
      titleForDisplay = item.caption_part1
      articleImage = item.image;
      this.state.combinedData[this.state.previousKey].isFavourite = favoArrayData
      // this.state.combinedData[key].isFavourite = favoArrayData;  old
    }
    else {

      titleForApi = item.title_for_api;
      titleForDisplay = item.title_for_display
      articleImage = item.image;
      this.state.combinedData[this.state.previousKey].data[this.state.prevIndexxx].isFavourite = favoArrayData;


    }

    this.setState({ combinedData: this.state.combinedData, refreshing: !this.state.refreshing })
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'setOrUnsetFavouriteArticle', {
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
        title_for_api: titleForApi,
        favouriteStatus: isFavourite,
        title_for_display: titleForDisplay,
        image: articleImage

      })
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props._onLogout('Login')
          this.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;
        if (responseJson.status == 1) {
          this.setState({ showData: true, spinner: false });
          Toast.show(responseJson.message, Toast.SHORT);
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });

  }


  addToFavoriteeeeee = (item, type, key, index) => {

    

    var isFavourite, favoArrayData;
    if (this.state.responseModal.isFavourite == true) {
      isFavourite = 0;
      favoArrayData = false;
    } else {
      isFavourite = 1;
      favoArrayData = true;
    }
    var responseModal = this.state.responseModal;
    responseModal.isFavourite = favoArrayData;
    this.setState({ responseModal: responseModal })

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'setOrUnsetFavouriteArticle', {
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
        title_for_api: this.state.responseModal.title_for_api,
        favouriteStatus: isFavourite,
        title_for_display: this.state.responseModal.title_for_display,
        image: this.state.responseModal.image

      })
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props._onLogout('Login')
          this.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;
        if (responseJson.status == 1) {
          this.setState({ showData: true, spinner: false });
          Toast.show(responseJson.message, Toast.SHORT);
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });

  }


  getUserList = (item, pos) => {

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
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props._onLogout('Login')
          this.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;
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


  setCreateList = () => {
    if (this.state.newListChecked) {
      const { listTitle } = this.state;
      if (!listTitle || listTitle.length === 0) {
        Toast.show('Please add list', Toast.LONG);
      }
      else {
        this.addNewList(this.state.listTitle);
      }
    }
    else {
      if (this.state.currentList !== undefined) {
        this.state.openFrom == 'Modal' ? this.addWithOldListttttt() : this.addWithOldList();
      } else {
        Toast.show("Please select list", Toast.SHORT);
      }
    }
  }

  addNewList(listTitleName) {
    //  this.setState({newListShow: false})
    this.setState({ spinnerList: true, newListShow: false })
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'createUserList', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': global.user_token
      },
      body: JSON.stringify({
        listName: listTitleName,
        childId: global.selectedChild.id,
      })
    })

      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props._onLogout('Login')
          this.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;

        if (responseJson.status == 1) {
          this.setState({ showData: true, spinnerList: false, newListShow: false, newListChecked: false, listTitle: '', currentList: { id: responseJson.id } });

          let that = this;
          setTimeout(function () {
            that.state.openFrom == 'Modal' ? that.addWithOldListttttt() : that.addWithOldList();
            that.getUserList();
          },
            500);

        }
        else {
          this.setState({ spinnerList: false });
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  backDetail = () => {
    console.log("hiiiii this.state.articlesToOpen", this.state.articlesToOpen)

    if (this.state.articlesToOpen.length == 1) {
      this.setState({ visibleModal: null, articlesToOpen: [] })
    }
    else {
      var articlesToOpen = this.state.articlesToOpen;
      var cuurent_article = this.state.articlesToOpen[this.state.articlesToOpen.length - 2];
      articlesToOpen.splice(this.state.articlesToOpen.length - 1);
      console.log("hiiiii this.state.articlesToOpen after", articlesToOpen)
      this.setState({ articlesToOpen: articlesToOpen })
      this.showArticleDetailForLinks(cuurent_article);
    }

  }


  addWithOldList = () => {
    var titleForApi, titleForDisplay, articleImage

    if (this.state.listType == 'On This Day') {
      titleForApi = this.state.selectedItemm.title_for_api;
      articleImage = this.state.selectedItemm.thumbnail;

    } else if (this.state.listType == 'featured_picture') {
      titleForApi = this.state.selectedItemm.article;
      articleImage = this.state.selectedItemm.image;
    }
    else {

      titleForApi = this.state.selectedItemm.title_for_api;
      articleImage = this.state.selectedItemm.image;
    }


    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'addArticlesToList', {
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
        title_for_api: titleForApi,
        image: articleImage,
        listId: this.state.currentList.id

      })
    })

      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props._onLogout('Login')
          this.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;

        if (responseJson.status == 1) {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ showData: true, spinner: false, newListShow: false, newListChecked: false, listTitle: '' });
          this.getUserList();


        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });


  }


  addWithOldListttttt = () => {

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'addArticlesToList', {
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
        title_for_api: this.state.responseModal.title_for_api,
        image: this.state.responseModal.image,
        listId: this.state.currentList.id

      })
    })

      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props._onLogout('Login')
          this.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;

        if (responseJson.status == 1) {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ showData: true, spinner: false, newListShow: false, newListChecked: false, listTitle: '' });
          this.getUserList();


        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });


  }



  createNewIcon = () => {
    var checkeddd = [];
    for (var i in this.state.checkPrev) {
      checkeddd[i] = false;
    }
    this.setState({ newListChecked: !this.state.newListChecked, checked: checkeddd, refreshingCheck: !this.state.refreshingCheck });
  }



  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }


  setPopupVisible(visible) {
    this.setState({ popoverShow: !this.state.popoverShow });
  }

  setShowNewListModal(visible, item, type, openFrom) {
    if (visible) {
      this.setState({ newListShow: visible, selectedItemm: item, listType: type, openFrom: openFrom });
    }
    else {
      this.setState({ newListShow: visible });
    }

  }


  isIconCheckedOrNot = (item, index) => {
    var checked = this.state.checked;
    checked[index] = !checked[index];
    for (var i in checked) {
      if (i != index) {
        checked[i] = false;
      }
    }
    this.setState({ newListChecked: false, checked: checked, refreshingCheck: !this.state.refreshingCheck, currentList: item })

  }

  fetchList() {

    let that = this;
    setTimeout(function () { that.setState({ showIndicator: true }), that.getHomeData() }, 1000);
   

  }

  onEndReached() {
    this.fetchList();
  }



  hideSpinner() {
    this.setState({ spinnerModal: false });
  }




  layoutChecked = (index) => {
    if (index == '0') {
      this.setState({ defaultChecked: true, customChecked: false, htmlForm: this.state.htmlFormPrev });
    } else {
      if (!this.state.customChecked) {
        var htmlString = this.state.htmlForm;
        var n = htmlString.indexOf("</head>");
        var kkkkk = new Date();
        var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
        this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });
      }

    }
  }


  reloadData = () => {
    this.setState({ combinedData: [], spinner: true, count: 0, refreshing: !this.state.refreshing }, this.getHomeDataFirst());

  }





  render() {


    return (
      <ImageBackground source={require('../assets/images/new_bg.png')} style={{ width: '100%', height: '100%', marginTop: 60, position: 'relative' }}>
        <TouchableOpacity activeOpacity={1} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={(jj) => this.setState({ popoverShow: false })}>


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
                      <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.selectChild(item, index)}>
                        <View style={{ width: 50, height: 50, borderRadius: 50 / 2, backgroundColor: index == 0 ? '#527CF3' : index == 1 ? '#F45C5F' : index == 2 ? '#62C677' : index == 3 ? '#05e6f0' : '#800080', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                          <Text style={{ fontSize: 22, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8, marginLeft: 1 }}>{item.username.substring(0, 1)}</Text>
                        </View>
                        <Text style={{ color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginLeft: 10, marginRight: 10, fontSize: 20 }}>{item.username}</Text>
                      </TouchableOpacity>
                      <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 1 }} />
                    </View>
                  )}
                  refreshing={this.state.refreshing}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              : null}

            <View style={{ position: 'absolute', right: 10, flexDirection: 'row', zIndex: 999 }}>
              <TouchableOpacity onPress={() => this.props._onClickSearch('Mysearch')} style={styles.iconBackground}>
                <Image style={{ height: 27, width: 27 }} source={require('../assets/images/search.png')} />
              </TouchableOpacity>
             
              <TouchableOpacity style={[styles.circle, { backgroundColor: global.colorIndex == 0 ? '#527CF3' : global.colorIndex == 1 ? '#F45C5F' : global.colorIndex == 2 ? '#62C677' : global.colorIndex == 3 ? '#05e6f0' : '#800080' }]} onPress={() => { this.setPopupVisible(true) }}>
                <Text style={{ fontSize: 22, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8, marginLeft: 1 }}>{global.selectedChild.username.substring(0, 1)}</Text>
              </TouchableOpacity>
            </View>

          </View>



          <View style={{ marginTop: 30, marginBottom: 60 }}>


            <Spinner
              visible={this.state.spinner} />

            {this.state.showData ?
              <View style={{ flexDirection: 'column' }}>



                <FlatList
                  style={{ paddingLeft: 15, marginRight: 10 }}
                  onEndReached={this.onEndReached}
                  onEndReachedThreshold={0.3}
                  data={this.state.combinedData}
                  refreshing={this.state.refreshing}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item, index }) =>
                    <TouchableOpacity activeOpacity={1}>


                      {item.type == 'interest' ?

                        <View style={{ width: '100%', flexDirection: 'column', marginTop: 10 }}>
                          <Text style={{ textTransform: 'uppercase', color: index == 0 ? '#527CF3' : 'white', fontSize: 25, fontFamily: 'BigJohn', marginLeft: 12 }}>{item.interestName}<Text> / </Text> <Text style={{ textTransform: 'uppercase', color: index == 0 ? '#5d5d5d' : 'white', fontSize: 22, fontFamily: 'SlimJoe' }}>{item.topic}</Text></Text>
                          <View style={{ width: '84%', flexDirection: 'row', marginTop: 5, marginLeft: 10 }}>
                            <View style={{ width: '28%', borderBottomColor: global.firstBorderColor1[index], borderBottomWidth: global.borderWidth1[index] }} />
                            <View style={{ width: '28%', borderBottomColor: global.firstBorderColor2[index], borderBottomWidth: global.borderWidth2[index], marginLeft: 10, marginRight: 10 }} />
                            <View style={{ width: '28%', borderBottomColor: global.firstBorderColor3[index], borderBottomWidth: global.borderWidth3[index] }} />
                          </View>

                          <View style={{ flex: 1 }}>

                            <ScrollView
                              onScroll={(event, nn) => this.handleScroll(event, index)}
                              scrollEventThrottle={16}
                              onScrollBeginDrag={() => this.setState({ currentKey: index })}
                              horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10, height: 300 }}>
                              {item.data.map((mainItem, key) => (
                                <View style={{ flexDirection: 'row' }}>
                                  <TouchableOpacity activeOpacity={1} style={styles.touchableStyle}
                                    onPress={(nn) => this.showVisible(mainItem.pageId, 0, mainItem, item.type, index, key, item.interestName)}>
                                    {mainItem.image ?
                                      <Image style={[styles.imageBookmarks, { height: mainItem.visible ? 280 : 250, width: mainItem.visible ? 340 : 300, marginRight: item.hasMore ? 0 : 15 }]} source={{ uri: mainItem.image }} />
                                      :
                                      <ImageBackground style={[styles.noImageStyle, { height: mainItem.visible ? 280 : 250, width: mainItem.visible ? 340 : 300, marginRight: item.hasMore ? 0 : 15 }]}>
                                        <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                                      </ImageBackground>

                                      // <View style={[styles.imageBookmarks, { height: mainItem.visible ? 280 : 250, width: mainItem.visible ? 340 : 300, backgroundColor: this.state.selectedColor, }]}></View>
                                    }

                                    {mainItem.image ? <Image source={require('../assets/images/gradient.png')} style={{ width: mainItem.visible ? 340 : 300, height: mainItem.visible ? 210 : 70, marginLeft: 10, position: 'absolute', bottom: mainItem.visible ? 0 : 20, borderRadius: 10 }} /> : null}

                                    {mainItem.visible ?
                                      <View style={{ flexDirection: 'row', position: 'absolute', marginLeft: 20, right: 10, top: 20 }}>

                                        {/* for add fav icon and add to list item set when has more fasle */}

                                        {item.hasMore ?
                                          <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity style={{ paddingRight: 5, zIndex: 99999 }} onPress={(nn) => this.addToFavorite(mainItem, item.type, key, index)}>
                                              {mainItem.isFavourite ?
                                                <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                                                :
                                                <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                                              }
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ paddingLeft: 5, zIndex: 999 }} onPress={(mm) => this.setShowNewListModal(true, mainItem, item.type, '')}>
                                              <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                                            </TouchableOpacity>
                                          </View>

                                          :

                                          <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity style={{ paddingRight: 8, zIndex: 99999 }} onPress={(nn) => this.addToFavorite(mainItem, item.type, key, index)}>
                                              {mainItem.isFavourite ?
                                                <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                                                :
                                                <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                                              }
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ paddingRight: 12, zIndex: 999 }} onPress={(mm) => this.setShowNewListModal(true, mainItem, item.type, '')}>
                                              <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                                            </TouchableOpacity>
                                          </View>}

                                      </View> : null}

                                    <View style={{ width: 300, justifyContent: 'center', position: 'absolute', bottom: mainItem.visible ? 15 : 25 }}>
                                      <Text numberOfLines={2} style={styles.textStyle}>{mainItem.title_for_display}</Text>
                                      {mainItem.visible ?
                                        <View style={{ marginTop: 55 }}>
                                          <Text numberOfLines={4} style={styles.textDesStyle}>{mainItem.summary}</Text>
                                        </View>
                                        : null}
                                    </View>

                                  </TouchableOpacity>



                                  {item.hasMore && key == item.data.length - 1 ?
                                    <TouchableOpacity style={styles.showMoreStyle} onPress={() => this.props._onClickList('SearchList', item.data[0].title_for_api, item.data[0].title_for_display, item.interestName, global.selectedChild, 'seed')}>
                                      <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white' }}>Show more{'\n'}    Like This</Text>
                                      <Image style={{ width: 40, height: 40, marginLeft: 5, marginBottom: 8 }} source={require('../assets/images/triangle.png')} />
                                    </TouchableOpacity>
                                    : null}


                                </View>
                              ))
                              }



                            </ScrollView>
                          </View>
                        </View>

                        :

                        item.type == 'history' ?
                          <View style={styles.articleStyle}>
                            <Text style={{ textTransform: 'uppercase', color: index == 0 ? '#527CF3' : 'white', fontSize: 25, fontFamily: 'BigJohn', alignSelf: 'flex-start', marginTop: 15, marginLeft: 12 }}>Because you read / <Text style={{ textTransform: 'uppercase', color: index == 0 ? '#5d5d5d' : 'white', fontSize: 22, fontFamily: 'SlimJoe' }}>{item.becauseYouRead}</Text></Text>
                            <View style={{ width: '84%', flexDirection: 'row', marginTop: 5, marginLeft: 10 }}>
                              <View style={{ width: '28%', borderBottomColor: global.firstBorderColor1[index], borderBottomWidth: global.borderWidth1[index] }} />
                              <View style={{ width: '28%', borderBottomColor: global.firstBorderColor2[index], borderBottomWidth: global.borderWidth2[index], marginLeft: 10, marginRight: 10 }} />
                              <View style={{ width: '28%', borderBottomColor: global.firstBorderColor3[index], borderBottomWidth: global.borderWidth3[index] }} />
                            </View>


                            <View style={{ flex: 1 }}>
                              <ScrollView
                                onScroll={(event, nn) => this.handleScroll(event, index)}
                                scrollEventThrottle={16}
                                onScrollBeginDrag={() => this.setState({ currentKey: index })}
                                horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10, height: 300 }}>
                                {item.data.map((mainItem, key) => (
                                  <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity activeOpacity={1} style={styles.touchableStyle}
                                      onPress={(nn) => this.showVisible(mainItem.pageId, 'history', mainItem, item.type, index, key, '')}>
                                      {mainItem.image ?
                                        <Image style={[styles.imageBookmarks, { height: mainItem.visible ? 280 : 250, width: mainItem.visible ? 340 : 300, marginRight: item.hasMore ? 0 : 15 }]} source={{ uri: mainItem.image }} />
                                        :
                                        <ImageBackground style={[styles.noImageStyle, { height: mainItem.visible ? 280 : 250, width: mainItem.visible ? 340 : 300, marginRight: item.hasMore ? 0 : 15 }]}>
                                          <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                                        </ImageBackground>

                                      }

                                      {mainItem.image ? <Image source={require('../assets/images/gradient.png')} style={{ width: mainItem.visible ? 340 : 300, height: mainItem.visible ? 210 : 70, marginLeft: 10, position: 'absolute', bottom: mainItem.visible ? 0 : 20, borderRadius: 10 }} /> : null}

                                      {mainItem.visible ?
                                        <View style={{ position: 'absolute', marginLeft: 20, right: 10, top: 20 }}>

                                          {/* for add fav icon and add to list item set when has more fasle */}

                                          {item.hasMore ?
                                            <View style={{ flexDirection: 'row' }}>
                                              <TouchableOpacity style={{ paddingRight: 5 }} onPress={(nn) => this.addToFavorite(mainItem, item.type, key, index)}>
                                                {mainItem.isFavourite ?
                                                  <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                                                  :
                                                  <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                                                }
                                              </TouchableOpacity>

                                              <TouchableOpacity style={{ paddingLeft: 5 }} onPress={(mm) => this.setShowNewListModal(true, mainItem, item.type, '')}>
                                                <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                                              </TouchableOpacity>
                                            </View>

                                            :

                                            <View style={{ flexDirection: 'row' }}>
                                              <TouchableOpacity style={{ paddingRight: 8 }} onPress={(nn) => this.addToFavorite(mainItem, item.type, key, index)}>
                                                {mainItem.isFavourite ?
                                                  <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                                                  :
                                                  <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                                                }
                                              </TouchableOpacity>

                                              <TouchableOpacity style={{ paddingRight: 12 }} onPress={(mm) => this.setShowNewListModal(true, mainItem, item.type, '')}>
                                                <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                                              </TouchableOpacity>
                                            </View>}

                                        </View>
                                        : null}

                                      <View style={{ width: 300, justifyContent: 'center', position: 'absolute', bottom: mainItem.visible ? 10 : 20 }}>
                                        <Text numberOfLines={2} style={styles.textStyle}>{mainItem.title_for_display}</Text>
                                        {mainItem.visible ?
                                          <View style={{ marginTop: 50 }}>
                                            <Text numberOfLines={4} style={styles.textDesStyle}>{mainItem.summary}</Text>

                                          </View>
                                          : null}

                                      </View>

                                    </TouchableOpacity>
                                    {item.hasMore && key == item.data.length - 1 ?
                                      <TouchableOpacity style={styles.showMoreStyle} onPress={() => this.props._onClickList('SearchList', item.data[0].title_for_api, item.data[0].title_for_display, item.becauseYouRead, global.selectedChild, 'seed')}>
                                        <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white' }}>Show more{'\n'}    Like This</Text>
                                        <Image style={{ width: 40, height: 40, marginLeft: 5, marginBottom: 8 }} source={require('../assets/images/triangle.png')} />
                                      </TouchableOpacity>
                                      : null}
                                  </View>
                                ))
                                }

                              </ScrollView>
                            </View>
                          </View>

                          :


                          item.type == 'featured_list' ?
                            <View style={styles.articleStyle}>
                              <Text style={{ textTransform: 'uppercase', color: index == 0 ? '#527CF3' : 'white', fontSize: 25, fontFamily: 'BigJohn', alignSelf: 'flex-start', marginTop: 15, marginLeft: 12 }}>{item.listNameFormatted}</Text>
                              <View style={{ width: '84%', flexDirection: 'row', marginTop: 5, marginLeft: 10 }}>
                                <View style={{ width: '28%', borderBottomColor: global.firstBorderColor1[index], borderBottomWidth: global.borderWidth1[index] }} />
                                <View style={{ width: '28%', borderBottomColor: global.firstBorderColor2[index], borderBottomWidth: global.borderWidth2[index], marginLeft: 10, marginRight: 10 }} />
                                <View style={{ width: '28%', borderBottomColor: global.firstBorderColor3[index], borderBottomWidth: global.borderWidth3[index] }} />
                              </View>

                              <View style={{ flex: 1 }}>
                                <ScrollView
                                  onScroll={(event, nn) => this.handleScroll(event, index)}
                                  scrollEventThrottle={16}
                                  onScrollBeginDrag={() => this.setState({ currentKey: index })}
                                  horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10, height: 300 }}>
                                  {item.data.map((mainItem, key) => (
                                    <View style={{ flexDirection: 'row' }}>
                                      <TouchableOpacity activeOpacity={1} style={{
                                        shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowRadius: 5,
                                        shadowOpacity: 0.5
                                      }} onPress={(nn) => this.showVisible(mainItem.pageId, 'feature', mainItem, item.type, index, key, '')}>

                                        {mainItem.image ?
                                          <Image style={[styles.imageBookmarks, { height: mainItem.visible ? 280 : 250, width: mainItem.visible ? 340 : 300, marginRight: item.hasMore ? 0 : 15 }]} source={{ uri: mainItem.image }} />
                                          :

                                          <ImageBackground style={[styles.noImageStyle, { height: mainItem.visible ? 280 : 250, width: mainItem.visible ? 340 : 300, marginRight: item.hasMore ? 0 : 15 }]}>
                                            <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                                          </ImageBackground>

                                          // <View style={[styles.imageBookmarks, { height: mainItem.visible ? 280 : 250, width: mainItem.visible ? 340 : 300, backgroundColor: this.state.selectedColor, }]}></View>
                                        }
                                        {mainItem.image ? <Image source={require('../assets/images/gradient.png')} style={{ width: mainItem.visible ? 340 : 300, height: mainItem.visible ? 210 : 70, marginLeft: 10, position: 'absolute', bottom: mainItem.visible ? 0 : 20, borderRadius: 10 }} /> : null}

                                        {mainItem.visible ?
                                          <View style={{ position: 'absolute', marginLeft: 20, right: 10, top: 20 }}>

                                            {/* for add fav icon and add to list item set when has more fasle */}

                                            {item.hasMore ?
                                              <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity style={{ paddingRight: 5 }} onPress={(nn) => this.addToFavorite(mainItem, item.type, index, key)}>
                                                  {mainItem.isFavourite ?
                                                    <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                                                    :
                                                    <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                                                  }
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{ paddingLeft: 5 }} onPress={(mm) => this.setShowNewListModal(true, mainItem, item.type, '')}>
                                                  <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                                                </TouchableOpacity>

                                              </View>

                                              :

                                              <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity style={{ paddingRight: 8 }} onPress={(nn) => this.addToFavorite(mainItem, item.type, index, key)}>
                                                  {mainItem.isFavourite ?
                                                    <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                                                    :
                                                    <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                                                  }
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{ paddingRight: 12 }} onPress={(mm) => this.setShowNewListModal(true, mainItem, item.type, '')}>
                                                  <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                                                </TouchableOpacity>

                                              </View>}



                                          </View>
                                          : null}


                                        <View style={{ width: 300, justifyContent: 'center', position: 'absolute', bottom: mainItem.visible ? 10 : 20 }}>
                                          <Text numberOfLines={2} style={styles.textStyle}>{mainItem.caption}</Text>
                                          {mainItem.visible ?
                                            <View style={{ marginTop: 50 }}>
                                              <Text numberOfLines={4} style={styles.textDesStyle}>{mainItem.summary}</Text>

                                            </View>
                                            : null}
                                        </View>

                                      </TouchableOpacity>

                                      {item.hasMore && key == item.data.length - 1 ?
                                        <TouchableOpacity style={styles.showMoreStyle} onPress={() => this.props._onClickList('FeaturedPicture', item.listNameFormatted, '', item.listNameOriginal, global.selectedChild, item.seed)}>
                                          <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white' }}>Show more{'\n'}    Like This</Text>
                                          <Image style={{ width: 40, height: 40, marginLeft: 5, marginBottom: 8 }} source={require('../assets/images/triangle.png')} />
                                        </TouchableOpacity>
                                        : null}
                                    </View>
                                  ))}
                                </ScrollView>
                              </View>
                            </View>


                            :
                            item.type == 'featured_picture' ?

                              <TouchableOpacity activeOpacity={1} style={{
                                shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowRadius: 5,
                                shadowOpacity: 0.5, flexDirection: 'column', backgroundColor: 'rgba(52, 52, 52, 0.2)', borderRadius: 10, marginLeft: 12, marginTop: 10
                              }} onPress={(nn) => this.setShowDescriptionModalFeature(item.data, item.type, index, 'no', '')} >
                                <View style={{ flexDirection: 'row' }}>

                                  <View style={{ flex: 1, padding: 15 }}>
                                    <Text style={{ color: 'white', fontSize: 25, fontFamily: 'BigJohn' }}>Featured Picture</Text>
                                    <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5, marginTop: 10, marginBottom: 10 }} />
                                    <Text style={{ width: '90%', textTransform: 'none', color: 'white', fontSize: 20, fontFamily: 'HelveticaNeueLTStd-Roman' }}>{item.data.caption_full}</Text>
                                  </View>

                                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Image
                                      style={{ height: item.data.height, width: '100%', borderRadius: 10 }}
                                      source={{ uri: item.data.image }}
                                    // style={{ borderRadius: 1, height: '100%' }}
                                    // source={{ uri: item.data.image }}
                                    />
                                  </View>
                                </View>

                              </TouchableOpacity>
                              :

                              item.type == 'On This Day' ?
                                <TouchableOpacity activeOpacity={1} style={{
                                  shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowRadius: 5,
                                  shadowOpacity: 0.5, flexDirection: 'column', backgroundColor: 'rgba(52, 52, 52, 0.2)', borderRadius: 10, marginTop: 10, marginLeft: 12
                                }} onPress={(nn) => this.setShowDescriptionModal(item.data, item.type, index, 'no', '')} >
                                  <View style={{ flexDirection: 'row' }}>

                                    <View style={{ flex: 1, padding: 15 }}>
                                      <Text style={{ color: 'white', fontSize: 25, fontFamily: 'BigJohn' }}>On this Day {'\n'}
                                        <Text style={{ textTransform: 'uppercase', color: 'white', fontSize: 26, fontFamily: 'SlimJoe', marginTop: 30, marginBottom: 30 }}>{item.data.eventDate}</Text> </Text>
                                      <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />

                                      <Text style={{ width: '90%', textTransform: 'none', color: 'white', fontSize: 20, fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 10 }}>{item.data.on_this_day_text}</Text>
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                      <Image
                                        style={{ height: item.data.height, width: '100%', borderRadius: 10 }}
                                        source={{ uri: item.data.thumbnail }}
                                      />
                                    </View>
                                  </View>

                                </TouchableOpacity>

                                : null}
                      {index == this.state.combinedData.length - 1 ?
                        <ActivityIndicator
                          style={{ padding: 10 }}
                          animating={this.state.showIndicator}
                          size="large" color="white" />
                        : null}

                      {this.state.combinedData.length > 32 && index == this.state.combinedData.length - 1 ?
                        <TouchableOpacity style={styles.reloadButton} onPress={(nn) => this.reloadData()}>
                          <Text style={styles.selectNavText}>Reload Articles</Text>
                        </TouchableOpacity>
                        : null}


                    </TouchableOpacity>
                  }
                  horizontal={false}
                  ItemSeparatorComponent={this.renderSeparator}
                  keyExtractor={(item, index) => index.toString()}
                />



              </View>

              : null}


            <Modal
              coverScreen={true}
              isVisible={this.state.visibleModal === 'sliding'}
              backdropColor="transparent"
              animationIn="slideInRight"
              animationOut="slideOutRight"
              animationInTiming={1000}
              animationOutTiming={1000}
              backdropTransitionInTiming={800}
              backdropTransitionOutTiming={800} >






              <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* <Spinner
                visible={this.state.spinnerModal} /> */}

                <TouchableOpacity activeOpacity={1} style={{ width: '15%', backgroundColor: this.state.transparentModal ? 'rgba(255, 255, 255 ,0.0)' : 'rgba(255,255,255,0.5)' }} onPress={() => this.setState({ visibleModal: false, transparentModal: true, defaultChecked: true, customChecked: false, articlesToOpen: [] })} />
                <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10 }}>


                  <TouchableOpacity style={{ marginLeft: 20, marginTop: 15 }} onPress={() => this.backDetail()}>
                    <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
                  </TouchableOpacity>

                  <View style={{ width: '100%', height: 50, alignItems: 'center' }}>
                  


                  </View>

                  <View style={{ position: 'absolute', marginTop: 15, right: 10, flexDirection: 'row', flexDirection: 'row', padding: 10 }}>
                    <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>
                      <TouchableOpacity style={{ marginRight: 15 }} onPress={(nn) => this.addToFavoriteeeeee(this.state.seachedItem, this.state.modalType, this.state.selectedKey, this.state.selectedIndex)}>
                        <Image style={{ width: 30, height: 31 }} source={require('../assets/images/star_plus.png')} />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginRight: 15 }} onPress={(mm) => this.setShowNewListModal(true, this.state.seachedItem, this.state.modalType, 'Modal')}>
                        <Image style={{ width: 30, height: 32 }} source={require('../assets/images/lists_star.png')} />
                      </TouchableOpacity>


                    </View>

                  </View>




                  <View style={{ width: '100%', marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />

                  <WebView
                    style={{ flex: 1, marginBottom: 20 }}
                    ref={(ref) => { this.webview = ref; }}
                    source={{ html: this.state.htmlForm }}
                    onNavigationStateChange={(event) => {
                      if (event.url != 'about:blank') {
                        this.webview.stopLoading();

                        var article_nmaesss = event.url.split('/');
                        var article_name = article_nmaesss[article_nmaesss.length - 1];
                        console.log("article_name", article_name)
                        var articlesToOpen = this.state.articlesToOpen;
                        articlesToOpen.push(article_name)
                        this.setState({ articlesToOpen: articlesToOpen })
                        this.showArticleDetailForLinks(article_name);
                      }
                    }} />

                </View>
                <Modal

                  animationType="slide"
                  visible={this.state.newListShow}
                  transparent={true}>

                  <Spinner
                    visible={this.state.spinnerList}
                  />

                  <KeyboardAvoidingView style={{
                    height: '100%',
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.8)'
                  }} behavior="padding" enabled >

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
                                containerStyle={{ backgroundColor: '#ffffff00', borderWidth: 0 }}
                                textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />

                            }

                            ItemSeparatorComponent={this.renderSeparator}
                            horizontal={false}
                            refreshing={this.state.refreshingCheck}
                            keyExtractor={(item, index) => index.toString()}
                          />


                          <CheckBox
                            title="Create New List"
                            checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                            uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                            checked={this.state.newListChecked}
                            onPress={() => this.createNewIcon()}
                            containerStyle={{ backgroundColor: '#ffffff00', borderWidth: 0 }}
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


                        <TouchableOpacity onPress={() => { this.setShowNewListModal(false, 'item', '') }} style={{ width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                          <Text style={{ color: '#B8B8B8', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>x CLOSE</Text>
                        </TouchableOpacity>

                      </View>

                    </View>


                  </KeyboardAvoidingView>
                </Modal>


              </View>




            </Modal>



            <Modal
              animationType="slide"
              visible={this.state.newListShow}
              transparent={true}>

              <Spinner
                visible={this.state.spinnerList} />

              <KeyboardAvoidingView style={{
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.8)'
              }}
                behavior="padding" enabled>

                <View
                  behavior="padding" enabled
                  style={{
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
                            containerStyle={{ backgroundColor: '#ffffff00', borderWidth: 0 }}
                            textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />

                        }

                        ItemSeparatorComponent={this.renderSeparator}
                        horizontal={false}
                        refreshing={this.state.refreshingCheck}
                        keyExtractor={(item, index) => index.toString()}
                      />


                      <CheckBox
                        title="Create New List"
                        checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                        uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                        checked={this.state.newListChecked}
                        onPress={() => this.createNewIcon()}
                        containerStyle={{ backgroundColor: '#ffffff00', borderWidth: 0 }}
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


                    <TouchableOpacity onPress={() => { this.setShowNewListModal(false, 'item', '') }} style={{ width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                      <Text style={{ color: '#B8B8B8', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>x CLOSE</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </KeyboardAvoidingView>
            </Modal>



          </View>

        </TouchableOpacity>


      </ImageBackground>
    );
  }







}

export default Home;


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
  webviewStyle: {
    height: '100%',
    width: '100%'
  },
  viewStyle: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageAnimals: {
    width: 300,
    height: 250,
    marginLeft: 20,
    borderRadius: 10,

  },
  imageBookmarks: {
    // width: 250,
    // height: 320,
    width: 300,
    height: 250,
    borderRadius: 10,
    marginLeft: 10

  }, textStyle: {
    fontSize: 20,
    color: 'white',
    position: 'absolute',
    marginLeft: 20,
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: 'bold',
    paddingTop: 8,
    paddingBottom: 40,
    lineHeight: 14,
  },
  textDesStyle: {
    fontSize: 14,
    color: 'white',
    marginLeft: 20,
    marginTop: 10,
    fontFamily: 'HelveticaNeueLTStd-Roman',
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 5,
  }
  ,

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
    marginTop: 2,
    color: '#9A9A9A',
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  selectNavText: {
    marginTop: 2,
    color: '#527CF3',
    fontFamily: 'HelveticaNeueLTStd-Roman',
    fontSize: 20,

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

  showMoreStyle: {
    flexDirection: 'row',
    borderRadius: 10,
    width: 250,
    height: 260,
    marginLeft: 20,
    backgroundColor: 'rgba(98,98,98,0.55)',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.5
  },
  touchableStyle: {
    zIndex: 99,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
  },

  styleSubmit: {
    width: '94%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
    , borderRadius: 10,
    backgroundColor: '#3F67DC',
    marginTop: 15,
    marginLeft: 20
  },

  articleStyle: {
    width: '100%',
    flexDirection: 'column',

  },

  reloadButton: {
    width: 200,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    fontFamily: 'HelveticaNeueLTStd-Md',
    alignItems: 'center',
    marginTop: -45,
    paddingTop: 10,
    marginBottom: 10
  }
  ,

  noImageStyle: {
    flexDirection: 'row',
    borderRadius: 10,
    width: 300,
    height: 250,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'rgba(98,98,98,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.5
  },


});


