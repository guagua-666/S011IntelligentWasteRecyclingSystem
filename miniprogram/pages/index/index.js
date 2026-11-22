const db=wx.cloud.database();
const app = getApp();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
  dataObj: [],
  },
        // 获取用户信息
        onGetOpenid: function() {
          var that=this
          // 调用云函数
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              // console.log('openid:', res.result.openid)
              app.globalData.openid = res.result.openid
              that.setData({
                openid:getApp().globalData.openid
              })
              wx.setStorageSync('openid',that.data.openid)
              db.collection("Users").where({
                _openid:wx.getStorageSync('openid')
              }).get().then(res=>{
                if(res.data.length){
                  // console.log("用户存在")
                  that.setData({
                    Swh:true,
                    userInfo:res.data[0].userInfo
                  })
                  wx.setStorageSync('id',res.data[0]._id)
                  wx.setStorageSync('jifen',res.data[0].jifen)
                  wx.setStorageSync('userInfo', res.data[0].userInfo)
                  wx.setStorageSync('Swh',that.data.Swh)
                }
                else{
                  wx.setStorageSync('Swh',that.data.Swh)
                }
              })
            },
            fail: err => {
              console.error('调用失败', err)
            }
          })
        },
// 获取数据
  getWork(){
    this.setData({
        dataObj:""
    })
    db.collection("Work").orderBy("_updateTime","desc").get().then(res=>{
        console.log(res)
      if(res.data.length){
        this.setData({
          dataObj:res.data
        })

      }else{

      }
    })

  },
  search(e){
    var title = e.detail.value
    this.setData({
      dataObj:""
    })
    if(title==''){
      wx.showToast({
        title: '请输入相关内容',
        icon:"none"
      })
    }else{
        db.collection('Work').where(

              {
                name:db.RegExp({
                  regexp:title,
                  options:'i'
                })
              }
          ).get().then(res=>{
            if(res.data.length){
                this.setData({
                    dataObj:res.data,
                    value:""
                })
            }
          })
    }
  },
  clickfu1(){
    wx.navigateTo({
      url: '../../pages/send/send',
    })
  },
  clickfu2(){
    wx.navigateTo({
      url: '../fenxiang/fenxiang',
    })
  },
  introduce:function(e){
    wx.navigateTo({
      url: '../introduce/introduce?message=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
 
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
      this.onGetOpenid()
      this.getWork()
    },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})