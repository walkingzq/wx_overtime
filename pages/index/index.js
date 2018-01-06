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
    showModalStatus: false
  },
//动画
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
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
    console.log(e.detail.value.newName)
    var currentStatu = e.detail.target.dataset.statu;
    this.util(currentStatu)

    var newName = e.detail.value.newName
    console.log('name changes,name is ', e.detail.value)
    wx.request({
      url: 'https://77205014.qcloud.la/form-1.0.3/setName',
      method: "POST",
      data: {
        name: e.detail.value,
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
            wx.setStorageSync('userName', e.detail.value)//存入本地缓存
            this.setData({
              hasUserName:true,
              userName: e.detail.value,
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
  nameChange:function(){
    wx.showModal({
      title: '提示',
      content: '确定要修改姓名吗？',
      success:res=>{
        if(res.confirm){
          this.setData({
            nameChange:true
          })
          console.log(this.data.nameChange)
        }
      }
    })
    console.log(this.data.nameChange)
  },
  notChangeName:function(){
    this.setData({
      nameChange: false
    })
  },
  //姓名修改
  bindNameModify:function(e){
    var currentStatu = e.detail.target.dataset.statu;
    this.util(currentStatu)
    var newName = e.detail.value.newName
    wx.showModal({
      title: '提示',
      content: '确定要设置或修改您的绑定姓名吗？',
      success:res=>{
        if(res.confirm){
          wx.request({
            url: 'https://77205014.qcloud.la/form-1.0.3/modifyName',
            method: "POST",
            data: {
              name: newName,
              localSessionKey: this.data.sessionKey
            },
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              console.log(res)
              if (res.statusCode == 200) {
                if (res.data == 0) {
                  // console.log("修改姓名成功")
                  wx.showToast({
                    title: '姓名设置成功',
                    icon: 'success'
                  })
                  wx.setStorageSync('userName', newName)//存入本地缓存
                  this.setData({
                    hasUserName: true,
                    userName: newName,
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
