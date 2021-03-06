var WxSearch = require('../../wxSearch/wxSearch.js');
var searchKey;
var lastSearchKey;
var songList = require('../../data/searchData.js').songs;
var songData;
var musicDisplay;
const app = getApp();

Page({
  data: {
    wxSearchData: {
      view: {
        isShow: true
      }
    },
  },

  onLoad: function () {
    console.log('onLoad');
    var that = this;
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['演员', '小幸运', '陈奕迅', 'faded', '等你下课']);
    WxSearch.initMindKeys(['你就不要想起我', '戒烟', '我爱的人', '成全']); 
    lastSearchKey = wx.getStorageSync('lastSearchKey');

    this.setData({
      key: lastSearchKey
    });
    wx.request({
      url: 'https://www.jemizhang.cn/weapp/getonesong',
      data: {
        'song_name': lastSearchKey
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        app.globalData.songInfo = res
        console.log("----------------")
        console.log(app.globalData.songInfo)
        console.log("----------------")
        console.log(songList)
        console.log("----------------")
        var songID = res.data["song_id"]
        musicDisplay = {
          "1": {
            "musicAddr": res.data["song_url"],
            "album": {
              "picAddr": res.data["img_url"],
              "name": "专辑",
            },
            "artist": res.data["singer"],
            "name": res.data["song_name"]
          },
        }

        for (var j = 0; j < 100000; j++) {
        }
        var rs = [],
          idsMap = {},
          keys = Object.keys(musicDisplay),
          len = keys.length;

        for (var i = 0; i < len; i++) {
          var k = keys[i];

          rs.push(Object.assign({
            id: k,
          }, musicDisplay[k]));

          idsMap[k] = {
            preid: i > 0 ? keys[i - 1] : 0,
            nextid: i < len - 1 ? keys[i + 1] : 0
          }
        }

        idsMap[keys[0]].preid = keys[len - 1];
        idsMap[keys[len - 1]].nextid = keys[0];

        console.log("------------------");
        console.log(rs);

        that.setData({
          searchMusic: rs
        });
      }
    })
  },

  bindViewTap: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  bindRecordTap: function () {
    wx.navigateTo({
      url: '../recording/recording'
    })
  },

  wxSearchFn: function (e) {
    searchKey = this
    WxSearch.wxSearchAddHisKey(searchKey);
    wx.setStorageSync('lastSearchKey', searchKey.data.wxSearchData.value)
    wx.navigateTo({
      url: '../search/search'
    })
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  }
})