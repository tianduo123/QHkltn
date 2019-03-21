// pages/login/login.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '获取验证码',
    timer_num: 60,
    val:'',
    val2:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从缓存中拿用户微信头像
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.data
        })
      },
    })
  },
  //获取用户姓名
  getName(e) {
    console.log(e)
  },
  //获取注册手机号
  getPhone(e) {
    console.log(e)
    this.setData({
      phone: e.detail.value
    })
    app.globalData.userPhone = e.detail.value
  },
  //获取用户输入验证码
  userCode(e){
    console.log(e.detail.value.length)
    //输入手机号和验证码后高亮显示注册按钮
    if(this.data.phone&&e.detail.value.length==4){
      console.log('用户输入手机号&&验证码是4位数')
      this.setData({
        isLogin:true
      })
    }else{
      this.setData({
        isLogin:false
      })
    }
  },
  //获取验证码
  getcode() {
    //判断用户手机号是否合法
    if ((!(/^1[34578]\d{9}$/.test(this.data.phone)))){
      wx.showToast({
        title: '手机号输入有误',
        icon: 'none'
      })
    } else if (this.data.msg == '获取验证码') {
      this.setData({
        msg: '已发送'
      })
      //启动定时器     
      var timer = setInterval(() => {
        this.setData({
          timer_num: this.data.timer_num - 1
        })
        console.log(this.data.timer_num)
        if (this.data.timer_num == 0) {
          //关闭定时器
          clearInterval(timer)
          console.log('关闭定时器')
          this.setData({
            msg:'获取验证码',
            timer_num:60
          })
        }
      }, 1000)
      //发短信
      wx.request({
        url: api.getcode(this.data.phone),
        success: (res) => {
          console.log(res)
          this.setData({
            code: res.data.code
          })
        }
      })
    } else {
      console.log('验证码已发送')
      return
    }

  },
  //注册
  login(e) {
    console.log(e)
    //前端判断用户输入验证码是否正确
    if(this.data.code == e.detail.value.usercode){
      //输入正确 --> 调注册接口
      wx.request({
        url: api.login(app.globalData.openid, e.detail.value.phone),
        success: (res) => {
          console.log(res)
          //判断是否是新用户
          if(res.data.first==0){
            //新用户
            console.log('新用户，赠送积分')
            app.globalData.newP = true,
            app.globalData.score = res.data.num
          }else{
            //老用户
            console.log('老用户，不赠送积分')
          }
          if(res.data.status == 1){
            //注册成功，将userId存到缓存
            wx.setStorage({
              key: 'userId',
              data: res.data.data,
              success:()=>{
                console.log('存储成功')
              },
              fail:()=>{
                console.log('存储失败')
              }
            })
            wx.showToast({
              title: '注册成功',
              success:()=>{
                setTimeout(()=>{
                  console.log('跳转到签到页面')
                  wx.switchTab({
                    url: `../qiandao/qiandao`,
                  })
                  this.setData({
                    val: '',
                    val2: ''
                  })
                },1500)
                
              }
            })
          }
        }
      })
    }else{
      //输入错误 --> 提示
      wx.showToast({
        title: '验证码错误，请重新输入',
        icon:'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})