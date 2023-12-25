<template>
  <van-nav-bar
      title="标题"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
  <slot name="content">
    <template v-if="active==='index'">
      <Index/>
    </template>
    <template v-if="active==='team'">
      <Team/>
    </template>
    <template v-if="active==='user'">
      <Index/>
    </template>
  </slot>

  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>

</template>

<script setup>
import {showToast} from "vant";
import {ref} from "vue";
import Index from "../pages/Index.vue";
import Team from "../pages/Team.vue";

const onClickLeft = () => alert("左边")
const onClickRight = () => alert("右边")
const active = ref("index");
const onChange = (name) => showToast(`标签 ${name}`);

</script>

<style scoped>

</style>