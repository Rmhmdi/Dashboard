<template>
    <div class="top-section">
      <div class="text-box">
        <h3>ویرایش واحد</h3>
        <div class="form-row">
          <label for="editTitle">عنوان جدید</label>
          <input type="text" id="editTitle" v-model="editTitle">
          <div class="category-label-wrapper">
            <label for="editCategory" class="category-label">گروه‌بندی</label>
            <select id="editCategory" v-model="editCategory">
              <option :value="editCategory">{{ editCategory ? editCategory : 'انتخاب کنید' }}</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.title }}</option>
            </select>
          </div>
        </div>
        <button class="bu" @click="confirmEdit">تایید</button>
        <button class="bu" @click="cancelEdit">لغو</button>
      </div>
      <div v-if="isSuccessPopupVisible || isErrorPopupVisible" class="overlay" @click="closeAllPopups"></div>
      <div v-if="isSuccessPopupVisible" class="popup-success">
        <div class="popup-content">
          <!-- <h3>موفقیت</h3> -->
          <p>{{ successMessage }}</p>
          <button class="bu" @click="closeSuccessPopup">بستن</button>
        </div>
      </div>
  
      <div v-if="isErrorPopupVisible" class="popup-error">
        <div class="popup-content">
          <!-- <h3>پیغام</h3> -->
          <p>{{ errorMessage }}</p>
          <button class="bu" @click="closeErrorPopup">بستن</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  
  export default {
    setup() {
      const router = useRouter();
      const route = useRoute();
      const categories = ref([]);
      const editTitle = ref('');
      const editCategory = ref('');
      const successMessage = ref('');
      const errorMessage = ref('');
      const isSuccessPopupVisible = ref(false);
      const isErrorPopupVisible = ref(false);
      
      const fetchCategories = async () => {
        try {
          const response = await axios.get('units');
          categories.value = response.data.data;
        } catch (error) {
          console.error(error);
        }
      };
  
      const loadUnitData = async () => {
        try {
          const unitId = route.params.id;
          const response = await axios.get(`units/${unitId}`);
          editTitle.value = response.data.data.title;
          editCategory.value = response.data.data.parent_id;
        } catch (error) {
          console.error(error);
          errorMessage.value = 'خطا در بارگذاری داده‌ها.';
          isErrorPopupVisible.value = true;
        }
      };
  
      onMounted(() => {
        require('@/assets/styles/unit.css');
        fetchCategories();
        loadUnitData();
      });
  
      const confirmEdit = async () => {
        if (!editTitle.value.trim()) {
          errorMessage.value = 'عنوان نمی‌تواند خالی باشد';
          isErrorPopupVisible.value = true;
          return;
        }
  
        const updatedUnit = {
            params:{
                
                title: editTitle.value,
                parent_id: editCategory.value || null,
            }
        };
  
        try {
          const unitId = route.params.id;
          const response = await axios.put(`units/${unitId}`, updatedUnit);
          if (response.data.success) {
            successMessage.value = 'واحد با موفقیت ویرایش شد.';
            isSuccessPopupVisible.value = true;
            setTimeout(() => {
              isSuccessPopupVisible.value = false;
              router.push({ name: 'Units' });
            }, 2000);
          } else {
            errorMessage.value = response.data.message || 'ویرایش واحد با خطا مواجه شد';
            isErrorPopupVisible.value = true;
          }
        } catch (error) {
          errorMessage.value = error.response?.data?.message || 'خطایی در انجام عملیات رخ داد';
          isErrorPopupVisible.value = true;
        }
      };
  
      const cancelEdit = () => {
        router.push({ name: 'Units' });
      };
  
      const closeSuccessPopup = () => {
        isSuccessPopupVisible.value = false;
      };
  
      const closeErrorPopup = () => {
        isErrorPopupVisible.value = false;
      };
      const closeAllPopups = () => {

      isSuccessPopupVisible.value = false;
      isErrorPopupVisible.value = false;
    };

      return {
        categories,
        editTitle,
        closeAllPopups,
        editCategory,
        successMessage,
        errorMessage,
        isSuccessPopupVisible,
        isErrorPopupVisible,
        confirmEdit,
        cancelEdit,
        closeSuccessPopup,
        closeErrorPopup
      };
    }
  };
  </script>
