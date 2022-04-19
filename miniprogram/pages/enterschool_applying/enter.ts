Page({
    onLoad(){
        wx.cloud.init()
        wx.cloud.callFunction({
          name: 'getID',
          complete: res => {
            console.log(res.result.openid)
            this.setData({
                openid:res.result.openid
            })
          }
      })
      const db = wx.cloud.database();
      const _ = db.command;
      db.collection('userInfo').where({
        _openid: _.eq(this.data.openid)
      }).get().then(res=>{
        this.setData({
          userName:res.data[0].userName,
          userID:res.data[0].userID,
          userDepartment:res.data[0].userDepartment
        })
      })
    },
    
    data: {
      openid:'',
      userName:"",
      userID:"",
      userDepartment:"",
      isEnter: false,
      mapName: ''
    },
  moveToLocation(){
    let that=this
    wx.getLocation({
      type:"wgs84",
      success(res){
        wx.chooseLocation({
          latitude:res.latitude,
          longitude:res.longitude,
          success:function(data){
            that.setData({
              mapName:data.address
            })
          }
        })
      }
    })
  },
    formSubmit(e) {
      let that=this
      const db = wx.cloud.database();
      db.collection('apply').add({
        data:{
            userID:that.data.userID,
            userName:that.data.userName,
            userDepartment:that.data.userDepartment,
            isEnter:e.detail.value.isEnter,
            address:that.data.mapName
        }
      })
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },
  
    formReset(e) {
      console.log('form发生了reset事件，携带数据为：', e.detail.value)
      this.setData({
        chosen: ''
      })
    }
  })