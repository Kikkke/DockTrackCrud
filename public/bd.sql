CREATE DATABASE IF NOT EXISTS historial;
USE historial;

CREATE TABLE paciente (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(250) NOT NULL,
    apellidop VARCHAR(250) NOT NULL,
    apellidom VARCHAR(250) NOT NULL
);

CREATE TABLE historial (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    escolaridad VARCHAR(255) NOT NULL,
    ocupacion VARCHAR(255) NOT NULL,
    religion VARCHAR(255) NOT NULL,
    interrogatorio VARCHAR(255),
    edad INT NOT NULL,
    antecedente TEXT NOT NULL, 
    tipo_sangre VARCHAR(250),
    pfuma VARCHAR(15) NOT NULL
);

CREATE TABLE paciente_historial (
    id_paciente INT,
    id_historial INT,
    PRIMARY KEY (id_paciente, id_historial),
    FOREIGN KEY (id_paciente) REFERENCES paciente(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_historial) REFERENCES historial(id_historial) ON DELETE CASCADE
);

INSERT INTO paciente (id_paciente, nombre, apellidop, apellidom) 
VALUES ('1', 'Enrique', 'Lopez', 'Garfias'),
('2', 'Fernanda', 'Sanchez', 'Villegas'),
('3', 'Edson', 'Ordoñoez', 'Martinez'),
('4', 'Aldebaran', 'Rojas', 'Ramirez'),
('5', 'Astrid', 'Lopez', 'Garfias');
select*from historial;
drop database historial;