const app = getApp()//获取app实例

//获取与微信号绑定的姓名（本地缓存或者远程数据库，return姓名或者null）
export function getUserName() {
  if(wx.getStorageSync("userName")){//如果本地缓存有值，读取并返回
    return wx.getStorageSync("userName")
  }else{//否则，从远程服务器获取并存入本地缓存
    wx.request({
      url: 'https://77205014.qcloud.la/zhaoqing1026/getName',
      method: "POST",
      data: {
        sessionKey: wx.getStorageSync("sessionKey")//本js文件中sessionKey()函数
      },
      success:res=>{
        if(res.statusCode == 200){
          console.log("getUserName.js " + res.data)
          //如果name不为空，存入本地缓存并返回
          if(res.data != ""){
            wx.setStorageSync("userName", res.data)
            return res.data
          }
          //否则，返回null
          return null
        }
        console.log("获取用户姓名出错")
        console.log(res.data)
      },
      fail:res=>{
        console.log("获取用户姓名出错")
        return null
      }
    })
  }
}

//获得sessionKey
function getSessionKey(zq){
  console.log("调用getSessionKey")
  wx.checkSession({//检查登录态是否过期
    success:res=>{//登录态未过期时获取本地sessionKey
      console.log("getSessionKey wx.checkSesson success")
      if (null != wx.getStorageSync('sessionKey')) {//如果本地缓存中有值，则直接从缓存中读取并返回
        console.log("本地缓存中有值")
        console.log(wx.getStorageSync('sessionKey'))
        return wx.getStorageSync("sessionKey")
      } else {//否则，重新登录获取sessionKey并存入本地缓存
      console.log("本地缓存中没值")
        wx.login({
          success: res => {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://77205014.qcloud.la/zhaoqing1026/onLogin',
                method: "POST",
                data: {
                  code: res.code
                },
                success: res => {
                  console.log("onLogin结果")
                  console.log(res)
                  if (res.statusCode == 200) {
                    app.globalData.sessionKey = res.data//设定app.globalData.sessionKey
                    wx.setStorageSync('sessionKey', res.data)//将sessionKey存入本地缓存
                    return res.data//返回sessionKey
                  }
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
      }
    },
    fail:res=>{
      console.log("getSessionKey wx.checkSesson fail")
      wx.login({
        success: res => {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://77205014.qcloud.la/zhaoqing1026/onLogin',
              method: "POST",
              data: {
                code: res.code
              },
              success: res => {
                if (res.statusCode == 200) {
                  // app.globalData.sessionKey = res.data//设定app.globalData.sessionKey
                  wx.setStorageSync('sessionKey', res.data)//将sessionKey存入本地缓存
                  return res.data//返回sessionKey
                }
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  })
  
}