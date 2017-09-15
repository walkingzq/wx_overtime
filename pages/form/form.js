// pages/form/form.js
var util = require('../../utils/util.js');
Page({
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
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
          wx.request({
            url: 'https://77205014.qcloud.la/form/formSubmitting',
            method: "POST",
            data: formData,
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              console.log(res.data)
              if(res.data == "0"){
                //提交成功后将本条记录的JSON格式存入本地缓存，key值为该记录日期（一个日期只有一条记录）
              wx.setStorage({
                key: date,
                data: JSON.stringify(formData),
              })

              wx.getStorage({
                key: date,
                success: function(res) {
                  console.log("已存入缓存，\"" + date + "\":\"" + JSON.stringify(res.data) + "\"")
                },
              })
              //显示“提交成功”消息
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
              })
              //跳转至日历页面
              wx.navigateTo({
                url: '../calendar/calendar?date=' + that.data.date
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
      date: util.formatTime(new Date())
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    date: util.formatTime(new Date())
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date: options.date || util.formatTime(new Date())
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