<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> Puesto de fichaje </CCardHeader>
                <CCardBody>
                  <form>
                    <div v-if="(errorCode>0)&(errorCode!=200)">
                      <div class="alert alert-danger" role="alert">{{ errorText }}</div>
                    </div>
                    <div v-if="(errorCode==200)">
                      <div class="alert alert-success" role="alert">{{ errorText }}</div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="nombre">Zona</label>
                      <SelectZonas @getZona="getZona" v-bind:value="zona"/>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="nombre">Nombre</label>
                      <CFormInput 
                        class="form-control" 
                        id="nombre" 
                        type="text" 
                        v-model:model-value="nombre"
                        v-on:keyup.enter="modificarpuestofichaje(this)" />
                    </div>
                      <button class="btn btn-primary mb-3" type="submit" v-on:click="modificarpuestofichaje(this)" style="margin-right: 5px">Modificar puesto</button>  
                      <button class="btn btn-danger mb-3" v-on:click="eliminarpuestofichaje(this)">Eliminar puesto</button>
                  </form>
                </CCardBody>
            </CCard>
            </CCol>
        </CRow>
    </DefaultLayout>
</template>
<script>
import DefaultLayout from '@/layouts/DefaultLayout'
import SelectZonas from '@/components/SelectZonas';
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';   

export default {
  name: 'Puesto de fichaje',
  data() {
    return {
      nombre: '',
      zona: '',
      errorCode: 0,
      errorText: ''
    }
  },
  components: {
    DefaultLayout,
    SelectZonas
  },
  methods: {
    cargarpuestofichaje: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/puestofichajes/"+self.$route.params.id,
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.nombre = response.data.salida.nombre;
            self.zona = response.data.salida.zona;
        });
    },
    modificarpuestofichaje: (self) => {
      axios({
          method: 'PUT',
          url: config.apiserver+"1.0/puestofichajes/"+self.$route.params.id+"?token_sesion="+VueCookies.get('token_sesion'),
          data: {
            nombre: self.nombre,
            zona: self.zona
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
          self.cargarpuestofichaje(self);
        }
      }, 200);
    },
    eliminarpuestofichaje: (self) => {
      var opcion = confirm("¿Estás seguro de eliminar el puesto de fichaje?");
      
      if(opcion) {
        axios({
            method: 'DELETE',
            url: config.apiserver+"1.0/puestofichajes/"+self.$route.params.id+"?token_sesion="+VueCookies.get('token_sesion'),
            crossdomain: true,
        })
        .then(() => {
          self.errorCode = 200;
          self.errorText = "Puesto eliminado correctamente";
          
          setTimeout(function () {
              self.$router.push('/puestosfichaje');
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
    getZona(data) {
      this.zona = data;
    }
  },
  mounted() {
    this.cargarpuestofichaje(this);
  }
}
</script>
