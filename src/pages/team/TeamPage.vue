<template>
  <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
  <van-tabs v-model:active="active" @click-tab="onClickTab">
    <van-tab title="公开" name="0"></van-tab>
    <van-tab title="加密" name="2"></van-tab>
    <van-tab title="私有" name="1" v-if="isAdmin===1"></van-tab>
  </van-tabs>
  <TeamCardList :team-list="teamList"/>
  <van-empty description="数据为空" v-if="!teamList ||teamList.length < 1"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {getCurrentUser} from "../../services/user.ts";
import TeamCardList from "../../components/TeamCardList.vue";
import myAxios from "../../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";


const teamList = ref([]);

const router = useRouter();
const searchText = ref('');
const active = ref('0')
const isAdmin = ref();
const onClickTab = ({ name }) => {
  listTeam('')
};

const listTeam = async (val = '') => {
  const token = localStorage.getItem("token");
  if (token == null) {
    const redirectUrl = window.location.href;
    window.location.href=`/user/login?redirect=${redirectUrl}`
  }
  const resData = await myAxios.get('/team/list', {
    params: {
      status:active.value,
      searchText: val,
      userAccount: token.split('-')[0],
      uuid: token.split('-')[1]
    }
  })
  if (resData?.code === 0) {
    console.log(resData.data.code);
    teamList.value = resData.data
    //获取当前用户
    const res = await getCurrentUser();
    console.log(res.data);
    isAdmin.value = res.data.userRole;
  } else {
    showFailToast('操作失败' + (resData.description ? `，${resData.description}` : ''))
     active.value='';
    await listTeam('')
  }

}



//搜索队伍
const onSearch = (val) => {
  listTeam(val)
};

onMounted(()=>{
  listTeam('');
})


const doAddTeam = () => {
  router.push({
    path: '/team/add'
  })
}


</script>

<style scoped>

</style>