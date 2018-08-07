// pages/recording/recording.js
const Lyric = require('../../utils/lyric.js')
const Resources = require("../../utils/resources.js")
var qcloud = require('../../vendor/wafer2-client-sdk/index')
const Recorder = wx.getRecorderManager()
const SongPlayer = wx.createInnerAudioContext()
const SingPlayer = wx.createInnerAudioContext()
const App = getApp()
const SERVER_URL = "https://www.jemizhang.cn/weapp/"
const REQUIRE_USER = "Senduserinfo"
const REQUIRE_SONG = "Getonesong"
const INIT_SONG = "Createsingsong"
const REQUIRE_STATE = "Getsongstate"
const REQUIRE_FOLLOW = "Getfollowsong"
const CHANGE_STATE = "Changesongstate"
const REQUIRE_DONE = "Getdonesong"
const UPLOAD_FRAME = "Sendsong"
const UPLOAD_SONG = "Upload"
const START_SINGING = "Startsinging"
const REQUIRE_CREATION = "Createsingsong"


const options = {
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3'
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
    albumUrl: "",
    songIndex: 0,
    songRange: [],
    rangeDetail: [],
    songInfo: [],
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
    singPiece: 0,
    tempRecordPath: "",
    tempSongPath: "",
    musicId: "",
    creationId: "",
    openId: "",
    winnerId: "",
    doneArr: [],
    playIndex: 0
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
    /*var currLyrcis = new Lyric(Resources.sampleLyrics())
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
          lyrics: currLyrcis,
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
    })*/
    let t = this
    let lyricPath = ""
    t.setData({
      rangeDetail: JSON.parse(t.data.songInfo.lyric_info)
    })
    this.setData({
      tempSongPath: t.data.songInfo.song_url,
      songRange: [t.data.songInfo.song_piece_num],
      albumUrl: t.data.songInfo.img_url,
      startLine: parseInt(t.data.rangeDetail[1]) + 1,
      endLine: parseInt(t.data.rangeDetail[3]),
      startTime: parseFloat(t.data.rangeDetail[0]),
      endTime: parseFloat(t.data.rangeDetail[2]),
    })


    console.log(this.data.songInfo)
    wx.request({
      url: this.data.songInfo.lyric_url,
      success: function(res) {
        t.setData({
          lyrics: new Lyric(res.data)
        })
      }
    })
    /*wx.downloadFile({
      url: this.data.songInfo.lyric_url,
      success: function(res) {
        console.log(res.tempFilePath)
        lyricPath = res.tempFilePath
        let content = ""
        wx.saveFile({
          tempFilePath: lyricPath,
          success: function(res) {
            lyricPath = res.savedFilePath
            wx.request({
              url: lyricPath,
              success: function(res) {
                console.log("lyrics=>" + res.data)
                content = res.data
                t.setData({
                  lyrics: new Lyric(content)
                })
                console.log(t.data)
              }
            })
          }
        })



      }

    })*/

  },
  requireLyrics: function(url) {
    let t = this
    wx.request({
      url: url,
      success: function(res) {
        t.setData({
          lyrics: new Lyric(res.data)
        })
      }
    })
  },
  checkCreationStatus: function(data) {
    console.log("data=>" + data)
    let t = this
    this.requireLyrics(data.lyric_url)
    this.setData({
      albumUrl: data.img_url,
      tempSongPath: data.song,
    })
    this.setData({
      rangeDetail: JSON.parse(data.lyric_info)
    })
    if (data.song_url2) {
      this.setData({
        canPlay: true,
        doneArr: [data.song_url, data.song_url2],
        startTime: parseFloat(t.data.rangeDetail[0]),
        endTime: parseFloat(t.data.rangeDetail[6])
      })
      console.log(this.data.doneArr)
    } else {
      this.setData({

        isContinuing: true,
        startTime: parseFloat(t.data.rangeDetail[4]),
        endTime: parseFloat(t.data.rangeDetail[6]),
        startLine: parseInt(t.data.rangeDetail[5]) + 1,
        endLine: parseInt(t.data.rangeDetail[7])
      })

    }
    /*
    let isDone = data.isdone //是否完成
    let isSinging = data.singing //正在唱
    isDone = 0
    isSinging = 0
    let winnerId = data.who
    let url = data.url
    console.log("isDone=>" + isDone + " isSinging=>" + isSinging)
    if (parseInt(isDone) == 0) {
      //未完成
      if (parseInt(isSinging) == 0) {
        //无人唱
        console.log("can sing")
        wx.request({
          url: SERVER_URL + REQUIRE_FOLLOW,
          data: {
            openid: this.data.openId,
            create_flow_id: this.data.creationId
          },
          success: function(res) {
            console.log(res)
            if (res.data.result == "success") {
              App.globalData.songInfo = res.data

              t.setData({
                tempSongPath: res.data.song_url,
                albumUrl: res.data.img_url,
                musicId: res.data.song_id,
                winnerId: initiator_id
              })
              t.requireLyrics(res.data.lyric_url)
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
*/
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
    let t = this
    wx.uploadFile({
      url: SERVER_URL + UPLOAD_SONG,
      filePath: this.data.tempRecordPath,
      file: this.data.creationId,
      name: "file",
      success: function(res) {
        let temp = JSON.parse(res.data)
        console.log(temp)
        t.setData({
          tempRecordPath: temp.data.imgUrl
        })

      }
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
    console.log(t.data.openId)
    //this.requireUser()
    wx.request({
      url: SERVER_URL + REQUIRE_FOLLOW,
      data: {
        create_flow_id: t.data.creationId
      },
      success: function(res) {
        console.log(res)

        App.globalData.songInfo = res
        t.checkCreationStatus(res.data)



      },
      fail: function(res) {
        wx.navigateBack({
          delta: 1
        })

      }
    })

  },
  playDoneMusic: function() {
    SongPlayer.src = this.data.tempSongPath
    SongPlayer.seek(this.data.startTime)
    SingPlayer.src = this.data.doneArr[this.data.playIndex]
    SongPlayer.play()
    SingPlayer.play()
  },
  stopDoneMusic: function() {
    SongPlayer.stop()
    SingPlayer.stop()
    this.setData({
      playIndex: 0
    })
  },
  requireUserInfo: function() {
    util.showBusy('正在登录')

    const session = qcloud.Session.get()
    if (session) {
      qcloud.loginWithCode({
        success: res => {
          this.setData({
            hasUserInfo: true
          })
          App.globalData.userInfo = res
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
          this.setData({
            hasUserInfo: true
          })
          App.globalData.userInfo = res
          util.showSuccess('登录成功2')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误2', err.message)
        }
      })
    }
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
      this.stopSing()
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
      if (this.data.canPlay && this.data.isPlaying) {
        if (this.data.playIndex >= 1) {
          console.log("stop")
          this.setData({
            isPlaying: false,
            playIndex: 0
          })
          SongPlayer.stop()
        } else {
          console.log("con")
          this.setData({
            playIndex: 1
          })
          SingPlayer.src = this.data.doneArr[this.data.playIndex]
          SingPlayer.play()
        }
      }
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
    console.log("startLine" + this.data.startLine)
    console.log("endLine" + this.data.endLine)

    // let num = this.data.songRange[this.data.songIndex],
    //   line = Resources.sampleBelongLine(),
    //   time = Resources.smapleBelongTime()
    // let t = this
    // wx.request({
    //   url: SERVER_URL + INIT_SONG,
    //   data: {
    //     openid: t.data.openId,
    //     songid: t.data.musicId,
    //     piece: num
    //   },
    //   success: function(res) {
    //     let reuslt = res.data.reuslt
    //     if (result == "success") {
    //       t.setData({
    //         creationId: res.data.createflowid
    //       })
    //     } else {

    //     }
    //   }
    // })
    // t.setData({
    //   startLine: line[0],
    //   endLine: line[1],
    //   startTime: time[0],
    //   endTime: time[1],
    //   creationId: 444
    // })
    let t = this
    if (this.data.creationId == "" || this.data.isStarting) {
      console.log(t.data.songInfo.song_id + t.data.openId + t.data.songInfo.song_piece_num)
      wx.request({
        url: SERVER_URL + REQUIRE_CREATION,
        data: {
          openid: t.data.openId,
          songid: t.data.songInfo.song_id,

          piece_num: t.data.songInfo.song_piece_num,
        },
        success: function(res) {
          console.log("Create=>" + res.data)
          if (res.data.result == "success") {
            t.setData({
              creationId: res.data.createflowid
            })
          }
        }
      })
    }
    SongPlayer.src = this.data.tempSongPath
    if (this.data.startTime > 5) {
      SongPlayer.seek(this.data.startTime - 5)
    }


  },
  /**
   * 开始唱歌
   */
  startSing: function() {
    let t = this
    wx.request({
      url: SERVER_URL + START_SINGING,
      data: {
        singsongid: t.data.creationId,
        openid: t.data.openId,
      },
      success: function(res) {
        if (res.data.result == "success") {

        } else if (res.data.result == "singing") {
          let who = res.data.who
        } else if (res.data.result == "done") {
          let url = res.data.url

        }
      }
    })
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
    let t = this
    console.log("creationId=>" + t.data.creationId)
    wx.request({
      url: SERVER_URL + CHANGE_STATE,
      data: {
        singsongid: t.data.creationId,
        openid: t.data.openId,
        piece_num: t.data.singPiece,
        song_url: t.data.tempRecordPath
      },
      success: function(res) {
        console.log(res)
        if (res.data.isdone == 0) {
          t.stopSing()
          t.stopListen()
          wx.navigateTo({
            url: '../share/share?cId=' + t.data.creationId,
          })
        } else {
          wx.showToast({
            title: '接唱完成！',
            icon: 'success',
            duration: 2000
          })
          console.log("save->quit")
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      }
    })

  },
  /**
   * 点击重唱按钮的回调函数
   */
  onClickAgain: function(e) {
    this.stopSing()
    this.startSing()
  },
  /**
   * 点击播放完成音频按钮的回调函数
   */
  onClickPlay: function(e) {
    //this.startListen()
    if (this.data.isPlaying) {
      this.stopDoneMusic()
      this.setData({
        isPlaying: false
      })
    } else {
      this.playDoneMusic()
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
  /**
   * 点击继续接唱按钮的回调函数
   */
  onClickContinue: function(e) {
    this.stopSing()
    console.log(this.data.startTime)
    SongPlayer.src = this.data.tempSongPath
    if (this.data.startTime > 5) {
      SongPlayer.seek(this.data.startTime - 5)
    }

    this.startSing()
  },
  onClickQuit: function(e) {
    console.log("quit")
    wx.redirectTo({
      url: '/pages/index/index',
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
        openId: App.globalData.userInfo.openId,
        hasUserInfo: true
      })
      this.initDevice()
      let cId = options.cId
      let t=this
      if (cId) {
        //接唱流程
        this.setData({
          creationId: cId
        })
        this.continueCreation()
      } else if (App.globalData.songInfo) {
        //发起流程
        this.setData({
          songInfo: App.globalData.songInfo.data,
          musicId: App.globalData.songInfo.data.song_id
        })
        this.launchCreation()
      } else {
        //错误
        console.log("error,no param!!!")
        wx.redirectTo({
          url: '/pages/index/index?cId='+t.data.creationId,
        })
      }
    } else {
      //this.requireUserInfo()
      wx.redirectTo({
        url: '/pages/index/index?cId=' + t.data.creationId,
      })
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
    this.resetAllState()
    this.resetLyrics()
    this.setData({
      openId: "",
      creationId: "",
      musicId: ""
    })
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