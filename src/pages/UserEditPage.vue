<template>
  <van-form @submit="onSubmit">
    <van-field
        v-if="editUser.editKey !='gender' && editUser.editKey !='tags' && editUser.editKey !='avatar'"
        v-model="editUser.currentValue"
        :name="editUser.editKey"
        :label="editUser.editName"
        :placeholder="`请输入${editUser.editName}`"
    />
<!--   修改性别 -->
    <van-radio-group style="padding: 10px; margin: 10px;" v-if="editUser.editKey =='gender'"
                     v-model="editUser.currentValue" direction="horizontal">
      <van-radio name="0">男</van-radio>
      <van-radio name="1">女</van-radio>
    </van-radio-group>

<!--修改标签-->
    <div style="text-align: center">
      <van-button type="success" v-if="editUser.editKey =='tags'" size="small" @click="showTagList = true">选择你的标签</van-button>
      <van-row gutter="16" style="padding-top: 20px;padding-left: 70px;"
               v-if="editUser.editKey =='tags' && editUser.currentValue.length > 0">
        <van-col v-for="tag in activeIds " style="padding: 8px">
          <van-tag :show="true" closeable size="medium" type="primary" @close="doClose(tag)">
            {{ tag }}
          </van-tag>
        </van-col>
      </van-row>
    </div>
<!--修改头像-->
    <van-field name="uploader" label="头像上传">
      <template #input>
        <van-uploader v-model="avatarUrlList"
                      accept="image/*"
                      reupload max-count="1"
                      :after-read="uploadAvatar"/>
      </template>
    </van-field>

    <div style="margin: 16px;" v-if="editUser.editKey !='tags' && editUser.editKey !='avatar'">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
  <div style="margin: 16px;" v-if="editUser.editKey =='tags'">
    <van-button round block type="primary" native-type="submit" @click="updateTags">
      提交
    </van-button>
  </div>
  <div style="margin: 16px;" v-if="editUser.editKey =='avatar'">
    <van-button round block type="primary" native-type="submit" @click="updateAvatar">
      提交
    </van-button>
  </div>

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
    <van-row gutter="16">
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
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import {getCurrentUser} from "../services/user.ts";

const route = useRoute();
const router = useRouter();
const showTagList = ref(false);
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
const avatarUrlList = ref([])
//已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);

//已选中的标签
let tagList = ref(originTagList);
console.log(tagList.value);

onMounted(() => {
  const res = getCurrentUser()
      .then(function (response) {
        console.log('getCurrentUser success', response.data);
        const tags = response.data.tags;
        activeIds.value = JSON.parse(tags);
        const newAvatarObj = {
          url: response.data.avatarUrl,
          // 其他属性，如果有的话
        };
        avatarUrlList.value.push(newAvatarObj);
        console.log(avatarUrlList.value);
        return response?.data?.records;
      })
      .catch(function (error) {
        console.log('getCurrentUser error' + error);
        showFailToast('请求失败');
      });
})


const onSearch = (val) => {
  tagList.value = originTagList.map(parentTag => {
    const tempChildren = parentTag.children.filter(item => item.text.includes(searchText.value));
    return {...parentTag, children: tempChildren};
  });
};
const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
};

const showCheckTag = () => {
  console.log('activeIds', activeIds.value);
}

//移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag;
  })
}


/**
 * 编辑参数
 */
const editUser = ref({
  id: route.query.editId,
  editKey: route.query.editKey,
  editName: route.query.editName,
  currentValue: route.query.currentValue
});

/**
 * 修改信息
 */
const onSubmit = async () => {
  const data = await getCurrentUser()

  const token = localStorage.getItem("token").split('-');
  const res = await myAxios.post('/user/update', {
    'id': data.data.id,
    'uuid': token[1],
    'currentUserAccount': token[0],
    [editUser.value.editKey]: editUser.value.currentValue,
  })
  console.log(res, '更新请求')
  if (res.code === 0 && res.data) {
    showSuccessToast('修改成功');
    router.back()
  } else {
    showFailToast('修改失败');
  }
};

/**
 * 修改标签
 */
const updateTags = async () => {
  const data = await getCurrentUser()

  const token = localStorage.getItem("token").split('-');
  const res = await myAxios.post('/user/update', {
    id: data.data.id,
    uuid: token[1],
    currentUserAccount: token[0],
    tags: JSON.stringify(activeIds.value),
  })
  console.log(res, '更新请求')
  if (res.code === 0 && res.data) {
    showSuccessToast('修改成功');
    router.back()
  } else {
    showFailToast('修改失败');
  }
};

const url = ref('');

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
 * 修改头像
 */
const updateAvatar = async () => {
  const data = await getCurrentUser()

  const token = localStorage.getItem("token").split('-');
  const res = await myAxios.post('/user/update', {
    id: data.data.id,
    uuid: token[1],
    currentUserAccount: token[0],
    avatarUrl: url.value,
  })
  console.log(res, '更新请求')
  if (res.code === 0 && res.data) {
    showSuccessToast('修改成功');
    router.back()
  } else {
    showFailToast('修改失败');
  }
}



</script>

<style scoped>

</style>