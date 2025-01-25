<template>
  <div class="center">
    <div class="container">
      <label class="close-btn fas fa-times" title="close"></label>
      <div class="text"> <p>{{ $t('login') }}</p></div>
      <form @submit.prevent="login">
        <div class="data">
          <input type="text" v-model="params.mobile" placeholder="موبایل" required>
          <p v-if="errors.mobile" class="error">{{ errors.mobile.join(', ') }}</p>
        </div>
        <div class="data">
         
          <input type="password" v-model="params.password" placeholder="رمز عبور" required>
          <p v-if="errors.password" class="error">{{ errors.password.join(', ') }}</p>
        </div>
        <div class="btn">
          <div class="inner"></div>
          <button type="submit">ادامه
            <span style="float: left; font-weight: bold; font-size: 32px; color: white ; margin-top: 1px;">&lt;</span>
          </button>
          <p v-if="generalMessage" :class="{'success': isSuccess, 'error': !isSuccess}">{{ generalMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  mounted() {
    require('@/assets/styles/login.css');
  },
  data() {
    return {
      params: {
        mobile: '',
        password: ''
      },
      errors: {},
      generalMessage: '',
      isSuccess: false ,
      
    };
  },
  methods: {
    async login() {
      this.errors = {};
      this.generalMessage = '';
      this.isSuccess = false;

      try {
        const response = await axios.post('login',{params: this.params});
        if (response.data.successful) {
          this.generalMessage = response.data.message;
          this.isSuccess = true;

          const token = response.data.data.user_token;
          if (token) {
            localStorage.setItem('authToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Token saved and header set:', token); 
          } else {
            console.error('Token not received');
          }

          this.$router.push('/'); 
        } else {
          this.generalMessage = response.data.message;
          this.isSuccess = false;
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = this.formatErrors(error.response.data.data || {});
          this.generalMessage = error.response.data.message;
        } else {
          this.generalMessage = 'همچین کاربری وجود ندارد';
        }
        this.isSuccess = false;
      }
    },
    formatErrors(errorsData) {
      let formattedErrors = {};
      for (let key in errorsData) {
        let fieldName = key.replace('params.', '');
        formattedErrors[fieldName] = errorsData[key];
      }
      return formattedErrors;
    },
    goToRegister() {
      this.$router.push({ name: 'register' });
    }
  },
  created() {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token loaded from localStorage:', token); 
    }
  }
};
</script>



