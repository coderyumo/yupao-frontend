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
        <van-button size="small" type="primary" @click="showDetail(team)">
          队员详情
        </van-button>
        <van-button size="small" v-if="!team.isJoin || team.memberId.length===team.maxNum" type="primary" @click="joinTeam(team.id,team.status)">
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

        {{
          team.memberId.length}}
        {{
          team.maxNum
        }}

        {{
          team.memberId.length== team.maxNum
        }}
      </template>

    </van-card>
    <van-dialog v-model:show="show" title="请输入密码" show-cancel-button @confirm="joinEncryptTeam()" @cancel="doClear">
      <van-field v-model="password" placeholder="请输入密码"/>
    </van-dialog>

    <van-dialog v-model:show="showMembers" title="队员详情" show-cancel-button>
      <user-card-list :user-list="userList"/>
    </van-dialog>


  </div>

</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from "vue";
import {TeamType} from "../models/team";
import {TeamStatusEnum} from "../constants/team";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user";
import {useRouter} from "vue-router";

interface TeamCardListProps {
  teamList: TeamType[]
}

const props = defineProps<TeamCardListProps>();

const currentUserId = ref(0);
const router = useRouter();
const show  = ref(false);
const password = ref('');
const teamId = ref(0);
const showMembers = ref(false);
const userList = ref([]);

const doClear = () =>{
  password.value = '';
}


/**
 * 展示队伍详情
 * @param team
 */
const showDetail = (team)=>{
  showMembers.value = true;

  if (team.userList) {
    team.userList.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = team.userList;
  }
  userList.value = team.userList
}

// 当前用户
onMounted(async () => {
  const currentUser = await getCurrentUser();
  currentUserId.value = currentUser.data.id;
  console.log('userId',currentUserId.value);
})



const token = localStorage.getItem("token");
if (token == null) {
  window.location.href = "/user/login"
}



/**
 * 加入队伍
 * @param id
 * @param status
 */
const joinTeam = async (id: number,status:number) => {
  if (status===0){
    const res = await myAxios.post('/team/join', {
      teamId: id,
      password: password.value,
      userAccount: token.split('-')[0],
      uuid: token.split('-')[1]
    })

    if (res?.code === 0) {
      showSuccessToast("加入成功")

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showFailToast('加入失败' + (res.description ? `，${res.description}` : ''))

    }
  }else {
    teamId.value = id;
    show.value = true;
  }

}


/**
 * 加入加密队伍
 * @param id
 * @param password
 */
const joinEncryptTeam = async () => {

  const res = await myAxios.post('/team/join', {
    teamId: teamId.value,
    password: password.value,
    userAccount: token.split('-')[0],
    uuid: token.split('-')[1]
  })

  if (res?.code === 0) {
    showSuccessToast("加入成功")
    doClear()
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    doClear()
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
    userAccount: token.split('-')[0],
    uuid: token.split('-')[1],
    teamId:id
  })

  console.log('res',res);
  if (res.code === 0) {
    showSuccessToast("操作成功")
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
    userAccount: token.split('-')[0],
    uuid: token.split('-')[1],
    teamId:id
  })
  if (res.code === 0) {
    showSuccessToast("操作成功")
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    showFailToast('操作失败' + (res.description ? `，${res.description}` : ''))
  }
}


</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 132px;
  object-fit: unset;
}
</style>