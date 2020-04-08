import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity, ImageBackground, FlatList, Alert, WebView , Linking } from 'react-native';
import { Base_Url, AppVersion } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements';
import Toast from 'react-native-simple-toast';


export class History extends Component {


  constructor(props) {
    super(props);

    this.state = {
      childs: [{ 'username': '' }],
      visible: [],
      visible1: [],
      visible2: [],
      refreshing: false,
      htmlForm: '',
      bgColor: [
        'red',
        'blue',
        'yellow',
      ],
      user_token: '',
      selectedChild: { username: '' },
      spinner: false,
      showLoad: true,
      historyToday: [],
      historyPrevious: [],
      historyOthers: [],
      newListShow: false,
      responseModal: {},
      listTitle: '',
      defaultChecked: true,
      spinnerModal: true,
      noDataFound: false,
      articlesToOpen: []

    };
  }
  onNavigationChange(event) {
    if (event.target) {
      const htmlHeight = Number(event.target) //convert to number
      this.setState({ Height: htmlHeight });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (global.currenttt == 4) {
      AsyncStorage.getItem("token").then((value) => {
        AsyncStorage.getItem('childs').then((childs) => {
          AsyncStorage.getItem('globalIndex').then((index) => {


            console.log("indexHistory", index)

            var childsss = JSON.parse(childs);
            global.selectedChild = childsss[global.colorIndex];
            // AsyncStorage.setItem('alreadySelected', global.colorIndex);
            this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0], spinner: false })
            this.getHistoryData();
          }).done();
        }).done();
      }).done();
      this.setState({ popoverShow: false })
    }
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


  _getRandomColor() {
    var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
    this.setState({
      selectedColor: item,
    })
  }

  getBannledList() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });

    fetch(Base_Url + 'getWordReplacementList', {
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
        if (responseJson.status == 1) {
          var bannnedData = [];
          for (var i in responseJson.data) {
            console.log("dataaaaaaa", responseJson.data[i])
            if (responseJson.data[i].replaceword) {
              bannnedData.push(responseJson.data[i]);
            }
          }
          this.setState({ banData: bannnedData });
        }
        else {
        }
      }).catch((error) => {
        console.log(error);
      });

  }




  getHistoryData() {
    var timezone = DeviceInfo.getTimezone();
    this.setState({ timezone: timezone });

    if (this.state.showLoad) {
      this.setState({ spinner: true })
    }

    fetch(Base_Url + 'getUserBrowsingHistory', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timezone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,
        // childId: this.state.selectedChild.id,
      })

    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          // AsyncStorage.removeItem('token');
          // this.props._onLogout('Login')
          this.setState({ spinner: false });
          return response.json();
        }
        else if (response.status === 423) {
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;

      

        if (responseJson.status == 1) {
          this.setState({
            historyToday: responseJson.data.today, historyPrevious: responseJson.data.previousDay,
            historyOthers: responseJson.data.others, showLoad: false, spinner: false
          });


          this.getUserList();
          this._getRandomColor()
          this.getBannledList();
          let that = this;
          setTimeout(function () { that.setState({ noDataFound: true }) }, 2000);
        }


        else {
          if (responseJson.app_version_error_code === '423') {
            this.showAppUpdateAlert(responseJson.url)

          } else {
            Toast.show(responseJson.message, Toast.SHORT);
            this.setState({ spinner: false });
          }

        }
        // this.setOnthisDayResponse()
      }).catch((error) => {
        this.setState({ spinner: false });
        console.log(error);
      });

  }



  setShowDescriptionModal(item, index, type) {
    console.log("item.article", item.article)
    var articlesToOpen = this.state.articlesToOpen;
    articlesToOpen.push(item.article);
    this.setState({ visibleModal: 'sliding', htmlForm: '', responseModal: '', articlesToOpen: articlesToOpen, seachedItem: item, selectedIndex: index, modalType: type, popoverShow: false, transparentModal: true });
    let that = this;
    setTimeout(function () { that.setState({ transparentModal: false }) }, 800);
    // setTimeout(function () { that.setState({ spinnerModal: true }) }, 1500);   

    fetch(Base_Url + 'getArticleDetail', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        title: item.article,
        childId: global.selectedChild.id,
        interestName: item.interest
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
             
              if (this.state.banData[i].checktitle.toLowerCase() == split2.split("<")[0].toLowerCase()) {
                replacinggg.push(splitString[1]);

                console.log("ehhhhh aaaa ", splitString[1])
              }
            }
          }

          var filterHtmlStringgggg = filterHtmlString;
          let unique = [...new Set(replacinggg)];
          console.log("uniguewwwwwwwwwwwwwwwwwwwww", unique)
          for (var k in unique) {
            filterHtmlStringgggg = filterHtmlStringgggg.replace(new RegExp(unique[k], 'gi'), '');
          }

          var filterHtmlStringgggg22 = filterHtmlStringgggg;
          for (var i in this.state.banData) {
            console.log("this.state.banData[i].checktitle", this.state.banData[i].checktitle)

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
        'Authorization': this.state.user_token
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
          console.log("helloooooooooo-------", responseJson)

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
            filterHtmlStringgggg = filterHtmlStringgggg.replace(new RegExp(unique[k], 'g'), '');
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

  _showAlert = () => {

    Alert.alert(
      '',
      'Are you sure you want to clear history ?',
      [
        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: (nn) => this.clearHistory() },

      ],
      { cancelable: false }
    )

  }



  clearHistory() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });

    fetch(Base_Url + 'clearUserBrowseHistory', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;

        if (responseJson.status == 1) {
          this.setState({ spinner: false, historyToday: [], historyPrevious: [], historyOthers: [], });

          Toast.show(responseJson.message, Toast.SHORT);

        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }

      }).catch((error) => {
        console.log(error);
      });


  }

  addToFavorite(item, index, type) {
    console.log("addtofacvttttttt dataaaa", this.state.responseModal)
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

   


    fetch(Base_Url + 'setOrUnsetFavouriteArticle', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timezone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,
        title_for_api: this.state.responseModal.title_for_api,
        favouriteStatus: isFavourite,
        title_for_display: this.state.responseModal.title_for_display,
        image: this.state.responseModal.image
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        if (responseJson.status == 1) {
          this.setState({ spinner: false });
          Toast.show(responseJson.message, Toast.SHORT);
        }
        else {
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
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,


      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;

        if (responseJson.status == 1) {
          var checkeddd = [];
          for (var i in responseJson.data) {
            checkeddd[i] = false;
          }

          this.setState({ userList: responseJson.data, checked: checkeddd, checkPrev: checkeddd });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
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

  createNewIcon = () => {
    var checkeddd = [];
    for (var i in this.state.checkPrev) {
      checkeddd[i] = false;
    }
    this.setState({ newListChecked: !this.state.newListChecked, checked: checkeddd, refreshingCheck: !this.state.refreshingCheck });
  }

  setCreateList() {

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
        this.addWithOldList();
      } else {
        Toast.show("Please select list", Toast.SHORT);
      }
    }
  }



  addNewList(listTitleName) {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'createUserList', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        listName: listTitleName,
        childId: global.selectedChild.id,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        if (responseJson.status == 1) {
          this.setState({ spinner: false });
          let that = this;
          setTimeout(function () { that.addWithOldList(); }, 500);

        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  addWithOldList() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'addArticlesToList', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,
        title_for_api: this.state.responseModal.title_for_api,
        image: this.state.responseModal.image,
        listId: this.state.currentList.id

      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        if (responseJson.status == 1) {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false, newListShow: false, listTitle: '' });
          this.getUserList();
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });


  }


  setShowNewListModal(visible) {
    this.setState({ newListShow: visible, listTitle: '' });

  }


  setPopupVisible(visible) {
    this.setState({ popoverShow: !this.state.popoverShow });

  }

  selectChild = (item, index) => {
    if (item.id !== global.selectedChild.id) {
      this.setPopupVisible(false)
      global.selectedChild = item;
      global.colorIndex = index;
      AsyncStorage.setItem("globalIndex", JSON.stringify(index));
      this.setState({ spinner: true })
      let that = this;
      setTimeout(function () { that.getHistoryData() }, 500);
    }
    else {
      this.setPopupVisible(false)
    }
  }


  startSpinner() {
    console.log("Start Spinner")
    // this.setState({ spinnerModal: true });
  }

  hideSpinner() {
    console.log("History Spinner")
    // this.setState({ spinnerModal: false });
  }

  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
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

  render() {
    return (

      <TouchableOpacity activeOpacity={1} style={{ width: '100%', height: '100%' }} onPress={() => this.setState({ popoverShow: false })}>

        <Spinner
          visible={this.state.spinner} />

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
              }} source={require('../assets/images/arrow_pop.png')}
              />
              <FlatList
                data={this.state.childs}
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
              />

            </View>


            : null}




          <View style={{ width: '100%', flexDirection: 'column' }}>
            <Text style={{ textTransform: 'uppercase', color: '#527CF3', fontSize: 25, fontFamily: 'BigJohn', marginLeft: 5 }}>History</Text>
            <View style={{ width: '71%', flexDirection: 'row', marginTop: 5, marginLeft: 5, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />
          </View>

          <View style={{ position: 'absolute', right: 30, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => { this.props._onClickSearch('Mysearch'); this.setState({ popoverShow: false }) }} style={styles.iconBackground}>
              <Image style={{ width: 27, height: 27 }} source={require('../assets/images/search.png')} />
            </TouchableOpacity>

            


            <TouchableOpacity style={[styles.circle, { backgroundColor: global.colorIndex == 0 ? '#527CF3' : global.colorIndex == 1 ? '#F45C5F' : global.colorIndex == 2 ? '#62C677' : global.colorIndex == 3 ? '#05e6f0' : '#800080' }]} onPress={() => { this.setPopupVisible(true) }}>
              <Text style={{ fontSize: 22, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8, marginLeft: 1 }}>{global.selectedChild.username.substring(0, 1)}</Text>
            </TouchableOpacity>


          </View>

        </View>

        <ImageBackground source={require('../assets/images/new_bg.png')} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 60 }}>

          {this.state.historyToday != 0 || this.state.historyPrevious != 0 || this.state.historyOthers != 0 ?


            <ScrollView style={{ marginBottom: 60, marginTop: 30 }}>
              <TouchableOpacity activeOpacity={1}>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>

                  {this.state.historyToday.length ?
                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                      <Image source={require('../assets/images/black_time.png')} />
                      <Text style={{ fontSize: 22, color: 'black', marginLeft: 10, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: '400', marginTop: 3 }}>Today</Text>
                    </View>
                    : null}

                  {this.state.historyToday.length || this.state.historyPrevious.length || this.state.historyOthers.length ?
                    <TouchableOpacity style={{ position: 'absolute', right: 20 }} onPress={(nn) => { this._showAlert(); this.setState({ popoverShow: false }) }}>
                      <Text style={{ fontSize: 18, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', textDecorationLine: 'underline' }}>Clear History</Text>
                    </TouchableOpacity>
                    : null}

                </View>



                <FlatList
                  refreshing={this.state.refreshing}
                  data={this.state.historyToday}
                  renderItem={({ item, index }) =>
                    <View style={{ flexDirection: 'column', marginTop: 10, marginLeft: 5, width: 220, borderRadius: 10 }}>

                      <TouchableOpacity activeOpacity={1} onPress={(nn) => this.setShowDescriptionModal(item, index, 'today')}>
                        {item.image ?
                          <Image style={[styles.imageAnimals]} source={{ uri: item.image }} />
                          :
                          <ImageBackground style={[styles.noImageStyle]}>
                            <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                          </ImageBackground>
                        }
                        {item.image ? <Image source={require('../assets/images/gradient.png')} style={{ width: 200, marginLeft: 15, borderRadius: 10, height: 80, position: 'absolute', bottom: 0 }} /> : null}
                      </TouchableOpacity>
                      <Text numberOfLines={2} style={styles.textStyle}>{item.displayTitle}</Text>
                    </View>

                  }
                  ItemSeparatorComponent={this.renderSeparator}
                  numColumns={4}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                />


                {this.state.historyPrevious.length ?
                  <View style={{ width: '90%', flexDirection: 'row', margin: 15, borderBottomColor: 'rgba(255,255,255,0.5)', borderBottomWidth: 0.5 }} />
                  : null}


                {this.state.historyPrevious.length ?
                  <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                    <Image source={require('../assets/images/black_time.png')} />
                    <Text style={{ fontSize: 22, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', marginLeft: 10, fontWeight: '400', marginTop: 3 }}>Yesterday</Text>
                  </View>
                  : null}


                <FlatList
                  refreshing={this.state.refreshing}
                  data={this.state.historyPrevious}
                  renderItem={({ item, index }) =>
                    <View style={{ flexDirection: 'column', marginTop: 10, marginLeft: 5, width: 220, borderRadius: 10 }}>
                      <TouchableOpacity activeOpacity={1} onPress={(nn) => this.setShowDescriptionModal(item, index, 'previous')}>
                        {item.image ?
                          <Image style={[styles.imageAnimals]} source={{ uri: item.image }} />
                          :
                          <ImageBackground style={[styles.noImageStyle]}>
                            <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                          </ImageBackground>                          // <View style={[styles.imageAnimals, { backgroundColor: this.state.selectedColor }]}></View>
                        }
                        {item.image ? <Image source={require('../assets/images/gradient.png')} style={{ width: 200, marginLeft: 15, borderRadius: 10, height: 80, position: 'absolute', bottom: 0 }} /> : null}
                      </TouchableOpacity>
                      <Text numberOfLines={2} style={styles.textStyle}>{item.displayTitle}</Text>
                    </View>

                  }
                  ItemSeparatorComponent={this.renderSeparator}
                  numColumns={4}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                />


                {this.state.historyOthers.length ?
                  <View style={{ width: '90%', flexDirection: 'row', margin: 15, borderBottomColor: 'rgba(255,255,255,0.5)', borderBottomWidth: 0.5 }} />
                  : null}

                {this.state.historyOthers.length ?
                  <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                    <Image source={require('../assets/images/black_time.png')} />
                    <Text style={{ fontSize: 22, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', marginLeft: 10, fontWeight: '400', marginTop: 3 }}>Previous</Text>
                  </View>
                  : null}


                <FlatList
                  refreshing={this.state.refreshing}
                  data={this.state.historyOthers}
                  renderItem={({ item, index }) =>
                    <View style={{ flexDirection: 'column', marginTop: 10, marginLeft: 5, marginRight: 5, width: 220, borderRadius: 10 }}>
                      <TouchableOpacity activeOpacity={1} onPress={(nn) => this.setShowDescriptionModal(item, index, 'others')}>
                        {item.image ?
                          <Image style={[styles.imageAnimals]} source={{ uri: item.image }} />
                          :
                          <ImageBackground style={[styles.noImageStyle]}>
                            <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                          </ImageBackground>
                        }
                        {item.image ? <Image source={require('../assets/images/gradient.png')} style={{ width: 200, marginLeft: 15, borderRadius: 10, height: 80, position: 'absolute', bottom: 0 }} /> : null}
                      </TouchableOpacity>
                      <Text numberOfLines={2} style={styles.textStyle}>{item.displayTitle}</Text>
                    </View>
                  }
                  ItemSeparatorComponent={this.renderSeparator}
                  numColumns={4}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                />
              </TouchableOpacity>
            </ScrollView>
            :

            <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
              {this.state.noDataFound ?
                <Text style={{
                  fontSize: 18, color: 'black', marginLeft: 15,
                  marginTop: 5, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold',
                }}>No History Found</Text>
                : null}
            </View>



          }



        </ImageBackground>






        <Modal
          coverScreen={true}
          isVisible={this.state.visibleModal === 'sliding'}
          backdropColor="tranparent"
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={800}
          backdropTransitionOutTiming={800}>

          <View style={{ flex: 1, flexDirection: 'row' }}>
         

            <TouchableOpacity activeOpacity={1} style={{ width: '15%', backgroundColor: this.state.transparentModal ? 'rgba(255, 255, 255 ,0.0)' : 'rgba(255,255,255,0.5)' }} onPress={() => this.setState({ visibleModal: false, transparentModal: true, defaultChecked: true, customChecked: false, articlesToOpen: [] })} />





            <View style={{ flex: 1, backgroundColor: '#fff' }}>


              <TouchableOpacity style={{ marginLeft: 20, marginTop: 15 }} onPress={() => this.backDetail()}>
                <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
              </TouchableOpacity>

              <View style={{ width: '100%', height: 50, alignItems: 'center' }}>

              </View>


              <View style={{ position: 'absolute', marginTop: 16, right: 10, flexDirection: 'row', padding: 10 }}>
                <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>
                  <TouchableOpacity style={{ marginRight: 15, zIndex: 999 }} onPress={(nn) => this.addToFavorite(this.state.seachedItem, this.state.selectedIndex, this.state.modalType)}>
                    <Image style={{ width: 30, height: 31 }} source={require('../assets/images/star_plus.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 15, zIndex: 999 }} onPress={(mm) => this.setShowNewListModal(true)}>
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

              <KeyboardAvoidingView style={{
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
                        refreshing={this.state.refreshing}
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


                    <TouchableOpacity onPress={() => { this.setShowNewListModal(false) }} style={{ width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                      <Text style={{ color: '#B8B8B8', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>x CLOSE</Text>
                    </TouchableOpacity>

                  </View>

                </View>
              </KeyboardAvoidingView>
            </Modal>


          </View>

        </Modal>



      </TouchableOpacity>




    );
  }
}


export default History;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageAnimals: {
    width: 200,
    height: 170,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,

  }, textStyle: {
    fontSize: 18,
    color: 'white',
    marginLeft: 15,
    marginTop: 5,
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: 'bold',
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
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#527CF3',
    justifyContent: 'center'
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

  noImageStyle: {
    flexDirection: 'row',
    borderRadius: 10,
    width: 200,
    height: 170,
    marginLeft: 15,
    marginRight: 15,
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


