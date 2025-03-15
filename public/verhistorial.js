document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/historiales")
        .then(response => response.json())
        .then(data => {
            mostrarHistoriales(data);

            // Filtrado en tiempo real
            document.getElementById("filtroNombre").addEventListener("input", function () {
                const filtro = this.value.toLowerCase();
                const historialesFiltrados = data.filter(historial => 
                    historial.nombre_completo.toLowerCase().includes(filtro)
                );
                mostrarHistoriales(historialesFiltrados);
            });
        })
        .catch(error => console.error("Error al cargar historiales:", error));
});

// Función para mostrar los historiales en la tabla
function mostrarHistoriales(historiales) {
    const tabla = document.getElementById("tablaHistoriales");
    tabla.innerHTML = ""; // Limpiar tabla antes de agregar nuevos datos

    historiales.forEach(historial => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${historial.nombre_completo}</td>
            <td>${historial.escolaridad}</td>
            <td>${historial.ocupacion}</td>
            <td>${historial.religion}</td>
            <td>${historial.interrogatorio || "N/A"}</td>
            <td>${historial.edad}</td>
            <td>${historial.antecedente || "Ninguno"}</td>
            <td>${historial.tipo_sangre}</td>
            <td>${historial.pfuma}</td>
        `;

        tabla.appendChild(fila);
    });
}
