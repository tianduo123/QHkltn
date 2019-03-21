// pages/more_rank/more_rank.js
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
      userId:options.userid
    })
    //获取全部排行榜
    wx.request({
      url: api.allRankList(),
      success:(res)=>{
        console.log(res)
        //通过userid,循环排行榜数组，拿到用户排名
        console.log(this.data.userId)
        var userId = this.data.userId;
        var idArr = res.data.map((item)=>{
          return item.id
        })
        console.log(idArr)
        console.log(idArr.indexOf(userId)+1)
        //截取数组4-最后一名
        var newArr = res.data.slice(3)
        console.log(newArr)
        this.setData({
          first:res.data[0],
          second:res.data[1],
          third:res.data[2],
          newArr,
          userRank: idArr.indexOf(userId) + 1
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
    //获取用户微信信息
    wx.getUserInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
    //获取用户积分
    wx.request({
      url: api.getUserScore(this.data.userId),
      success:(res)=>{
        console.log(res)
        this.setData({
          score:res.data.data.score
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