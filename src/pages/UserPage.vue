<template>
  <template v-if="user">
<!--    <van-card-->
<!--        :desc="`自我介绍: ${user.profile}`"-->
<!--        :tag="user.gender===0?'男':'女'"-->
<!--        :title="`编号：${user.planetCode}`"-->
<!--        :thumb="user.avatarUrl"-->
<!--    >-->
<!--      <template #tags>-->
<!--        <van-tag plain type="primary" style="margin-right: 8px;margin-top: 8px;" v-for="tag in user.tags">-->
<!--          {{ tag }}-->
<!--        </van-tag>-->
<!--      </template>-->
<!--    </van-card>-->
    <van-cell title="当前用户" :value="user.userAccount"/>
    <van-cell title="修改信息" is-link to="/user/update"/>
    <van-cell title="我加入的队伍" is-link to="/team/my/join"/>
    <van-cell title="我创建的队伍" is-link to="/team/my/create"/>
    <van-cell title="我的标签" is-link to="/user/tags"/>
  </template>
</template>

<script setup lang="ts">
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
    window.location.href='/user/login'
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