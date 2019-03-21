// pages/message/message.js
let api = require('../../request/api.js')
let app = getApp()
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
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userId:options.userId
    })
  },
  //获取用户输入数据
  getVal(e){
    console.log(e)
    this.setData({
      userVal:e.detail.value
    })
  },
  //提交建议
  submit(){
    console.log('提交',this.data.userVal)
    wx.request({
      url: api.submit(app.globalData.openid,this.data.userId,this.data.userVal),
      success:(res)=>{
        console.log(res)
       if(res.data.status==1){
         //提交成功
         wx.showToast({
           title: '提交成功',
           success:()=>{
             this.setData({
               val:'',
               userVal:''
             })
             setTimeout(()=>{
               wx.switchTab({
                 url: '../qiandao/qiandao',
               })
             },1500)
           }
         })
       }else{
         wx.showToast({
           title: res.data.msg,
           icon:'none'
         })
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