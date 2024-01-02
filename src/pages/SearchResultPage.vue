<template>
  <user-card-list :user-list="userList"/>
  <van-loading size="24px" vertical v-if="loading" style="margin-top: 235px; margin-bottom: 235px" >加载中...</van-loading>
  <van-empty v-if="isShow " description="暂无数据" />
  <van-pagination
      v-model="pageNum"
      :total-items="total"
      show-page-size="5"
      @change = "change"
      force-ellipses
  />
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast, Toast} from "vant";
import qs from 'qs';

const userList = ref([]);
const pageNum = ref(1);
const total = ref(0);
const pageSize = ref(0);

const route = useRoute();
const {tags} = route.query;

const loading = ref(false);
const isShow = ref(false);

// 监听 pageNum 的变化
watch(pageNum, (newValue, oldValue) => {
  // 在这里可以进行一些异步操作，例如加载数据
  // 假设这里是一个异步操作示例，比如加载数据，这里使用 setTimeout 模拟异步加载
  loading.value = true; // 显示加载状态
  setTimeout(() => {
    // 模拟异步加载完成后，隐藏加载状态
    loading.value = false;
  }, 6000); // 假设加载需要2秒钟
});

onMounted(async () => {
  loading.value = true;
  console.log(tags);
  const userListData = await myAxios.get('/user/search/tags', {
    params: {
      pageSize: 8,
      pageNum: pageNum.value,
      tagNameList: tags
    },
    paramsSerializer: tagNameList => {
      return qs.stringify(tagNameList, {indices: false})
    }
  })
      .then(function (response) {
        console.log('/user/search/tags success', response.data);
        if (response.data.records.length == 0){
          isShow.value = true
        }
        loading.value = false;
        return response?.data;
      })
      .catch(function (error) {
        console.log('/user/search/tags error' + error);
        showFailToast('请求失败')
      });
  console.log('userListData', userListData);
  if (userListData.records) {
    userListData.records.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData.records;
  }
  ;

  pageNum.value = userListData.current;
  total.value = userListData.total;
})



const change = async ()=>{
  userList.value = []
  const userListData = await myAxios.get('/user/search/tags', {
    params: {
      pageSize: 8,
      pageNum: pageNum.value,
      tagNameList: tags
    },
    paramsSerializer: tagNameList => {
      return qs.stringify(tagNameList, {indices: false})
    }
  })
      .then(function (response) {
        console.log('/user/search/tags success', response.data);
        return response?.data;
      })
      .catch(function (error) {
        console.log('/user/search/tags error' + error);
        showFailToast('请求失败')
      });
  console.log('userListData', userListData);
  if (userListData.records) {
    userListData.records.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData.records;
  }
  ;

  pageNum.value = userListData.current;
  total.value = userListData.total;
}
</script>

<style scoped>

</style>