"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";
import { Button, TextInput, Title, Text } from "@tremor/react";
import {
  LockClosedIcon,
  AtSymbolIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { apiUrl } from "@/config/config";

const Login = () => {

  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido_paterno, setApellido_paterno] = useState("");
  const [apellido_materno, setApellido_materno] = useState("");
  const [matricula, setMatricula] = useState("");
  const [area, setArea] = useState("");
  const [cargo, setCargo] = useState("");
  const [rfc, setRfc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("SOMOSUJED");
  const [addUsers, setAddUsers] = useState(false);

  const handleAddUsers = () => {
    const AddUsers = {
      nombre,
      apellido_paterno,
      apellido_materno,
      matricula,
      area,
      cargo,
      rfc,
      email,
      password
    };
  
    fetch(`${ apiUrl }/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(AddUsers),
    })
      .then((response) => response.json())
      .then(() => {
        Swal.fire({
          title: "Usuario Guardado",
          icon: "success",
          confirmButtonText: "Cool"
        }).then(() => {
          router.push("/");
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Error al guardar el usuario",
          icon: "error",
          confirmButtonText: "Cool"
        });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (addUsers) {
      handleAddUsers();
    } else {
      fetch(`${ apiUrl }/users`)
        .then((response) => response.json())
        .then((users) => {
          console.log(users);

          const user = users.find((user) => user.email === email);

          if (user) {
            bcrypt
              .compare(password, user.password)
              .then((passwordMatch) => {
                if (passwordMatch) {
                  console.log("Inicio de sesión exitoso");
                  Cookies.set("idUser", user._id, { path: "/" });
                  router.push("/");
                } else {
                  Swal.fire({
                    title: 'Error!',
                    text: 'Credenciales Invalidas',
                    icon: 'error',
                    confirmButtonText: 'Cool',
                  });
                }
              })
              .catch((error) => {
                console.error("Error al comparar contraseñas:", error);
              });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Usuario no encontrado',
              icon: 'error',
              confirmButtonText: 'Cool',
            });
          }
        })
        .catch((error) => {
          console.error("Error al obtener los usuarios:", error);
        });
    }
  };


  return (
    <main className="w-full h-screen flex">
      <aside className="bg-main hidden w-1/2 h-screen md:flex flex-col justify-center items-center">
        <img src="/assets/img/logoujedblanco.png" alt="ujed logo" className="w-3/4" />
        <Title
          className="text-white"
          style={{ fontSize: "30px", padding: "40px 0px 0px 0px" }}
        >
          Sistema Gestión de Minutas
        </Title>
      </aside>

      <aside className="w-full md:w-1/2 h-screen flex flex-col justify-center items-center">
        <div className="-mt-28 md:hidden">
          <img src="/assets/img/logoujedblanco.png" alt="ujed logo" className="bg-main w-full" />
        </div>

        <form
          className="w-3/4 flex flex-col gap-3 mt-5 md:mt-0"
          onSubmit={handleSubmit}
        >

          {addUsers && (
            <>
              <TextInput
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <TextInput
                type="text"
                name="apellido_paterno"
                placeholder="Apellido Paterno"
                value={apellido_paterno}
                onChange={(e) => setApellido_paterno(e.target.value)}
              />
              <TextInput
                type="text"
                name="apellido_materno"
                placeholder="Apellido Materno"
                value={apellido_materno}
                onChange={(e) => setApellido_materno(e.target.value)}
              />
              <TextInput
                type="text"
                name="matricula"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              />
              <TextInput
                type="text"
                name="area"
                placeholder="Área"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <TextInput
                type="text"
                name="cargo"
                placeholder="Cargo"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              />
              <TextInput
                type="text"
                name="rfc"
                placeholder="RFC"
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
              />
              <TextInput
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />              
            </>
          )}

          {addUsers ? (
            <Button
              type="button"
              onClick={handleAddUsers}
              color="red"
              variant="secondary"
              icon={PlusCircleIcon}
              iconPosition="right"
            >
              Guardar Usuario
            </Button>
          ) : (
            <>
              <TextInput
                type="email"
                name="email"
                placeholder="Correo electrónico"
                icon={AtSymbolIcon}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextInput
                type="password"
                name="password"
                placeholder="Contraseña"
                icon={LockClosedIcon}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Text className="text-center">¿Olvidaste tu contraseña?</Text>

              <Button
                className="mt-4"
                type="submit"
                onClick={handleSubmit}
                color="red"
                variant="secondary"
                icon={PaperAirplaneIcon}
                iconPosition="right"
              >
                Iniciar Sesión
              </Button>
            </>
          )}

          <Button
            type="button"
            onClick={() => setAddUsers(!addUsers)}
            color="red"
            variant="secondary"
            icon={PaperAirplaneIcon}
            iconPosition="right"
          >
            {addUsers ? "Cancelar" : "Registrarse"}
          </Button>

        </form>
      </aside>
    </main>
  );
}

export default Login;