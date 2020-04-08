import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, WebView, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList, AsyncStorage, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Icon, Footer, FooterTab, Content } from 'native-base';
import { Base_Url, AppVersion } from '../constants/common';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import { CheckBox } from 'react-native-elements';




class Mysearch extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: '1',
      selectedChild: { username: '' },
      childs: [{ 'username': '' }],
      searchData: [],
      showSearch: [],
      user_token: '',
      searchTitle: '',
      newListShow: false,
      listTitle: '',
      defaultChecked: true,
      spinner: false,
      articlesToOpen : []

    };
  }


  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {
        console.log("user_token home", value, childs)
        var childsss = JSON.parse(childs);
        this.setState({ user_token: value, childs: childsss, selectedChild: childsss[global.colorIndex] })
        this.getUserList();
        this.getSearchList();
        this.getBannledList();
      }).done();
    }).done();

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
            console.log("dataaaaaaa",responseJson.data[i])
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


  getSearchList() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone, spinner: true });
    fetch(Base_Url + 'getSearchHistory', {
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
      .then((response) => {
        if (response.status === 200) {
          console.log("getSearchSUCCESSS")
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
        if (responseJson.status == 1) {
          this.setState({ spinner: false, searchData: responseJson.data });
        }
        else {
          this.setState({ spinner: false });
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
        let that = this;
        setTimeout(function () { that.setState({ spinner: false }) }, 100);
      });
  }



  newSearchList(searchText) {
    if (searchText.length == 0) {
      this.setState({ searchTitle: '', showSearch: [] });
    } else {
       
      var timzone = DeviceInfo.getTimezone();
      this.setState({ timzone: timzone, searchText: searchText });
      fetch(Base_Url + 'searchArticlesByTitle', {
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
          searchTitle: this.state.searchText,
        })
      })
        .then((response) => {
          if (response.status === 200) {
            console.log("SearchListSUCCESSS")
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
          console.log("showSearch========", this.state.searchText)

          if (responseJson.status == 1) {
            this.setState({ spinner: false, showSearch: responseJson.data });
           
          }
          else {
            Toast.show(responseJson.message, Toast.SHORT);
          }
        }).catch((error) => {
          console.log(error);
        });

    }
    // }

  }

  setTextInput = (item, index, result) => {
    // console.log("MYYYYYYYY", item, index, result)

    if (result == 'SearchList') {
      titleForApi = item.query;
      titleForDisplay = item.displayTitle;
      isFavourite = item.isFavourite;
      image = item.image;

    }
    else {
      titleForApi = item.title_for_api;
      titleForDisplay = item.title_for_display;
      isFavourite = item.isFavourite;
      image = item.image;

    }

    let that = this;
    setTimeout(function () { that.getDetailOfArticleeeeee(item, index, titleForApi, titleForDisplay, result) }, 500);

  }




  getDetailOfArticleeeeee = (item, index, titleForApi, titleForDisplay, result) => {

    var articlesToOpen = this.state.articlesToOpen;
    articlesToOpen.push(item.article);

    this.setState({ visibleModal: 'sliding', htmlForm: '' , articlesToOpen: articlesToOpen , seachedItem: item, selectedIndex: index, transparentModal: true, searchResult: result });
    let that = this;
    setTimeout(function () { that.setState({ transparentModal: false }) }, 1000);

    setTimeout(function () { that.setState({ spinner2: true }) }, 1500);

    fetch(Base_Url + 'getArticleDetailBySearch', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        title: titleForApi,
        dtitle: titleForDisplay,
        isFavourite: isFavourite,
        image: image,
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
              if (this.state.banData[i].checktitle.toLowerCase() == split2.split("<")[0].toLowerCase()) {
                replacinggg.push({href: splitString[1], checkTitleee: split2.split("<")[0].toLowerCase()});

                console.log("ehhhhh aaaa ", this.state.banData[i].checktitle.toLowerCase(), split2.split("<")[0].toLowerCase())
              }
            }
          }

          var filterHtmlStringgggg = filterHtmlString;
          let unique = [...new Set(replacinggg)];
          console.log("uniguewwwwwwwwwwwwwwwwwwwww", unique)
          for (var k in unique) {
            // var matchStringgg = unique[k].replace(new RegExp('_', 'gi'), ' ')
            console.log("unique[k].checkTitleee stringggg",unique[k].checkTitleee)
            var checkStringNew = filterHtmlStringgggg.toLowerCase();
            if(checkStringNew.includes(unique[k].checkTitleee)){
              console.log("imncludeddddddddd",unique[k].href)
              filterHtmlStringgggg = filterHtmlStringgggg.replace(new RegExp(unique[k].href, 'g'), '');
            }
            
          }


          console.log("filterHtmlStringgggg",filterHtmlStringgggg)

          var filterHtmlStringgggg22 = filterHtmlStringgggg;
          for (var i in this.state.banData) {
            console.log("this.state.banData[i].checktitle", this.state.banData[i].checktitle, this.state.banData[i].replaceword)

            // console.log("this.state.banData[i].checktitle", this.state.banData[i].checktitle, this.state.banData[i].replaceword)
            filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(new RegExp("\\b" + this.state.banData[i].checktitle + "\\b", 'gi'), '[' + this.state.banData[i].replaceword + ']');
          }


          var filterDisplayString = filterHtmlStringgggg22.replace(new RegExp('display: none;">', 'g'), 'display: block;">');
          var filterExternalLink = filterDisplayString.replace(new RegExp('rel="mw:ExtLink" href', 'g'), 'rel="mw:ExtLink" text');
          var openFacts = filterExternalLink.replace(new RegExp('pcs-collapse-table', 'g'), 'pcs-collapse-table');
  
          this.setState({ htmlForm: openFacts, responseModal: responseJson, htmlFormPrev: openFacts });


          var htmlString = this.state.htmlForm;
          var n = htmlString.indexOf("</head>");
          var kkkkk = new Date();
          var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + " " +"<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedstatic/uploaded_css_static.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);

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





  getDetailOfArticle = (item, index, titleForApi, titleForDisplay, result) => {

    var articlesToOpen = this.state.articlesToOpen;
    articlesToOpen.push(item.article);

    this.setState({ visibleModal: 'sliding', htmlForm: '' , articlesToOpen: articlesToOpen , seachedItem: item, selectedIndex: index, transparentModal: true, searchResult: result });
    let that = this;
    setTimeout(function () { that.setState({ transparentModal: false }) }, 1000);

    setTimeout(function () { that.setState({ spinner2: true }) }, 1500);

    fetch(Base_Url + 'getArticleDetailBySearch', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        title: titleForApi,
        dtitle: titleForDisplay,
        isFavourite: isFavourite,
        image: image,
        childId: this.state.selectedChild.id,
        interestName: ''
      })
    })

      .then((response) => {
        if (response.status === 200) {
          console.log("MySearchSUCCESSS")
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props.navigation.navigate('Login');
          this.setState({ spinner: false, visibleModal: false });
          return response.json();
        }
      })
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
                replacinggg.push({href: splitString[1], checkTitleee: split2.split("<")[0].toLowerCase()});

                console.log("ehhhhh aaaa ", this.state.banData[i].checktitle.toLowerCase(), split2.split("<")[0].toLowerCase())
              }
            }
          }

          var filterHtmlStringgggg = filterHtmlString;
          let unique = [...new Set(replacinggg)];
          console.log("uniguewwwwwwwwwwwwwwwwwwwww", unique)
          for (var k in unique) {
            console.log("unique[k].checkTitleee stringggg",unique[k].checkTitleee)
            var checkStringNew = filterHtmlStringgggg.toLowerCase();
            if(checkStringNew.includes(unique[k].checkTitleee)){
              console.log("imncludeddddddddd",unique[k].href)
              filterHtmlStringgggg = filterHtmlStringgggg.replace(new RegExp(unique[k].href, 'g'), '');
            }
            
          }


          console.log("filterHtmlStringgggg",filterHtmlStringgggg)

          var filterHtmlStringgggg22 = filterHtmlStringgggg;
          for (var i in this.state.banData) {
            console.log("this.state.banData[i].checktitle", this.state.banData[i].checktitle, this.state.banData[i].replaceword)

            // console.log("this.state.banData[i].checktitle", this.state.banData[i].checktitle, this.state.banData[i].replaceword)
            filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(new RegExp("\\b" + this.state.banData[i].checktitle + "\\b", 'gi'), '[' + this.state.banData[i].replaceword + ']');
          }


          var filterDisplayString = filterHtmlStringgggg22.replace(new RegExp('display: none;">', 'g'), 'display: block;">');
          var filterExternalLink = filterDisplayString.replace(new RegExp('rel="mw:ExtLink" href', 'g'), 'rel="mw:ExtLink" text');
          var openFacts = filterExternalLink.replace(new RegExp('pcs-collapse-table', 'g'), 'pcs-collapse-table');
  
          this.setState({ htmlForm: openFacts, responseModal: responseJson, htmlFormPrev: openFacts });


          var htmlString = this.state.htmlForm;
          var n = htmlString.indexOf("</head>");
          var kkkkk = new Date();
          var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + " " +"<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedstatic/uploaded_css_static.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);

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
        console.log("replacingggreplacingggreplacinggg",unique)
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
        var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + " " +"<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedstatic/uploaded_css_static.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
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



  replaceSearch = () => {
    this.setState({ searchTitle: '', showSearch: [] }, this.getSearchList());
  }



  _showAlert = () => {

    Alert.alert(
      '',
      'Are you sure you want to clear search ?',
      [
        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: (nn) => this.clearSearch() },

      ],
      { cancelable: false }
    )

  }


  clearSearch() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });

    fetch(Base_Url + 'clearSearchHistory', {
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
          this.setState({ spinner: false });

          this.getSearchList()


        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }



      }).catch((error) => {
        console.log(error);
      });


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

          this.setState({ spinner: false, userList: responseJson.data, checked: checkeddd, checkPrev: checkeddd });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
  }




  addToFavorite(item, index, searchResult) {


    var isFavourite, favoArrayData, titleForApi, titleForDisplay;
    var favDataaaaaaa = [];
    if (item.isFavourite == true) {
      isFavourite = 0;
      favoArrayData = false;
    } else {
      isFavourite = 1;
      favoArrayData = true;
    }



    if (searchResult == 'SearchList') {
      titleForApi = item.query;
      titleForDisplay = item.displayTitle;
      image = item.image;
      favDataaaaaaa = this.state.searchData;
    }
    else {
      titleForApi = item.title_for_api;
      titleForDisplay = item.title_for_display;
      image = item.image;
      favDataaaaaaa = this.state.showSearch;
    }


    favDataaaaaaa[index].isFavourite = favoArrayData;
    this.setState({ showSearch: favDataaaaaaa, refreshing: !this.state.refreshing })

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
        title_for_api: titleForApi,
        favouriteStatus: isFavourite,
        title_for_display: titleForDisplay,
        image: image

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


  setShowNewListModal(visible) {
    this.setState({ newListShow: visible });
  }

  createNewIcon = () => {
    var checkeddd = [];
    for (var i in this.state.checkPrev) {
      checkeddd[i] = false;
    }
    this.setState({ newListChecked: !this.state.newListChecked, checked: checkeddd, refreshingCheck: !this.state.refreshingCheck });
  }


  backDetail = () => {
    console.log("hiiiii this.state.articlesToOpen",this.state.articlesToOpen)
    
    if(this.state.articlesToOpen.length == 1){
      this.setState({ visibleModal: null, articlesToOpen : [] })
    }
    else{
      var articlesToOpen = this.state.articlesToOpen;
      var cuurent_article = this.state.articlesToOpen[this.state.articlesToOpen.length-2];
      articlesToOpen.splice(this.state.articlesToOpen.length-1);
      console.log("hiiiii this.state.articlesToOpen after",articlesToOpen)
      this.setState({articlesToOpen:articlesToOpen})
      this.showArticleDetailForLinks(cuurent_article);
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
        childId: this.state.selectedChild.id,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        if (responseJson.status == 1) {
          this.setState({ spinner: false, currentList: { id: responseJson.id } });
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

    // console.log(this.state.seachedItem)
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
        title_for_api: this.state.seachedItem.title_for_api != undefined ? this.state.seachedItem.title_for_api : this.state.seachedItem.query,
        image: this.state.seachedItem.image,
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



          console.log("MY SEarcg,",this.state.seachedItem)



          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });


  }


  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }
  goBack = () => {
    this.props.navigation.goBack()
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

  updateSearch = searchTitle => {
    var timzone = DeviceInfo.getTimezone();
    var titleSearch = searchTitle;

    this.setState({ timzone: timzone, searchTitle });
    this.searchApi(titleSearch, timzone);

    //   setTimeout(function () {  

    // }, 800);
  };


  searchApi = (titleSearch, timzone) => {
    console.log("showSearch========111111", titleSearch)
    let that = this;
    fetch(Base_Url + 'searchArticlesByTitle', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': that.state.user_token
      },
      body: JSON.stringify({
        childId: that.state.selectedChild.id,
        searchTitle: titleSearch,
      })
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("SearchListSUCCESSS")
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          that.props.navigation.navigate('Login');
          that.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        that.data = responseJson;
        console.log("showSearch========", titleSearch)


        that.setState({ spinner: false, showSearch: responseJson.data });
        if (responseJson.status == 1) {
          // console.log("showSearch========", this.state.showSearch)
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  endEditing() {
    const formattedText = this.state.searchTitle;
    console.log("formattedText", formattedText)
  }

  render() {
    const { searchTitle } = this.state;
    return (
      <View>

        <View style={{ width: '100%', flexDirection: 'row', marginTop: 10, marginLeft: 20, alignItems: 'center' }}>
          <View style={styles.buttonContainer}>
            <View style={{ justifyContent: 'center', }}>
              <Image style={{ width: 30, height: 30, position: 'absolute', left: 15 }} source={require('../assets/images/search.png')} />
              <TextInput style={styles.textInputStyle} placeholder="Search articles by title" returnKeyType={'search'}
                value={searchTitle}
                onChangeText={this.updateSearch}
              />

              {this.state.searchTitle ?
                <TouchableOpacity style={{ position: 'absolute', right: 15 }} onPress={(nn) => this.replaceSearch()}>
                  <Image style={{ width: 30, height: 30, }} source={require('../assets/images/ic_cross.png')} />
                </TouchableOpacity>
                :
                null}
            </View>
          </View>
          <TouchableOpacity style={{ width: '10%', position: 'absolute', right: 10, alignItems: 'center' }} onPress={this.goBack}>
            <Text style={{ justifyContent: 'center', color: '#527BF3', fontSize: 22, marginTop: 10, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Cancel</Text>
          </TouchableOpacity>

        </View>

        {this.state.searchTitle.length > 0 ?
          <FlatList
            style={{ maxHeight: 550, backgroundColor: 'red', marginTop: -10, marginLeft: 20, width: '87%', backgroundColor: 'white', borderWidth: 1, borderTopWidth: 0, borderColor: '#BDBDBD', fontFamily: 'HelveticaNeueLTStd-Md' }}
            data={this.state.showSearch}
            renderItem={({ item, index }) =>
              <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginTop: 30, paddingLeft: 10, paddingBottom: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} onPress={(nn) => this.setTextInput(item, index, 'Search')}>
                <Text style={styles.textStyle}>{item.title_for_display}</Text>
              </TouchableOpacity>
            }
            ItemSeparatorComponent={this.renderSeparator}
            horizontal={false}
          />
          : null}




        {this.state.searchData.length > 0 && this.state.searchTitle == '' ?
          <View>
            <View style={{ width: '100%', flexDirection: 'row', marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />
            <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 20 }}>
              <Text style={{ color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', fontSize: 18 }}>Recent Searches</Text>
              <TouchableOpacity style={{ position: 'absolute', right: 20 }} onPress={(nn) => this._showAlert()}>
                <Text style={{ marginLeft: 10, color: 'black', textDecorationLine: 'underline', fontFamily: 'HelveticaNeueLTStd-Roman', fontSize: 18 }}>Clear Searches</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={this.state.searchData}
              renderItem={({ item, index }) =>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginTop: 30, marginLeft: 20, marginRight: 20, paddingBottom: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} onPress={(nn) => this.setTextInput(item, index, 'SearchList')}>
                  <Text style={styles.textStyle}>{item.displayTitle}</Text>
                  <Image source={require('../assets/images/right_blackarrow.png')} style={{ position: 'absolute', right: 5 }} />
                </TouchableOpacity>
              }
              ItemSeparatorComponent={this.renderSeparator}
              horizontal={false}
            />
          </View>
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
           
            <TouchableOpacity activeOpacity={1} style={{ width: '15%', backgroundColor: this.state.transparentModal ? 'transparent' : 'rgba(255,255,255,0.5)' }} onPress={() => this.setState({ visibleModal: false, transparentModal: true, defaultChecked: true, customChecked: false, articlesToOpen: [] })} />


            <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10 }}>
            <TouchableOpacity style={{ marginLeft: 20, marginTop: 15 }} onPress={() => this.backDetail()}>
                <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
              </TouchableOpacity>

              <View style={{ width: '100%', height: 50, alignItems: 'center' }}>
         

              </View>

              <View style={{ position: 'absolute', marginTop: 15, right: 10, flexDirection: 'row', flexDirection: 'row', padding: 10 }}>
                <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>
                  <TouchableOpacity style={{ marginRight: 15 }} onPress={(nn) => this.addToFavorite(this.state.seachedItem, this.state.selectedIndex, this.state.searchResult)}>
                    <Image style={{ width: 30, height: 31 }} source={require('../assets/images/star_plus.png')} />
                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginRight: 15 }} onPress={(mm) => this.setShowNewListModal(true)}>
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
                  if(event.url!='about:blank'){
                    this.webview.stopLoading();
                    
                    var article_nmaesss = event.url.split('/');
                    var article_name = article_nmaesss[article_nmaesss.length-1];
                    console.log("article_name",article_name)
                    var articlesToOpen = this.state.articlesToOpen;
                    articlesToOpen.push(article_name)
                    this.setState({articlesToOpen: articlesToOpen})
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






      </View>
    );
  }
}



export default Mysearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonContainer: {
    width: '87%',
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    justifyContent: 'center',
    fontFamily: 'HelveticaNeueLTStd-Md'
  },
  textStyle: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'HelveticaNeueLTStd-Roman',
    fontWeight: '400',
  },

  textInputStyle: {
    width: '88%',
    height: 50,
    fontSize: 20,
    marginLeft: 50,
    color: 'black',
    paddingLeft: 5,
    fontFamily: 'HelveticaNeueLTStd-Roman'
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
  }

});