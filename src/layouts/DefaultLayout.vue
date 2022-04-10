<template>
  <div lg v-if="login">
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100 bg-light">
      <AppHeader />
      <div class="body flex-grow-1 px-3">
        <CContainer>
          <slot />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
<script>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import VueCookies from 'vue-cookies';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      login: 0
    }
  },
  components: {
    AppFooter,
    AppHeader,
    AppSidebar,
    CContainer,
  },
  mounted() {
    if(!VueCookies.get('token_sesion')) {
      this.login = 0;
      this.$router.push({ path: 'Login' })
    }else{
      this.login = 1;
    }
  }
}
</script>
