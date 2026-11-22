const db=wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  dataObj: [],
  scrollHeight: 0,  // scroll-view高度
  startX: 0,        // 开始X坐标
  startY: 0,        // 开始Y坐标
  id:"",
  },
// 获取数据
  getWork(){
    this.setData({
        dataObj:""
    })
    db.collection("Result").where({
      _openid:wx.getStorageSync('openid')
    }).orderBy("sendDate","desc").get().then(res=>{
      if(res.data.length){
        this.setData({
          dataObj:res.data
        })

      }else{

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   

  },

// 删除
delList: function(e){
  console.log(e)
  var that=this
  var id = e.currentTarget.dataset.item._id;  // 当前下标
  console.log(id)
  wx.showModal({
    title:"是否要删除该记录？",
    content:"删除记录",
    success(res){
      if(res.confirm==true){
        wx.showLoading({
          title: '数据处理中...',
        })
        db.collection("Result").doc(id).remove().then(res=>{
            that.getWork()
            wx.showToast({
              title: '删除成功！',
              mask:true,
              duration: 1000,
              icon:"none"
            })
        })

      }}})
 
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