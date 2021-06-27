// 1连接socket服务器
var socket=io('http://localhost:3000')
var username,avatar
// 登录模块
$('#login_avatar li').on('click',function(){
  $(this).addClass('now').siblings().removeClass('now')
})
// 点击按钮登录
$('#loginBtn').on('click',function(){
  // 获取用户名
  var username=$('#username').val().trim()
  if(!username){
    alert('请输入用户名')
    return
  }
  // 获取选择头像
  var avatar=$('#login_avatar li.now img').attr('src')
  // 告诉服务器需要登录
  socket.emit('login',{
    username:username,
    avatar:avatar
  })
})

// 监听登录失败的请求
socket.on('loginError',data=>{
  alert('登录失败')
})
// 监听登录成功的请求
socket.on('loginSuccess',data=>{
  // alert('登录成功')
  // 显示
  $('.login_box').fadeOut()
  $('.container').fadeIn()
  // 个人信息
  $('.avatar_url').attr('src',data.avatar)
  $('.user-list .username').text(data.username)

  username=data.username
  avatar=data.avatar
})
// 监听添加用户的信息
socket.on('addUser',data=>{
  $('.box-bd').append(`
        <div class="system">
        <p class="message_system">
          <span class="content">${data.username}加入群聊</span>
        </p>
      </div>
        `)
        scrollIntoView()
})
// 监听在线人数
socket.on('userList',data=>{
  // console.log(data);
  $('.user-list ul').html('')
  data.forEach(item=>{
    $('.user-list ul').append(`
       <li class="user">
          <div class="avatar"><img src="${item.avatar}"></div>
          <div class="name">${item.username}</div>
       </li>
     `)
  })

  $('#userTotalNumber').text(data.length)
})

// 监听用户离开的信息
socket.on('delUser',data=>{
  $('.box-bd').append(`
        <div class="system">
        <p class="message_system">
          <span class="content">${data.username}离开了群聊</span>
        </p>
      </div>
        `)
        scrollIntoView()
})

// 聊天功能
$('.btn-send').on('click',()=>{
  var content=$('#content').html().trim()
  console.log(content);
  $('#content').html('')
  if(!content) return alert('请输入内容')

  // 发送给服务器
  socket.emit('sendMessage',{
    msg:content,
    username:username,
    avatar:avatar
  })
})

// 监听聊天功能
socket.on('receiveMessage',data=>{
  if(data.username===username){
    $('.box-bd').append(`
          <div class="message-box">
          <div class="my message">
            <img src="${data.avatar}" alt="" class="avatar">
            <div class="content">
              <div class="bubble">
                <div class="bubble_cont">${data.msg}</div>
              </div>
            </div>
          </div>
        </div>
      `)
  }else{
    $('.box-bd').append(`
        <div class="message-box">
        <div class="other message">
          <img src="${data.avatar}" alt="" class="avatar">
          <div class="content">
            <div class="nickname">${data.username}</div>
            <div class="bubble">
              <div class="bubble_cont">${data.msg}</div>
            </div>
          </div>
        </div>
      </div>
    `)
  }
 
    scrollIntoView()
})

// 封装一个滚动函数
function scrollIntoView(){
  // 当前元素的底部滚动到可视区域
  $('.box-bd').children(':last').get(0).scrollIntoView(false)
}