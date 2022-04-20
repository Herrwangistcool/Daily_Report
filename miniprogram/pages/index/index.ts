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
      let that=this
      var time=new Date()
      db.collection('userInfo').where({
          _openid:_.eq(this.data._openid)
      }).get().then(res=>{
          this.setData({
              userName:res.data[0].userName,
              userID:res.data[0].userID,
              gender:res.data[0].gender
          })
      })
      
      db.collection('dailyReport').where({
        _openid:_.eq(this.data._openid),
        reportDate:_.eq(time.toDateString())
      }).count({
        success:function(res){
          if(res.total==1){
            db.collection('dailyReport').where({
              _openid:_.eq(that.data._openid),
              reportDate:_.eq(that.data.reportDate)
            }).field({
              _id:true
            }).get().then(e=>{
              that.setData({
                p_key:e.data[0]._id
              })
            })
            that.setData({
              isSubmitted:'是',
              count:res.total,
            })
          }
          if(res.total>1){
              that.setData({
                count:res.total
              })
              wx.showModal({
                title:'数据重复',
                content:'打卡信息重复，请联系辅导员/学院信息处人员'
            })
          }
        },
        fail:console.error
      })
      this.setData({
        reportDate:time.toDateString()
      })
    },
    data:{
        p_key:'',
        count:0,
        reportDate:'',
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
        index_s:0,
        index_f:0
    },
    bindPickerChange_s: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index_s: e.detail.value
        })
    },
    bindPickerChange_f: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index_f: e.detail.value
      })
  },

    formSubmit(e){
      const db=wx.cloud.database();
      const _=db.command;
      let that=this;
      console.log(e.detail.value.code_status)
      console.log(e.detail.value.temperature)
      console.log(that.data.array[e.detail.value.self_h])
      console.log(that.data.array[e.detail.value.family_h])
      if(that.data.count==0){
        db.collection('dailyReport').add({
          data:{
            userID:that.data.userID,
            reportDate:that.data.reportDate,
            userName:that.data.userName,
            self_health:that.data.array[e.detail.value.self_h],
            family_healthy:that.data.array[e.detail.value.self_h],
            temperature:e.detail.value.temperature,
            h_code_status:e.detail.value.code_status[0],
            t_code_status:e.detail.value.code_status[1]
          }
        })
      }
      if(that.data.count==1){
        db.collection('dailyReport').doc(that.data.p_key).update({
          data:{
            userID:that.data.userID,
            reportDate:that.data.reportDate,
            userName:that.data.userName,
            self_health:that.data.array[e.detail.value.self_h],
            family_healthy:that.data.array[e.detail.value.self_h],
            temperature:e.detail.value.temperature,
            h_code_status:e.detail.value.code_status[0],
            t_code_status:e.detail.value.code_status[1]
          }
        })
      }
    },

    formReset(e) {
      console.log('form发生了reset事件，携带数据为：', e.detail.value)
      this.setData({
        chosen: ''
      })
    }
})
