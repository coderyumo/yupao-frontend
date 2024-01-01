<template>
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
  <van-button type="primary" @click="doSearchResult" block>搜索</van-button>

</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
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

const token = localStorage.getItem("token");
if (token == null) {
  const redirectUrl = window.location.href;
  window.location.href=`/user/login?redirect=${redirectUrl}`
}

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


//移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag;
  })
}


//获取所有标签
const getAllTags = () =>{

}


/**
 * 执行搜索
 */
const doSearchResult = () =>{
  router.push({
    path: '/user/list',
    query: {
      tags: activeIds.value
    }
  })
}
</script>

<style scoped>

</style>