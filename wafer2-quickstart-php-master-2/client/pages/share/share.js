// pages/share/share.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    charNum: 0,
    albumUrl: "../../img/album.jpg",
    msg: "",
    creationId: ""
  },
  onConfirmMsg: function(e) {
    let msg = e.detail.value
    this.setData({
      msg: msg,
      charNum: msg.length
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      creationId: options.cId,
      msg: App.globalData.userInfo.nickName + '邀请你一起来唱' + App.globalData.songInfo.data.singer + "的" + App.globalData.songInfo.data.song_name + "！"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      charNum: this.data.msg.length
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log(this.data.creationId)

    wx.redirectTo({
      url: '/pages/index/index',
    })
    return {
      title: this.data.msg,
      path: '/pages/recording/recording?cId=' + this.data.creationId,
      imageUrl: this.data.albumUrl
    }
  }
})