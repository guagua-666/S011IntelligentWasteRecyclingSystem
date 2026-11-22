const db=wx.cloud.database()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    maxnumber:500,
    name:"",
    sex:"",
    phone:"",
    hetong:"",
    mess:"",
    temp_imgs:[],
    jzimg:0,
    zpimg:[],
  },
    //选择图片
chooseImage() {
  console.log("执行调用图片")
  let that = this;
  let timestamp = (new Date()).valueOf();
  wx.chooseImage({
   count:9,
   sizeType:['original','compressed'],
   sourceType:['album','camera'],
   success(res) {
     that.setData({
       temp_imgs:that.data.temp_imgs.concat(res.tempFilePaths),
       jzimg:1
     })
     if(that.data.temp_imgs.length>=9){
       var all=[]
       for (let index = 0; index < 9; index++) {
         all[index]=that.data.temp_imgs[index]
       }
       that.setData({
         temp_imgs:all
       })
       wx.showToast({
        title: '最多上传9张照片!',
        mask:true,
        duration: 1500,
        icon:"none"
      })
     }
   },
  })
 },
 //取消选择
 quxiao:function(e){
   var id=e.currentTarget.dataset.id
   var temp_imgs=this.data.temp_imgs
   temp_imgs.splice(id,1)
  if(this.data.temp_imgs.length>0){
    this.setData({
      temp_imgs:temp_imgs
    })
  }else{
    this.setData({
      jzimg:0
    })
  }
 },
 randomString(e){
  var t="abcdefjhijklmnopqrstuvwxyzQWERTYUIOPLKJHGFDSAXZCVBNM1234567890"
  let a=t.length
  var n=""
  for(var i=0;i<e;i++){
    n+=t.charAt(Math.floor(Math.random()*a))
  }
  return n
},

async btnSub(e){


	if(wx.getStorageSync('Swh')){
  var that=this
  that.setData({
    zpimg:await app.upload_file(that.data.temp_imgs,that.randomString(8))
  })

    wx.hideLoading();
    db.collection("Chang").add({
      data:{
		name:e.detail.value.name,
        mess:e.detail.value.mess,
        sendDate:new Date(),
        imgs:that.data.zpimg,
        user:wx.getStorageSync('userInfo'),
        dzcount:0,
        zfcount:0,
		plcount:0,
		sccount:0,
		Send:false,
      }
    }).then(res=>{
      db.collection("Users").doc(wx.getStorageSync('id')).update({
        data:{
          jifen:wx.getStorageSync('jifen')+5
        }
      }).then(res=>{
        wx.showToast({
          title: '分享成功，奖励5积分！',
          mask:true,
          duration: 1000,
          icon:"none"
        })
        wx.setStorageSync('jifen', wx.getStorageSync('jifen')+5)
      })
      that.setData({
        name:"",
        phone:"",
        hetong:"",
        mess:"",
        temp_imgs:[],
        jzimg:0,
        zpimg:[],
      })


    })
  


}else{
	wx.showToast({
		title: '请先登陆后再进行操作',
		mask:true,
		duration: 1500,
		icon:"none"
	})
	setTimeout(function(){
		wx.switchTab({
			url: '../my/my',
		})
	},1800 ); 
}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('admin')){
        this.setData({
            show:false
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