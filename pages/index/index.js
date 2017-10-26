//index.js
//获取应用实例
import { getUserName } from '../../utils/getUserName.js';
const app = getApp()

Page({
  data: {
    names: ['陈越', '沈旻雁', '李成钢', '冯祥', '张延', '李新龙', '叶鑫', '卜理超', '贾娟', '张也', '陈蔚', '冯金荣',
      '陈婧', '杨志', '葛文君', '王鹏', '丁鑫同', '李旭春', '袁雅迪', '张少昆', '段征', '杭欢', '李铮', '田曦阳', '丁钊'],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    encryptedData:{},
    hasUserName:false,//姓名是否绑定标志
    userName: null
  },
  // 事件处理函数
  bindViewTap: function() {
    wx.redirectTo({
      url: '../calendar/calendar'
    })
  },
  onLoad: function () {
    console.log("index.js0:" + app.globalData.userName)
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
    //获取用户真实姓名
    console.log("index.js1:" + app.globalData.userName)
    if(app.globalData.userName){
      this.setData({
        userName:app.globalData.userName,
        hasUserName:true
      })
      console.log("index.js" + app.globalData.userName)
    }else if(null != getUserName(app.globalData.sessionKey)){
      console.log("index.js" + "else if")
      this.setData({
        userName: getUserName(app.globalData.sessionKey),
        hasUserName: true
      })
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
  //绑定姓名按钮的js代码
  setName:function(){
    wx.showToast({
      title: '绑定姓名按钮',
    })
  },
  //姓名
  bindNameChange: function (e) {
    console.log('name changes,name is ', this.data.names[e.detail.value])
    wx.request({
      url: 'https://77205014.qcloud.la/zhaoqing1026/setName',
      method: "POST",
      data: {
        name: this.data.names[e.detail.value],
        localSessionKey: app.globalData.sessionKey
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
          }else{
            console.log("系统异常")
          }
        }else{
          console.log("http请求失败")
        }
      },
      fail:res=>{
        console.log("网络异常")
      }
    })
  },
  onShareAppMessage() {
    return {
      title: 'CTSI加班助手',
      desc: '加班信息统计',
      path: 'pages/index/index'
    };
  },
})
