import Cookies from 'js-cookie';

function CerrarSesion() {
  const cookies = Cookies.get();

  // Iterar sobre todas las cookies y eliminarlas una por una
  Object.keys(cookies).forEach(cookie => {
    Cookies.remove(cookie);
  });

  // Redirigir a la página de inicio
  window.location.href = '/';
}

export default CerrarSesion;
