import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, WebView, TouchableOpacity, ImageBackground, AsyncStorage, FlatList, TextInput, ActivityIndicator } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Base_Url, AppVersion } from '../constants/common';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import { CheckBox } from 'react-native-elements';
import { interfaceDeclaration } from '@babel/types';



let itemId = '', titleForApi = '';
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export class FeaturedPicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionShow: false,
      refreshing: false,
      visible: [],
      error: null,
      spinner: false,
      articlesName: [],
      itemId: '',
      titleForApi: '',
      page: 0,
      onEndReachedCalledDuringMomentum: true,
      bgColor: [
        'red',
        'blue',
        'yellow',
      ],

      featuredList: [],
      selectedChild: { username: '' },
      childs: [{ 'username': '' }],
      popoverShow: false,
      newListShow: false,
      seed: '',
      hasFavourite: '',
      indicatorShow: true,
      trueeee: false,
      defaultChecked: true,
      articlesToOpen: [],
      responseModal: {}


    };

  }

  showVisible = (index, item) => {
    if (index == this.state.prevIndex) {
      this.setShowDescriptionModal(item, index)
    } else {
      var visible = this.state.visible;
      visible[index] = !visible[index]
      for (var i in visible) {
        if (i != index) {
          visible[i] = false;
        }
      }
      this.setState({ visible: visible, refreshing: !this.state.refreshing, prevIndex: index })
    }

  }

  componentDidMount() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    this._getRandomColor()

  }

  _getRandomColor() {
    var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
    this.setState({
      selectedColor: item,
    })
  }

  componentWillMount() {


    const { navigation } = this.props;
    itemId = navigation.getParam('interest');
    titleForApi = navigation.getParam('titleForApi');
    seed = navigation.getParam('seed');
    var selectedChild = navigation.getParam('selectedChild');



    console.log("itemId", itemId + "\n" + titleForApi)

    this.setState({ spinner2: true, itemId: itemId, titleForApi: titleForApi, selectedChild: selectedChild, seed: seed });
    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {
        console.log("user_token home", value, childs)
        var childsss = JSON.parse(childs);
        console.log("user_token home", value, childsss)
        this.setState({ user_token: value, childs: childsss })
        this.getRows();
        this.getUserList();
      }).done();
    }).done();

  }

  getRows = () => {

    console.log("hiiiii", itemId + "\n" + titleForApi, this.state.seed)
    fetch(Base_Url + 'loadMoreFeaturedArticles', {
      method: "POST",
      headers: {
        'Authorization': this.state.user_token,
        'appVersion': AppVersion,
        'timezone': this.state.timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        'listName': titleForApi,
        'pageNo': this.state.page,
        'maxRecords': '10',
        childId: this.state.selectedChild.id,
        seed: this.state.seed
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        if (responseJson.status == 1) {
          // console.log("finallllll", responseJson);
          var featuredList = this.state.featuredList;
          var finalArray = featuredList.concat(responseJson.featuredList.listArticles)
          this.setState({ spinner2: false, featuredList: finalArray, page: this.state.page + 1 });
        }
        else {
          this.setState({ spinner: false, indicatorShow: false });
        }

      }).catch((error) => {
        console.log(error);
        this.setState({ spinner2: false });
      });
  }




  addToFavorite(item, index) {

    console.log("Toppp=======>>>>>>", item, index)

    var hasFavourite, favoArrayData;
    if (item.hasFavourite == true) {
      hasFavourite = 0;
      favoArrayData = false;
    } else {
      hasFavourite = 1;
      favoArrayData = true;
    }


    this.state.featuredList[index].hasFavourite = favoArrayData;
    console.log("Toppp=======>>>>>>", this.state.featuredList[index].hasFavourite)

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'setOrUnsetFavouriteArticle', {
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
        title_for_api: item.title_for_api,
        favouriteStatus: hasFavourite,
        title_for_display: item.title_for_display,
        image: item.image

      })
    })
      .then((response) => response.json())
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


  addToFavoriteeeee(item, index) {

    console.log("Toppp=======>>>>>>", item, index)


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
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({

        childId: this.state.selectedChild.id,
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



  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }



  setShowDescriptionModal(item, index) {

    var articlesToOpen = this.state.articlesToOpen;
    articlesToOpen.push(item.title_for_api);

    this.setState({ visibleModal: 'sliding', htmlForm: '', responseModal: '', spinner: true, seachedItem: item, selectedIndex: index, articlesToOpen: articlesToOpen, transparentModal: true });

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
        title: item.title_for_api,
        childId: this.state.selectedChild.id,
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
                console.log("ayaaaa")
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
            // filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(this.state.banData[i].checktitle, '[' + this.state.banData[i].replaceword + ']');
          }
          var filterDisplayString = filterHtmlStringgggg22.replace(new RegExp('display: none;">', 'g'), 'display: block;">');
          var filterExternalLink = filterDisplayString.replace(new RegExp('rel="mw:ExtLink" href', 'g'), 'rel="mw:ExtLink" text');
          var openFacts = filterExternalLink.replace(new RegExp('pcs-collapse-table', 'g'), 'pcs-collapse-table');


          this.setState({ spinner: false, responseModal: responseJson, htmlForm: openFacts, htmlFormPrev: openFacts });


          var htmlString = this.state.htmlForm;
          var n = htmlString.indexOf("</head>");
          var kkkkk = new Date();
          var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
          this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });

          if (responseJson.status == 1) {
          }
        }

      }).catch((error) => {
        console.log(error);
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
          var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
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



  setPopupVisible(visible) {
    this.setState({ popoverShow: !this.state.popoverShow });

  }

  selectChild = (item) => {
    this.setPopupVisible(false)
    this.setState({ selectedChild: item })
    let that = this;
    setTimeout(function () { that.getRows() }, 500);

  }

  setShowNewListModal(visible, item, openFrom) {
    if (visible) {
      this.setState({ newListShow: visible, selectedItemm: item , openFrom : openFrom });
    }
    else {
      this.setState({ newListShow: visible });
    }

  }


  isIconCheckedOrNot = (item, index) => {
    var checked = this.state.checked;
    checked[index] = !checked[index];
    console.log("hii111", checked)
    for (var i in checked) {
      if (i != index) {
        checked[i] = false;
      }
    }
    console.log("hii", checked)
    this.setState({ newListChecked: false, checked: checked, refreshingCheck: !this.state.refreshingCheck, currentList: item })

  }

  getUserList() {
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
        childId: this.state.selectedChild.id,


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
          this.setState({ showData: true, spinner: false, userList: responseJson.data, checked: checkeddd, checkPrev: checkeddd });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
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
        this.state.openFrom == 'Modal' ? this.addWithOldListttttttt() :  this.addWithOldList();
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
        childId: this.state.selectedChild.id,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        // console.log("responseJson", responseJson)
        if (responseJson.status == 1) {
          this.setState({ showData: true, spinner: false, currentList: { id: responseJson.id } });
          let that = this;
          setTimeout(function () { that.state.openFrom == 'Modal' ? that.addWithOldListttttttt() : that.addWithOldList(); }, 500);

        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
  }


  addWithOldList() {
    console.log("this.state.currentListthis.state.currentList", this.state.currentList, this.state.selectedItemm)
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
        childId: this.state.selectedChild.id,
        title_for_api: this.state.selectedItemm.title_for_api,
        image: this.state.selectedItemm.image,
        listId: this.state.currentList.id

      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        // console.log("hellooooooo", responseJson)
        if (responseJson.status == 1) {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ showData: true, spinner: false, newListShow: false });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });


  }


  addWithOldListttttttt() {
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
        childId: this.state.selectedChild.id,
        title_for_api: this.state.responseModal.title_for_api,
        image: this.state.responseModal.image,
        listId: this.state.currentList.id

      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        // console.log("hellooooooo", responseJson)
        if (responseJson.status == 1) {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ showData: true, spinner: false, newListShow: false });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });


  }




  layoutChecked = (index) => {
    if (index == '0') {
      this.setState({ defaultChecked: true, customChecked: false, htmlForm: this.state.htmlFormPrev });
    } else {
      if (!this.state.customChecked) {
        var htmlString = this.state.htmlForm;
        var n = htmlString.indexOf("</head>");
        var kkkkk = new Date();
        var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n); this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });
      }
    }
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




  render() {
    return (
      <ImageBackground source={require('../assets/images/new_bg.png')} style={{ width: '100%', height: '100%', marginTop: 80 }}>
        <Spinner
          visible={this.state.spinner2} />



        <View style={{ flex: 1  , alignItems: 'center', justifyContent:'center'  }}>

          <View style={{ width: '100%', flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', position: 'absolute', top: -30, left: 20, right: 20, zIndex: 999 }}>

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
                  data={this.state.childs}
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




            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: 40, height: 30 }}>
              <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
            </TouchableOpacity>


            <View style={{ width: '100%', flexDirection: 'column', marginLeft: 20 }}>
              <Text style={{ textTransform: 'uppercase', color: '#527CF3', fontSize: 25, fontFamily: 'BigJohn', marginLeft: 5 }}>{this.state.titleForApi}</Text>

              <View style={{ width: '86%', flexDirection: 'row', marginTop: 5, marginLeft: 5, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />
            </View>




          </View>


          <ScrollView
            style={{ marginTop: 30, marginBottom: 80 }}
            

            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {

                let that = this;
                if (!that.state.trueeee) {
                  that.setState({ trueeee: true })
                  // that.setState({ indicatorShow: true});
                  that.getRows()
                  console.log("refreshLog")
                  setTimeout(() => {
                    that.setState({ trueeee: false })
                  }, 10000)
                }

              }
            }}>


            <FlatList
              refreshing={this.state.refreshing}
              data={this.state.featuredList}
              renderItem={({ item, index }) =>
                <TouchableOpacity activeOpacity={1} style={{
                  shadowColor: '#000000',
                  shadowOffset: {
                    width: 0,
                    height: 3
                  },
                  shadowRadius: 5,
                  shadowOpacity: 0.5, width: 300, height: 250, margin: 10, borderRadius: 10
                }} onPress={(nn) => this.showVisible(index, item)}>
                  {item.image ?
                    <Image style={[styles.imageAnimals, { height: this.state.visible[index] ? 270 : 250 }]} source={{ uri: item.image }} />
                    :
                    <ImageBackground style={[styles.noImageStyle, { height: this.state.visible[index] ? 270 : 250 }]}>
                      <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                    </ImageBackground>
                    // <View style={[styles.imageAnimals, { height: this.state.visible[index] ? 270 : 250, backgroundColor: this.state.selectedColor }]}></View>
                  }


                  {this.state.visible[index] ?
                    <View style={{ flexDirection: 'row', position: 'absolute', marginLeft: 20, right: -5, top: 8 }}>
                      <TouchableOpacity style={{ paddingRight: 2 }} onPress={(nn) => this.addToFavorite(item, index)}>
                        {item.hasFavourite ?
                          <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                          :
                          <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                        }

                      </TouchableOpacity>

                      <TouchableOpacity style={{ paddingLeft: 2 }} onPress={(mm) => this.setShowNewListModal(true, item,'')}>
                        <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                      </TouchableOpacity>

                    </View>
                    : null}


                  {item.image ? <Image source={require('../assets/images/gradient.png')} style={[styles.imageAnimals, { height: this.state.visible[index] ? 120 : 70, position: 'absolute', bottom: this.state.visible[index] ? -20 : 0 }]} /> : null}
                  <View style={{ width: 290, justifyContent: 'center', position: 'absolute', bottom: this.state.visible[index] ? 10 : 0 }}>
                    <Text numberOfLines={2} style={styles.textStyle}>{item.title_for_display}</Text>





                    {this.state.visible[index] ?
                      <View style={{ marginTop: 50 }}>
                      
                        <Text numberOfLines={4} style={styles.textDesStyle}>{item.summary}</Text>

                      </View>
                      : null}

                  </View>




                </TouchableOpacity>

              }
              ItemSeparatorComponent={this.renderSeparator}
              numColumns={3}
              horizontal={false}
              columnWrapperStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 20 }}
            />

            <ActivityIndicator
              animating={this.state.indicatorShow}
              size="large" color="white" />


          </ScrollView>





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
              {/* <Spinner
                visible={this.state.spinner2} /> */}

              <TouchableOpacity activeOpacity={1} style={{ width: '15%', backgroundColor: this.state.transparentModal ? 'transparent' : 'rgba(255,255,255,0.5)' }} onPress={() => this.setState({ visibleModal: false, transparentModal: true, defaultChecked: true, customChecked: false, articlesToOpen: [] })} />


              <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10 }}>

                <TouchableOpacity style={{ marginLeft: 20, marginTop: 15 }} onPress={() => this.backDetail()}>
                  <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
                </TouchableOpacity>

                <View style={{ width: '100%', height: 50, alignItems: 'center' }}>
                
                </View>

                <View style={{ position: 'absolute', marginTop: 15, right: 10, flexDirection: 'row', flexDirection: 'row', padding: 10 }}>

                  <Text style={{ color: 'black' }}></Text>

                  <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>

                    <TouchableOpacity style={{ marginRight: 15 }} onPress={(nn) => this.addToFavoriteeeee(this.state.seachedItem, this.state.selectedIndex)}>
                      <Image style={{ width: 30, height: 31 }} source={require('../assets/images/star_plus.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginRight: 15 }} onPress={(mm) => this.setShowNewListModal(true, this.state.seachedItem, 'Modal')}>
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
                          onPress={() => { this.setState({ newListChecked: !this.state.newListChecked, checked: this.state.checkPrev, refreshingCheck: !this.state.refreshingCheck }); console.log("checked checked ", this.state.checkPrev) }}
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
                      onPress={() => { this.setState({ newListChecked: !this.state.newListChecked, checked: this.state.checkPrev, refreshingCheck: !this.state.refreshingCheck }); console.log("checked checked ", this.state.checkPrev) }}
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


                  <TouchableOpacity onPress={() => { this.setShowNewListModal(false, 'item') }} style={{ width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                    <Text style={{ color: '#B8B8B8', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>x CLOSE</Text>
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


export default FeaturedPicture;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAnimals: {
    width: 300,
    height: 250,
    marginLeft: 20,
    borderRadius: 10,

  }, textStyle: {
    fontSize: 18,
    color: 'white',
    position: 'absolute',
    marginLeft: 35,
    fontFamily: 'HelveticaNeueLTStd-Md',
    paddingBottom: 60,
    fontWeight: 'bold',
    lineHeight: 20
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
  textDesStyle: {
    fontSize: 14,
    color: 'white',
    marginLeft: 35,
    fontFamily: 'HelveticaNeueLTStd-Roman',
    flex: 1,
    flexWrap: 'wrap',
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
    width: 300,
    height: 250,
    marginLeft: 20,
    marginRight: 20,
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