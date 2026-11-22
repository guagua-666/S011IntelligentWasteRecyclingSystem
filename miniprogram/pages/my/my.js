const db=wx.cloud.database();
const app=getApp()
Page({
  data: {
    userInfo: {},
    SWOW:false,
    jifen:0
  },
  onLoad() {

  },
 user(){
     wx.navigateTo({
       url: '../geren/geren',
     })
 },
  // 用户登录
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          SWOW:true,
        })
        db.collection("Users").add({
          data:{
            userInfo:this.data.userInfo,
            jifen:0
          }
        })
        .then(res=>{
          console.log("新建用户")
          wx.setStorageSync('jifen',0)
          wx.setStorageSync('id',res._id)
          wx.setStorageSync('userInfo', this.data.userInfo)
          wx.setStorageSync('Swh',this.data.SWOW)
        })
      }
    })

  },
  myorder(){
    wx.navigateTo({
      url: '../mysend/mysend',
    })
  },
  myxinde(){
    wx.navigateTo({
      url: '../myxinde/myxinde',
    })
  },
// 关于
guanyu(){
  wx.navigateTo({
    url: '../../pages/guanyu/guanyu',
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
    this.setData({
      SWOW:wx.getStorageSync('Swh'),
      jifen:wx.getStorageSync('jifen'),
      userInfo:wx.getStorageSync('userInfo'),
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