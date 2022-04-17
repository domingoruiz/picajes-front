<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> Usuarios </CCardHeader>
                <CCardBody>
                <CTable>
                    <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col" width="80px">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Equipo</CTableHeaderCell>
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                    <CTableRow :key="usuario" v-for="(usuario, index) in usuarios">
                        <CTableHeaderCell scope="row">
                          {{index+1}}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          <router-link :to="`/usuarios/${usuario.id}`">{{usuario.nombre}}</router-link>
                        </CTableDataCell>
                        <CTableDataCell>
                          {{usuario.equipo}}
                        </CTableDataCell>
                    </CTableRow>
                    </CTableBody>
                </CTable>
                </CCardBody>
            </CCard>
            </CCol>
        </CRow>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> Crear nuevo usuario </CCardHeader>
                <CCardBody>
                  <form>
                    <div v-if="(errorCode != 200) & (errorCode != 0)">
                      <div class="alert alert-danger" role="alert">{{ errorText }}</div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="nombre">Nombre</label>
                      <CFormInput 
                        class="form-control" 
                        id="nombre" 
                        type="text" 
                        v-model:model-value="nombre"/>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="usuario">Usuario</label>
                      <CFormInput 
                        class="form-control" 
                        id="usuario" 
                        type="text" 
                        v-model:model-value="usuario"/>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="contrasenia">Contraseña</label>
                      <CFormInput 
                        class="form-control" 
                        id="contrasenia" 
                        type="password"
                        v-model:model-value="contrasenia"/>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="email">Correo electrónico</label>
                      <CFormInput 
                        class="form-control" 
                        id="email" 
                        type="email"
                        v-model:model-value="email"/>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="telefono">Teléfono</label>
                      <CFormInput 
                        class="form-control" 
                        id="telefono" 
                        type="tel"
                        v-model:model-value="telefono"/>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="nombre">Equipo</label>
                      <SelectEquipos @getEquipo="getEquipo" />
                    </div>
                    <button class="btn btn-primary mb-3" type="submit" v-on:click="crearusuario(this)">Crear usuario</button>
                  </form>
                </CCardBody>
            </CCard>
            </CCol>
        </CRow>
    </DefaultLayout>
</template>
<script>
import DefaultLayout from '@/layouts/DefaultLayout'
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import SelectEquipos from '@/components/SelectEquipos.vue';

export default {
  name: 'Usuarios',
  data() {
    return {
      usuarios: [],
      nombre: '',
      usuario: '',
      contrasenia: '',
      email: '',
      telefono: '',
      equipo: '',
      errorCode: 0,
      errorText: ''
    }
  },
  components: {
    DefaultLayout,
    SelectEquipos,
},
  methods: {
    cargarusuarios: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/usuarios/",
            params: {
              token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.usuarios = response.data.salida;
            self.errorCode = 200;
        })
        .catch((error) => {
            self.errorText = error.response.data.error;
            self.errorCode = error.response.status;
        });
    },
    crearusuario: (self) => {
      if(self.errorText == '') {
        axios({
            method: 'POST',
            url: config.apiserver+"1.0/usuarios/?token_sesion="+VueCookies.get('token_sesion'),
            data: {
              nombre: self.nombre,
              usuario: self.usuario,
              password: self.contrasenia,
              email: self.email,
              telefono: self.telefono,
              equipo: self.equipo
            },
            crossdomain: true,
        })
        .then(() => {
          self.errorCode = 200;
        })
        .catch((error) => {
          self.errorText = error.response.data.error;
          self.errorCode = error.response.status;
        });

        setTimeout(function () {
          if(self.errorCode == 200) {
            self.errorText = '';
            self.nombre = "";
            self.usuario = "";
            self.contrasenia = "";
            self.email = "";
            self.telefono = "";
            self.cargarusuarios(self);
          }
        }, 200);
      }
    },
    getEquipo(data) {
      this.equipo = data;
    }
  },
  mounted() {
    this.cargarusuarios(this);
  }
}
</script>
