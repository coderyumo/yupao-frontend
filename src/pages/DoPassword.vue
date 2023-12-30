<template>
  <van-password-input
      :value="value"
      info="密码为 6 位数字"
      :error-info="errorInfo"
      :focused="showKeyboard"
      @focus="showKeyboard = true"
  />

  <van-button size="normal" type="primary" @click="joinTeam(team.id,team.password)">加入队伍</van-button>
  <van-number-keyboard
      v-model="value"
      :show="showKeyboard"
      @blur="showKeyboard = false"
  />
</template>

<script setup>
import {ref, watch} from "vue";

const value = ref('123');
const errorInfo = ref('');
const showKeyboard = ref(true);

watch(value, (newVal) => {
  if (newVal.length === 6 && newVal !== '123456') {
    errorInfo.value = '密码错误';
  } else {
    errorInfo.value = '';
  }
});
</script>

<style scoped>

</style>