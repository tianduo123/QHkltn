let api = require('../../request/api.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     imgurl:api.API_IMG,
    //  isShow:true,
     val:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从缓存中拿用户userInfo数据
    wx.getStorage({
      key: 'userInfo',
      success:(res)=>{
        console.log('拿到授权信息')
        //拿到用户微信信息 --> 不显示授权蒙层
        this.setData({
          isShow:false
        })
      },
      fail:(res)=>{
        console.log('没拿到授权信息')
        //没拿到用户微信信息 --> 显示授权蒙层
        this.setData({
          isShow:true
        })
      }
    })
    //获取用户经纬度（显示附近商家需要）
    wx.getLocation({
      success:(res)=>{
        console.log(res)
        this.setData({
          lat:res.latitude,
          lon:res.longitude
        })
        //拿到用户经纬度获取附近商家列表
        wx.request({
          url:api.nearList(res.latitude,res.longitude),
          success:(res)=>{
            console.log(res)
            this.setData({
              near:res.data
            })
          }
        }) 
      },
    })
    //获取屏幕高度（显示用户授权蒙层需要）
    wx.getSystemInfo({
      success:(res) =>{
        console.log(res.screenHeight)
        this.setData({
          Height:res.screenHeight
        })
        app.globalData.Height = res.screenHeight
      },
    })
    //获取首页轮播
    wx.request({
      url: api.getBanner(),
      success:(res)=>{
        console.log(res)
        this.setData({
          bannerList : res.data.re
        })
      }
    })
    //获取每日即时看8个导航按钮
    wx.request({
      url: api.getTab(),
      success:(res)=>{
        console.log(res)
        this.setData({
          tabList:res.data.re
        })
      }
    })
    //获取身临其境视频列表
    wx.request({
      url: api.getFunctional(),
      success:(res)=>{
        console.log(res)
        this.setData({
          functionalList:res.data.re
        })
      }
    })
  },
  //附近商家
  tonear(){
 
    //获取用户的授权状态
    wx.getSetting({
      success:(res)=>{
        //判断scope.userLocation是否为true
        console.log(res)
        if(res.authSetting["scope.userLocation"]){
          //如果授权过直接跳转附近商家列表
          wx.navigateTo({
            url: `../near/near?lat=${this.data.lat}&lon=${this.data.lon}`,
          })
        }else{
          //用户没有授权，引导用户授权
          wx.openSetting({
            success: (res) => {
              console.log(res)
              wx.getLocation({
                success:(res)=>{
                  console.log(res)
                  this.setData({
                    lat:res.latitude,
                    lon:res.longitude
                  })
                  wx.navigateTo({
                    url: `../near/near?lat=${res.latitude}&lon=${res.longitude}`,
                  })
                  //拿到用户经纬度获取附近商家列表
                  wx.request({
                    url: api.nearList(res.latitude, res.longitude),
                    success: (res) => {
                      console.log(res)
                      this.setData({
                        near: res.data
                      })
                      console.log(this.data.near)
                    }
                  }) 
                },
              })
            }
          })
        }
      }
    })
 
  },
  //获取用户信息
  getUserInfo(res){
    console.log(res)
    if (res.detail.rawData){
      //将用户信息存到缓存
      wx.setStorage({
        key: 'userInfo',
        data: res.detail.userInfo,
      })
      this.setData({
        isShow:false
      })
      //调用接口保存用户授权信息
      wx.request({
        url: api.saveUser(app.globalData.openid, res.detail.userInfo.nickName, res.detail.userInfo.avatarUrl),
        success:(res)=>{
          console.log(res)
        }
      })
    }
  },

  //每日即时看
  toVideoDetail(e){
    console.log('点击了每日即时看',e)
    wx.navigateTo({
      url: `/pages/everyday/everyday?id=${e.currentTarget.dataset.id}`,
    })
  },
  //商品详情
  toGoodsDetail(e){
    console.log(e)
    wx.navigateTo({
      url: `/pages/goods_detail/goods_detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  //点击身临其境
  toFuncdetail(e){
    console.log('身临其境',e)
    //对应的评论列表
    wx.request({
      url: api.commentList2(e.currentTarget.dataset.id),
      success:(res)=>{
        console.log(res)
        this.setData({
          list:res.data.re
        })
      }
    })
    //对应的浏览、点赞数量
    wx.request({
      url: api.getZan(e.currentTarget.dataset.id),
      success:(res)=>{
        console.log(res)
        this.setData({
        browser: res.data.re.browser,
        zan: res.data.re.zan
        })
      }
    })
    this.setData({
      Vshow:true,
      src:e.currentTarget.dataset.src,
      id:e.currentTarget.dataset.id
    })
  },
  //身临其境点赞
  video_zan(e){
    console.log('点赞',this.data.id)
    wx.request({
      url: api.like2(app.globalData.openid,this.data.id),
      success:(res)=>{
        console.log(res)
        wx.showToast({
          title: res.data.msg,
          //点赞/取消点赞后更新点赞数量
          success:()=>{
            wx.request({
              url: api.getZan(this.data.id),
              success:(res)=>{
                console.log(res)
                this.setData({
                  zan:res.data.re.zan
                })
              }
            })
          }
        })
      }
    })
  },
  //关闭
  close(){
    this.setData({
      Vshow:false
    })
    //获取身临其境视频列表
    wx.request({
      url: api.getFunctional(),
      success: (res) => {
        console.log(res)
        this.setData({
          functionalList: res.data.re
        })
      }
    })
  },
  //评论
  comment(){
    console.log('评论',this.data.val)
    //判断评论内容是否合法
    if(this.data.val){
      wx.request({
        url: api.comment2(app.globalData.openid, this.data.val, this.data.id),
        success: (res) => {
          console.log(res)
          if (res.data.status == 1) {
            //评论成功
            wx.showToast({
              title: '评论成功',
              success: () => {
                //清空输入
                this.setData({
                  val: ''
                })
                //刷新评论列表
                wx.request({
                  url: api.commentList2(this.data.id),
                  success: (res) => {
                    console.log(res)
                    this.setData({
                      list: res.data.re
                    })
                  }
                })
              }
            })
          }
        }
      })    
    } else {
      wx.showToast({
        title: '您还没有输入内容哦',
        icon: 'none'
      })
    }
  
  },
  //获取用户评论内容
  getVal(e){
    console.log(e)
    this.setData({
      val:e.detail.value
    })
  },
  //播放/继续播放，增加浏览量
  play(){
    console.log('播放')
    //调用增加浏览量数量接口
    wx.request({
      url: api.addBrowser2(this.data.id),
      success:(res)=>{
        console.log(res)
        //更新浏览数量
        wx.request({
          url: api.getZan(this.data.id),
          success: (res) => {
            console.log(res)
            this.setData({
              browser: res.data.re.browser,
            })
          }
        })
      }
    })
  },
  //
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})