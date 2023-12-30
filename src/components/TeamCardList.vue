<template>
  <div id="teamCardList">
    <van-card
        v-for="team in props.teamList"
        :desc="team.description"
        :title="team.name"
        :thumb="team.createAvatarUrl"
    >
      <template #tags>
        <van-tag plain type="primary" style="margin-right: 8px;margin-top: 8px;">{{ TeamStatusEnum [team.status] }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
          已加入人数：{{ team.userList.length }}
        </div>
        <div>
          最大人数：{{ team.maxNum }}
        </div>
        <div>
          发布时间：{{ team.createTime }}
        </div>
        <div v-if="team.expireTime">
          过期时间：{{ team.expireTime }}
        </div>
      </template>
      <template #footer>
<!--        <van-button size="small" type="primary" @click="joinTeam(team.id,team.password)" v-if="isUserInTeam(team)">-->
        <van-button size="small" type="primary" @click="joinTeam(team.id,team.password)">
          加入队伍
        </van-button>
        <van-button size="small" v-if="userId === team.userId" type="primary" @click="updateTeam(team.id)">
          修改队伍
        </van-button>
        <van-button size="small" v-if="userId === team.userId" type="primary" @click="updateTeam(team.id)">
          退出队伍
        </van-button>
        <van-button size="small" v-if="userId === team.userId" type="primary" @click="updateTeam(team.id)">
          解散队伍
        </van-button>
      </template>
    </van-card>
  </div>

</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from "vue";
import {TeamType} from "../models/team";
import {TeamStatusEnum} from "../constants/team";
import myAxios from "../plugins/myAxios";
import {List, passwordInputProps, showFailToast, showSuccessToast, showToast} from "vant";
import {getCurrentUser} from "../services/user";
import {useRouter} from "vue-router";

interface TeamCardListProps {
  teamList: TeamType[]
}

const props = defineProps<TeamCardListProps>();

const userId = ref(0);
const router = useRouter();
/**
 * 加入队伍
 * @param id
 * @param password
 */
const joinTeam = async (id: number, password: string) => {
  const token = localStorage.getItem("token").split('-');
  const res = await myAxios.post('/team/join', {
    teamId: id,
    password: password,
    userAccount: token[0],
    uuid: token[1]
  })

  if (res?.code === 0) {
    showSuccessToast("加入成功")
  } else {
    showFailToast('加入失败' + (res.description ? `，${res.description}` : ''))
  }
}

/**
 * 去修改队伍
 * @param id
 */
const updateTeam = (id:number)=>{
  router.push({
    path:'/team/update',
    query:{
      id
    }
  })
}



// 当前用户
onMounted(async () => {
  const currentUser = await getCurrentUser();
  userId.value = currentUser.data.id;
})

</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 132px;
  object-fit: unset;
}
</style>