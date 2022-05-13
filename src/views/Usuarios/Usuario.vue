<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> <b>Usuario</b> </CCardHeader>
                <CCardBody>
                  <form>
                    <div v-if="(errorCode>0)&(errorCode!=200)">
                      <div class="alert alert-danger" role="alert">{{ errorText }}</div>
                    </div>
                    <div v-if="(errorCode==200)">
                      <div class="alert alert-success" role="alert">{{ errorText }}</div>
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
                      <SelectEquipos @getEquipo="getEquipo" v-bind:value="equipo"/>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="nombre">Barcode</label>
                      <CFormInput 
                        class="form-control" 
                        id="barcode" 
                        type="number"
                        v-model:model-value="barcode"/>
                    </div>
                      <button class="btn btn-primary mb-3" type="submit" v-on:click="modificarusuario(this)" style="margin-right: 5px">Modificar usuario</button>  
                      <button class="btn btn-danger mb-3" v-on:click="eliminarusuario(this)">Eliminar usuario</button>
                  </form>
                </CCardBody>
            </CCard>
            </CCol>
        </CRow>
    </DefaultLayout>
</template>
<script>
import DefaultLayout from '@/layouts/DefaultLayout'
import SelectEquipos from '@/components/SelectEquipos.vue';
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';   

export default {
  name: 'Usuario',
  data() {
    return {
      nombre: '',
      usuario: '',
      contrasenia: '',
      email: '',
      telefono: '',
      equipo: '',
      barcode: '',
      errorCode: 0,
      errorText: ''
    }
  },
  components: {
    DefaultLayout,
    SelectEquipos
  },
  methods: {
    cargarusuario: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/usuarios/"+self.$route.params.id,
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.nombre = response.data.salida.nombre;
            self.usuario = response.data.salida.usuario;
            self.contrasenia = response.data.salida.password;
            self.email = response.data.salida.email;
            self.telefono = response.data.salida.telefono;
            self.equipo = response.data.salida.equipo;
            self.barcode = response.data.salida.barcode;
        });
    },
    modificarusuario: (self) => {
      axios({
          method: 'PUT',
          url: config.apiserver+"1.0/usuarios/"+self.$route.params.id+"?token_sesion="+VueCookies.get('token_sesion'),
          data: {
            nombre: self.nombre,
            usuario: self.usuario,
            password: self.contrasenia,
            email: self.email,
            telefono: self.telefono,
            equipo: self.equipo,
            barcode: self.barcode
          },
          crossdomain: true,
      })
      .then((response) => {
        self.errorText = response.data.error;
        self.errorCode = response.status;
      })
      .catch((error) => {
        self.errorText = error.response.data.error;
        self.errorCode = error.response.status;
      });

      setTimeout(function () {
        if(self.errorCode == 200) {
          self.cargarusuario(self);
        }
      }, 200);
    },
    eliminarusuario: (self) => {
      var opcion = confirm("¿Estás seguro de eliminar el usuario? Se eliminaran todos los logs y fichajes asociados a este.");
      
      if(opcion) {
        axios({
            method: 'DELETE',
            url: config.apiserver+"1.0/usuarios/"+self.$route.params.id+"?token_sesion="+VueCookies.get('token_sesion'),
            crossdomain: true,
        })
        .then(() => {
          self.errorCode = 200;
          self.errorText = "Usuario eliminado correctamente";
          
          setTimeout(function () {
              self.$router.push('/usuarios');
          }, 400);
        })
        .catch((error) => {
          if(self.errorCode!=200) {
            self.errorText = error.response.data.error;
            self.errorCode = error.response.status;
          }
        });
      }
    },
    getEquipo(data) {
      this.equipo = data;
    }
  },
  mounted() {
    this.cargarusuario(this);
  }
}
</script>
