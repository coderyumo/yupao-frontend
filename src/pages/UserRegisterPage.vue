<template>
  <div @click="handlePageClick">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="username"
            name="username"
            label="昵称"
            placeholder="请输入昵称"
            :rules="[{ required: true, message: '请输入昵称' }]"
        />
        <van-field
            v-model="userAccount"
            name="userAccount"
            label="账号"
            placeholder="请输入账号"
            :rules="[{ required: true, message: '请输入账号' }]"
        />
        <van-field
            v-model="phone"
            name="phone"
            label="电话号码"
            placeholder="请输入电话号码"
            :rules="[{ required: true, message: '请输入电话号码' }]"
        />

        <van-field
            v-model="email"
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[{ required: true, message: '请输入邮箱' }]"
        />
        <van-field name="radio" label="性别">
          <template #input>
            <van-radio-group v-model="gender" direction="horizontal">
              <van-radio name="0">男</van-radio>
              <van-radio name="1">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field name="checkboxGroup" label="标签">
          <template #input>
            <van-button round v-if="activeIds.length === 0" type="success" @click="showTagList = true">选择你的标签</van-button>
          </template>
        </van-field>
        <van-row gutter="16" v-if="activeIds.length > 0" >
          <van-col v-for="tag in activeIds" style="padding: 8px">
            <van-tag :show="true" closeable size="medium" type="primary" @close="doClose(tag)">
              {{ tag }}
            </van-tag>
          </van-col>
        </van-row>
        <van-field name="uploader" label="头像上传">
          <template #input>
            <van-uploader v-model="avatarUrl"
                          accept="image/*"
                          reupload max-count="1"
                          :after-read="uploadAvatar"/>
          </template>
        </van-field>
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
        <van-button round block type="primary" native-type="submit" :disabled ="isShowRegister">
          注册
        </van-button>
      </div>
    </van-form>
    <van-dialog v-model:show="showTagList" title="标签" show-cancel-button @confirm="showCheckTag" @cancel="">
      <form action="/public">
        <van-search
            v-model="searchText"
            show-action
            placeholder="请输入需要搜索的标签"
            @search="onSearch"
            @cancel="onCancel"
        />
      </form>
      <van-divider content-position="left">已选标签</van-divider>
      <div v-if="activeIds.length === 0">请选择标签</div>
      <van-row gutter="16" >
        <van-col v-for="tag in activeIds" style="padding: 8px">
          <van-tag :show="true" closeable size="medium" type="primary" @close="doClose(tag)">
            {{ tag }}
          </van-tag>
        </van-col>
      </van-row>

      <van-divider content-position="left">选择标签</van-divider>
      <van-divider content-position="left"/>
      <van-tree-select
          v-model:active-id="activeIds"
          v-model:main-active-index="activeIndex"
          :items="tagList"
      />
    </van-dialog>
  </div>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onBeforeUnmount, onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";

const route = useRoute();
const router = useRouter();

const userAccount = ref('');
const username = ref('');
const userPassword = ref('');
const checkPassword = ref('');
const planetCode = ref('');
const phone = ref('');
const email = ref('');
const show = ref(false);
const isShowRegister = ref(true);

const showTagList = ref(false);
const url = ref('');
const avatarUrl = ref([]);
const gender = ref('0');
const searchText = ref('');
const originTagList = [
  {
    text: '性别',
    children: [
      {text: '男', id: '男'},
      {text: '女', id: '女'},
    ],
  },
  {
    text: '年级',
    children: [
      {text: '高一', id: '高一',},
      {text: '高二', id: '高二',},
      {text: '高三', id: '高三',},
      {text: '大一', id: '大一',},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
      {text: '大四', id: '大四'},
      {text: '研一', id: '研一'},
      {text: '研二', id: '研二'},
      {text: '研三', id: '研三'},
    ],
  },
  {
    text: '编程语言',
    children: [
      {text: 'Java', id: 'Java',},
      {text: 'Python', id: 'Python',},
      {text: 'C', id: 'C',},
      {text: 'Vue', id: 'Vue',},
      {text: 'React', id: 'React',},
      {text: 'Angular', id: 'Angular',},
      {text: 'C++', id: 'C++',},
      {text: 'Go', id: 'Go'},
      {text: 'C#', id: 'C#'},
    ],
  },
  {
    text: '目标',
    children: [
      {text: '考研', id: '考研',},
      {text: '春招', id: '春招',},
      {text: '秋招', id: '秋招',},
      {text: '考公', id: '考公',},
      {text: '竞赛', id: '竞赛',},
      {text: '转行', id: '转行',},
      {text: '跳槽', id: '跳槽',},
    ],
  },
  {
    text: '段位',
    children: [
      {text: '初级', id: '初级',},
      {text: '中级', id: '中级',},
      {text: '高级', id: '高级',},
      {text: '架构师', id: '架构师',},
    ],
  },
  {
    text: '状态',
    children: [
      {text: '乐观', id: '乐观',},
      {text: 'emo', id: 'emo',},
      {text: '一般', id: '一般',},
      {text: '单身', id: '单身',},
      {text: '已婚', id: '已婚',},
      {text: '有对象', id: '有对象',},
    ],
  },
]

let tagList = ref(originTagList);
console.log(tagList.value);


const onSearch = (val) => {
  tagList.value = originTagList.map(parentTag => {
    const tempChildren = parentTag.children.filter(item => item.text.includes(searchText.value));
    return { ...parentTag, children: tempChildren };
  });
};
const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
};

//已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);


const showCheckTag = ()=>{
  console.log('activeIds',activeIds.value);
}


//移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag;
  })
}


/**
 * 控制注册按钮
 */
const handleGlobalBlur = (event) => {
  // 在这里处理全局失去焦点事件触发后的逻辑
  console.log('页面失去焦点了！');
  if (username.value != ''
      && userAccount.value !=''
      && url.value !=''
      && planetCode.value !=''
      && phone.value !=''
      && email.value !=''
      && userPassword.value !=''
      && checkPassword.value !=''
      && activeIds.value.length > 0 ){

    isShowRegister.value = false;
  }
  // 这里可以添加你的处理逻辑，根据需要操作页面上的元素或执行其他操作
};

const handlePageClick = (event) => {
  // 在页面组件中捕获点击事件，并阻止其冒泡到 document 上触发全局失焦事件
  event.stopPropagation();
  if (username.value != ''
      && userAccount.value !=''
      && url.value !=''
      && planetCode.value !=''
      && userPassword.value !=''
      && checkPassword.value !=''
      && activeIds.value.length > 0 ){
    isShowRegister.value = false;
  }
  // 这里可以添加页面点击事件的处理逻辑
  console.log('点击了页面！');
};

onMounted(() => {
  // 在组件 mounted 时添加事件监听器
  document.addEventListener('click', handleGlobalBlur);
});

onBeforeUnmount(() => {
  // 在组件 unmounted 时移除事件监听器，以防止内存泄漏
  document.removeEventListener('click', handleGlobalBlur);
});

/**
 * 上传头像
 * @param file
 */
const uploadAvatar = (file) => {
  // console.log(file);
  // 'file' 参数包含了用户选择的图片文件
  const formData = new FormData();
  formData.append('file', file.file)
  const response = myAxios.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
      .then(function (response) {
        console.log('/file/upload success', response.data);
        url.value =  response.data;
        return response?.data?.records;
      })
      .catch(function (error) {
        console.log('/file/upload error' + error);
        showFailToast('请求失败');
      });
}

/**
 * 注册用户
 */
const onSubmit = async () => {

  const tags = JSON.stringify(activeIds.value)

  console.log('url', url);
  const res = await myAxios.post('/user/register', {
    username: username.value,
    userAccount: userAccount.value,
    tags: tags,
    avatarUrl: url.value,
    phone: phone.value,
    gender: gender.value,
    email: email.value,
    planetCode: Number(planetCode.value),
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
  })
  console.log('用户注册', res);
  if (res.code === 0 && res.data) {
    localStorage.setItem("token", res.data);
    showSuccessToast("注册成功");
    await router.replace('/user/login')
  } else {
    showFailToast('注册失败' + (res.description ? `，${res.description}` : ''))
    // await router.replace('/user/register')
  }
};
</script>

<style scoped>

</style>