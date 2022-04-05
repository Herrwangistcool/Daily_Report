Page({
    onShareAppMessage() {
      return {
        title: 'form',
        path: '/pages/demo/demo'
      }
    },
    onLoad(){
        wx.cloud.init()
    },
    
    data: {
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
  
    formSubmit(e) {
      const db = wx.cloud.database();
      db.collection('userInfo').add({
          data:{
              userName:e.detail.value.userName,
              userID:e.detail.value.userID,
              gender:e.detail.value.gender,
              userDepartment:e.detail.value.userDepartment
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