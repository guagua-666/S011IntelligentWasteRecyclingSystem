const db=wx.cloud.database();
const app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:"",
    id:"",
    avatarUrl: defaultAvatarUrl,
    name:"",
    phone:"",
    cid:"",
    sex:"",
    time:"请选择",
    sexbox:['男' ,'女'],
    sex:"请选择",
    cid:"",
    userInfo:""
},
// 选择日期
changeTime(e){
    this.setData({ 
      time:e.detail.value,
    });
  },
  // 选择性别
  changeSex(e){
    this.setData({ 
      sex:this.data.sexbox[e.detail.value],
    });
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
    console.log(this.data.avatarUrl)
  },

  submit(e) {
      console.log(e)
    this.setData({
      SWOW:true,
      show1:false,
    })
    var userInfo={avatarUrl:this.data.avatarUrl,nickName:e.detail.value.name}
    db.collection("Users").doc(wx.getStorageSync('id')).update({
      data:{
        userInfo:userInfo,
        name:e.detail.value.name,
        phone: e.detail.value.phone,
        time:this.data.time,
        sex:this.data.sex,
        cid:e.detail.value.cid
      }
    })
    .then(res=>{

      wx.setStorageSync('userInfo', userInfo)
      wx.setStorageSync('Swh',this.data.SWOW)
      wx.showLoading({
        title: '修改成功...'
      })
      setTimeout(() => {
        wx.hideLoading();
        wx.switchTab({
          url: '../my/my',
        })
      }, 1000)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection("Users").doc(wx.getStorageSync('id')).get().then(res=>{
        this.setData({
            name:res.data.userInfo.nickName,
            phone: res.data.phone,
            time:res.data.time,
            sex:res.data.sex,
            cid:res.data.cid,
            avatarUrl:res.data.userInfo.avatarUrl
        })
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
  onShareAppMessage: function (res) {

  }
})