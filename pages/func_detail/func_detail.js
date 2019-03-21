// pages/func_detail/func_detail.js
let app = getApp()
let api = require('../../request/api.js')
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isZan:false,
    // status:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      funcId:options.id
    })
    wx.request({
      url: api.getFuncdetail(options.id,app.globalData.openid),
      success:(res)=>{
        console.log(res)
        if(res.data.is_zan == 0){
          this.setData({
            isZan:false
          })
        }else{
          this.setData({
            isZan:true
          })
        }
        this.setData({
          detail: res.data.re
        })
        var article = this.data.detail.content;
        WxParse.wxParse('article', 'html', article, this, 5);
      }
    })
  },

  //点赞
  like(){
    console.log('点赞+1')
    wx.request({
      url: api.like(this.data.funcId,app.globalData.openid),
      success:(res)=>{
        console.log(res) 
        this.setData({
          isZan:!this.data.isZan,
        })
        wx.showToast({
          title: res.data.msg,
        })
        //重新调用详情接口，更新点赞数量
        wx.request({
          url: api.getFuncdetail(this.data.funcId),
          success: (res) => {
            console.log(res)
            this.setData({
              detail: res.data.re
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