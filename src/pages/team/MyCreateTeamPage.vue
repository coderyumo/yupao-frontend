<template>
  <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
  <van-button type="primary" @click="doAddTeam">创建队伍</van-button>
  <TeamCardList :team-list="teamList"/>
  <van-empty description="数据为空" v-if="!teamList ||teamList.length < 1"/>
  <div id="teamPage">
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {getCurrentUser} from "../../services/user.ts";
import TeamCardList from "../../components/TeamCardList.vue";
import myAxios from "../../plugins/myAxios.ts";
import {showFailToast} from "vant";


const teamList = ref([]);

const router = useRouter();
const searchText = ref('');


const listTeam = async (val: string,userId: number) => {
  const token = localStorage.getItem("token").split('-');
  const resData = await myAxios.get('/team/list/my/create', {
    params: {
      searchText: val,
      userAccount: token[0],
      uuid: token[1]
    }
  })
  if (resData?.code === 0) {
    teamList.value = resData.data
  } else {
    showFailToast("加载失败，刷新重试")
  }
}

//搜索队伍
const onSearch = (val) => {
  listTeam('',0)
};


const doAddTeam = () => {
  router.push({
    path: '/team/add'
  })
}
</script>

<style scoped>

</style>