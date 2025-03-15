document.addEventListener("DOMContentLoaded", function () {
    // Cargar lista de pacientes
    fetch("http://localhost:3000/pacientes")
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("id_paciente");
            data.forEach(paciente => {
                let option = document.createElement("option");
                option.value = paciente.id_paciente;
                option.textContent = `${paciente.nombre} ${paciente.apellidop} ${paciente.apellidom}`;
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar pacientes:", error));
});

// Función para eliminar historial médico
document.getElementById("eliminarHistorial").addEventListener("click", function () {
    let id_paciente = document.getElementById("id_paciente").value;

    if (!id_paciente) {
        alert("Por favor, selecciona un paciente.");
        return;
    }

    if (confirm("¿Estás seguro de que deseas eliminar el historial de este paciente? Esta acción no se puede deshacer.")) {
        fetch(`http://localhost:3000/historial/${id_paciente}`, {
            method: "DELETE"
        })
        .then(response => response.text())
        .then(alert)
        .catch(error => console.error("Error al eliminar historial:", error));
    }
});
