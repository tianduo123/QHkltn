// pages/lianxi/lianxi.js
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSele:true
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


    // wx.getLocation({
    //   type:'gcj02',//返回可以用于wx.openLocation的经纬度  
    //   success: function(res) {
    //     console.log(res)
    //     wx.openLocation({
    //       latitude: 39.905425,
    //       longitude: 116.641587,
    //       name:'通州万达'
    //     })
    //   },
    // })


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