// pages/record/record.js
let api = require('../../request/api.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.API_IMG,
    isShow:false,
    shenhe:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.openid)
    console.log(options)
    this.setData({
      userId:options.userId
    })
    console.log('兑换记录')
    //兑换记录
    wx.request({
      url: api.getLog(app.globalData.openid,options.userId),
      success:(res)=>{
        console.log(res)
        this.setData({
          logList:res.data.re
        })
        //没有兑换记录
        if(res.data.status == 0){
          this.setData({
            isShow:true
          })
        }
      }
    })
  },
  cancel(e){
    console.log(e)
    console.log('取消兑换')
    wx.showModal({
      title: '取消兑换',
      content: '确定取消兑换此商品吗',
      success:(res)=>{
        if(res.confirm){
          //用户点击确定
          wx.request({
            url: api.cancel(e.currentTarget.dataset.id),
            success: (res) => {
              console.log(res)
              if(res.data.status == 1){
                wx.showToast({
                  title: '已提交，待审核',
                  success:()=>{
                    //更新兑换记录状态
                    wx.request({
                      url: api.getLog(app.globalData.openid, this.data.userId),
                      success: (res) => {
                        console.log(res)
                        this.setData({
                          logList: res.data.re
                        })
                      }
                    })
                  }
                })
              }
            }
          })
        }else{
          console.log('用户点击取消')
        }
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
    //兑换记录
    wx.request({
      url: api.getLog(app.globalData.openid, this.data.userId),
      success: (res) => {
        console.log(res)
        this.setData({
          logList: res.data.re
        })
        //没有兑换记录
        if (res.data.status == 0) {
          this.setData({
            isShow: true
          })
        }
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