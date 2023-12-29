<template>
  <user-card-list :user-list="userList"/>
  <van-loading size="24px" vertical v-if="!userList || userList.length<1" style="margin-top: 235px; margin-bottom: 235px">加载中...</van-loading>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast, Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";

const userList = ref([]);
const route = useRoute();
const router = useRouter();


onMounted(async () => {

  const token = localStorage.getItem("token");
  if (token == null) {
    await router.push('/user/login')
  }


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
        if (response.data == null){
          router.push('/user/login')
        }
        showSuccessToast('请求成功')
        return response?.data?.records;
      })
      .catch(function (error) {
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

</script>

<style scoped>

</style>