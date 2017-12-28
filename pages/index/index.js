//index.js
//获取应用实例
import { getUserName } from '../../utils/getUserName.js';
const app = getApp()

Page({
  data: {
    names: ['陈越', '沈旻雁', '李成钢', '冯祥', '张延', '李新龙', '叶鑫', '卜理超', '贾娟', '张也', '陈蔚', '冯金荣',
      '陈婧', '杨志', '葛文君', '王鹏', '丁鑫同', '李旭春', '袁雅迪', '张少昆', '段征', '杭欢', '李峥', '田曦阳', '丁钊', '封龙飞'],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    encryptedData:{},
    hasUserName:false,//姓名是否绑定标志
    userName: null,
    sessionKey:wx.getStorageSync('sessionKey') || null,
  },
  // 事件处理函数
  bindViewTap: function() {
    wx.redirectTo({
      url: '../calendar/calendar'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          encryptedData: JSON.stringify(res.encryptedData) 
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    if(this.data.userName != null){
      this.setData({
        hasUserName: true
      })
    } else if (wx.getStorageSync("userName") && wx.getStorageSync("userName") != ""){//如果缓存中有值且不为空，直接读取
        this.setData({
          userName: wx.getStorageSync("userName"),
          hasUserName: true
        })
    }else{//缓存中没值，则延时2000毫秒之后继续从缓存中读取
      var that = this
      setTimeout(function tmp(){
        if (wx.getStorageSync("userName") && wx.getStorageSync("userName") != ""){
          that.setData({
            userName: wx.getStorageSync("userName"),
            hasUserName: true
          })
        }
      }, 2000)
    }

    //设定sessionKey
    console.log('this.data.sessionKey == null :' + (this.data.sessionKey == null))
    console.log(wx.getStorageSync('sessionKey'))
    if(this.data.sessionKey == null){
      var that = this
      setTimeout(function tmp() {
        if (wx.getStorageSync("sessionKey") && wx.getStorageSync("sessionKey")) {
          that.setData({
            sessionKey: wx.getStorageSync('sessionKey')
          })
        }
      }, 1000)
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //姓名
  bindNameChange: function (e) {
    console.log('name changes,name is ', this.data.names[e.detail.value])
    wx.request({
      url: 'https://77205014.qcloud.la/form-1.0.3/setName',
      method: "POST",
      data: {
        name: this.data.names[e.detail.value],
        localSessionKey: wx.getStorageSync('sessionKey')
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=>{
        console.log(res)
        if(res.statusCode == 200){
          if(res.data == 0){
            console.log("绑定成功")
            wx.showToast({
              title: '绑定成功',
              icon:'success'
            })
            wx.setStorageSync('userName', this.data.names[e.detail.value])//存入本地缓存
            this.setData({
              hasUserName:true,
              userName: this.data.names[e.detail.value],
            })
          }else{
            console.log("系统异常")
          }
        }else{
          console.log("http请求失败")
          wx.showModal({
            title: '提示',
            content: '服务器出小差了，请重试',
            showCancel: false,
          })
        }
      },
      fail:res=>{
        console.log("微信异常")
        wx.showModal({
          title: '提示',
          content: '出错了，请重试',
          showCancel:false,
        })
      }
    })
  },
  //姓名修改
  bindNameModify:function(e){
    wx.showModal({
      title: '提示',
      content: '确定要修改您绑定的姓名吗？',
      success:res=>{
        if(res.confirm){
          wx.request({
            url: 'https://77205014.qcloud.la/form-1.0.3/modifyName',
            method: "POST",
            data: {
              name: this.data.names[e.detail.value],
              localSessionKey: this.data.sessionKey
            },
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              console.log(res)
              if (res.statusCode == 200) {
                if (res.data == 0) {
                  console.log("修改姓名成功")
                  wx.showToast({
                    title: '修改姓名成功',
                    icon: 'success'
                  })
                  wx.setStorageSync('userName', this.data.names[e.detail.value])//存入本地缓存
                  this.setData({
                    hasUserName: true,
                    userName: this.data.names[e.detail.value],
                  })
                } else {
                  console.log("系统异常")
                }
              } else {
                console.log("http请求失败")
                wx.showModal({
                  title: '提示',
                  content: '服务器出小差了，请重试',
                  showCancel: false,
                })
              }
            },
            fail: res => {
              console.log("微信异常")
              wx.showModal({
                title: '提示',
                content: '出错了，请重试',
                showCancel: false,
              })
            }
          })
        }else if(res.cancel){
          console.log('用户点击取消')
        }   
      }
    })
  },
  onShow(){
    //获取sessionKey
    if (this.data.sessionKey == null && wx.getStorageSync("sessionKey")){
      this.setData({
        sessionKey: wx.getStorageSync("sessionKey")
      })
    }
    //获取用户真实姓名
    if (this.data.userName == null && wx.getStorageSync("userName") && wx.getStorageSync("userName") != ""){
      this.setData({
        userName: wx.getStorageSync("userName"),
        hasUserName: true
        })
    }

  },
  onShareAppMessage() {
    return {
      title: 'CTSI加班助手',
      desc: '加班信息统计',
      path: 'pages/index/index'
    };
  },
})
