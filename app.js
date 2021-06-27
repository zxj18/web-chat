// 启动聊天的服务端程序
var app=require('express')()
var server=require('http').Server(app)
var io=require('socket.io')(server)
// 记录所有已经登陆过的用户
const users=[]

server.listen(3000,()=>{
    console.log('服务器启动成功了');
})

// express处理静态资源
app.use(require('express').static('public'))

app.get('/',function(req,res){
    res.redirect('/index.html')
})

io.on('connection',function(socket){
    // console.log('新用户连接了');
    socket.on('login',data=>{
        // console.log(data);
        let user=users.find(item=>item.username===data.username)
        if(user){
            socket.emit('loginError',{msg:'登录失败'})
            // console.log(1);
        }else{
            users.push(data)
            socket.emit('loginSuccess',data)
            // console.log(2);
            // 广播事件
            io.emit('addUser',data)

            // 通知所有人聊天室人数
            io.emit('userList',users)

            // 把登录成功的用户名和头像存储起来
            socket.username=data.username
            socket.avatar=data.avatar
        }
    })

    // 监听用户断开连接
    socket.on('disconnect',()=>{
        // 把用户信息删除掉
        let idx=users.findIndex(item=>item.username===socket.username)
        users.splice(idx,1)
        // 告诉所有人，有人离开了
        io.emit('delUser',{
            username:socket.username,
            avatar:socket.avatar
        })
        io.emit('userList',users)
    })

    // 监听聊天事件
    socket.on('sendMessage',data=>{
        console.log(data);
        io.emit('receiveMessage',data)
    })
})

