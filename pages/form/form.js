// pages/form/form.js
var util = require('../../utils/util.js');
Page({
  /**
  * 页面的初始数据
  */
  data: {
    sessionKey:null,
    date: util.formatTime(new Date()),
    department:'产品研发中心二部',
    names: ['陈越', '沈旻雁', '李成钢', '冯祥', '张延', '李新龙', '叶鑫', '卜理超', '贾娟', '张也', '陈蔚', '冯金荣', 
            '陈婧', '杨志', '葛文君', '王鹏', '丁鑫同', '李旭春', '袁雅迪', '张少昆', '段征', '杭欢', '李铮', '田曦阳', '丁钊'],
    index: 0,
    reason:'',
    durations:['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5',
    '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11', '12', '12.5', '13', '13.5', '14', '14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18', '18.5', '19', '19.5', '20', '20.5', '21', '21.5', '22', '23', '23.5'],
    durationIndex:4,
    place:'公司',
  //   items: [
  //     { name: 'USA', value: '美国' },
  //     { name: 'CHN', value: '中国', checked: 'true' },
  //     { name: 'BRA', value: '巴西' },
  //     { name: 'JPN', value: '日本' },
  //     { name: 'ENG', value: '英国' },
  //     { name: 'TUR', value: '法国' },
  //   ]
  // },
  // checkboxChange: function (e) {
  //   console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  //加班日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //姓名
  bindNameChange:function(e){
    console.log('name changes,name is ', this.data.names[e.detail.value])
    this.setData({
      index:e.detail.value
    })
  },
  //加班时长
  bindDurationChange:function(e){
    this.setData({
      durationIndex:e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // var date = that.data.date;
    // console.log(this.data.date)
    wx.showModal({
      title: '提示',
      content: '确认要提交吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //获取formData和date
          var formData = e.detail.value;
          var date = formData.date;
          console.log(date)
          console.log(formData)
          console.log("sessionKey in form page:")
          console.log(that.data.sessionKey)
          wx.request({
            url: 'https://77205014.qcloud.la/zhaoqing/formSubmitting',
            method: "POST",
            data: formData,
            header: {
              'Content-Type': 'application/json',
              'Session-Key':that.data.sessionKey
            },
            success: function (res) {
              console.log(res.data)
              if(res.data == "0"){
                //提交成功后将本条记录的JSON格式存入本地缓存，key值为该记录日期（一个日期只有一条记录） 
              wx.setStorageSync(date, JSON.stringify(formData))
              // ({
              //   key: date,
              //   data: JSON.stringify(formData),
              // })
              wx.getStorage({
                key: date,
                success: function(res) {
                  console.log("已存入缓存，\"" + date + "\":\"" + JSON.stringify(res.data) + "\"")
                },
                fail:function(res){
                  console.log("取缓存失败" + res.data) 
                }
              })
              //显示“提交成功”消息
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
              })
              //关闭非tabBar页面并跳转至日历tabBar页面
              wx.switchTab({
                url: '../calendar/calendar'
              })
              }else if(res.data == "-1"){
                wx.navigateTo({
                  url: '../message/message?message=部门填写有误，请检查后重新提交'
                })
              } else if (res.data == "-2") {
                wx.navigateTo({
                  url: '../message/message?message=日期填写有误，请检查后重新提交'
                })
              } else if (res.data == "-3") {
                wx.navigateTo({
                  url: '../message/message?message=姓名填写有误，请检查后重新提交'
                })
              } else if (res.data == "-4") {
                wx.navigateTo({
                  url: '../message/message?message=加班缘由填写有误，请检查后重新提交'
                })
              } else if (res.data == "-5") {
                wx.navigateTo({
                  url: '../message/message?message=加班时长填写有误，请检查后重新提交'
                })
              } else if (res.data == "-6") {
                wx.navigateTo({
                  url: '../message/message?message=加班地点填写有误，请检查后重新提交'
                })
              } else if (res.data == "-7") {
                wx.navigateTo({
                  url: '../message/message?message=系统异常，提交失败，请确认信息填写正确后重新提交或稍后重试'
                })
              }
            },
            fail:function(res){
              wx.navigateTo({
                url: '../message/message?message=系统异常，提交失败，请确认信息填写正确后重新提交或稍后重试'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });  
  },
  formReset: function () {
    console.log('form发生了reset事件')
    this.setData({
      date: util.formatTime(new Date()),
      index:0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.checkSession({
      //登录态未过期，则直接从本地缓存中读取sessionKey
      success:res => {
        this.setData({
          sessionKey: wx.getStorageSync("sessionKey")
        })
        console.log("sessionKey in form page 已存入")
        console.log(this.data.sessionKey)
      },
      //登录态过期，则重新登录获取sessionKey
      fail:res=>{
        wx.login({
          success: res => {
            if (res.code) {
              console.log(res)
              //发起网络请求
              wx.request({
                url: 'https://77205014.qcloud.la/zhaoqing/onLogin',
                method: "POST",
                data: {
                  code: res.code
                },
                success: res => {
                  console.log(res.data)
                  this.globalData.sessionKey = res.data
                  wx.setStorageSync("sessionKey", res.data)
                  console.log("sessionKey: " + res.data + " 已存入本地缓存")
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
      }
    })

    this.setData({
      date: options.date || util.formatTime(new Date()),
      index:options.nameIndex || 0,
      department:options.department || '产品研发中心二部',
      durationIndex:options.durationIndex || 4,
      reason:options.reason || '',
      place:options.place || '公司',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})