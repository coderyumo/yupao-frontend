<template>
  <van-card
      v-for="user in props.userList"
      :desc="user.profile"
      :tag="user.gender===0?'男':'女'"
      :title="`${user.username}(编号：${user.planetCode})`"
      :thumb="user.avatarUrl==null?userAvatarUrl:user.avatarUrl"
  >
    <template #tags>
      <van-tag plain type="primary" style="margin-right: 8px;margin-top: 8px;" v-for="tag in user.tags">{{tag}}</van-tag>
    </template>
    <template #footer>
      <van-button size="mini" @click="doContact(user)">联系我</van-button>
    </template>
  </van-card>
  <van-dialog v-model:show="isShowContact" title="联系方式" show-cancel-button>
    <van-contact-card  type="edit" :name="currentUser.username" :tel="currentUser.phone" :editable="false" />
  </van-dialog>
</template>

<script setup lang="ts">
import {defineProps, ref} from "vue";
  import {UserType} from "../models/user";
  const isShowContact = ref(false);
  const currentUser = ref();
  const userAvatarUrl = ref('https://i1.hdslb.com/bfs/archive/1c653aefb7880924037ebc0adbcb49c97e00d77e.jpg');
  interface UserCardListProps {
    userList: UserType[]
  }
  const props = defineProps<UserCardListProps>();

  const doContact = (user) =>{
    isShowContact.value = true;
    currentUser.value = user;
  }
</script>

<style scoped>

</style>