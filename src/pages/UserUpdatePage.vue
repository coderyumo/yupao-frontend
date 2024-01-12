<template>
  <template v-if="user">
    <van-cell title="用户名" is-link to="/user/edit" :value="user.username" @click="toEdit('username','用户名',user.username)"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="自我介绍" is-link to="/user/edit" :value="user.profile" @click="toEdit('profile','自我介绍',user.profile)"/>
    
    <van-cell title="头像" to="/user/edit" is-link @click="toEdit('avatar','头像',user.avatarUrl)">
      <img style="height: 40px" :src="user.avatarUrl">
    </van-cell>
    <van-cell title="性别" to="/user/edit" is-link :value="user.gender===0?'男':'女'" @click="toEdit('gender','性别',user.gender)"/>
    <van-cell title="电话" to="/user/edit" is-link :value="user.phone" @click="toEdit('phone','电话',user.phone)"/>
    <van-cell title="邮箱" to="/user/edit" is-link :value="user.email" @click="toEdit('email','邮箱',user.email)"/>
    <van-cell title="我的标签" to="/user/edit" is-link :value="tags" @click="toEdit('tags','标签',user.tags)"/>
    <van-cell title="星球编号" :value="user.planetCode"/>
    <van-cell title="注册时间" :value="user.createTime"/>
  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user.ts";

const router = useRouter();
const user = ref();
let tags = ref([]);

onMounted(async () => {
  const res = await getCurrentUser();
    if (res.code===0 ){
      user.value = res.data
      let tagList = res.data.tags
      tagList = JSON.parse(tagList);
      tags = tagList.join(' ');
    }else {
      showFailToast('获取用户信息失败')
      await router.push('/user/login')
    }
  }
)

const toEdit = (editKey:string, editName:string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query :{
      editKey,
      editName,
      currentValue
    }
  })
}
</script>

<style scoped>

</style>