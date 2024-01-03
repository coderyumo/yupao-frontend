<template>
  <div>
    <input v-model="inputText" placeholder="输入要生成二维码的文本"/>
    <button @click="generateQRCode">生成二维码</button>
    <div v-if="qrCodeUrl">
      <img :src="qrCodeUrl" alt="QR Code"/>
    </div>
  </div>
</template>

<script setup>
import QRCode from 'qrcode';
import {ref} from "vue";

const inputText = ref('');
const qrCodeUrl = ref('');
const generateQRCode = async () => {
  try {
    if (inputText.value) {
      qrCodeUrl.value = await QRCode.toDataURL(inputText.value);
    }
  } catch (error) {
    console.error('生成二维码时出错:', error);
  }
};
</script>
