Page({
    onLoad(){
        wx.cloud.init()
        wx.cloud.callFunction({
          name: 'getID',
          complete: res => {
            console.log(res.result.openid)
            this.setData({
                _openid:res.result.openid
            })
          }
      })
      const db=wx.cloud.database()
      const _=db.command
      db.collection('userInfo').where({
          _openid:_.eq(this.data._openid)
      }).get().then(res=>{
          this.setData({
              userName:res.data[0].userName,
              userID:res.data[0].userID,
              gender:res.data[0].gender
          })
      })
    },
    data:{
        _openid:'',
        userName:'',
        userID:'',
        gender:'',
        userDepartment:'',
        isSubmitted:'否',
        array:['健康','虚弱','发热','其他症状'],
        objectArray: [
            {
              id: 0,
              name: '健康'
            },
            {
              id: 1,
              name: '虚弱'
            },
            {
              id: 2,
              name: '发热'
            },
            {
              id: 3,
              name: '其他症状'
            }
          ],
        index:0
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index: e.detail.value
        })
    }
})
