<template>
  <van-form @submit="onSubmit">
    <van-field
        v-if="editUser.editKey !='gender'"
        v-model="editUser.currentValue"
        :name="editUser.editKey"
        :label="editUser.editName"
        :placeholder="`请输入${editUser.editName}`"
    />
    <van-radio-group style="padding: 10px; margin: 10px;" v-if="editUser.editKey =='gender'" v-model="editUser.currentValue" direction="horizontal">
      <van-radio name="0">男</van-radio>
      <van-radio name="1">女</van-radio>
    </van-radio-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import {getCurrentUser} from "../services/user.ts";

const route = useRoute();
const router = useRouter();

const editUser = ref({
  id: route.query.editId,
  editKey: route.query.editKey,
  editName: route.query.editName,
  currentValue: route.query.currentValue
});

const onSubmit = async () => {
  const data = await getCurrentUser()

  const token = localStorage.getItem("token").split('-');
  const res = await myAxios.post('/user/update', {
    'id': data.data.id,
    'uuid': token[1],
    'currentUserAccount': token[0],
    [editUser.value.editKey]: editUser.value.currentValue,
  })
  console.log(res,'更新请求')
  if (res.code===0 && res.data){
    showSuccessToast('修改成功');
    router.back()
  }else {
    showFailToast('修改失败');
  }
};

</script>

<style scoped>

</style>