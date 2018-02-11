var app = new Vue({
   el: '#app',
   created:function(){
     this.listarPaises();
   },
  data: {
    paises:[],
    nombrepais:"",
    nombredepartamento:"",
    nombreciudad:"",
    departamentos:[],
    paisseleccionado : {},
    departamentoseleccionado :{},
    inHabilitarRegistroDepartamento : true,
    inHabilitarRegistroCiudad : true,
    ciudades:[]
  },
   methods: {
     registrarPais:function(){
       var self = app;
       $.ajax({
        type: "POST",
        url: 'http://localhost:8081/paises',
        contentType: 'application/json',
        data: JSON.stringify({ "nombre": app.nombrepais}),
        success: function () {
          self.nombrepais="";
          $('#nombrepais').focus();
          self.listarPaises();
        }
      });
    },

    listarDepartamentos:function(pais){
      var self = app;
      self.paisseleccionado = pais;
      self.inHabilitarRegistroDepartamento = false;
      self.departamentoseleccionado={};
      self.inHabilitarRegistroCiudad= true;
      $.ajax({
       type: "POST",
       url: 'http://localhost:8081/departamentos',
       contentType: 'application/json',
       data: JSON.stringify({id:pais.id ,"nombre": pais.nombre}),
       success: function (data) {
           self.departamentos = data;
           self.ciudades =[];
       }
     });
   },

    listarCiudades: function(departamento){
      var self = app;
       self.departamentoseleccionado = departamento;
       self.inHabilitarRegistroCiudad = false;
       $.ajax({
         url: 'http://localhost:8081/ciudades',
        contentType: 'application/json',
         type: 'POST',
         data:JSON.stringify({"id": departamento.id ,"nombre":departamento.nombre})
       })
       .done(function(data) {
         console.log("success");
         self.ciudades = data;
       })
       .fail(function() {
         console.log("error listarCiudades");
       })
       .always(function() {
         console.log("complete listarCiudades");
       });
    },

   registrarDepartamento:function(){
     var self = app;
     $.ajax({
       type : 'POST',
       url: 'http://localhost:8081/registrardepartamento',
       contentType: 'application/json',
       data : JSON.stringify({"nombre": self.nombredepartamento, "pais": self.paisseleccionado}),
       success: function(data){
           self.nombredepartamento = "";
           $('#nombredepartamento').focus();
           self.listarDepartamentos(self.paisseleccionado);
       }
     });
   },

   listarPaises:function (){
     var jqxhr = $.ajax( "http://localhost:8081/paises" )
     .done(function(response) {
         app.paises = response;
     })
     .fail(function() {
       alert( "error" );
     });
   },

   registrarCiudad: function(){
    var self = app;
    $.ajax({
      url: 'http://localhost:8081/registrarciudad',
      type: 'POST',
      contentType: 'application/json',
      data:JSON.stringify({"nombre": self.nombreciudad, "departamento": self.departamentoseleccionado}),
    })
    .done(function() {
       self.nombreciudad = "";
        $('#nombreciudad').focus();
       self.listarCiudades(self.departamentoseleccionado);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
   }
   }
});
