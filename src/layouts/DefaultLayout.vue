<template>
  <div>
    <!-- <NavBar v-if="showNavBar" /> -->
    <Sidebar :isMenuOpen="isMenuOpen" @show-posts="togglePostList" @show-units="toggleUnitList"/>
    <router-view :showPostList="showPostList" :showUnitList="showUnitList"></router-view>
  </div>
</template>

<script>
// import NavBar from "@/components/NavBar.vue";
import Sidebar from "@/components/sideBar.vue";

export default {
  mounted(){
    require('@/assets/styles/layout.css');
  },
  components: {
   
    Sidebar,
  },
  data() {
    return {
      isMenuOpen: false,
      showPostList: false,
      showUnitList: false,
      showNavBar: true,
    };
  },
  // watch: {
  //   $route(to) {
  //     this.showNavBar = to.path !== '/units';
  //   },
  // },
  // created() {
  //   if (this.$route.path === '/units') {
     
  //     this.$router.replace('/');
  //   } else {
      
  //     this.showNavBar = this.$route.path !== '/units';
  //     this.showUnitList = this.$route.path === '/units';
  //   }
  // },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    togglePostList() {
      this.showPostList = true;
    },
    toggleUnitList() {
      this.showUnitList = true;
    },
  },
};
</script>
