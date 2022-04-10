<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Cuenta
      </CDropdownHeader>
      <CDropdownItem v-on:click="logout()"> <CIcon icon="cil-lock-locked" /> Cerrar sesión </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import VueCookies from 'vue-cookies';

export default {
  name: 'AppHeaderDropdownAccnt',
  data() {
    return {
      avatar: 'http://assets.stickpng.com/images/585e4bd7cb11b227491c3397.png'
    }
  },
  methods: {
    logout() {
      VueCookies.remove('token_sesion');
      this.$router.push({ path: 'login' })
    }
  }
}
</script>
