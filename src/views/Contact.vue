<template>
  <div class="contact">
    <h1>This is a contact page</h1>
  </div>
</template>

<script>
import backgroundImage from '@/assets/shutterstock_582394888_resize.jpg'
import setBackgroundImage from '@/utils/setBackgroundImage'

export default {
  mounted() {
    setBackgroundImage(backgroundImage)
  }
}
</script>
