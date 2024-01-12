<template>
  <van-card
      v-for="user in props.userList"
      :desc="user.profile"
      :tag="user.gender===0?'男':'女'"
      :thumb="user.avatarUrl==null?userAvatarUrl:user.avatarUrl"
      :title="`${user.username}(编号：${user.planetCode})`"
  >
    <template #tags>
      <van-tag v-for="tag in user.tags" plain style="margin-right: 8px;margin-top: 8px;" type="primary">{{ tag }}
      </van-tag>
    </template>
    <template #footer>

      <van-button size="mini" @click="doContact(user)">联系我</van-button>
    </template>
  </van-card>
  <van-dialog v-model:show="isShowContact" show-cancel-button title="联系方式">
    <van-button size="normal" type="primary" @click="addFriend(currentUser)">添加好友</van-button>
    <van-contact-card :editable="false" :name="currentUser.username" :tel="currentUser.phone" type="edit"/>
  </van-dialog>
</template>

<script lang="ts" setup>
import {defineProps, ref} from "vue";
import {UserType} from "../models/user";
import {getCurrentUser} from "../services/user";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";

const isShowContact = ref(false);
const currentUser = ref();
const userAvatarUrl = ref([]);

interface UserCardListProps {
  userList: UserType[]
}

const props = defineProps<UserCardListProps>();

const token = localStorage.getItem("token");
if (token == null) {
  window.location.href = "/user/login"
}

const doContact = (user) => {
  isShowContact.value = true;
  currentUser.value = user;
}

const addFriend = async (user) => {
  const userData = await getCurrentUser();
  const res = await myAxios.post("/user/friend/add", {
    senderId: userData.data.id,
    recipientId: user.id,
    userAccount: token.split('-')[0],
    uuid: token.split('-')[1]
  })
  console.log(res,'添加好友')
  if (res.code===0 && res.data){
    showSuccessToast('已发送好友申请');
  }else {
    showFailToast('操作失败' + (res.description ? `，${res.description}` : ''));
  }
}

</script>

<style scoped>

</style>