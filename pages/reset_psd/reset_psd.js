// pages/register/register.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val: ''
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
  reset(e) {
    console.log(e)
    console.log('确认修改')
    //判断手机号与两次输入的密码是否合法
    if (!(/^1[34578]\d{9}$/.test(e.detail.value.phone))) {
      wx.showToast({
        title: '手机号码有错误，请重新填写',
        icon: 'none'
      })
    } else if (e.detail.value.password != e.detail.value.password2) {
      wx.showToast({
        title: '请确认两次密码是否一致',
        icon: 'none'
      })
    } else {
      console.log('修改成功,清空输入')
      wx.request({
        url: api.resetPsd(e.detail.value.phone, e.detail.value.password),
        success: (res) => {
          console.log(res)
          if (res.data.status == 0) {
            wx.showToast({
              title: res.data.message,
              icon:'none'
            })
          } else {
            wx.showToast({
              title: '修改成功,重新登录吧',
              success: () => {
                this.setData({
                  val: ''
                })
                //返回登录页面
                wx.redirectTo({
                  url: '../register/register',
                })
              }
            })
          }
        }
      })

    }
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