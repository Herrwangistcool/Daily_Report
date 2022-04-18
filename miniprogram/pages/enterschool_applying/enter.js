var count=0;
var yes_or_not=' ';
var _openid=' ';
var address=" ";
Page({
  data: {
    mapName:' ',
    yes_or_not:' ',
    isChecked: false,
    _openid:' '
  },
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
            console.log(res)
            this.setData({
                _openid:res.result.openid
            })
          }
      })
      const db = wx.cloud.database();
      const _ = db.command;
      db.collection('apply').where({
        _openid: _.eq(this.data.openid)
      }).count().then(res=>{
        count=res.total
      })
    },
    moveToLocation(){
      let that = this
      wx.chooseLocation({
          success: function (res) {
              console.log(res.name);
              //赋值给data中的mapName
              that.setData({
                  mapName: res.name
              })
          },
          //错误信息
          fail: function () {
              console.log(err);
          }
      })
    },
  radiochange(e){
    console.log(e)
    this.setData({
    yes_or_not:e.detail.value
    })
  },
  
submit(){
      const db = wx.cloud.database()
      db.collection('apply').add({
        data:{
          yes_or_not,
          _openid,
          address
        }
      }),
  success:res=>
{
  console.log('保存成功')
}
  }
  

  })