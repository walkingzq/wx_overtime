//获取与微信号绑定的姓名（本地缓存或者远程数据库，return姓名或者""）
export function getUserName(sessionKey) {
  if(wx.getStorageSync("userName")){
    return wx.getStorageSync("userName")
  }else{
    wx.request({
      url: 'https://77205014.qcloud.la/zhaoqing1026/getName',
      method: "POST",
      data: {
        sessionKey:sessionKey
      },
      success:res=>{
        if(res.statusCode == 200){
          console.log("getUserName.js " + res.data)
          //如果name不为空，存入本地缓存
          if(res.data != ""){
            wx.setStorageSync("userName", res.data)
            return res.data
          }
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