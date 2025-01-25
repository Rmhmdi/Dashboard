<template>
  <div v-if="!isEditPopupVisible">
    <div class="top-section" v-if="!isSectionVisible">
      <div class="text-box">
        <h3>ایجاد واحد برای محصول</h3>
        <h5>میتوانید با کلیک برروی دکمه ی شروع،واحد جدیدی اضافه کنید</h5>
        <button class="bu" @click="showNewSection">شروع</button>
        <div class="circle"></div>
      </div>
    </div>
    <div class="top-section" v-if="isSectionVisible">
      <div class="text-box">
        <p>در صورتی که گروه‌بندی برای واحد انتخاب نکنید، به عنوان گروه جدید اضافه خواهد شد</p>
        <div class="form-row">
          <label for="title">عنوان</label>
          <input type="text" id="title" name="title" v-model="newTitle">
          <div class="category-label-wrapper">
            <div class="category-label">گروه‌بندی</div>
            <select id="category" name="category" v-model="selectedCategory">
              <option value="">انتخاب کنید</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.title }}</option>
            </select>
          </div>
        </div>
        <button class="bu" @click="addCategory">افزودن</button>
        <button class="bu" @click="closeNewSection">بستن</button>
      </div>
    </div>

    <div class="category-list" v-if="!isEditPopupVisible">
      <h3>در این بخش میتوانید واحدهای محصولات را مشاهده کنید</h3>
      <div class="categories-container">
        <div v-for="(category, index) in categories" :key="index" class="category-item">
          <div class="category-header" @click="toggleCategory(category.id)">
            <span class="">{{ category.title }}</span>
            <div class="category-actions">
              <button class="buo" @click.stop="editUnit(category.id)">📝</button>
              <button class="buo" @click.stop="openDeletePopup(category.id, null, false)">❌</button>
            </div>
          </div>
        
          <div v-if="expandedCategory === category.id" class="subcategories">
            <ul>
              <li v-for="(subCategory, subIndex) in subCategories[category.id]" :key="subIndex">
                {{ subCategory.title }}
                <button class="buoo" @click.stop="editUnit(subCategory.id)">📝</button>
                <button class="buoo" @click.stop="openDeletePopup(category.id, subIndex, true)">❌</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="isEditPopupVisible" class="new-section">
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
        <button class="bu" @click="closeEditPopup">لغو</button>
      </div>
    </div>

    <div v-if="isDeletePopupVisible || isSuccessPopupVisible || isErrorPopupVisible" class="overlay" @click="closeAllPopups"></div>
    
    <div v-if="isDeletePopupVisible" class="popup-delete">
      <div class="popup-content">
        <h3>حذف واحد</h3>
        <p>آیا مطمئن هستید که می‌خواهید این واحد را حذف کنید؟</p>
        <div class="popup-buttons">
          <button class="bu" @click="confirmDelete">بله</button>
          <button class="bu" @click="closeDeletePopup">خیر</button>
        </div>
      </div>
    </div>

    <div v-if="isSuccessPopupVisible" class="popup-secsses">
      <div class="popup-content">
        <h3>موفقیت</h3>
        <p>{{ successMessage }}</p>
        <button class="bu" @click="closeSuccessPopup">بستن</button>
      </div>
    </div>

    <div v-if="isErrorPopupVisible" class="popup-error">
      <div class="popup-content">
        <h3>پیغام</h3>
        <p>{{ errorMessage }}</p>
        <button class="bu" @click="closeErrorPopup">بستن</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const isSectionVisible = ref(false);
    const newTitle = ref('');
    const selectedCategory = ref('');
    const categories = ref([]);
    const subCategories = ref({});
    const expandedCategory = ref(null);
    const isSubCategoryEdit = ref(false);
    const isSubCategoryDelete = ref(false);
    const isEditPopupVisible = ref(false);
    const isDeletePopupVisible = ref(false);
    const isSuccessPopupVisible = ref(false);
    const isErrorPopupVisible = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const editTitle = ref('');
    const editCategory = ref('');
    const currentCategory = ref('');
    const currentSubIndex = ref(null);

    const fetchCategories = () => {
      axios.get('units')
        .then(response => {
          categories.value = response.data.data;
          subCategories.value = {};
          response.data.data.forEach(category => {
            subCategories.value[category.id] = category.sub_units;
          });
        })
        .catch(error => {
          errorMessage.value = 'خطایی در دریافت اطلاعات رخ داد';
          showErrorPopup();
          console.error(error);
        });
    };

    // watch([categories, subCategories], () => {
      //  fetchCategories();
    // });
  
    onMounted(() => {
      require('@/assets/styles/unit.css');
      fetchCategories();
    });

    const showNewSection = () => {
      isSectionVisible.value = true;
    };

    const closeAllPopups = () => {
      isEditPopupVisible.value = false;
      isDeletePopupVisible.value = false;
      isSuccessPopupVisible.value = false;
      isErrorPopupVisible.value = false;
    };

    const closeNewSection = () => {
      isSectionVisible.value = false;
    };

    const addCategory = () => {
      const newCategory = {
        params: {
          title: newTitle.value,
          parent_id: selectedCategory.value || null,
        },
      };
      axios.post('units', newCategory)
        .then(response => {
          if (response.data.success) {
             fetchCategories();
            newTitle.value = '';
            selectedCategory.value = '';
            successMessage.value = response.data.message || 'واحد با موفقیت اضافه شد';
            showSuccessPopup();
          } else {
            errorMessage.value = response.data.message || 'افزودن واحد با خطا مواجه شد';
            showErrorPopup();
          }
        })
        .catch(error => {
          errorMessage.value = error.response?.data?.message || 'خطایی در ارسال درخواست رخ داد';
          showErrorPopup();
          console.error(error);
        });
    };

    const toggleCategory = (categoryId) => {
      expandedCategory.value = expandedCategory.value === categoryId ? null : categoryId;
    };
    const editUnit = (unitId) => {
      router.push({ name: 'EditUnit', params: { id: unitId } });
    };

    const openEditPopup = (categoryId, subIndex, isSubCategory = false) => {
      currentCategory.value = categoryId;
      currentSubIndex.value = subIndex;
      isEditPopupVisible.value = true;
      isSubCategoryEdit.value = isSubCategory; 

      if (isSubCategory) {
        editTitle.value = subCategories.value[categoryId][subIndex].title;
        editCategory.value = categoryId; 
      } else {
        editTitle.value = categories.value.find(category => category.id === categoryId).title;
        editCategory.value = categoryId;
      }
    };

    const closeEditPopup = () => {
      isEditPopupVisible.value = false;
    };

    const confirmEdit = async () => {
      if (!editTitle.value.trim()) {
        errorMessage.value = 'عنوان نمی‌تواند خالی باشد';
        isErrorPopupVisible.value = true;
        return;
      }

      const isSubCategory = isSubCategoryEdit.value;
      const id = isSubCategory ? subCategories.value[currentCategory.value][currentSubIndex.value].id : currentCategory.value;
      const updatedUnit = {
        title: editTitle.value,
        parent_id: editCategory.value || null,
      };

      try {
        const response = await axios.put(`units/${id}`, updatedUnit);
        if (response.data.success) {
          successMessage.value = 'واحد با موفقیت ویرایش شد';
          isSuccessPopupVisible.value = true;
          setTimeout(() => {
            isSuccessPopupVisible.value = false;
             fetchCategories();
          }, 2000);
        } else {
          errorMessage.value = response.data.message || 'ویرایش واحد با خطا مواجه شد';
          isErrorPopupVisible.value = true;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          errorMessage.value = 'موردی با این شناسه یافت نشد';
        } else {
          errorMessage.value = error.response?.data?.message || 'خطایی در انجام عملیات رخ داد';
        }
        isErrorPopupVisible.value = true;
      }
    };

    const openDeletePopup = (categoryId, subIndex, isSubCategory = false) => {
      currentCategory.value = categoryId;
      currentSubIndex.value = subIndex;
      isSubCategoryDelete.value = isSubCategory;
      isDeletePopupVisible.value = true;
    };

    const closeDeletePopup = () => {
      isDeletePopupVisible.value = false;
    };

    const confirmDelete = async () => {
      const id = isSubCategoryDelete.value ? subCategories.value[currentCategory.value][currentSubIndex.value].id : currentCategory.value;
      try {
        const response = await axios.delete(`units/${id}`);
        if (response.data.success) {
          successMessage.value = 'واحد با موفقیت حذف شد';
          isSuccessPopupVisible.value = true;
          setTimeout(() => {
            isSuccessPopupVisible.value = false;
             fetchCategories();
          }, 2000);
        } else {
          errorMessage.value = response.data.message || 'حذف واحد با خطا مواجه شد';
          isErrorPopupVisible.value = true;
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'خطایی در حذف واحد رخ داد';
        isErrorPopupVisible.value = true;
      }
      closeDeletePopup();
    };

    const showErrorPopup = () => {
      isErrorPopupVisible.value = true;
    };

    const showSuccessPopup = () => {
      isSuccessPopupVisible.value = true;
    };

    const closeSuccessPopup = () => {
      isSuccessPopupVisible.value = false;
    };

    const closeErrorPopup = () => {
      isErrorPopupVisible.value = false;
    };

    return {
      isSectionVisible,
      newTitle,
      selectedCategory,
      categories,
      subCategories,
      expandedCategory,
      isSubCategoryEdit,
      isSubCategoryDelete,
      isEditPopupVisible,
      isDeletePopupVisible,
      isSuccessPopupVisible,
      isErrorPopupVisible,
      successMessage,
      errorMessage,
      editTitle,
      editCategory,
      currentCategory,
      currentSubIndex,
      showNewSection,
      closeAllPopups,
      closeNewSection,
      addCategory,
      toggleCategory,
      editUnit,
      openEditPopup,
      closeEditPopup,
      confirmEdit,
      openDeletePopup,
      closeDeletePopup,
      confirmDelete,
      showErrorPopup,
      showSuccessPopup,
      closeSuccessPopup,
      closeErrorPopup
    };
  }
};
</script>

