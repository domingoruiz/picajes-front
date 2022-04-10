<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Picajes</h1>
                  <p class="text-medium-emphasis">Iniciar sesión en el panel</p>
                  <div v-if="(errorCode != 200) & (errorCode != 0)">
                    <div class="alert alert-danger" role="alert">{{ errorText }}</div>
                  </div>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Usuario"
                      autocomplete="Usuario"
                      v-model:model-value="username"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      autocomplete="current-password"
                      v-model:model-value="password"
                      v-on:keyup.enter="validarlogin(this)"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" v-on:click="validarlogin(this)"> Iniciar sesión </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import config from '@/config/config.js';
import axios from 'axios';
import md5 from 'js-md5'
import VueCookies from 'vue-cookies';

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      errorText: '',
      errorCode: '',
      token_sesion: '',
    }
  },
  methods: {
    validarlogin: (self)  => {
      axios({
        method: 'GET',
        url: config.apiserver+"1.0/usuarios/login/",
        params: {
          username: self.username,
          password: md5(self.password)
        }
      })
      .then((response) => {
        self.token_sesion = response.data.salida.token_sesion;
        self.errorCode = 200;
      })
      .catch((error) => {
        self.errorText = error.response.data.error;
        self.errorCode = error.response.status;
      });
      
      setTimeout(function () {
        if(self.errorCode == 200) {
          VueCookies.set('token_sesion', self.token_sesion);
          self.errorText = '';
          self.errorCode = 200;
          self.$router.push({ path: '/' })
        }
      }, 200);
    },
  },
  mounted: function() {
    if(VueCookies.get('token_sesion')) {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
