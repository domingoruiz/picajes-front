<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> <b>Equipo</b> </CCardHeader>
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
                        v-model:model-value="nombre"
                        v-on:keyup.enter="modificarequipo(this)" />
                    </div>
                      <button class="btn btn-primary mb-3" type="submit" v-on:click="modificarequipo(this)" style="margin-right: 5px">Modificar equipo</button>  
                      <button class="btn btn-danger mb-3" v-on:click="eliminarequipo(this)">Eliminar equipo</button>
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

export default {
  name: 'equipo',
  data() {
    return {
      nombre: '',
      errorCode: 0,
      errorText: ''
    }
  },
  components: {
    DefaultLayout
  },
  methods: {
    cargarequipo: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/equipos/"+self.$route.params.id,
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.nombre = response.data.salida.nombre;
        });
    },
    modificarequipo: (self) => {
      axios({
          method: 'PUT',
          url: config.apiserver+"1.0/equipos/"+self.$route.params.id+"?token_sesion="+VueCookies.get('token_sesion'),
          data: {
            nombre: self.nombre
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
          self.cargarequipo(self);
        }
      }, 200);
    },
    eliminarequipo: (self) => {
      var opcion = confirm("¿Estás seguro de eliminar el equipo? Se eliminaran todos los usuarios, logs y fichajes asociados a este.");
      
      if(opcion) {
        axios({
            method: 'DELETE',
            url: config.apiserver+"1.0/equipos/"+self.$route.params.id+"?token_sesion="+VueCookies.get('token_sesion'),
            crossdomain: true,
        })
        .then(() => {
          self.errorCode = 200;
          self.errorText = "Equipo eliminado correctamente";
          
          setTimeout(function () {
              self.$router.push('/equipos');
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
  },
  mounted() {
    this.cargarequipo(this);
  }
}
</script>
