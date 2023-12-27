<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请输入账号' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";

const route = useRoute();
const router = useRouter();

const userAccount = ref('');
const userPassword = ref('');
const onSubmit = async () => {
  const localToken = localStorage.getItem("token");
  const uuid = localToken ? localToken.split('-')[1] : ''
  const res = await myAxios.post('/user/login',{
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    uuid: uuid,
  })
  console.log('用户登录', res);
  if (res.code===0 && res.data){
    showSuccessToast('登录成功');
    localStorage.setItem("token",res.data);
    router.replace('/')
  }else {
    showFailToast('登录失败');
  }
};
</script>

<style scoped>

</style>