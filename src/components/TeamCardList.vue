<template>
  <div id="teamCardList">
    <van-card
        v-for="team in props.teamList"
        :desc="team.description"
        :title="team.name"
        :tag="currentUserId === team.userId?'房主':''"
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
        <!--仅未加入队伍可见-->
        <van-button size="small" v-if="!team.isJoin" type="primary" @click="joinTeam(team.id,team.password)">
          加入队伍
        </van-button>
        <!--仅创建人可见-->
        <van-button size="small" v-if="team.userId === currentUserId" type="primary" @click="updateTeam(team.id)">
          修改队伍
        </van-button>
        <!--仅加入队伍可见,非创建人可见-->
        <van-button size="small" v-if="team.userId !== currentUserId && team.isJoin" type="primary" @click="quitTeam(team.id)">
          退出队伍
        </van-button>
        <van-button size="small" v-if="team.userId === currentUserId" type="danger" @click="disbandTeam(team.id)">
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
import {List, Loading, passwordInputProps, showFailToast, showSuccessToast, showToast} from "vant";
import {getCurrentUser} from "../services/user";
import {useRouter} from "vue-router";

interface TeamCardListProps {
  teamList: TeamType[]
}

const props = defineProps<TeamCardListProps>();

const currentUserId = ref(0);
const router = useRouter();

// 当前用户
onMounted(async () => {
  const currentUser = await getCurrentUser();
  currentUserId.value = currentUser.data.id;
  console.log('userId',currentUserId.value);
})


/**
 * 加入队伍
 * @param id
 * @param password
 */
const token = localStorage.getItem("token").split('-');
const joinTeam = async (id: number, password: string) => {
  const res = await myAxios.post('/team/join', {
    teamId: id,
    password: password,
    userAccount: token[0],
    uuid: token[1]
  })

  if (res?.code === 0) {
    showSuccessToast("加入成功")
    window.location.reload();
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

/**
 * 退出队伍
 * @param id
 */
const quitTeam =async (id:number) =>{
  const  res = await myAxios.post('/team/quit',{
    userAccount: token[0],
    uuid: token[1],
    teamId:id
  })

  console.log('res',res);
  if (res.code === 0) {
    showSuccessToast("操作成功")
    window.location.reload();
  } else {
    showFailToast('操作失败' + (res.description ? `，${res.description}` : ''))
  }
}

/**
 * 解散队伍
 * @param id
 */
const disbandTeam = async (id:number) =>{
  const res = await myAxios.post('/team/disband',{
    userAccount: token[0],
    uuid: token[1],
    teamId:id
  })
  if (res.code === 0) {
    showSuccessToast("操作成功")
    window.location.reload();
  } else {
    showFailToast('操作失败' + (res.description ? `，${res.description}` : ''))
  }
}

console.log('currentUserId',currentUserId.value);



</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 132px;
  object-fit: unset;
}
</style>