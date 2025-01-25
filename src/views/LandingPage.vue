<template>
  <header>
    <nav class="navbar">
      <ul class="links">
        <button class="exit-btn"><li><router-link to="/">خانه</router-link></li></button>
        <button class="exit-btn"><li><router-link to="/profile">پروفایل</router-link></li></button>
        <button class="exit-btn"><li><router-link to="/about">درباره ما</router-link></li></button>
      </ul>
      <div class="dropdown">
        <button class="exit-btn" @click="toggleDropdown">
          <img src="@/assets/images/down-arrow.png" style="width: 18px; height: 18px; margin-top: 5px;">
          خوش آمدید
        </button>
        <ul v-if="dropdownVisible" class="dropdown-menu">
          <li><router-link to="/dashboard" class="menu-item">مدیریت <img src="@/assets/images/control-system.png" style="width: 20px; height: 20px; margin-left: 5px;"></router-link></li>
          <li><router-link class="exit menu-item" to="/">خروج <img src="@/assets/images/logout.png" alt="exit icon" style="width: 18px; height: 18px; margin-left: 5px;"></router-link></li>
        </ul>
      </div>
    </nav>
    <div class="small-images">
      <img src="../assets/images/banner/shaps1.png" alt="" class="small-img">
      <img src="../assets/images/banner/shaps3.png" alt="" class="small-img">
      <img src="../assets/images/banner/shaps5.png" alt="" class="small-img">
      <img src="../assets/images/banner/shaps2.png" alt="" class="small-img">
      <img src="../assets/images/banner/shaps6.png" alt="" class="small-img">
      <img src="../assets/images/banner/shaps4.png" alt="" class="small-img">
      <img src="../assets/images/banner/shaps7.png" alt="" class="small-img">
    </div>
  </header>
  <div class="circle-overlay">
  <img class="background-image" src="../assets/images/1cd8511e5912c0915ab836d8e551efd6.gif" alt="GIF">
</div>

  <!-- <div class="circle-overlay">
  <video autoplay muted loop class="background-video">
    <source src="../assets/images/original-93e862b833e0863e1674841db3918ff6.mp4" type="video/mp4">
    مرورگر شما از ویدیو پشتیبانی نمی‌کند.
  </video>
</div> -->

</template>

<script>
export default {
  mounted() {
    require('@/assets/styles/landing.css');
  },
  data() {
    return {
      dropdownVisible: false
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    closeDropdown() {
      this.dropdownVisible = false;
    }
  }
};
</script>
