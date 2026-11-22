// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-0g4ju7fj0c10d396',
        traceUser: true,
      });
    }

    this.globalData = {};
  }, async upload_file(files,name){
    wx.showLoading({
      title: '上传中',
    })
    var all_p = new Array()
    for(var i=0;i<files.length;i++){
      const filePath=files[i]
      const cloudPath=name+String(Number(new Date()))+filePath.match(/\.[^.]+?$/)[0]
      var p=await wx.cloud.uploadFile({
        cloudPath,
        filePath,
      }).catch(err=>{return{fileID:files[i]}})
      all_p.push(p)
    }
    var final_files = new Array()
    await Promise.all(all_p).then((res)=>{
      for(var i=0;i<res.length;i++){
        final_files.push(res[i].fileID)
      }
    })
    wx.hideLoading()
    return final_files
  }
});
