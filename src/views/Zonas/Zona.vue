<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> Zona </CCardHeader>
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
                        v-on:keyup.enter="modificarzona(this)" />
                    </div>
                      <button class="btn btn-primary mb-3" type="submit" v-on:click="modificarzona(this)" style="margin-right: 5px">Modificar zona</button>  
                      <button class="btn btn-danger mb-3" v-on:click="eliminarzona(this)">Eliminar zona</button>
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
  name: 'Zona',
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
    cargarzona: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/zonas/"+self.$route.params.id,
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.nombre = response.data.salida.nombre;
        });
    },
    modificarzona: (self) => {
      axios({
          method: 'PUT',
          url: config.apiserver+"1.0/zonas/"+self.$route.params.id+"?token_sesion="+VueCookies.get('token_sesion'),
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
          self.cargarzona(self);
        }
      }, 200);
    },
    eliminarzona: (self) => {
      var opcion = confirm("¿Estás seguro de eliminar la zona?");
      
      if(opcion) {
        axios({
            method: 'DELETE',
            url: config.apiserver+"1.0/zonas/"+self.$route.params.id+"?token_sesion="+VueCookies.get('token_sesion'),
            crossdomain: true,
        })
        .then(() => {
          self.errorCode = 200;
          self.errorText = "Zona eliminada correctamente";
          
          setTimeout(function () {
              self.$router.push('/zonas');
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
    this.cargarzona(this);
  }
}
</script>
