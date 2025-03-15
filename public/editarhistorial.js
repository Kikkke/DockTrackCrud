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

// Al seleccionar un paciente, cargar su historial
document.getElementById("id_paciente").addEventListener("change", function () {
    let id_paciente = this.value;
    if (id_paciente) {
        fetch(`http://localhost:3000/historial/${id_paciente}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    document.getElementById("formulario-historial").style.display = "block";
                    document.getElementById("id_historial").value = data.id_historial;
                    document.getElementById("escolaridad").value = data.escolaridad;
                    document.getElementById("ocupacion").value = data.ocupacion;
                    document.getElementById("religion").value = data.religion;
                    document.getElementById("edad").value = data.edad;
                    document.getElementById("tipo_sangre").value = data.tipo_sangre;
                    document.getElementById("pfuma").value = data.pfuma;
                } else {
                    alert("El paciente seleccionado no tiene historial médico registrado.");
                    document.getElementById("formulario-historial").style.display = "none";
                }
            })
            .catch(error => console.error("Error al obtener historial:", error));
    }
});

// Guardar cambios en el historial
document.getElementById("editarForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let id_historial = document.getElementById("id_historial").value;

    let data = {
        escolaridad: document.getElementById("escolaridad").value,
        ocupacion: document.getElementById("ocupacion").value,
        religion: document.getElementById("religion").value,
        edad: document.getElementById("edad").value,
        tipo_sangre: document.getElementById("tipo_sangre").value,
        pfuma: document.getElementById("pfuma").value
    };

    fetch(`http://localhost:3000/historial/${id_historial}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(alert)
    .catch(error => console.error("Error al actualizar historial:", error));
});
