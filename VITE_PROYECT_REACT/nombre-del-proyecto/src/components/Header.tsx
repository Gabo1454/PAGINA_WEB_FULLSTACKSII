import { useState } from "react";
/*import "./Header.css";*/

export default function Header() {
    const [busquedaVisible, setBusquedaVisible] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [contadorCarrito, setContadorCarrito] = useState(0); //Inicializacion

    const toggleBusqueda = () => setBusquedaVisible(!busquedaVisible);

    return (
        <header className="header_principal">
            {/* LOGO */}
            <div className="logo-web">
                <img>
                    src="/img/logo_level_up-removebg-preview.png"
                    alt="Logo Level-Up Gamer"
                    width={120}
                    height={140}
                </img>
            </div>

            {/* Navegación principal */}

            {/* Carrito y búsqueda */}

        </header>
    )
}