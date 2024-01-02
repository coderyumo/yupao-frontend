<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="addTeamData.name"
            name="name"
            label="队伍名称"
            placeholder="请输入队伍名称"
            :rules="[{ required: true, message: '请输入队伍名称' }]"
        />
        <van-field
            v-model="addTeamData.description"
            autosize
            rows="4"
            name="description"
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
            :rules="[{ required: true, message: '请输入队伍描述' }]"
        />

        <van-field name="stepper" label="最大人数">
          <template #input>
            <van-stepper v-model="addTeamData.maxNum" max="10"/>
          </template>
        </van-field>
        <van-field
            is-link
            readonly
            clickable
            name="date-picker"
            label="过期时间"
            :value="addTeamData.expireTime"
            v-model="addTeamData.expireTime"
            :placeholder="'点击选择过期时间'"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker-group
              title="设定过期日期"
              :tabs="['选择日期', '选择时间']"
              @confirm="onConfirm"
              @cancel="showPicker = false"
          >
            <van-date-picker
                v-model="currentDate"
                :min-date="minDate"
            />
            <van-time-picker
                v-model="currentTime"
                :columns-type="columnsType"
            />
          </van-picker-group>
        </van-popup>

        <van-field name="radio" label="房间类型">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-if="Number(addTeamData.status) === 2"
            v-model="addTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          创建队伍
        </van-button>
      </div>
    </van-form>
  </div>

</template>

<script setup lang="ts">

import {ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";
import {useRouter} from "vue-router";

const currentToken = localStorage.getItem("token").split('-');
const initFromData = {
  "name": "",
  "description": "",
  "expireTime": new Date(),
  "maxNum": 0,
  "password": "",
  "status": 0,
  "userAccount": currentToken[0],
  "uuid": currentToken[1]
}
//用户填写的表单数据
const addTeamData = ref({...initFromData})
const minDate = new Date();

const router = useRouter();

// 展示日期选择器
const currentDate = ref(['2022', '06', '01']);		//定义一个初始时间(年月日)
const currentTime = ref(['12', '00', '00']);		//定义一个初始时间(时分秒)
const columnsType = ['hour', 'minute', 'second'];
const showPicker = ref(false);
const onConfirm = ({ selectedValues }) => {
  //组合过期时间，'T'是满足后端序列化配的
  addTeamData.value.expireTime = currentDate.value.join('-') + ' ' + currentTime.value.join(':');
  showPicker.value = false;		//有了这行才会使picker点击“确认”后自动关闭
}

const onSubmit = async () =>{
  const res = await myAxios.post('/team/add',{
    "name": addTeamData.value.name,
    "description": addTeamData.value.description,
    "expireTime": addTeamData.value.expireTime,
    "maxNum": addTeamData.value.maxNum,
    "password": addTeamData.value.password,
    "status":Number(addTeamData.value.status),
    "userAccount": currentToken[0],
    "uuid": currentToken[1]
  })
  if (res?.code === 0 && res.data){
    showSuccessToast("添加成功")
    await router.push({
      path: '/team',
      replace: true
    })
  }else {
    showFailToast("添加失败")
  }
}
</script>

<style scoped>

</style>