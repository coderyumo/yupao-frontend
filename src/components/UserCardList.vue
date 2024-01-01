<template>
  <van-card
      v-for="user in props.userList"
      :desc="user.profile"
      :tag="user.gender===0?'男':'女'"
      :title="`${user.username}(编号：${user.planetCode})`"
      :thumb="user.avatarUrl"
  >
    <template #tags>
      <van-tag plain type="primary" style="margin-right: 8px;margin-top: 8px;" v-for="tag in user.tags">{{tag}}</van-tag>
    </template>
    <template #footer>
      <van-button size="mini">联系我</van-button>
    </template>
  </van-card>
</template>

<script setup lang="ts">
  import {defineProps} from "vue";
  import {UserType} from "../models/user";
  interface UserCardListProps {
    userList: UserType[]
  }
  const props = defineProps<UserCardListProps>();
</script>

<style scoped>

</style>