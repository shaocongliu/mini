// pages/page1/page1.js
Page({


  bindViewTap: function() {
    wx.navigateTo({
      url: '../recommend/recommend'
    })
  },
  onLoad: function(options) {
    wx.navigateTo({
      url: '../recommend/recommend'
    })
  }
})