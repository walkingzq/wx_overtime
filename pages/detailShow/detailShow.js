// pages/detailShow/detailShow.js
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date:null,
    department:null,
    nameIndex:null,
    reason:null,
    duration:null,
    place:null,
    name:null,
    names: ['陈越', '沈旻雁', '李成钢', '冯祥', '张延', '李新龙', '叶鑫', '卜理超', '贾娟', '张也', '陈蔚', '冯金荣',
      '陈婧', '杨志', '葛文君', '王鹏', '丁鑫同', '李旭春', '袁雅迪', '张少昆', '段征', '杭欢', '李峥', '田曦阳', '丁钊'],
    durations: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5',
      '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11', '12', '12.5', '13', '13.5', '14', '14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18', '18.5', '19', '19.5', '20', '20.5', '21', '21.5', '22', '23', '23.5'],
    durationIndex: 4,
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
          // nameIndex: JSON.parse(res.data).name,
          name: JSON.parse(res.data).name,
          reason: JSON.parse(res.data).reason,
          durationIndex: JSON.parse(res.data).duration,
          place: JSON.parse(res.data).place
        })
      },
    })
  },
  //跳转到表单提交页面
  goToForm: function () {
    wx.navigateTo({
      url: '../form/form?date=' + this.data.date 
      + "&department=" + this.data.department
      + '&userName' + this.data.name
      + "&reason=" + this.data.reason
      + "&durationIndex=" + this.data.durationIndex 
      + "&date=" + this.data.date ,
    })
  },
  deleteRecord:function(event){
    console.log(event.currentTarget.dataset.date)
    var day = event.currentTarget.dataset.date;
    wx.request({
      url: 'https://77205014.qcloud.la/form-1.0.3/deleteRecord?date=' + day,
      method: "GET",
      header: {
        'Session-Key': wx.getStorageSync("sessionKey")
      },
      success: function (res) {//微信提供的wx.request()接口调用成功
        console.log(res)
        if(res.data == "0"){//服务器返回0，表示该条记录在数据库中成功删除
          wx.showToast({
            title: '已删除本条记录',
            icon:'success',
          })
          try{//删除本地缓存
            wx.removeStorageSync(day)
          }catch (exc){
            wx.showModal({
              title: '提示',
              content: '删除本地缓存失败，请手动同步信息',
            })
          }
          wx.switchTab({//返回主页
            url: '../calendar/calendar',
          })
        }else if(res.data == "1"){//服务器返回1，表示该条记录在数据库中删除失败
          wx.showModal({
            title: '提示',
            content: '删除失败,请重试',
          })
        }else{//服务器返回结果只有0和1两个取值，其他取值均为服务器异常
          wx.showModal({
            title: '提示',
            content: '服务器出小差了，请稍后重试',
          })
        }
      },
      fail:function(){//微信提供的wx.request()接口调用失败
        wx.showModal({
          title: '提示',
          content: '出错了，请重试',
          showCancel: false,
        })
      }
    })
    // wx.removeStorageSync(event.currentTarget.dataset.date)
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