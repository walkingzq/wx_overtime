// pages/detailShow/detailShow.js
var util = require('../../utils/util.js');
Page({
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
    wx.redirectTo({
      url: '../form/form?date=' + this.data.date,
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