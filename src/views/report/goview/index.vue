<template>
  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">
    <IFrame :src="src" />
  </ContentWrap>
</template>
<script lang="ts" setup>
defineOptions({ name: 'GoView' })

const src = ref(import.meta.env.VITE_GOVIEW_URL)
</script>
