const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
        message:JSON.parse(options.message)
    })
  },
  btn(){
      wx.navigateTo({
        url: '../send2/send2?dateweek='+this.data.message.name,
      })
  },
    area(){
        var that=this
    wx.openLocation({
        latitude: that.data.message.x, // 纬度，范围为-90~90，负数表示南纬
        longitude:that.data.message.y, // 经度，范围为-180~180，负数表示西经
        scale: 28, // 缩放比例
        name:that.data.name,
        address:that.data.message.area
      })
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