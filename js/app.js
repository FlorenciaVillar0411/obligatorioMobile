
const URLApi = 'https://crypto.develotion.com'
document.addEventListener('DOMContentLoaded', function(){

    let router = document.querySelector('ion-router');
    router.addEventListener('ionRouteDidChange', function(e){
        let nav = e.detail;
        let paginas = document.getElementsByTagName('ion-page');
        for(let i=0 ; i<paginas.length; i++){
            paginas[i].style.visibility = "hidden";
        }
        let ion_route = document.querySelectorAll(`[url="${nav.to}"]`)
        let id_pagina = ion_route[0].getAttribute('component');
        let pagina = document.getElementById(id_pagina);
        pagina.style.visibility = "visible";

        if(nav.to == '/monedas'){
            listar_monedas();
        }
        if(nav.to == '/moneda'){
            info_moneda();
        }
    });
    document.getElementById('btn_registro').onclick = function(){       
        try{
            let usuario = document.getElementById('inp_usuario').value;
            const password = document.getElementById('inp_password2').value;
            const repassword = document.getElementById('inp_repassword').value;
            const ciudad = document.getElementById('inp_ciudad').value;
            const depto = document.getElementById('inp_depto').value;
            
            // if(!usuario){
            //     throw 'Nombre requerido para continuar';
            // }
            // if(password != repassword){
            //     throw 'Contrase&ntilde;a y repetici&oacute;n no coinciden';
            // }

            // TODO otras validaciones...

            // post a API registro de usuario
            const url = URLApi + '/usuarios.php';
            const datos = {
                "usuario": usuario,
                "password": password,
                "idDepartamento": depto,
                "idCiudad": ciudad
            }
            fetch(url, {
                method:'POST',
                body: JSON.stringify(datos),
                headers:{
                    "Content-type":"application/json"
                }
            }).then(respuesta => (respuesta.ok)?respuesta.json():respuesta.json().then(data => Promise.reject(data.error)))
            .then(data => console.log(data))
            .catch(mensaje => display_toast(mensaje,'Info','primary'))
            console.log(usuario);
        }   
        catch(e){
            console.log(e);
        }
    }

    document.getElementById('btn_login').onclick = function(){
        try{
            let usuario = document.getElementById('inp_usuarioLogin').value;
            let password = document.getElementById('inp_password').value;
            if(!usuario){
                throw 'Usuario requerido';
            }
            if(!password){
                throw 'Contrase&ntilde;a requerida';
            }
            // invocar API de login de usuario.
            const url = URLApi + '/login.php';
            const datos = {
                "usuario": usuario,
                "password": password
            }
            fetch(url, {
                method:'POST',
                body: JSON.stringify(datos),
                headers:{
                    "Content-type":"application/json"
                }
            }).then(respuesta => (respuesta.ok)?respuesta.json():respuesta.json().then(data => Promise.reject(data.error)))
            .then(data => login(data, router))
            .catch(mensaje => display_toast(mensaje,'Info','primary'))
        }
        catch(e){
            console.log(e);
        }
    }

});


function login(data, router){
    sessionStorage.setItem("apiKey", data.apiKey);
    sessionStorage.setItem("idUsuario", JSON.stringify(data.id))
    router.push('/monedas');
}

function display_toast(mensaje, header, color){
    const toast = document.createElement('ion-toast');
    toast.header = header;
    toast.icon = 'information-circle',
    toast.position = 'top';
    toast.message = mensaje;
    toast.duration = 3000;
    toast.color = color;
    document.body.appendChild(toast);
    toast.present();
}

function listar_monedas(){
    let key = sessionStorage.getItem("apiKey");
    const url = URLApi + '/monedas.php';
    fetch(url, {
        headers:{
            "apiKey": key,
            "Content-type":"application/json"
        }
    }).then(respuesta => respuesta.json())
    .then(data => crearListadoMonedas(data))
}

function crearListadoMonedas(data){
    console.log(data)
    const urlImagen = 'https://crypto.develotion.com/imgs/'
    let lista = document.getElementById('listMonedas');
    let item = '';
    for (let i = 0; i<= data.monedas.length; i++){
        let moneda = data.monedas[i];
        item = `<ion-item href="/moneda?id=${moneda.id}" detail>
        <ion-avatar slot="start">
          <img src="${urlImagen}${moneda.imagen}" />
        </ion-avatar>
        <ion-label>
          <h2>${moneda.nombre}</h2>
          <h3>${moneda.cotizacion}</h3>
          </ion-label>
      </ion-item>`;
      lista.innerHTML += item;
    }
}

function info_moneda(){
    const id_moneda = getParam('id');
    const url = URLApi + '/monedas';
    let key = sessionStorage.getItem("apiKey");
    fetch(url, {
        headers:{
            "apiKey": key,
            "Content-type":"application/json"
        }
    }).then(respuesta => respuesta.json())
    .then(data => crear_info_usuario(data.monedas[id_moneda-1]))
}

function crear_info_moneda(data){
    console.log(data)
    urlImagen = 'https://crypto.develotion.com/imgs/' + data.imagen;
    document.getElementById('moneda_imagen').setAttribute('src', urlImagen);
    document.getElementById('moneda_nombre').innerHTML = data.nombre;
    document.getElementById('moneda_cot').innerHTML = data.cotizacion;
}

function getParam(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}