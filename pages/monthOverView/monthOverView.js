// pages/monthOverView/monthOverView.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    durations: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5',
      '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11', '12', '12.5', '13', '13.5', '14', '14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18', '18.5', '19', '19.5', '20', '20.5', '21', '21.5', '22', '23', '23.5'],
      records:[]
    // records:[
    //   {"id": 1, "department": "产品研发中心二部", "name": "封龙飞", "reason": "小程序测试", "duration": 4, "date": "2017-12-14", "place": "公司", "openId": "ofrUf0VAe0gUF2EFEniEBcC-GHUc" },
    //   { "id": 6, "department": "产品研发中心二部", "name": "张也", "reason": "小程序测试", "duration": 4, "date": "2017-12-15", "place": "公司", "openId": "ofrUf0VAe0gUF2EFEniEBcC-GHUc" },
    //   { "id": 7, "department": "产品研发中心二部", "name": "张也", "reason": "小程序测试", "duration": 4, "date": "2017-12-16", "place": "公司", "openId": "ofrUf0VAe0gUF2EFEniEBcC-GHUc" },
    //   { "id": 25, "department": "产品研发中心二部", "name": "李峥", "reason": "小程序测试小程序测试小程序测试小程序测试小程序测试小程序测试", "duration": 4, "date": "2017-12-21", "place": "公司", "openId": "ofrUf0VAe0gUF2EFEniEBcC-GHUc" },
    //   { "id": 33, "department": "产品研发中心二部", "name": "李峥", "reason": "小程序测试", "duration": 4, "date": "2017-12-22", "place": "公司", "openId": "ofrUf0VAe0gUF2EFEniEBcC-GHUc" }
    // ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let monthRecords = [];
    var year = options.year;//获取年
    var month = options.month;//获取月份
    if(month < 10){//月份格式修改
      month = "0" + month;
    }
    var j = 0;
    for (var i = 0; i < 10; i++) {
      var key = year + "-" + month + "-0" + i;
      console.log("key:" + key)
      try {
       var value = wx.getStorageSync(key);
       if(value){
         monthRecords[j++] = JSON.parse(value);
       }
      } catch (e) {
        wx.showModal({
          title: '提示',
          content: '获取' + month + '月数据失败，请重试',
          showCancel: false,
        })
      }
    }
    for (var i = 10; i < 32; i++) {
      var key = year + "-" + month + "-" + i;
      console.log("key:" + key)
      try {
        var value = wx.getStorageSync(key);
        if (value) {
          monthRecords[j++] = JSON.parse(value);
        }
      } catch (e) {
        wx.showModal({
          title: '提示',
          content: '获取' + month + '月数据失败，请重试',
          showCancel: false,
        })
      }
    }
    console.log(monthRecords)
    this.setData({
      records:monthRecords
    })
  },
  //跳转至日详情界面
  goToDetailShow:function(e){
    wx.navigateTo({
      url: '../detailShow/detailShow?date=' + e.currentTarget.dataset.date,
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