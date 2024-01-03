<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" @click="doMatch(isMatchMode)"/>
    </template>
  </van-cell>
  <user-card-list :user-list="userList"/>
  <van-loading size="24px" vertical v-if="isLoading" style="margin-top: 50px;">加载中...</van-loading>
  <van-empty v-if="isShow " description="暂无数据" />
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast, Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";

const userList = ref([]);
const route = useRoute();
const router = useRouter();

const isShow = ref(false);
const isLoading = ref(false);
const isMatchMode = ref<boolean>(false)

const token = localStorage.getItem("token");
if (token == null) {
  window.location.href='/user/login'
}
onMounted(async () => {
  isLoading.value = true;

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
        if (token == null || response.code===40101) {
          window.location.href='/user/login'
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

  if (isMatchMode==false){
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
          if (response.data==null){
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
  }else {
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
          if (response.data==null){
            isShow.value = true;
          }
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