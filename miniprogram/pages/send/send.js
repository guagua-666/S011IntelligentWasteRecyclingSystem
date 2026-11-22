const db=wx.cloud.database()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxnumber:500,
    temp_imgs:"",
    jzimg:0,
    zpimg:[],
    array:[],
    dateweek:"请选择",
    time:"请选择",
    index:0,
    name:"",
    user:"",
    phone:"",
    mess:""
  },
    bindPickerChange: function(e) {
      this.setData({
        index: e.detail.value,
        dateweek:this.data.array[e.detail.value]
      })
      console.log(this.data.dateweek)
    },
    bindPickerTime: function(e) {
        this.setData({
          time: e.detail.value
        })
      },
    
    //选择图片
chooseImage() {
  console.log("执行调用图片")
  let that = this;
  let timestamp = (new Date()).valueOf();
  wx.chooseImage({
   count:1,
   sizeType:['original','compressed'],
   sourceType:['album','camera'],
   success(res) {
     that.setData({
       temp_imgs:res.tempFilePaths,
       jzimg:1
     })
   },
  })
 },
 //取消选择
 quxiao:function(e){
    this.setData({
      jzimg:0
    })
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
    var that=this
    if(that.data.jzimg==0){
        wx.showToast({
            title: '请选择物品照片！',
            mask:true,
            icon:"none"
          })
          return
      }
      if(e.detail.value.name.length==0){
        wx.showToast({
            title: '请填写物品名称！',
            mask:true,
            icon:"none"
          })
          return
      }
      if( this.data.dateweek=="请选择"){
        wx.showToast({
            title: '请选择站点！',
            mask:true,
            icon:"none"
          })
          return
      }
      if( this.data.time=="请选择"){
        wx.showToast({
            title: '请选择交付时间！',
            mask:true,
            icon:"none"
          })
          return
      }
      if(e.detail.value.type.length==0){
        wx.showToast({
            title: '请填写废品类型！',
            mask:true,
            icon:"none"
          })
          return
      }
      if(e.detail.value.num.length==0){
        wx.showToast({
            title: '请填写废品数量！',
            mask:true,
            icon:"none"
          })
          return
      }

  var img=await app.upload_file(that.data.temp_imgs,that.randomString(8))
  db.collection("Result").add({
    data:{
      dateweek:that.data.dateweek,
      time:that.data.time,
      name:e.detail.value.name,
      type:e.detail.value.type,
      num:e.detail.value.num,
      mess:e.detail.value.mess,
      sendDate:new Date(),
      userInfo:wx.getStorageSync('userInfo'),
      img:img[0],
    }
  }).then(res=>{
    wx.showToast({
      title: '操作成功！',
      mask:true,
      duration: 1000,
      icon:"none"
    })
    setTimeout(function(){
      db.collection("Users").doc(wx.getStorageSync('id')).update({
        data:{
          jifen:wx.getStorageSync('jifen')+5
        }
      }).then(res=>{
        wx.showToast({
          title: '发布成功，奖励5积分！',
          mask:true,
          duration: 1000,
          icon:"none"
        })
        wx.setStorageSync('jifen', wx.getStorageSync('jifen')+5)
      })
      wx.navigateBack()
    },1000 ); 

  })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection("Work").get().then(res=>{
        var arr=[]
        if(res.data.length){
            for (let i = 0; i < res.data.length; i++) {
                arr.push(res.data[i].name)
            }
            this.setData({
                array:arr,
            })
        }

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