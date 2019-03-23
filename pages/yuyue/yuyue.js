// pages/yuyue/yuyue.js
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val:'',
    name1:'',
    tel:'',
    name2:'',
    imgurl:api.API_IMG
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取预约页面顶部图片
    wx.request({
      url: api.getImg(),
      success:(res)=>{
        console.log(res.data.re.image)
        this.setData({
          imageurl:res.data.re.image
        })
      }
    })
  },
  //选择日期函数
  binddatechange(e){
    console.log(e)
    this.setData({
      val:e.detail.value
    })
  },
  //预约咨询函数
  tijiao(e){
    console.log(e)
    //判断时间、姓名、手机号是否合法
    if(!e.detail.value.time){
      wx.showToast({
        title: '请选择时间',
        icon:'none'
      })
    }else if(!e.detail.value.name.trim()){
      wx.showToast({
        title: '请输入姓名',
        icon:'none'
      })
    } else if (!(/^1[34578]\d{9}$/.test(e.detail.value.phone))){
      wx.showToast({
        title: '手机号输入有误',
        icon:'none'
      })
    }else{
      //调取预约接口，成功后执行以下代码
      wx.request({
        url: api.yuyue(e.detail.value.name,e.detail.value.phone,e.detail.value.time),
        success:(res)=>{
          console.log(res)
          wx.showToast({
            title: '预约成功',
          })
          //预约成功后清空输入框
          this.setData({
            val: '',
            name1: '',
            tel: '',
            name2: ''
          })
        }
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