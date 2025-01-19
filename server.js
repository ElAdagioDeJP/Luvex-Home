const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para parsear el body de las solicitudes (por ejemplo, los datos del formulario)
app.use(express.urlencoded({ extended: true }));

// Ruta para procesar el formulario
app.post('/submit-form', (req, res) => {
    const { name, lastname, email, telefono, message } = req.body;

    // Guardar los datos en un archivo .txt
    const data = `Nombre: ${name}\nApellido: ${lastname}\nCorreo: ${email}\nTeléfono: ${telefono}\nMensaje: ${message}\n\n`;
    fs.appendFile(path.join(__dirname, 'contact-form.txt'), data, (err) => {
        if (err) {
            console.error('Error al guardar los datos:', err);
            return res.status(500).send('Hubo un error al guardar los datos');
        }
        console.log('Datos guardados correctamente');
        res.send('Gracias por contactarnos. Pronto te responderemos.');
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
