<template>
  <aside class="sidebar" :class="{ 'is-open': isMenuOpen }">
    <div class="sidebar-header">
      <h1><img src="https://img.icons8.com/?size=100&id=Y9aaMCohZ2Md&format=png&color=000000"></h1>
    </div>
    <ul class="sidebar-links">
      <h4>
        <span>منو اصلی</span>
        <div class="menu-separator"></div>
      </h4>
      
      <li>
        <h4>
          <router-link to="/posts" @click="openPosts">
           <span class="material-symbols-outlined">پست ها </span>
          </router-link>
          <div class="menu-separ"></div>
        </h4>
      </li>
      <li>
        <h5>
          <router-link to="/units" >
            <span class="material-symbols-outlined">واحدها</span>
          </router-link>
          <router-link to="/units" @click="openUnits">
            <span class="management">مدیریت واحد</span>
          </router-link>
          <div class="menu-unit"></div>
        </h5>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  mounted(){
    require('@/assets/styles/sidebar.css');

  },
  props: {
    isMenuOpen: Boolean,
  },
  methods: {
    openPosts() {
      this.$emit('show-posts');
    },
    openUnits() {
      this.$emit('show-units');
    },
  },
};
</script>
