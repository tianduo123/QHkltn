// pages/video_detail/video_detail.js
let api = require('../../request/api.js')
let app = getApp()
var WxParse = require('../../wxParse/wxParse.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    video_url:api.API_IMG,
    isZan:false,
    val:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      courseid:options.id
    })
    //获取视频详情
    wx.request({
      url: api.getVideiDetail(options.id, app.globalData.openid),
      success:(res)=>{
        console.log(res)
        if(res.data.data.is_zan.is_zan == 0){
          this.setData({
            isZan:false
          })
        }else{
          this.setData({
            isZan:true
          })
        }
        this.setData({
          detail: res.data.data.re,
        })
        var article = this.data.detail.content;
        WxParse.wxParse('article', 'html', article, this, 5);
      }
    })
 
    //获取评论列表
    wx.request({
      url: api.commentList(this.data.courseid),
      success:(res)=>{
        console.log(res)
        this.setData({
          commentList:res.data.re,
          comment:res.data.re.length
        })
      }
    })

  },

  //视频点赞
  video_zan(e){
    console.log("视频点赞")
    wx.request({
      url: api.video_zan(app.globalData.openid, e.currentTarget.dataset.id),
      success:(res)=>{
        console.log(res)
        wx.showToast({
          title: res.data.msg,
        })
        //更新点赞数量
        wx.request({
          url: api.getVideiDetail(this.data.courseid,app.globalData.openid),
          success: (res) => {
            console.log(res)
            this.setData({
              detail: res.data.data.re
            })
          }
        })
      }
    })
  },
  //评论点赞
  comment_zan(e){
    console.log(e)
    wx.request({
      url: api.commentZan(app.globalData.openid,e.currentTarget.dataset.id),
      success:(res)=>{
        console.log(res)
        wx.showToast({
          title: res.data.msg,
        })
        //更新评论列表，用于更新点赞数量
        wx.request({
          url: api.commentList(this.data.courseid),
          success: (res) => {
            console.log(res)
            this.setData({
              commentList: res.data.re
            })
          }
        })
      }
    })
  },
  //评论内容
  getVal(e){
    console.log(e)
    this.setData({
      val:e.detail.value
    })
  },
  //评论
  comment(){
    //判断是否有输入
    if(this.data.val){
      wx.request({
        url: api.comment(app.globalData.openid, this.data.val, this.data.courseid),
        success: (res) => {
          wx.showToast({
            title: '评论成功',
            success:()=>{
              //清空输入
              this.setData({
                val: ''
              })
              //更新评论列表
              wx.request({
                url: api.commentList(this.data.courseid),
                success: (res) => {
                  console.log(res)
                  this.setData({
                    commentList: res.data.re,
                    comment:res.data.re.length
                  })
                }
              })
            }
          })          
        }
      })
    }else{
      wx.showToast({
        title: '请输入内容后在评论哦',
        icon:'none'
      })
    }
  
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