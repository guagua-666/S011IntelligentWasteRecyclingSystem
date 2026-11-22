const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:"",
    DzMess:{},
    Dzswh:false,
		DzId:"",
		Scswh:false,
    ScId:"",
    sccount:0,
    dzcount:0,
    plcount:0,
    zfcount:0,
    zhezhao:false,
    write:false,
    info:"",
    messObj:"",
    selk:false,
		selk2:false,
		guanzhu:false
  },
  // 将date类型通过该方法转换为可视日期
  commentTimeHandle(dateStr) {
    var publishTime = new Date(dateStr).getTime(),
        date = dateStr,
        Y = date.getFullYear(),
        M = date.getMonth()+1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
        if (M < 10) {
            M = '0' + M;
        }
        if (D < 10) {
            D = '0' + D;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        // console.log("年", Y); // 年 
        // console.log("月", M); // 月 
        // console.log("日", D); // 日 
        // console.log("时", H); // 时 
        // console.log("分", m); // 分 
    var nowTime = new Date().getTime(), //获取此时此刻日期的秒数
        diffValue = (nowTime - publishTime)/1000,  // 获取此时 秒数 与 要处理的日期秒数 之间的差值
        diff_days = parseInt(diffValue / 86400),    // 一天86400秒 获取相差的天数 取整
        diff_hours = parseInt(diffValue / 3600),    // 一时3600秒
        diff_minutes = parseInt(diffValue / 60),
        diff_secodes = parseInt(diffValue);
        if (diff_days > 0 && diff_days < 7) {  //相差天数 0 < diff_days < 3 时, 直接返出
            return diff_days + "天前";
        } else if (diff_days <= 0 && diff_hours > 0) {
            return diff_hours + "小时前";
        } else if (diff_hours <= 0 && diff_minutes > 0) {
            return diff_minutes + "分钟前";
        } else if (diff_secodes < 60) {
            if (diff_secodes <= 0) {
                return "刚刚";
            } else {
                return diff_secodes + "秒前";
            }
        } else if (diff_days >= 7){
            return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
        }
  },
  //点赞命令
  clickDz(){
    if(wx.getStorageSync('Swh')){
      this.setData({
        selk:!this.data.selk
      })
      if(this.data.Dzswh){
        this.setData({
          Dzswh:false,
          dzcount:this.data.dzcount-1
        })
      }else{
        this.setData({
          Dzswh:true,
          dzcount:this.data.dzcount+1
        })
      }
    }
    else{
      wx.showToast({
        title: '请先登陆后再进行点赞',
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
	  //收藏命令
		clickSc(){
			if(wx.getStorageSync('Swh')){
				this.setData({
					selk2:!this.data.selk2
				})
				if(this.data.Scswh){
					this.setData({
						Scswh:false,
						sccount:this.data.sccount-1
					})
				}else{
					this.setData({
						Scswh:true,
						sccount:this.data.sccount+1
					})
				}
			}
			else{
				wx.showToast({
					title: '请先登陆后再进行收藏',
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
  //遮罩
  clickZz(){
    if(wx.getStorageSync('Swh')){
      this.setData({
        zhezhao:true,
        write:true,
        info:""
      })
    }
    else{
      wx.showToast({
        title: '请先登陆后再进行评论',
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
  //取消遮罩
  clickClose(){
    this.setData({
      zhezhao:false,
      write:false
    })
  },
  //获取评论内容
  async getdata(){
    let count = await db.collection('CommentList').where({
      messid:this.data.message._id
    }).count()
    count = count.total
    let all =[]
    for (let i = 0; i < count; i += 20) { 
      let list = await db.collection('CommentList')
      .where({
        messid:this.data.message._id
      })
      .skip(i).get()
      all=all.concat(list.data);
    }
    for(var i=0;i<all.length;i++){
     all[i].AssessDate=this.commentTimeHandle(all[i].AssessDate)
    }
    this.setData({
      messObj:all.reverse(),
    })
    console.log(this.data.messObj)
	},
  // 删除评论
  shanchu(e){
    var that=this
    var id=e.currentTarget.dataset.item._id
    wx.showModal({
      title:"是否要删除该留言？",
      content:"删除留言",
      success(res){
        if(res.confirm==true){
          db.collection("CommentList").doc(id).remove().then(res=>{
            wx.showToast({
              title: '删除成功！',
              mask: true,
              duration: 2000,
              icon:"none"
            })
            that.getdata()
            that.setData({
              plcount:that.data.plcount-1
            })
          })
        }else{
        }
      }
      })
  },
   //用户评论
   btnSub:function(e){
    var info=e.detail.value.info;
    console.log(info)
    if(info==""||info=="请输入要评论内容"){
      wx.showToast({
        title: '请输入内容',
        mask: true,
        duration: 2000,
        icon:"none"
      })
      this.setData({
        zhezhao:false
      })
    }
    else{
      db.collection("CommentList").add({
        data:{
          info:info,
          userInfo:wx.getStorageSync('userInfo'),
          AssessDate:new Date(),
          messid:this.data.message._id
        }
      }).then(res=>{
        this.setData({
          write:false,
          zhezhao:false,
          plcount:this.data.plcount+1
        })
      })
      wx.showToast({
        title: '评论成功！',
        mask: true,
        duration: 2000,
        icon:"none"
      })
      this.getdata()
      var that=this
      setTimeout(function(){
        that.getdata()
      },1000 );  
    }
  },

  //清空品论内容
  resert:function () {
    console.log("清空内容")
    this.setData({
      write:false
    })
  },
  //查看用户是否点赞
  getUserDz(){
    db.collection("DzMess").where({
      _openid:wx.getStorageSync('openid'),
      titleId:this.data.message._id
    }).get().then(res=>{
      console.log(res)
      if(res.data.length){
        this.setData({
          Dzswh:true,
          DzId:res.data[0]._id
        })
      }
    })
	},
	  //查看用户是否收藏
		getUserSc(){
			db.collection("ScMess").where({
				_openid:wx.getStorageSync('openid'),
				titleId:this.data.message._id
			}).get().then(res=>{
				console.log(res)
				if(res.data.length){
					this.setData({
						Scswh:true,
						ScId:res.data[0]._id
					})
				}
			})
		},
  //修改点赞信息
  upDzMess(){
    if(this.data.Dzswh){
      db.collection("DzMess").add({
        data:{
          titleId:this.data.message._id
        }
      }).then(res=>{
        console.log("点赞记录成功")
      })
    }else{
      var id=this.data.DzId
      db.collection("DzMess").doc(id).remove().then(res=>{
        console.log("取消点赞记录成功")
      })
    }
	},
	  //修改收藏信息
		upScMess(){
			if(this.data.Scswh){
				db.collection("ScMess").add({
					data:{
						titleId:this.data.message._id
					}
				}).then(res=>{
					console.log("收藏记录成功")
				})
			}else{
				var id=this.data.ScId
				db.collection("ScMess").doc(id).remove().then(res=>{
					console.log("取消收藏记录成功")
				})
			}
		},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		db.collection("Chang").doc(options.id).get().then(res=>{
			this.setData({
				message:res.data,
				dzcount:res.data.dzcount,
				plcount:res.data.plcount,
				zfcount:res.data.zfcount,
				sccount:res.data.sccount,
				openid:wx.getStorageSync('openid'),
				sendDate:this.commentTimeHandle(res.data.sendDate)
			})
			console.log(this.data.sendDate)
			this.getUserDz()
			this.getUserSc()
			this.getdata()
		})

  },

    //上传文章点赞数量、评论量、转发量
    upCount(){
      console.log(this.data.message.dzcount)
      db.collection("Chang").doc(this.data.message._id).update({
        data:{
          dzcount:this.data.dzcount,
          zfcount:parseInt(this.data.zfcount)+1,
          plcount:this.data.plcount,
          sccount:this.data.sccount,
        }
      }).then(res=>{
        console.log("修改成功")
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
    console.log(this.data.zfcount)
    this.upCount()
    if(this.data.selk){
      this.upDzMess()
		}
		if(this.data.selk2){
      this.upScMess()
    }
    this.setData({
      selk:false,
      selk2:false,
    })
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
    return {
      title:this.data.message.mess,
      imageUrl:this.data.message.imgs[0],
      // 成功的回调
      success: (res) => {
      },
      // 失败的回调
      fail: (res) => {},
      // 无论成功与否的回调
      complete: (res) => {}
    }
  }
})