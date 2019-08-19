// Dummy data
const data = {
    metadata: {
        numero: "29.614",
        fecha: "jueves, 6 de junio de 2019",
        usuario: "ADMIN",
    },
    transporte: {
        desde: {
            lugar: "BODEGA CENTRAL",
            usuario: "ADMIN"
        },
        hasta: {
            lugar: "GIZ COSTANERA CENTER",
            usuario: "ADMIN"
        },
    },
    items: [
        {
            codigo: "10189000",
            insumo: "FUN-TEMPERED GLASS FOR IPHONE 7",
            existencia: {
                casaMatriz: "1.509",
                local: "305"
            },
            hecho: "0",
            falta: "-1,00"
        },
        {
            codigo: "4895206902083",
            insumo: "LAU-FLURO FOR IPHONE 7 BLACK",
            existencia: {
                casaMatriz: "6",
                local: "-12"
            },
            hecho: "0",
            falta: "-1,00"
        }
    ]
};

// Función
function convert2pdf(data) {
    // Referencias al DOM con jQuery
    const $DOM = {
        metaNumero: document.getElementById("metadata-numero"),
        metaFecha: document.getElementById("metadata-fecha"),
        metaUsuario: document.getElementById("metadata-usuario"),
        desdeLugar: document.getElementById("desde-lugar"),
        desdeUsuario: document.getElementById("desde-usuario"),
        hastaLugar: document.getElementById("hasta-lugar"),
        hastaUsuario: document.getElementById("hasta-usuario"),
        items: document.getElementById("items")
    };

    // Rellenar los campos con la data recibida
    $DOM.metaNumero.innerHTML = data.metadata.numero;
    $DOM.metaFecha.innerHTML = data.metadata.fecha;
    $DOM.metaUsuario.innerHTML = data.metadata.usuario;
    $DOM.desdeLugar.innerHTML = data.transporte.desde.lugar;
    $DOM.desdeUsuario.innerHTML = data.transporte.desde.usuario;
    $DOM.hastaLugar.innerHTML = data.transporte.hasta.lugar;
    $DOM.hastaUsuario.innerHTML = data.transporte.hasta.usuario;

    // Añadir todos los items
    data.items.forEach(item => {
        const template = `
                <tr>
                    <td>${item.codigo}</td>
                    <td>${item.insumo}</td>
                    <td class="text-right">${item.existencia.casaMatriz}</td>
                    <td class="text-right">${item.existencia.local}</td>
                    <td class="expander">&nbsp;</td>
                    <td class="text-right">${item.hecho}</td>
                    <td class="text-right"><strong>${item.falta}</strong></td>
                </tr>
            `;
        $DOM.items.innerHTML += template;
    });

    // Abrir cuadro de diálogo para imprimir o guardar como PDF
    window.print();
}

// Ejecución al cargar
convert2pdf(data);
