// pages/me/me.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //积分排行榜
    wx.request({
      url: api.rankList(),
      success:(res)=>{
        console.log(res)
        this.setData({
          first:res.data.re[0],
          second: res.data.re[1],
          third: res.data.re[2],
          fourth: res.data.re[3],
          fifth: res.data.re[4],
        })
      }
    })
    //留言板
    wx.request({
      url: api.message(),
      success:(res)=>{
        console.log(res)
        this.setData({
          msgList: res.data.comment
        })
      }
    })
  },
  //查看全部排行榜
  toMore(){
    wx.navigateTo({
      url: `../more_rank/more_rank?userid=${app.globalData.userId}`,
    })
  },
  //积分兑换
  jifen(){
    //判断用户是否登录，登录-->跳转积分兑换页面。未登录-->判断用户是否注册
    //从app.js中拿用户id用于判断用于判断用户是否登录
    console.log(app.globalData.userId)
    if(app.globalData.userId){
      //已登录 --> 跳转积分兑换页面
      wx.navigateTo({
        url: '../getgoods/getgoods',
      })
    }else{
      //未登录 --> 判断用户是否注册
      //判断用户是否注册
      wx.request({
        url: api.isLogin(app.globalData.openid),
        success: (res) => {
          console.log(res)
          if (res.data.status == 0) {
            //用户未注册，跳转注册界面
            wx.navigateTo({
              url: '../login/login',
            })
          } else {
            //用户已注册，跳转登录界面
            wx.reLaunch({
              url: '../register/register',
            })
          }
        }
      })
    }
  },
  //每日签到
  qiandao(){
    //判断用户是否登录，登录-->跳转积分兑换页面。未登录-->判断用户是否注册
    //从app.js中拿用户id用于判断用于判断用户是否登录
    console.log(app.globalData.userId)
    if (app.globalData.userId) {
      //已登录 --> 跳转积分兑换页面
      wx.navigateTo({
        url: '../qiandao/qiandao',
      })
    } else {
      //未登录 --> 判断用户是否注册
      //判断用户是否注册
      wx.request({
        url: api.isLogin(app.globalData.openid),
        success: (res) => {
          console.log(res)
          if (res.data.status == 0) {
            //用户未注册，跳转注册界面
            wx.navigateTo({
              url: '../login/login',
            })
          } else {
            //用户已注册，跳转登录界面
            wx.reLaunch({
              url: '../register/register',
            })
          }
        }
      })
    }
  },
  toMessage(){
    wx.navigateTo({
      url: '../message/message',
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
    //获取用户信息
    wx.getUserInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
    //调接口拿用户积分
    wx.request({
      url: api.getUserScore(app.globalData.userId),
      success:(res)=>{
        console.log(res)
        this.setData({
          score:res.data.data.score
        })
      }
    })
    //从缓存中拿用户积分
  //   wx.getStorage({
  //     key: 'jifen',
  //     success:(res)=>{
  //       console.log(res)
  //       this.setData({
  //         score:res.data
  //       })
  //     },
  //   })
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