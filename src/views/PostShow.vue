<template>
  <PostList :showPostList="showPostList" />
</template>

<script>
import PostList from "@/components/PostList.vue";

export default {
  components: {
      PostList,
  },
  props: {
      showPostList: {
          type: Boolean,
          default: false, 
      }
  },
};
</script>