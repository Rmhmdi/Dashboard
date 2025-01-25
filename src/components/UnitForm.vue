<!-- <template>
  <div class="container">
    <div class="top-section" v-if="!isSectionVisible">
      <div class="text-box">
        <p>ایجاد واحد برای محصول</p>
        <button class="bu" @click="showNewSection">شروع</button>
      </div>
    </div>
    <div class="new-section" v-if="isSectionVisible">
      <div class="text-box">
        <p>در صورتی که گروه‌بندی برای واحد انتخاب نکنید، به عنوان گروه جدید اضافه خواهد شد</p>
        <label for="title">عنوان</label>
        <input type="text" id="title" name="title" v-model="newTitle">
        <label for="category">گروه‌بندی</label>
        <select id="category" name="category" v-model="selectedCategory">
          <option value="">انتخاب کنید</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
        <button class="bu" @click="addCategory">افزودن</button>
        <button class="bu" @click="closeNewSection">بستن</button>
      </div>
    </div>
    <div class="category-list">
      <h3>لیست گروه‌ها</h3>
      <ul>
        <li v-for="(category, index) in categories" :key="index">
          {{ category }}
          <ul>
            <li v-for="(subCategory, subIndex) in subCategories[category]" :key="subIndex">
              {{ subCategory }}
              <button class="bu" @click="openEditPopup(category, subIndex)">📝</button>
              <button class="bu" @click="openDeletePopup(category, subIndex)">❌</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-if="isEditPopupVisible" class="popup">
      <div class="popup-content">
        <h3>ویرایش زیرواحد</h3>
        <label for="editTitle">عنوان جدید</label>
        <input type="text" id="editTitle" v-model="editTitle">
        <label for="editCategory">گروه‌بندی</label>
        <select id="editCategory" v-model="editCategory">
          <option value="">انتخاب کنید</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
        <button class="bu" @click="confirmEdit">تایید</button>
        <button class="bu" @click="closeEditPopup">لغو</button>
      </div>
    </div>
    <div v-if="isDeletePopupVisible" class="popup">
      <div class="popup-content">
        <h3>حذف زیرواحد</h3>
        <p>آیا مطمئن هستید که می‌خواهید این زیرواحد را حذف کنید؟</p>
        <button class="bu" @click="confirmDelete">بله</button>
        <button class="bu" @click="closeDeletePopup">خیر</button>
      </div>
    </div>
    <div v-if="isSuccessPopupVisible" class="popup">
      <div class="popup-content">
        <h3>موفقیت</h3>
        <p>به درستی اضافه شد</p>
        <button class="bu" @click="closeSuccessPopup">بستن</button>
      </div>
    </div>
    <div v-if="isErrorPopupVisible" class="popup">
      <div class="popup-content">
        <h3>خطا</h3>
        <p>این عنوان  موجود است</p>
        <button class="bu" @click="closeErrorPopup">بستن</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isSectionVisible: false,
      newTitle: '',
      selectedCategory: '',
      categories: [],
      subCategories: {},

      isEditPopupVisible: false,
      isDeletePopupVisible: false,
      isSuccessPopupVisible: false,
      isErrorPopupVisible: false,
      editTitle: '',
      editCategory: '',
      currentCategory: '',
      currentSubIndex: null,
    };
  },
  methods: {
    showNewSection() {
      this.isSectionVisible = true;
    },
    
    closeNewSection() {
      this.isSectionVisible = false;
    },

    fetchCategories() {
      axios.get('units')
        .then(response => {
          this.categories = response.data.data.map(item => item.title);
          this.subCategories = response.data.data.reduce((acc, item) => {
            acc[item.title] = item.subunits.map(sub => sub.title);
            return acc;
          }, {});
        })
        .catch(error => {
          console.error(error);
        });
    },

    addCategory() {
      const payload = {
        title: this.newTitle,
        parent: this.selectedCategory || null,
      };

      axios.post('units', payload)
        .then(response => {
          this.fetchCategories();
          this.newTitle = '';
          this.showSuccessPopup();
        })
        .catch(error => {
          if (error.response && error.response.data.params && error.response.data.params.title) {
            this.showErrorPopup();
          } else {
            console.error(error);
          }
        });
    },

    openEditPopup(category, subIndex) {
      this.currentCategory = category;
      this.currentSubIndex = subIndex;
      this.editTitle = this.subCategories[category][subIndex];
      this.editCategory = category;
      this.isEditPopupVisible = true;
    },

    closeEditPopup() {
      this.isEditPopupVisible = false;
    },

    confirmEdit() {
      if (this.editTitle.trim() !== '') {
        const payload = {
          title: this.editTitle,
          parent: this.editCategory || null,
        };

        axios.put(`units/${this.subCategories[this.currentCategory][this.currentSubIndex].id}`, payload)
          .then(response => {
            this.fetchCategories();
            this.closeEditPopup();
          })
          .catch(error => {
            if (error.response && error.response.data.params && error.response.data.params.title) {
              this.showErrorPopup();
            } else {
              console.error(error);
            }
          });
      }
    },

    openDeletePopup(category, subIndex) {
      this.currentCategory = category;
      this.currentSubIndex = subIndex;
      this.isDeletePopupVisible = true;
    },

    closeDeletePopup() {
      this.isDeletePopupVisible = false;
    },

    confirmDelete() {
      axios.delete(`units/${this.subCategories[this.currentCategory][this.currentSubIndex].id}`)
        .then(response => {
          this.fetchCategories();
          this.closeDeletePopup();
        })
        .catch(error => {
          console.error(error);
        });
    },

    showSuccessPopup() {
      this.isSuccessPopupVisible = true;
      setTimeout(() => {
        this.isSuccessPopupVisible = false;
      }, 2000);
    },

    showErrorPopup() {
      this.isErrorPopupVisible = true;
      setTimeout(() => {
        this.isErrorPopupVisible = false;
      }, 2000);
    },

    closeSuccessPopup() {
      this.isSuccessPopupVisible = false;
    },

    closeErrorPopup() {
      this.isErrorPopupVisible = false;
    },
  },
  mounted() {
    this.fetchCategories();
  }
};
</script>




<style>
body {
font-family: 'Tahoma', sans-serif;
margin: 0;
padding: 0;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
background-color: #f0f0f0;
}

.container {
width: 100%;
max-width: 600px;
background-color: white;
padding: 20px;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
margin-right: 20px; 
}

.top-section, .new-section, .category-list {
margin-bottom: 20px;
}

.text-box {
background-color: white;
padding: 20px;
border-radius: 5px;
display: inline-block;
width: 100%;
box-sizing: border-box;
}

.bu {
background-color: blue;
color: white;
border: none;
padding: 10px 20px;
border-radius: 5px;
cursor: pointer;
margin: 5px;
}

.category-list ul {
list-style-type: none;
padding: 0;
}

.category-list ul ul {
margin-top: 10px;
}

.category-list button {
background-color: orange;
color: white;
border: none;
padding: 5px 10px;
border-radius: 5px;
cursor: pointer;
margin-left: 5px;
}

label {
display: block;
margin-top: 10px;
}

input, select {
width: 100%;
padding: 10px;
margin-top: 5px;
border: 1px solid #ccc;
border-radius: 5px;
box-sizing: border-box;
}

.popup {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}

.popup-content {
background-color: white;
padding: 20px;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
text-align: center;
}

@media (max-width: 360px) {
.container {
  max-width: 70%;
  padding: 8px;
  margin-right: 10px;
}

.text-box {
  padding: 4px;
  margin: 2px;
}

.bu {
  padding: 4px 4px;
  margin: 2px;
}

.category-list button {
  padding: 3px 3px;
  margin-left: 2px;
}

input, select {
  padding: 8px;
}

.popup-content {
  padding: 8px;
}

.popup {
  padding: 10px;
}

.popup-content {
  max-width: 50%;
  padding: 10px;
}
}


</style> -->
