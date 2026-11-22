const db=wx.cloud.database();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		dataObj:""
	},
	// 我得心得
	t1(){
		db.collection("Chang").where({
			_openid:wx.getStorageSync('openid')
		}).get().then(res=>{
			this.setData({
				dataObj:res.data,
			})
		})
	},
			// 跳转
introduce:function(e){
	wx.navigateTo({
	  url: '../text/text?id=' + e.currentTarget.dataset.item._id,
	})
  },
      // 删除
	  del(e){
		var that=this
		var id=e.currentTarget.dataset.item._id
		wx.showModal({
		  title:"是否要删除该心得？",
		  content:"删除心得",
		  success(res){
			if(res.confirm==true){
			  db.collection("Chang").doc(id).remove().then(res=>{
				wx.showToast({
				  title: '删除成功！',
				  mask: true,
				  duration: 2000,
				  icon:"none"
				})
				that.t1()
			  })
			}else{
			}
		  }
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
		this.t1()
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