<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import backgroundImage from '@/assets/pexels-andrea-piacquadio-3756165.jpg'
import setBackgroundImage from '@/utils/setBackgroundImage'

export default {
  mounted() {
    setBackgroundImage(backgroundImage)
  }
}
</script>
