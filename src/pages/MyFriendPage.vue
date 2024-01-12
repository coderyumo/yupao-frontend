<template>
  <div id="friend">
    <van-card
        v-for="user in userList"
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
        <van-button size="normal" type="danger" @click="deleteFriend(user)">删除好友</van-button>
      </template>
    </van-card>
  </div>
  <van-loading v-if="loading" size="24px" style="margin-top: 235px; margin-bottom: 235px" vertical>加载中...</van-loading>
  <van-empty v-if="isShow " description="暂无数据"/>
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user";

const loading = ref(false);
const isShow = ref(false);
const userList = ref([]);

const token = localStorage.getItem("token");
if (token == null) {
  window.location.href = "/user/login"
}



const loadData = async () => {
  loading.value = true;
  const res = await myAxios.get("/user/friend/list", {
    params: {
      userAccount: token.split('-')[0],
      uuid: token.split('-')[1]
    }
  })
  console.log(res.data)
  if (res.code === 0 && res.data) {
    res.data.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = res.data

    if (res.data.length == 0) {
      isShow.value = true;
    }
    loading.value = false;

  } else {
    showFailToast("获取数据失败，请刷新")
    // if (res.code === 40101) {
    //   window.location.href = "/user/login"
    // }
  }
}

onMounted(() => {
  loadData();
})

setInterval(loadData, 50000);
const deleteFriend = async (user) => {

  const resData = await getCurrentUser();
  const res = await myAxios.post("/user/friend/delete", {
    id: resData.data.id,
    deleteId: user.id,
    userAccount: token.split('-')[0],
    uuid: token.split('-')[1]
  })
  if (res.code === 0 && res.data) {
    showSuccessToast("删除好友成功！");
    window.location.href="/user"
  } else {
    showFailToast('操作失败' + (res.description ? `，${res.description}` : ''));
    window.location.href="/user"
  }
}


</script>

<style scoped>

</style>