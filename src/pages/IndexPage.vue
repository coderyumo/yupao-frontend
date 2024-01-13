<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" @click="doMatch(isMatchMode)"/>
    </template>
  </van-cell>
  <van-badge :content="messageCount">
    <van-button style="width: 100px;" type="primary" @click="onClick">好友申请</van-button>
  </van-badge>
  <user-card-list :user-list="userList"/>
  <van-loading v-if="isLoading" size="24px" style="margin-top: 50px;" vertical>{{ textMessage }}</van-loading>
  <van-empty v-if="isShow " description="暂无数据"/>
  <van-dialog v-model:show="showAddFriendMessage" show-cancel-button title="好友申请">
    <van-card
        v-for="user in noticeData"
        :desc="user.profile"
        :tag="user.gender===0?'男':'女'"
        :thumb="user.avatarUrl==null?userAvatarUrl:user.avatarUrl"
        :title="`${user.username}(编号：${user.planetCode})`"
    >
      <template #tags>
        <van-tag v-for="tag in user.tags" plain style="margin-right: 8px;margin-top: 8px;" type="primary">{{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini" type="primary" @click="agreeApply(user)">同意</van-button>
        <van-button size="mini" type="danger" @click="rejectApply(user)">拒绝</van-button>
      </template>
    </van-card>
  </van-dialog>

  <van-notify v-model:show="isShowMessage" :type="messageType">
    <van-icon name="bell" style="margin-right: 4px;" />
    <span>{{ messageDetail }}</span>
  </van-notify>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showNotify, showSuccessToast, Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {getCurrentUser} from "../services/user";

const userList = ref([]);
const route = useRoute();
const router = useRouter();

const isShow = ref(false);
const isLoading = ref(false);
const isMatchMode = ref<boolean>(false)
const textMessage = ref('匹配中......')
const showAddFriendMessage = ref(false);
const messageCount = ref(0);
const noticeData = ref([]);
const isShowMessage = ref(false);
const messageDetail = ref('');
const messageType = ref('success');


const offset = ref({x: 330, y: 790});

const onClick = () => {
  showAddFriendMessage.value = true;
};



/**
 * 获取通知信息
 */

const getNoticeData = async () => {
  const resData = await getCurrentUser();
  const res = await myAxios.get('/notice/friend/add', {
    params: {
      id: resData.data.id
    }
  })
  console.log("通知数据", res);
  if (res.code === 0 && res.data) {
    messageCount.value = res.data.length
    res.data.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    noticeData.value = res.data
  } else {
    showFailToast('获取失败' + (res.description ? `，${res.description}` : ''))
  }
}

// 设置定时器，每隔五秒调用getNoticeData函数
setInterval(getNoticeData, 5000);
const agreeApply = async (user) => {
  try {
    const resData = await getCurrentUser();
    await myAxios.post("/user/friend/agree", {
      senderId: user.id,
      recipientId: resData.data.id,
      userAccount: token.split('-')[0],
      uuid: token.split('-')[1]
    })

  } catch (error) {
    console.error('处理好友申请时发生错误:', error);
    // 处理错误逻辑
  }
  await getNoticeData()
};

const rejectApply = async (user) => {
  try {
    const resData = await getCurrentUser();
    await myAxios.post("/user/friend/reject", {
      senderId: user.id,
      recipientId: resData.data.id,
    })

  } catch (error) {
    console.error('处理好友申请时发生错误:', error);
    // 处理错误逻辑
  }
  await getNoticeData()
};


const clientId = Math.random().toString().substring(2);
// 建立 WebSocket 连接 本地
// const websocket = new WebSocket('ws://localhost:8081/api/ws/' + clientId);
const websocket = new WebSocket('ws://yupao-backend.code-li.fun/api/ws/' + clientId);

// ----- WebSocket API -----
websocket.onerror = () => setMessageInnerHTML('{"connect":"error"}');
websocket.onopen = () => setMessageInnerHTML('{"connect":"success"}');
websocket.onmessage = (event) => setMessageInnerHTML(event.data);
websocket.onclose = () => setMessageInnerHTML('{"connect":"close"}');

// 监听窗口关闭
onBeforeUnmount(() => {
  websocket.close();
});

// -----------------------------
const setMessageInnerHTML = async (innerHtml) => {
  console.log("响应信息",innerHtml);
  await showAddFriendSuccess(innerHtml)
};

const token = localStorage.getItem("token");
if (token == null) {
  window.location.href = "/user/login"
}

const showAddFriendSuccess = async (innerHtml) =>{
  const currentUser = await getCurrentUser();
  const loginUser = currentUser.data;
  let parse = JSON.parse(innerHtml);

  console.log('loginUser.id',loginUser.id);
  console.log('innerHtml.senderId',parse.senderId);
  console.log('innerHtml.isAgree',parse.isAgree);
  console.log("响应信息：",innerHtml)

  if (loginUser.id===parse.senderId){
    if(!parse.isAgree){
      messageType.value = "danger"
    }else {
      messageType.value = "success"
    }
    isShowMessage.value = true;
    messageDetail.value = parse.message;

    //向数据库发送请求，更新数据
   const res = await myAxios.post("/user/refresh/cache", {
      userAccount: token.split('-')[0],
      uuid: token.split('-')[1]
    })

    if (res.code===0 && res.data){
      console.log("更新缓存成功")
    }
  }

// 等待3秒后执行特定代码
  setTimeout(function() {
    // 在这里放置你想执行的代码
    isShowMessage.value = false;
    messageDetail.value = '';
  }, 3000); // 3000毫秒（3秒）

}

const sendMessage = () => {
  // websocket.send(text.value);
  // text.value = '';
};

const closeConnection = () => {
  websocket.close();
};




onMounted(async () => {
  await getNoticeData();
  const currentUser = await getCurrentUser();


  isLoading.value = true;
  const token = localStorage.getItem("token");
  const userListData = await myAxios.get('/user/recommend', {
    params: {
      pageSize: 8,
      pageNum: 1,
      userAccount: token.split('-')[0],
      uuid: token.split('-')[1]
    },
  })
      .then(function (response) {
        console.log('/user/recommend success', response.data);
        if (token == null || response.code === 40101) {
          window.location.href = '/user/login'
        }
        isLoading.value = false;
        return response?.data?.records;
      })
      .catch(function (error) {
        isLoading.value = false;
        console.log('/user/recommend error' + error);
        showFailToast('请求失败');
      });
  console.log('userListData', userListData);
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData;
  }
})

const doMatch = async (isMatchMode) => {
  isLoading.value = true
  userList.value = [];
  console.log('isMatchMode', isMatchMode);
  const token = localStorage.getItem("token");
  if (isMatchMode == false) {
    const userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: 1,
        userAccount: token.split('-')[0],
        uuid: token.split('-')[1]
      },
    })
        .then(function (response) {
          console.log('/user/recommend success', response.data);
          isLoading.value = false;
          if (response.data == null) {
            isShow.value = true;
          }

          return response?.data?.records;
        })
        .catch(function (error) {
          isLoading.value = false;
          console.log('/user/recommend error' + error);
          showFailToast('请求失败');
        });
    console.log('userListData', userListData);
    if (userListData) {
      userListData.forEach(user => {
        if (user.tags) {
          user.tags = JSON.parse(user.tags)
        }
      })
      userList.value = userListData;
    }
  } else {
    textMessage.value = '匹配中......'
    const token = localStorage.getItem("token");
    const userListData = await myAxios.get('/user/match', {
      params: {
        num: 10,
        userAccount: token.split('-')[0],
        uuid: token.split('-')[1]
      },
    })
        .then(function (response) {
          console.log('/user/match', response.data);
          isLoading.value = false;
          if (response.data == null) {
            isShow.value = true;
          }
          textMessage.value = '加载中......'
          return response?.data;
        })
        .catch(function (error) {
          isLoading.value = false;
          console.log('/user/match error' + error);
          showFailToast('请求失败');
        });
    console.log('userListData', userListData);
    if (userListData) {
      userListData.forEach(user => {
        if (user.tags) {
          user.tags = JSON.parse(user.tags)
        }
      })
      userList.value = userListData;
    }
  }

}

</script>

<style scoped>

</style>