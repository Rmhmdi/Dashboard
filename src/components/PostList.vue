<template>
  <div v-if="showPostList" class="post-list">
    <div v-for="(post, index) in posts" :key="index" class="post">
      <img :src="post.image" alt="Post Image" class="post-image" />
      <p class="post-text">{{ post.text }}</p>
      <button @click="confirmDelete(index)" class="delete-btn">حذف</button>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <button @click="cancelDelete" class="close-btn">&times;</button>

        <p>حذف شود؟</p>
        <button @click="deletePost" class="confirm-btn">بله</button>
        <button @click="cancelDelete" class="cancel-btn">خیر</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showPostList: {
      type: Boolean,
      default: false, 
    },
  },
  data() {
    return {
      showModal: false,
      posts: [
        {
          text: "درود",
          image: require("@/assets/images/logo.png"),
        },
        {
          text: "سلام",
          image: require("@/assets/images/logo.png"),
        },
      ],
      postToDelete: null,
    };
  },
  methods: {
    confirmDelete(index) {
      this.postToDelete = index;
      this.showModal = true;
    },
    deletePost() {
      if (this.postToDelete !== null) {
        this.posts.splice(this.postToDelete, 1);
        this.postToDelete = null;
        this.showModal = false;
      }
    },
    cancelDelete() {
      this.postToDelete = null;
      this.showModal = false;
    },
  },
};
</script>