// pages/user/user.ts
Page({
    onLoad(){
        wx.cloud.init()
    },

    add(){
        wx.cloud.database().collection('goods')
            .add({
                data:{
                    name: 'watermelon',
                    price: 18
                }
            })
            .then(res=>{
                console.log('添加成功', res)
            })
            .catch(res=>{
                console.error('添加失败', res)
            })
    },
    update(){
        wx.cloud.database().collection('goods')
            .doc("636050766249637c03bc21862383b4dd")
            .update({
                data:{
                    price:11
                }
            })
            .then(res=>{
                console.log('修改成功',res)
            })
            .catch(res=>{
                console.error('修改失败',res)
            })
    },
    search(){
        wx.cloud.database().collection('goods')
            .where({
                price: 8
            })
            .get({
                success:function(res){
                    console.log(res.data)
                }
            })
    },
    delete(){
        wx.cloud.database().collection('goods')
            .doc("636050766249637c03bc21862383b4dd")
            .remove({
                success:function(res){
                    console.log(res.data)
                }
            })
    }
})