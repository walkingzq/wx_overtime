//app.js
//小程序的脚本代码。我们可以在这个文件中监听并处理小程序的生命周期函数、声明全局变量。
// var getUserName = require('./utils/getUserName.js');
import {getUserName} from './utils/getUserName.js';
App({
  onLaunch: function () {//当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || [] //从本地缓存中获取key值为'logs'的value值，如果value不存在，则logs=[](一个js数组)
    // logs.unshift(Date.now())//插入时间到logs数组
    // wx.setStorageSync('logs', logs)//保存至本地缓存

    // 登录并获取sessionKey
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res)
          //发起网络请求
          wx.request({
            url: 'https://77205014.qcloud.la/zhaoqing1026/onLogin',
            method: "POST",
            data: {
              code: res.code
            },
            success:res => {
              console.log(res.data)
              this.globalData.sessionKey = res.data

              this.globalData.userName = getUserName(this.globalData.sessionKey)
              console.log("app.js" + this.globalData.userName)

              wx.setStorageSync('sessionKey', this.globalData.sessionKey)
              console.log("sessionKey: " + this.globalData.sessionKey + " 已存入本地缓存")

              var value = wx.getStorageSync('sessionKey')
              if(value){
                console.log("wx.getStorageSync('sessionKey'):" + value)
              }
              
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        // else{
        //   wx.authorize({
        //     scope: 'scope.userInfo',
        //     success: res => {
        //       wx.getUserInfo({
        //         success: res => {
        //           console.log(res)
        //           // 可以将 res 发送给后台解码出 unionId
        //           this.globalData.userInfo = res.userInfo
        //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //           // 所以此处加入 callback 以防止这种情况
        //           if (this.userInfoReadyCallback) {
        //             this.userInfoReadyCallback(res)
        //           }
        //         }
        //       })
        //     }
        //   })
        // }
      }
    })
  },
  globalData: {
    userInfo: null,
    sessionKey:null,
    userName:""
  }
})