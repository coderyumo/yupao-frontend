<template>
  <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <div name="content" style="padding-bottom: 50px;">
    <router-view/>
  </div>

  <van-tabbar route @change="onChange">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
<!--    <van-tabbar-item to="/message" icon="friends-o" name="message" dot>消息</van-tabbar-item>-->
  </van-tabbar>

</template>

<script setup lang="ts">
import {showToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import routes from "../config/route";
import {getCurrentUser} from "../services/user";

const router = useRouter();
const route = useRoute();
const DEFAULT_TITLE = '学习圈子';
const title = ref(DEFAULT_TITLE);

router.beforeEach((to,from)=>{
  const toPath =to.path;
  const route = routes.find((route)=>{
    return toPath === route.path;
  })
  title.value=route?.title??DEFAULT_TITLE
})



const onClickLeft = () => {
  router.back()
}
const onClickRight = () => {
  router.push('/search')
}
// const active = ref("index");

</script>

<style scoped>

</style>