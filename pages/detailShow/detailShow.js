// pages/detailShow/detailShow.js
var util = require('../../utils/util.js');
Page({
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showModal({
      title: '提示',
      content: '确认要提交吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var that = this;
          var formData = e.detail.value;
          wx.request({
            url: 'https://77205014.qcloud.la/form/formSubmitting',
            method: "POST",
            data: formData,
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              console.log(res.data)
              if (res.data == "0") {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateTo({
                  url: '../message/message?message=您本次提交的信息为' + JSON.stringify(formData)
                })
              } else if (res.data == "-1") {
                wx.navigateTo({
                  url: '../message/message?message=部门填写有误，请检查后重新提交'
                })
              } else if (res.data == "-2") {
                wx.navigateTo({
                  url: '../message/message?message=日期填写有误，请检查后重新提交'
                })
              } else if (res.data == "-3") {
                wx.navigateTo({
                  url: '../message/message?message=姓名填写有误，请检查后重新提交' + JSON.stringify(formData)
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
            fail: function (res) {
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
      date: util.formatTime(new Date())
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    date:null,
    department:null,
    name:null,
    reason:null,
    duration:null,
    place:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取传递过来的日期
    this.setData({
      date: options.date
    })
    var that = this;
    //根据日期从本地缓存中读取信息，若有信息，设定各个输入框内容；若没有，则跳转至加班信息提交界面。
    var data_day = wx.getStorage({
      key: options.date,
      success: function (res) {
        that.setData({
          date: JSON.parse(res.data).date,
          department: JSON.parse(res.data).department,
          name: JSON.parse(res.data).name,
          reason: JSON.parse(res.data).reason,
          duration: JSON.parse(res.data).duration,
          place: JSON.parse(res.data).place
        })
      },
    })
  },
  //跳转js
  goToForm: function () {
    wx.navigateTo({
      url: '../form/form'
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