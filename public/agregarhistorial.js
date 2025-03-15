document.addEventListener("DOMContentLoaded", function () {
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

document.getElementById("registroForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('input[name="antecedente"]:checked');
    const antecedentes = Array.from(checkboxes).map(cb => cb.value);
    
    const antecedentesStr = antecedentes.length > 0 ? antecedentes.join(", ") : "";

    const data = {
        id_paciente: document.getElementById("id_paciente").value,
        escolaridad: document.getElementById("escolaridad").value,
        ocupacion: document.getElementById("ocupacion").value,
        religion: document.getElementById("religion").value,
        edad: document.getElementById("edad").value,
        antecedente: antecedentesStr, // Se envía correctamente
        tipo_sangre: document.getElementById("tipo_sangre").value,
        pfuma: document.getElementById("pfuma").value
    };

    fetch("http://localhost:3000/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(alert)
    .catch(error => console.error("Error:", error));
});
