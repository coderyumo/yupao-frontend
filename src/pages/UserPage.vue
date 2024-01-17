<template>
  <div v-if="user">
    <van-cell :value="user.userAccount" title="当前用户"/>
    <van-cell is-link title="修改信息" to="/user/update"/>
    <van-cell is-link title="我的好友" to="/user/my/friend"/>
    <van-cell is-link title="我加入的队伍" to="/team/my/join"/>
    <van-cell is-link title="我创建的队伍" to="/team/my/create"/>
    <van-cell is-link title="退出登录" @click="logout"/>
    <van-cell title="我的标签"/>
    <van-row v-if="user.tags.length > 0" gutter="16">
      <van-col v-for="tag in user.tags" style="padding: 15px">
        <van-tag size="large" type="success">{{ tag }}</van-tag>
      </van-col>
    </van-row>
  </div>

</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user.ts";

const router = useRouter();
const user = ref();

onMounted(async () => {
      const token = localStorage.getItem("token");
      if (token == null) {
        window.location.href = '/user/login'
      }
      const res = await getCurrentUser();
      if (res.code === 0) {
        if (res.data.tags) {
          res.data.tags = JSON.parse(res.data.tags)
        }
        user.value = res.data;
        console.log(res.data.tags);
      } else {
        showFailToast('获取用户信息失败')
        await router.push('/user/login')
      }
    }
)

const logout = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const res = myAxios.post("/user/logout", {
    userAccount: token.split('-')[0],
    uuid: token.split('-')[1]
  })
      .then(function (response) {
        console.log('/user/logout success', response.data);
        if (response.code === 0 && response.data) {
          window.location.href = "/user/login"
        }
        return response?.data?.records;
      })
      .catch(function (error) {
        console.log('/user/recommend error' + error);
        showFailToast('请求失败');
      });

}

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue
    }
  })
}
</script>

<style scoped>

</style>