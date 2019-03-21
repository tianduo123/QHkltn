// pages/everyday/everyday.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id
    })
    //获取视频列表
    wx.request({
      url: api.getVideoList(options.id),
      success:(res)=>{
        console.log(res)
        this.setData({
          Vlist:res.data.re
        })
      }
    })

    
  },
  //去视频详情
  toDetail(e){
    console.log(e)
    wx.navigateTo({
      url: `/pages/video_detail/video_detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  //视频播放/继续播放
  play(e){
    console.log('视频开始/继续播放')
    wx.request({
      url: api.addBrowser(e.currentTarget.dataset.id),
      success:(res)=>{
        console.log(res)
      }
    })
  },
  //点赞
  video_zan(e){
    wx.request({
      url: api.video_zan(app.globalData.openid,e.currentTarget.dataset.id),
      success:(res)=>{
        console.log(res)
        wx.showToast({
          title: res.data.msg,
          success:()=>{
            console.log('重新获取点赞数量')
            //获取视频列表
            wx.request({
              url: api.getVideoList(this.data.id),
              success: (res) => {
                console.log(res)
                this.setData({
                  Vlist: res.data.re
                })
              }
            })
          }
        })
      }
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
    wx.request({
      url: api.getVideoList(this.data.id),
      success: (res) => {
        console.log(res)
        this.setData({
          Vlist: res.data.re
        })
      }
    })
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