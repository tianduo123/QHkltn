// pages/register/register.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从缓存中拿用户微信头像
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.data
        })
      },
    })
  },
  //登录
  register(e) {
    console.log(e)
    wx.request({
      url: api.register(e.detail.value.phone, e.detail.value.password),
      success: (res) => {
        console.log(res)
        if (res.data.status == 0) {
          //失败
          wx.showToast({
            title: '手机号或密码输入错误',
            icon: 'none'
          })
        } else {
          //成功,将用户id和积分存到缓存（用于判断用户是否登录）
          app.globalData.userId = res.data.data.id
          wx.setStorage({
            key: 'userId',
            data: res.data.data.id,
          })
          wx.setStorage({
            key: 'jifen',
            data: res.data.data.score,
          })
          wx.showToast({
            title: '登录成功',
            success: () => {
              setTimeout(() => {
                wx.switchTab({
                  url: '../qiandao/qiandao',
                })
              }, 1500)
            }
          })
        }
      }
    })
  },
  //忘记密码
  forget(){
    //清空用户输入数据
    this.setData({

    })
    wx.navigateTo({
      url: '../reset_psd/reset_psd',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})