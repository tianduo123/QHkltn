// pages/getgoods/getgoods.js
let api = require('../../request/api.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.API_IMG
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userId:options.userId
    })
    //获取兑换商品列表
    wx.request({
      url: api.goodsList(),
      success:(res)=>{
        console.log(res)
        this.setData({
          goodsList:res.data.re
        })
      }
    })
  },
  //兑换商品
  getGood(e){
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '您确定要兑换此商品吗',
      success:(res)=>{
        if(res.confirm){
          //点击了确定，调兑换接口
          console.log('兑换')
          wx.request({
            url: api.getGoods(app.globalData.openid,this.data.userId,e.currentTarget.dataset.id,e.currentTarget.dataset.num),
            success:(res)=>{
              console.log(res)
              if(res.data.status==1){
                wx.showToast({
                  title: '兑换成功',
                })
                //兑换成功后更新累计兑换数据
                wx.request({
                  url: api.goodsList(),
                  success: (res) => {
                    console.log(res)
                    this.setData({
                      goodsList: res.data.re
                    })
                  }
                })
              }else{
                wx.showToast({
                  title: res.data.message,
                  icon:'none'
                })
              }
            }
          })
       
        }else{
          //点击了取消
        }
      }
    })
  },
  //兑换记录
  torecord(){
    wx.navigateTo({
      url: `../record/record?userId=${this.data.userId}`,
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