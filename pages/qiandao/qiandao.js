// pages/qiandao/qiandao.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,
    isqiandao:false, 
    show:'none',
    show2:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      Height:app.globalData.Height
    })
    console.log(options)
    //获取精选留言板
    wx.request({
      url: api.message(),
      success:(res)=>{
        console.log(res)
        this.setData({
          msgList:res.data.comment
        })
      }
    })
  },
  //签到
  qiandao(){
    console.log(this.data.userId)
    if(this.data.userId){
      //已绑定手机号，直接签到
      wx.request({
        url: api.qiandao(app.globalData.openid, this.data.userId),
        success: (res) => {
          if (res.data.status == 1) {
            wx.showToast({
              title: '签到成功',
            })
            this.setData({
              days: res.data.re.sign_day,
              isqiandao: true,
            })
            //将签到状态存入缓存，onShow取缓存用于判断显示签到与红包样式
            wx.setStorage({
              key: 'isqiandao',
              data: res.data.status,
              success: function (res) {
                console.log('存储签到状态成功')
              },
            })
            //将签到天数存入缓存，onShow取缓存用于显示连续签到天数
            wx.setStorage({
              key: 'days',
              data: res.data.re.sign_day,
              success: function (res) {
                console.log('存储签到天数成功')
              },
              fail: function (res) { },
              complete: function (res) { },
            })
            //更新用户成长豆
            wx.request({
              url: api.getUserScore(this.data.userId),
              success: (res) => {
                console.log(res)
                this.setData({
                  score: res.data.data.score
                })
              }
            })
          } else {
            console.log('今日已签到')
          }
          console.log(res)

        }
      })
    }else{
      //未绑定手机号，提示用户去绑定
      // wx.showToast({
      //   title: '请绑定手机号后再进行该操作',
      //   icon: 'none'
      // })
      wx.showModal({
        title: '需注册手机号才能进行该操作',
        content: '是否现在注册',
        success:(res)=>{
          if(res.confirm){
            //用户点击了确定，跳转绑定手机号页面
            console.log('用户点击了确定')
            wx.navigateTo({
              url: '../login/login',
            })
          }else{
            console.log('用户点击了取消')
          }
        }
      })
    }
  },
  //绑定手机号(注册)
  toLogin(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //积分兑换
  jifen(){
    console.log(this.data.userId)
    //onShow每次都将userId setData,判断data中有没有userId
    if(this.data.userId){
      wx.navigateTo({
        url: `../getgoods/getgoods?userId=${this.data.userId}`,
      })
    }else{
      //没有拿到userId，提示用户去手机号
      wx.showModal({
        title: '需注册手机号才能进行该操作',
        content: '是否现在注册',
        success:(res)=>{
          if(res.confirm){
            //用户点击了确定，跳转绑定手机号页面
            console.log('确定')
            wx.navigateTo({
              url: '../login/login',
            })
          }else{
            console.log('用户点击了取消')
          }
        }
      })
    }
  },
  //查看成长豆排行榜
  toMore() {
    if(this.data.userId){
      wx.navigateTo({
        url: `../more_rank/more_rank?userid=${this.data.userId}`,
      })
    }else{
      //没有绑定手机号 提示用户绑定
      wx.showModal({
        title: '需注册手机号后才能进行该操作',
        content: '是否现在注册',
        success:(res)=>{
          if(res.confirm){
            //用户点击了确定，跳转绑定手机号页面
            console.log('确定')
            wx.navigateTo({
              url: '../login/login',
            })
          }else{
            console.log('用户点击了取消')
          }
        }
      })
    }
 
  },
  //成长豆规则
  rule(){
    //获取成长豆规则
    wx.request({
      url: api.getRule(),
      success:(res)=>{
        console.log(res)
        var ruleList = res.data.re.content.split(';')
        console.log(ruleList)
        this.setData({
          ruleList
        })
      }
    })
    this.setData({
      isShow:true
    })
  },
  //关闭规则
  close(){
    this.setData({
      isShow:false
    })
  },
  //成长豆明细
  toScoreDetail(){
    console.log('成长豆明细')
    wx.navigateTo({
      url: `../scroe_detail/score_detail?userId=${this.data.userId}`,
    })
  },
  //输入推荐人手机号
  getPhone(e){
    console.log(e)
    this.setData({
      tjphone:e.detail.value
    })
  },
  //确定推荐人手机号
  tjphone(){
   console.log('确定推荐人手机号')
   //判断手机号是否合法&&判断手机号是否为用户绑定手机号
    if (!(/^1[34578]\d{9}$/.test(this.data.tjphone))){
      wx.showToast({
        title: '手机号码错误',
        icon:'none'
      })
    }else if(this.data.tjphone==app.globalData.userPhone){
      wx.showToast({
        title: '推荐人不能填自己哦',
        icon:'none'
      })
    }else{
      wx.request({
        url: api.tuijian(this.data.tjphone,this.data.userId),
        success: (res) => {
          console.log(res.data.re.status)
          if(res.data.re.status == 1){
            //填写推荐人成功 
            wx.showToast({
              title: '成功',
              //成功后需隐藏输入input
              success:()=>{
                this.setData({
                  show:'none',
                  isMake:'none'
                })
              }
            })
          }else if(res.data.re.status == 3){
            //输入的推荐人无效(没有在平台绑定过手机号)
            wx.showToast({
              title: '输入的推荐手机号无效',
              icon:'none'
            })
          }else if(res.data.re.status == 4){
            //输入手机号无效
            wx.showToast({
              title: '手机号码错误',
              icon: 'none'
            })
          }else{
            //未知错误
            wx.showToast({
              title: '未知错误',
              icon: 'none'
            })
          }
        }
      })
    }

  },
  //领取分享积分
  getScore1(){
    console.log('领取分享积分') 
    wx.request({
      url: api.getScore(app.globalData.openid,this.data.userId,this.data.share.score,0),
      success:(res)=>{
        console.log(res)
        if(res.data.status==1){
          wx.showToast({
            title: '领取成功',
            //领取成功后
            success:()=>{
              this.setData({
                share:false,
                get1:true
              }),
              //重新获取用户积分
                wx.request({
                  url: api.getUserScore(this.data.userId),
                  success: (res) => {
                    console.log(res)
                    this.setData({
                      score: res.data.data.score
                    })
                  }
                })
            }
          })
        }
      }
    })   
  },
  
  //领取提建议积分
  getScore3(){
    console.log('领取提建议积分')
    wx.request({
      url: api.getScore(app.globalData.openid,this.data.userId,this.data.comment.score,3),
      success:(res)=>{
        console.log(res)
        if(res.data.status==1){
          wx.showToast({
            title: '领取成功',
            success:()=>{
              //领取成功后改变样式
              this.setData({
                comment:false,
                get3:true
              })
              //重新获取用户积分
              wx.request({
                url: api.getUserScore(this.data.userId),
                success: (res) => {
                  console.log(res)
                  this.setData({
                    score: res.data.data.score
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  
  //去完成-->分享小程序
  complete1(){
    console.log('分享小程序')
  },
  //去完成-->推荐人
  complete2(){
    console.log('推荐人')
    if (this.data.userId) {
      //判断当前用户是否填写过推荐人
      wx.request({
        url: api.isMake(this.data.userId),
        success: (res) => {
          console.log(res)
          if (res.data.re == 0) {
            // 0 --> 当前用户未填写过推荐人 --> 显示推荐人input
            this.setData({
              show: ''
            })
          } else {
            //当前用户已经填写过推荐人 --> 提示不能再填写
            wx.showToast({
              title: '您已经填写过推荐人啦',
              icon: 'none'
            })
          }
        }
      })
    } else {
      //没有拿到userId，提示用户去手机号
      wx.showModal({
        title: '需注册手机号才能进行该操作',
        content: '是否现在注册',
        success: (res) => {
          if (res.confirm) {
            //用户点击了确定，跳转绑定手机号页面
            console.log('确定')
            wx.navigateTo({
              url: '../login/login',
            })
          } else {
            console.log('用户点击了取消')
          }
        }
      })
    }

  },
  //去完成-->提建议
  complete3() {

    if (this.data.userId) {
      wx.navigateTo({
        url: `../message/message?userId=${this.data.userId}`,
      })
    } else {
      //没有拿到userId，提示用户去手机号
      wx.showModal({
        title: '需绑定手机号才能进行该操作',
        content: '是否现在绑定',
        success: (res) => {
          if (res.confirm) {
            //用户点击了确定，跳转绑定手机号页面
            console.log('确定')
            wx.navigateTo({
              url: '../login/login',
            })
          } else {
            console.log('用户点击了取消')
          }
        }
      })
    }
    
  
  },
  //留言
  toMsg() {

    if (this.data.userId) {
      wx.navigateTo({
        url: `../message/message?userId=${this.data.userId}`,
      })
    } else {
      //没有拿到userId，提示用户去手机号
      wx.showModal({
        title: '需绑定手机号才能进行该操作',
        content: '是否现在绑定',
        success: (res) => {
          if (res.confirm) {
            //用户点击了确定，跳转绑定手机号页面
            console.log('确定')
            wx.navigateTo({
              url: '../login/login',
            })
          } else {
            console.log('用户点击了取消')
          }
        }
      })
    }


  },
  //领取新人积分
  getNewScore(){
    console.log('新人积分')
    wx.request({
      url: api.getNscore(this.data.userId,app.globalData.score),
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          wx.showToast({
            title: '领取成功',
            success:()=>{
              //更新用户积分
              wx.request({
                url: api.getUserScore(this.data.userId),
                success: (res) => {
                  console.log(res)
                  this.setData({
                    score: res.data.data.score
                  })
                }
              })
            }
          })
        }
      }
    })
    app.globalData.newP = false
    this.setData({
      isNew:false
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
    //从缓存中拿userId
    wx.getStorage({
      key: 'userId',
      success:(res)=>{
        console.log(res)
        this.setData({
          userId:res.data,
          // show:false
        })


        //每次进入判断用户是否签到!!
        wx.request({
          url: api.isQiandao(app.globalData.openid, this.data.userId),
          success: (res) => {
            console.log(res)
            if (res.data.status == 0) {
              //今日未签到
              this.setData({
                isqiandao: false
              })
            }
            else {
              console.log('今日已签到')
              this.setData({
                isqiandao: true
              })

            }
          }
        })
        //每次需重新获取用户成长豆!!
        wx.request({
          url: api.getUserScore(this.data.userId),
          success: (res) => {
            console.log(res)
            this.setData({
              score: res.data.data.score
            })
          }
        })
        //每次进入判断成长豆任务是否完成!!
        wx.request({
          url: api.isDone(app.globalData.openid, this.data.userId),
          success: (res) => {
            console.log(res)
            this.setData({
              comment: res.data.comment,
              share: res.data.share,
              tuijian: res.data.tuijian,
              xuefei:res.data.xue
            })
          }
        })
        //每次进入判断分享与提建议任务是否完成
        wx.request({
          url: api.isGet(app.globalData.openid,this.data.userId),
          success:(res)=>{
            console.log(res)
            if(res.data.comment == 1){
              this.setData({
                get3:true
              })
            }
            
            if(res.data.share == 1){
                console.log('今日已完成分享任务')
                this.setData({
                  get1:true
                })
            }
          }
        })
        //每次进入判断是否填写过推荐人
        wx.request({
          url: api.isMake(this.data.userId),
          success:(res)=>{
            console.log(res)
            if(res.data.re == 1){
              this.setData({
                isMake:'none'
              })
            }
          }
        })
      },
    })
    //从缓存中获取用户微信信息
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.data
        })
      },
    })
    //从缓存中拿签到状态!!
    wx.getStorage({
      key: 'isqiandao',
      success:(res)=>{
        console.log(res)
        if(res.data==0||1){
          this.setData({
            isqiandao:true
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    //从缓存中拿连续签到天数!!
    wx.getStorage({
      key: 'days',
      success:(res)=>{
        console.log(res)
        this.setData({
          days:res.data
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    //判断是否是新用户
    console.log(app.globalData.newP)
    if(app.globalData.newP){
      this.setData({
        isNew:true
      })
    }  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    // console.log(event)
    console.log('转发啦哈哈哈！！！')
    //监听用户分享，调取接口获得积分
    wx.request({
      url: api.share(app.globalData.openid,this.data.userId),
      success:(res)=>{
        console.log(res)
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

})