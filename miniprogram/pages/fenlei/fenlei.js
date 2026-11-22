const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
        db.collection('Chang').where(

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
                })
            }
          })
    }
  },
  //判断当前滚动超过一屏时，设置tab服务名称滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
getChang(){
    db.collection("Chang").get().then(res=>{
        this.setData({
            dataObj:res.data
        })
    })
},
introduce:function(e){
	wx.navigateTo({
        url: '../text/text?id=' + e.currentTarget.dataset.item._id,
      })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    this.getChang()
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