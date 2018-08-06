var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logoPage/logoPage'
    })
  },


  onLoad: function () {
  },


    bindGetUserInfo: function () {
    console.log("-------")
    if (this.data.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          util.showSuccess('登录成功1')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误1', err.message)
        }
      })
    } else {
      qcloud.login({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          util.showSuccess('登录成功2')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误2', err.message)
        }
      })
    }
  }

})
