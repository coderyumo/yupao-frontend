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
          v-model="planetCode"
          name="planetCode"
          type="number"
          label="星球编号"
          placeholder="请输入星球编号"
          @click="show=true"
          readonly
          :rules="[{ required: true, message: '请输入星球编号' }]"
      />
<!--      <van-field v-model="planetCode" readonly clickable @touchstart.stop="show = true" />-->
      <van-number-keyboard
          v-model="planetCode"
          :show="show"
          :maxlength="6"
          @blur="show = false"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
      />
      <van-field
          v-model="checkPassword"
          type="password"
          name="checkPassword"
          label="确认密码"
          placeholder="请输入确认密码"
          :rules="[{ required: true, message: '请输入确认密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        注册
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";

const route = useRoute();
const router = useRouter();

const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');
const planetCode = ref('');
const show = ref(false);
const onSubmit = async () => {

  const localToken = localStorage.getItem("token");
  const uuid = localToken ? localToken.split('-')[1] : ''
  const res = await myAxios.post('/user/register',{
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
    planetCode: Number(planetCode.value),
    uuid: uuid,
  })
  console.log('用户注册', res);
  if (res.code===0 && res.data){
    localStorage.setItem("token",res.data);
    showSuccessToast("注册成功");
    router.replace('/')
  }else {
    showFailToast('注册失败' + (res.description ? `，${res.description}` : ''))
    router.replace('/user/register')
  }
};
</script>

<style scoped>

</style>