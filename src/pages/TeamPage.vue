<template>
队伍
</template>

<script setup>
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {getCurrentUser} from "../services/user.ts";

const router = useRouter();
onMounted(async () => {
      const res = await getCurrentUser();
      if (res.code===0 ){
        await router.push('/team')
      }else {
        await router.push('/user/login')
      }
    }
)
</script>

<style scoped>

</style>