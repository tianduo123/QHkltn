// pages/lianxi/lianxi.js
let api = require('../../request/api.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSele:true,
    imgUrl: api.API_IMG
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取幼儿园地址
    wx.request({
      url: api.getAddress(),
      success:(res)=>{
        console.log(res)
        this.setData({
          userInfo:res.data.re,
          latitude: res.data.re.jingweidu.split(',')[0],
          longitude: res.data.re.jingweidu.split(',')[1],

        })
      }
    })
    //获取喵喵老师二维码
    wx.request({
      url: api.getShare(),
      success:(res)=>{
        console.log(res)
        this.setData({
          shareUrl:res.data.re.miaomiao
        })
      }
    })
  },
  //电话咨询函数
  phone(){
    this.setData({
      isSele:true
    })
    wx.makePhoneCall({
      phoneNumber: this.data.userInfo.phone,
    })
  },
  //导航函数
  daohang(){
    console.log(parseFloat(this.data.latitude),this.data.longitude)
    this.setData({
      isSele:false
    })
    wx.openLocation({
      latitude: parseFloat(this.data.userInfo.jingweidu.split(',')[0]),
      longitude:parseFloat(this.data.userInfo.jingweidu.split(',')[1]),
      name: this.data.userInfo.school_name,
      address: this.data.userInfo.address
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