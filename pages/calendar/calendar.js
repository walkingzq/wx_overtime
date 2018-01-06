// pages/calendar/calendar.js
import { getUserName } from '../../utils/getUserName.js';
'use strict';
const app = getApp()//获取app实例

let choose_year = null,
choose_month = null;
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    hasUserName:false,//是否绑定姓名
    userName: null,
  },
  //加载按钮动作：从服务器加载数据到本地
  download:function(e) {
    wx.showLoading({//显示加载动画
      title: '正在加载ing...',
    })
    const date1 = new Date();
    var cur_year = this.data.cur_year;
    var cur_month = this.data.cur_month;
    var cur_day = date1.getDate();

    //日期修改
    if(cur_day < 10){
      cur_day = "0" + cur_day;
    }
    //月份修改
    if(cur_month < 10){
      cur_month = "0" + cur_month;
    }
    const date = cur_year + "-" + cur_month + "-" + cur_day;
    this.deleteStorage(cur_year, cur_month);//清除该月本地缓存，防止出现与数据库记录不一致的情况（本地缓存有而数据库没有）
    var that = this;
    wx.request({
      url: 'https://77205014.qcloud.la/form-1.0.3/download?date=' + date,
      method: "GET",
      header: {
        'Session-Key':wx.getStorageSync("sessionKey")
      },
      success: function (res) {//成功调用接口
        console.log(res)
        if(res.statusCode == "200"){//服务器成功响应
          var records = res.data;
          for(var i=0;i<records.length;i++){
            console.log(records[i].date)
            records[i].duration = records[i].duration / 0.5 - 1;
            wx.setStorageSync(records[i].date, JSON.stringify(records[i]));
            // setTimeout(that.calculateDays(cur_year, cur_month), 100)
            // that.calculateDays(cur_year, cur_month);
          }
          that.calculateDays(cur_year, cur_month);
          wx.hideLoading();//关闭加载动画
          wx.showToast({//加载成功动画
            title: '加载成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  //跳转按钮动作：跳转至月总览页面
  goToMonthOverView:function(e){
    wx.navigateTo({
      url: '../monthOverView/monthOverView?year=' + this.data.cur_year + "&month=" + this.data.cur_month,
    })
  },
  onShow:function() {
    this.setHasUserName();//设定hasUserNam变量
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);//设置不显示的上个月天数
    this.calculateDays(cur_year, cur_month);//设置本月哪些日期有值
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    });
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  //设置hasName变量
  setHasUserName(){
    console.log("calendar.js1:" + this.data.userName)
    if (wx.getStorageSync("userName") && wx.getStorageSync("userName") != ""){
      this.setData({
        userName: wx.getStorageSync("userName"),
        hasUserName: true
      })
    }
  },
  //显示在当前页面的上月天数
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  //清除某年某月的本地缓存
  //传入month:必须是两位数，ie.09,12
  deleteStorage(year, month){
    for (var i = 0; i < 10; i++) {
      var key = year + "-" + month + "-0" + i;
      try {
        wx.removeStorageSync(key)
      } catch (e) {
        wx.showModal({
          title: '提示',
          content: '清除' + month + '月缓存失败，请重试',
          showCancel:false,
        })
      }
    }
    for (var i = 10; i < 32; i++) {
      var key = year + "-" + month + "-" + i;
      try {
        wx.removeStorageSync(key)
      } catch (e) {
        wx.showModal({
          title: '提示',
          content: '清除' + month + '月缓存失败，请重试',
          showCancel: false,
        })
      }
    }
    console.debug('清除' + month + '月缓存成功')
  },
  //设置本月天数的有值状态
  calculateDays(year, month) {
    console.log("刷新日期状态")
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      //组装本地缓存key值
      // 如果日期为1-9日，则在日期前加一个0
      if(i<10){
        var d = "0" + i;
      }else{
        d = i
      }
      // 如果月份为1-9月，则在月份前加一个0并组装key值
      var key = year + '-' + month + '-' + d;
      // console.debug(parseInt(month))
      if (parseInt(month) < 10) {
        key = year + '-0' + parseInt(month) + '-' + d;
      }

      //查询本地缓存，若有值，则将该日期的choosed设定为true；否则，设为false
      try{
        var value = wx.getStorageSync(key);
        console.log(key);
        if (value) {
          console.debug(key + "有值")
          days.push({
            day: i,
            choosed: true
          });
        } else {
          days.push({
            day: i,
            choosed: false
          });
        }
      }catch(e){
        console.error("获取本地缓存出错：" + e)
      }
    }

    this.setData({
      days
    });
    // console.debug(days)
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
    }
  },
  //点击某一日期时，如果该日期有提交记录，进入该日期的详情界面；否则，进入提交信息界面。
  tapDayItem(e) {
    const idx = e.currentTarget.dataset.idx;
    const days = this.data.days;

    // 如果日期为1-9日，则在日期前加一个0
    var d = parseInt(idx) + 1;
    if (d < 10) {
      var d = "0" + d;
    }

    //如果月份为1-9月，则在月份前加一个0
    var value = this.data.cur_year + '-' + this.data.cur_month + '-' + d;
    if (parseInt(this.data.cur_month) < 10) {
      value = this.data.cur_year + '-0' + this.data.cur_month + '-' + d;
    }

    if(days[idx].choosed){
      if(this.data.hasUserName){
        wx.navigateTo({
          url: '../detailShow/detailShow?date=' + value,
          // + "&userName=" + this.data.userName,
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '您还没有绑定姓名，请先在首页绑定姓名后再提交加班信息',
          showCancel:false,
          //点击确认按钮跳转至主页
          success:res=>{
            wx.switchTab({
              url: '../index/index',
            })
          },
          fail:res=>{
            console.log("calendar.js模态窗口出错")
          }
        })
      }
    }else{
      if(this.data.hasUserName){
        wx.navigateTo({
          url: '../form/form?date=' + value + "&userName=" + this.data.userName,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您还没有绑定姓名，请先在首页绑定姓名后再提交加班信息',
          showCancel: false,
          //点击确认按钮跳转至主页
          success: res => {
            wx.switchTab({
              url: '../index/index',
            })
          },
          fail: res => {
            console.log("calendar.js模态窗口出错")
          }
        })
      }
    }
  },
  chooseYearAndMonth() {
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    let picker_year = [],
      picker_month = [];
    for (let i = 1900; i <= 2100; i++) {
      picker_year.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      picker_month.push(i);
    }
    const idx_year = picker_year.indexOf(cur_year);
    const idx_month = picker_month.indexOf(cur_month);
    this.setData({
      picker_value: [idx_year, idx_month],
      picker_year,
      picker_month,
      showPicker: true,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    choose_year = this.data.picker_year[val[0]];
    choose_month = this.data.picker_month[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.cur_year = choose_year;
      o.cur_month = choose_month;
      this.calculateEmptyGrids(choose_year, choose_month);
      this.calculateDays(choose_year, choose_month);
    }

    this.setData(o);
  },
  onShareAppMessage() {
    return {
      title: 'CTSI加班助手',
      desc: '加班信息统计',
      path: 'pages/index/index'
    };
  }
};

Page(conf);
