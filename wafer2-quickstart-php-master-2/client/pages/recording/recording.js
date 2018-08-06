// pages/recording/recording.js
const Lyric = require('../../utils/lyric.js')
const Resources = require("../../utils/resources.js")
const Recorder = wx.getRecorderManager()
const SongPlayer = wx.createInnerAudioContext()
const SingPlayer = wx.createInnerAudioContext()
const App = getApp()
const SERVER_URL = "https://www.jemizhang.cn/weapp/"
const REQUIRE_USER = "Senduserinfo"
const REQUIRE_SONG = "Getonesong"
const INIT_SONG = "Createsingsong"
const REQUIRE_STATE = "Getsongstate"
const REQUIRE_FOLLOW = "xxx"
const CHANGE_STATE = "Changesongstate"
const REQUIRE_DONE = "Getdonesong"
const UPLOAD_FRAME = "Sendsong"
const UPLOAD_SONG = "Upload"


const options = {
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isContinuing: false,
    isStarting: false,
    canPlay: false,
    isLosing: false,
    isSinging: false,
    isRecording: false,
    isDone: false,
    hasUserInfo: false,
    isListening: false,
    isClosed: false,
    isPlaying: false,
    recorderImage: '../../img/record.png',
    playImage: '../../img/playdone.png',
    songIndex: 0,
    songRange: [],
    rangeDetail: [],
    lyrics: null,
    toLineNum: 0,
    startLine: -1,
    endLine: -1,
    startTime: 0,
    endTime: 0,
    currLine: -1,
    frameCount: 0,
    creationStatus: 1,
    timingLast: 0,
    tempRecordPath: "",
    tempSongPath: "",
    musicId: "",
    creationId: "",
    openId: "",
    winnerId: ""
  },
  /**
   * 重置创作状态
   */
  resetAllState: function() {
    this.setData({
      frameCount: 0,
      isContinuing: false,
      isStarting: false,
      isLosing: false,
      isSinging: false,
      isRecording: false,
      isDone: false,
      isListening: false,
      canPlay: false,
      isPlaying: false
    })
  },
  /**
   * 重置歌词显示状态
   */
  resetLyrics: function() {
    this.setData({
      toLineNum: 0,
      currLine: -1
    })
  },
  /**
   * 处理录音的回调函数
   */
  handleRecord: function(currTime) {
    if (this.data.isSinging && !this.data.isListening) {
      if (this.data.startTime <= currTime && currTime <= this.data.endTime) {
        if (!this.data.isRecording) {
          this.setData({
            isRecording: true
          })
          Recorder.start(options)
        }
      } else {
        if (this.data.isRecording) {
          this.setData({
            isDone: true,
            isRecording: false
          })
          Recorder.stop()
        }
      }
    }
  },
  /**
   * 处理歌词滚动的回调函数
   */
  handleLyrics: function(currTime) {
    let lines = this.data.lyrics.lines,
      lineNum = 0

    for (let i = 0; i < lines.length; i++) {
      if ((i < 1 && currTime < lines[i].time) ||
        (i >= lines.length - 1 && currTime > lines[i].time)) {
        lineNum = i
        break
      } else if (i > 0 && i < lines.length) {
        let time1 = lines[i - 1].time,
          time2 = lines[i].time
        if (currTime > time1 && currTime < time2) {
          lineNum = i - 1
          break
        }
      }
    }
    if (lineNum != this.data.currLine) {
      console.log(lineNum)
      this.setData({
        currLine: lineNum
      })

      if (lineNum > 7) {
        this.setData({
          toLineNum: lineNum - 7
        })
      }
    }
  },
  /**
   * 向服务器获得用户信息
   */
  requireUser: function() {
    let t = this
    wx.request({
      url: '',
      data: {
        rawData: this.data.userInfo.rawData,
        signature: this.data.userInfo.signature,
        encryptedData: this.data.encryptedData,
        iv: this.data.iv
      },
      success: function(res) {
        t.setData({
          openId: res.data.openId
        })
      }
    })
  },
  /**
   * 向服务器获得歌曲伴奏、歌词数据与分段信息
   */
  requireSong: function() {
    var currLyrcis = new Lyric(Resources.sampleLyrics())
    let t = this
    wx.request({
      url: SERVER_URL + REQUIRE_SONG,
      data: {
        songId: this.data.musicId,
      },
      success: function(res) {
        let range = res.data.lyrics_pieces_info

        t.setData({
          tempSongPath: res.data.music_url,
          //lyrics: currLyrcis,
          songRange: res.data.lyrics_pieces_info.piece_num
        })
      },
      fail: function(res) {
        t.setData({
          tempSongPath: "http://banzou.wo99.net:2012/banzou_1234//1/1/temp/wo99.com_1330167429929540.mp3",
          lyrics: currLyrcis,
          songRange: [2, 3, 4]
        })
      },
      complete: function() {
        t.setData({
          tempSongPath: "http://banzou.wo99.net:2012/banzou_1234//1/1/temp/wo99.com_1330167429929540.mp3",
          lyrics: currLyrcis,
          songRange: [2, 3, 4]
        })
      }
    })
  },
  checkCreationStatus: function(data) {
    let isDone = data.isdone //是否完成
    let isSinging = data.singing //正在唱
    let winnerId = data.who
    let url = data.url
    if (parseInt(isDone) == 0) {
      //未完成
      if (parseInt(isSinging) == 0) {
        //无人唱
        console.log("can sing")
        wx.request({
          url: SERVER_URL + REQUIRE_FOLLOW,
          data: {
            openid: this.data.openId,
            singsongid: this.data.creationId
          },
          success: function(res) {
            if (res.data.result == "success") {

            }
          }
        })
        this.setData({
          isContinuing: true
        })
      } else {
        //有人唱
        console.log("no sing")
        this.setData({
          isLosing: true,
          timingLast: 20
        })
        setTimeout(function() {
          t.refreshStatus()
        }, 1000)
      }
    } else {
      //已完成
      console.log("is done")
      this.setData({
        tempSongPath: url,
        canPlay: true
      })
    }

  },
  refreshStatus: function() {
    let t = this
    if (!this.data.isClosed) {
      if (this.data.timingLast <= 0) {
        this.resetAllState()
        this.continueCreation()
      } else {
        console.log("tiktok")
        this.setData({
          timingLast: this.data.timingLast - 1
        })
        setTimeout(function() {
          t.refreshStatus()
        }, 1000)
      }
    }

  },
  uploadPieces: function() {
    wx.uploadFile({
      url: SERVER_URL + UPLOAD_SONG,
      filePath: this.data.tempRecordPath,
      name: this.data.creationId,
    })
  },
  /**
   * 启动创作流程
   */
  launchCreation: function() {
    console.log("launch creation")
    //this.continueCreation()
    //this.requireUser()
    this.requireSong()
    this.setData({
      isStarting: true
    })
  },
  /**
   * 继续创作流程
   */
  continueCreation: function() {
    console.log("continue creation")
    let t = this
    //this.requireUser()
    wx.request({
      url: SERVER_URL + REQUIRE_STATE,
      data: {
        singsongid: this.data.creationId,
        openid: this.data.openId
      },
      success: function(res) {
        if (res.data.result == "success") {
          t.checkCreationStatus(res.data)
        } else {

        }

      },
      fail: function(res) {
        wx.navigateBack({
          delta: 1
        })

      }
    })

  },
  /**
   * 初始化录音、播放设备，设置回调函数
   */
  initDevice: function() {

    Recorder.onStart(() => {
      console.log("recording start")
    })
    Recorder.onStop((res) => {
      console.log("recording stop")
      this.setData({
        tempRecordPath: res.tempFilePath,
      })
      this.uploadPieces()
    })
    /* Recorder.onFrameRecorded((res) => {

       console.log("frame record")
       let t = this
       let txt = wx.arrayBufferToBase64(res.frameBuffer)
       this.setData({

       })
       wx.request({
         url: SERVER_URL + UPLOAD_FRAME,
         data: {
           creationId: t.data.creationId,
           serial: t.data.frameCount,
           frameContent: txt,
           isLastFrame: res.isLastFrame
         }
       })
     })*/

    SongPlayer.onError(() => {
      console.log("song error")
      this.stopSing()
    })
    SongPlayer.onPlay(() => {
      console.log("song play")
    })
    SongPlayer.onTimeUpdate((res) => {
      console.log(SongPlayer.currentTime)
      this.handleLyrics(SongPlayer.currentTime * 1000)
      this.handleRecord(SongPlayer.currentTime)
    })
    SongPlayer.onEnded(() => {
      console.log("song end")
    })
    SongPlayer.onStop(() => {
      console.log("song stop")
    })

    SingPlayer.onError(() => {
      console.log("playback error")
      this.stopListen()
    })
    SingPlayer.onPlay(() => {
      console.log("playback start")
    })
    SingPlayer.onEnded(() => {
      console.log("playback end")
      if (this.data.isListening) {
        this.stopListen()
      }
    })
    SingPlayer.onStop(() => {
      console.log("playback stop")
    })
  },
  /**
   * 初始化唱歌数据
   */
  initSing: function() {
    let num = this.data.songRange[this.data.songIndex],
      line = Resources.sampleBelongLine(),
      time = Resources.smapleBelongTime()
    let t = this
    wx.request({
      url: SERVER_URL + INIT_SONG,
      data: {
        openid: t.data.openId,
        songid: t.data.musicId,
        piece: num
      },
      success: function(res) {
        let reuslt = res.data.reuslt
        if (result == "success") {
          t.setData({
            creationId: res.data.createflowid
          })
        } else {

        }
      }
    })
    t.setData({
      startLine: line[0],
      endLine: line[1],
      startTime: time[0],
      endTime: time[1],
      creationId: 444
    })
    SongPlayer.src = this.data.tempSongPath
  },
  /**
   * 开始唱歌
   */
  startSing: function() {
    this.resetLyrics()
    this.resetAllState()
    this.setData({
      isSinging: true,
    })
    SongPlayer.play()
  },
  /**
   * 结束唱歌
   */
  stopSing: function() {
    SongPlayer.stop()
    Recorder.stop()
    this.resetLyrics()
    this.resetAllState()
  },
  /**
   * 开始聆听录音数据
   */
  startListen: function() {
    this.stopSing()
    this.resetLyrics()
    this.resetAllState()
    this.setData({
      isListening: true,
      isSinging: true,
      isDone: true
    })
    SingPlayer.src = this.data.tempRecordPath
    SongPlayer.seek(this.data.startTime)
    SongPlayer.play()
    SingPlayer.play()

  },
  /**
   * 结束聆听录音数据
   */
  stopListen: function() {
    SingPlayer.stop()
    SongPlayer.stop()
    this.resetLyrics()
    this.resetAllState()
    this.setData({
      isSinging: true,
      isDone: true
    })
  },
  /**
   * 转发回调函数
   */
  onShareAppMessage: function(e) {
    console.log("share " + e.from)
    return {
      title: this.data.userInfo.nickName + '邀请你一起来唱！',
      path: '/pages/recording/recording?creationId=' + this.data.creationId
    }
  },
  /**
   * 点击预览按钮的回调函数
   */
  onClickListen: function(e) {
    if (this.data.isListening) {
      this.stopListen()
    } else {
      this.startListen()
    }
  },
  /**
   * 点击保存按钮的回调函数
   */
  onClickSave: function(e) {
    this.stopSing()
    this.stopListen()
    let t = this
    wx.request({
      url: '',
      data: {
        action: 0
      },
      success: function(res) {

      },
      complete: function(res) {
        t.setData({
          //creationStatus: parseInt(res.data.creationStatus)
        })
      }
    })

  },
  /**
   * 点击重唱按钮的回调函数
   */
  onClickAgain: function(e) {
    wx.request({
      url: '',
      data: {
        action: 1
      }
    })
    this.stopSing()
    this.startSing()
  },
  /**
   * 点击播放完成音频按钮的回调函数
   */
  onClickPlay: function(e) {
    //this.startListen()
    if (this.data.isPlaying) {
      this.setData({
        isPlaying: false
      })
    } else {
      this.setData({
        isPlaying: true
      })
    }
  },
  /**
   * 点击开始嗨歌按钮的回调函数
   */
  onClickSing: function(e) {
    this.stopSing()
    this.initSing()
    this.startSing()
  },
  onClickContinue: function(e) {

  },
  onClickQuit: function(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 切换合作人数的Picker的回调函数
   */
  onPickerChange: function(e) {
    this.setData({
      songIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isClosed: false
    })
    console.log(App.globalData.userInfo)
    if (App.globalData.userInfo) {
      this.setData({
        userInfo: App.globalData.userInfo,
        hasUserInfo: true
      })
      this.initDevice()
      //状态码
      let status = options.status
      status = 0
      options.mId = 123
      options.cId = 444
      if (status == 0) {
        //发起流程
        let mId = options.mId
        this.setData({
          musicId: mId
        })
        this.launchCreation()
      } else if (status == 1) {
        //接唱流程
        let cId = options.cId
        this.setData({
          creationId: cId
        })
        this.continueCreation()
      } else {
        //未获取到正确参数，退出
        wx.navigateBack({
          delta: 1
        })
      }
    }

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
    this.stopListen()
    this.stopSing()

    this.setData({
      isClosed: true
    })
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
})