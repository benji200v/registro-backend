const express   = require('express');
const cors      = require('cors');
const validator = require('validator');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ───────────────────────────────────────────────────
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Ruta principal ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('✅ Servidor funcionando correctamente');
});

// ── POST /register ────────────────────────────────────────────────
app.post('/register', (req, res) => {

  let { email, password, dob, website_url } = req.body;

  console.log('📨 Nueva solicitud recibida:', req.body);

  // HONEYPOT - Detección de bots
  if (website_url && website_url.trim() !== '') {
    console.log('🤖 ¡Bot detectado!');
    return res.status(200).json({ message: 'Registro recibido' });
  }

  // Sanitización
  email    = validator.escape(email    || '');
  password = validator.escape(password || '');
  dob      = validator.escape(dob      || '');

  // Validación de Email
  if (!validator.isEmail(validator.unescape(email))) {
    console.log('❌ Email inválido');
    return res.status(400).json({ error: 'Email inválido' });
  }

  // Validación de Contraseña
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(validator.unescape(password))) {
    console.log('❌ Contraseña débil');
    return res.status(400).json({
      error: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número'
    });
  }

  // Validación de Fecha de nacimiento
  const today   = new Date();
  const dobDate = new Date(dob);

  if (!dob || isNaN(dobDate)) {
    console.log('❌ Fecha inválida');
    return res.status(400).json({ error: 'Fecha de nacimiento inválida' });
  }

  if (dobDate > today) {
    console.log('❌ Fecha en el futuro');
    return res.status(400).json({
      error: 'La fecha de nacimiento no puede ser en el futuro'
    });
  }

  // ✅ Todo válido
  console.log('✅ Registro exitoso para:', validator.unescape(email));
  return res.status(200).json({
    message: '¡Registro exitoso!',
    data: {
      email: validator.unescape(email),
      dob:   dob
    }
  });
});

// ── Iniciar servidor ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});