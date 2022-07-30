
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

        if(nav.to == '/locales'){
            listar_locales();
        }
        if(nav.to == '/local'){
            info_local();
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
            const url = URLApi + 'login.php';
            fetch(url, {
                method:'POST',
                body: JSON.stringify({
                    "usuario":usuario,
                    "password":password
                }),
                headers:{
                    "Content-type":"application/json"
                }
            }).then(respuesta => (respuesta.ok)?respuesta.json():respuesta.json().then(data => Promise.reject(data.error)))
            .then(data => console.log(data))
            // .catch(mensaje => display_toast(mensaje,'No autorizado','primary'))
            
        }
        catch(e){
            console.log(e);
        }
    }

});

