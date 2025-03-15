const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "n0m3l0",
    database: "historial"
});

con.connect((err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err);
    } else {
        console.log("Conectado a la base de datos MySQL.");
    }
});

app.use(session({
    secret: "clave_secreta",
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/pacientes", (req, res) => {
    con.query("SELECT * FROM paciente", (err, results) => {
        if (err) {
            res.status(500).send("Error al obtener pacientes");
        } else {
            res.json(results);
        }
    });
});

app.post("/registro", (req, res) => {
    const { id_paciente, escolaridad, ocupacion, religion, interrogatorio, edad, antecedente, tipo_sangre, pfuma } = req.body;

    const antecedentesStr = Array.isArray(antecedente) ? antecedente.join(", ") : antecedente;

    const sqlHistorial = `INSERT INTO historial (escolaridad, ocupacion, religion, interrogatorio, edad, antecedente, tipo_sangre, pfuma) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    con.query(sqlHistorial, [escolaridad, ocupacion, religion, interrogatorio, edad, antecedentesStr, tipo_sangre, pfuma], (err, result) => {
        if (err) {
            console.error("Error al insertar historial:", err);
            res.status(500).send("Error al registrar historial");
        } else {
            const id_historial = result.insertId;

            const sqlRelacion = `INSERT INTO paciente_historial (id_paciente, id_historial) VALUES (?, ?)`;
            con.query(sqlRelacion, [id_paciente, id_historial], (err, result) => {
                if (err) {
                    console.error("Error al relacionar paciente e historial:", err);
                    res.status(500).send("Error en la relación paciente-historial");
                } else {
                    res.send("Registro exitoso y relación creada");
                }
            });
        }
    });
});

// Obtener historial de un paciente
app.get("/historial/:id_paciente", (req, res) => {
    const { id_paciente } = req.params;

    const sql = `
        SELECT h.* FROM historial h
        JOIN paciente_historial ph ON h.id_historial = ph.id_historial
        WHERE ph.id_paciente = ?
    `;

    con.query(sql, [id_paciente], (err, result) => {
        if (err) {
            console.error("Error al obtener historial:", err);
            res.status(500).send("Error al obtener historial");
        } else {
            res.json(result.length > 0 ? result[0] : null);
        }
    });
});

// Actualizar historial médico
app.put("/historial/:id_historial", (req, res) => {
    const { id_historial } = req.params;
    const { escolaridad, ocupacion, religion, interrogatorio, edad, antecedente, tipo_sangre, pfuma } = req.body;

    const sql = `
        UPDATE historial 
        SET escolaridad = ?, ocupacion = ?, religion = ?, interrogatorio = ?, edad = ?, antecedente = ?, tipo_sangre = ?, pfuma = ?
        WHERE id_historial = ?
    `;

    con.query(sql, [escolaridad, ocupacion, religion, interrogatorio, edad, antecedente, tipo_sangre, pfuma, id_historial], (err, result) => {
        if (err) {
            console.error("Error al actualizar historial:", err);
            res.status(500).send("Error al actualizar historial");
        } else {
            res.send("Historial actualizado correctamente");
        }
    });
});

app.get("/historiales", (req, res) => {
    const sql = `
        SELECT 
            p.id_paciente, 
            CONCAT(p.nombre, ' ', p.apellidop, ' ', p.apellidom) AS nombre_completo, 
            h.id_historial, 
            h.escolaridad, 
            h.ocupacion, 
            h.religion, 
            h.interrogatorio, 
            h.edad, 
            h.antecedente, 
            h.tipo_sangre, 
            h.pfuma 
        FROM historial h
        JOIN paciente_historial ph ON h.id_historial = ph.id_historial
        JOIN paciente p ON ph.id_paciente = p.id_paciente
    `;

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener historiales:", err);
            res.status(500).send("Error al obtener historiales");
        } else {
            res.json(results);
        }
    });
});
// Eliminar historial de un paciente
app.delete("/historial/:id_paciente", (req, res) => {
    const { id_paciente } = req.params;

    // Primero obtenemos el historial asociado al paciente
    const sqlGetHistorial = `
        SELECT h.id_historial FROM historial h
        JOIN paciente_historial ph ON h.id_historial = ph.id_historial
        WHERE ph.id_paciente = ?
    `;

    con.query(sqlGetHistorial, [id_paciente], (err, results) => {
        if (err) {
            console.error("Error al obtener historial:", err);
            res.status(500).send("Error al obtener historial");
        } else if (results.length === 0) {
            res.status(404).send("Este paciente no tiene historial médico registrado.");
        } else {
            const id_historial = results[0].id_historial;

            // Eliminamos la relación en paciente_historial
            const sqlDeleteRelacion = `DELETE FROM paciente_historial WHERE id_paciente = ?`;

            con.query(sqlDeleteRelacion, [id_paciente], (err, result) => {
                if (err) {
                    console.error("Error al eliminar relación paciente-historial:", err);
                    res.status(500).send("Error al eliminar relación paciente-historial");
                } else {
                    // Luego eliminamos el historial médico
                    const sqlDeleteHistorial = `DELETE FROM historial WHERE id_historial = ?`;

                    con.query(sqlDeleteHistorial, [id_historial], (err, result) => {
                        if (err) {
                            console.error("Error al eliminar historial:", err);
                            res.status(500).send("Error al eliminar historial médico");
                        } else {
                            res.send("Historial médico eliminado correctamente.");
                        }
                    });
                }
            });
        }
    });
});



app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
