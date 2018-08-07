var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    creationId: ""
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logoPage/logoPage'
    })
  },

  onLoad: function(options) {
    let cId = options.cId
    if (cId) {
      this.setData({
        creationId: cId
      })
    }
    this.bindGetUserInfo()
  },

  bindGetUserInfo: function() {
    if (this.data.logged) return
let t=this
    util.showBusy('正在登录')

    const session = qcloud.Session.get()
    if (session) {
      qcloud.loginWithCode({
        success: res => {
          this.setData({
            userInfo: res,
            logged: true
          })
          app.globalData.userInfo = res
          util.showSuccess('登录成功1')
          if(t.data.creationId){
              wx.navigateTo({
                url: '../recording/recording?cId='+t.data.creationId,
              })
          }else{
            wx.navigateTo({
              url: '../logoPage/logoPage'
            })
          }
        
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误1', err.message)
        }
      })
    } else {
      qcloud.login({
        success: res => {
          this.setData({
            userInfo: res,
            logged: true
          })
          app.globalData.userInfo = res
          util.showSuccess('登录成功2')
          if (t.data.creationId) {
            wx.navigateTo({
              url: '../recording/recording?cId=' + t.data.creationId,
            })
          } else {
            wx.navigateTo({
              url: '../logoPage/logoPage'
            })
          }
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误2', err.message)
        }
      })
    }
  }
})