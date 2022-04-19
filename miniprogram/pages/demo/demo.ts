var count=0;
Page({
    onShareAppMessage() {
      return {
        title: 'form',
        path: '/pages/demo/demo'
      }
    },
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
      }).count().then(res=>{
        count=res.total
      })
    },
    
    data: {
      primaryKey:'',
      openid:'',
      userName:"",
      userID:"",
      gender:"",
      userDepartment:"",
      isChecked: false,
      pickerHidden: true,
      chosen: ''
    },
  
    confirm(e){
        this.setData({
            isChecked:!this.data['isChecked']
        })
    },
    pickerConfirm(e) {
      this.setData({
        pickerHidden: true
      })
      this.setData({
        chosen: e.detail.value
      })
    },
  
    pickerCancel() {
      this.setData({
        pickerHidden: true
      })
    },
  
    pickerShow() {
      this.setData({
        pickerHidden: false
      })
    },
    add(e){
      const db = wx.cloud.database()
      db.collection('userInfo').add({
        data:{
            userName:e.detail.value.userName,
            userID:e.detail.value.userID,
            gender:e.detail.value.gender,
            userDepartment:e.detail.value.userDepartment
        }
      })
    },
    update(e){
      const db = wx.cloud.database()
      db.collection('userInfo').doc(this.data.primaryKey).update({
        data:{
          userName:e.detail.value.userName,
          userID:e.detail.value.userID,
          gender:e.detail.value.gender,
          userDepartment:e.detail.value.userDepartment
        }
      })
    },
    formSubmit(e) {
      const db = wx.cloud.database();
      const _ = db.command;
      console.log(count)
      if(count==0){
        this.add(e)
        console.log('add')
      }else if(count==1){
        db.collection('userInfo').where({
          _openid: _.eq(this.data.openid)
        }).field({
          _id:true
        }).get().then(res=>{
          this.setData({
            primaryKey:res.data[0]._id
          })
        })
        this.update(e)
        console.log('update')
      }else{
        wx.showModal({
          title:'数据重复',
          content:'用户信息重复，请联系辅导员/学院信息处人员'
        })
        console.log('error')
      }
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },
  
    formReset(e) {
      console.log('form发生了reset事件，携带数据为：', e.detail.value)
      this.setData({
        chosen: ''
      })
    }
  })