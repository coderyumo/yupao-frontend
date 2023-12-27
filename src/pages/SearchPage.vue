<template>
  <form action="/">
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

<script setup>
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
      {text: '大一', id: '大一',},
      {text: '大二', id: '大二'},
      {text: '大3', id: '大3'},
      {text: '大4', id: '大4'},
      {text: '大5', id: '大5'},
      {text: '大6', id: '大6'},
      {text: '大aaaaaaa', id: '大aaaaaaa'},
      {text: '大ddddd', id: '大ddddd'},
      {text: '大asdasdasd', id: '大asdasdasd'},
    ],
  }]
let tagList = ref(originTagList);
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