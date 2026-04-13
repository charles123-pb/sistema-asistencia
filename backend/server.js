const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('sqlite3').Database;

const app = express();
const PORT = 3000;
const JWT_SECRET = 'uniasistencia_secret_key_2024';

app.use(cors());
app.use(express.json());

const db = new Database('./database.sqlite');

// ============================================================================
// TABLA SCHEMAS
// ============================================================================
db.serialize(() => {
  // Users: ADMIN o TEACHER
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    pin TEXT NOT NULL,
    role TEXT DEFAULT 'teacher',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Courses: Solo Teachers pueden crear cursos
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    teacher_id INTEGER NOT NULL,
    schedule TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(teacher_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Students: Pertenecen a cursos
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    email TEXT,
    course_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
  )`);

  // Sessions: Sesiones de clases
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    topic TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
  )`);

  // Attendance: Asistencia de estudiantes
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    status TEXT DEFAULT 'p',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE
  )`);

  // Justifications: Justificaciones de inasistencia
  db.run(`CREATE TABLE IF NOT EXISTS justifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    reason TEXT,
    approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE
  )`);

  // Inicializar usuario ADMIN por defecto
  db.get("SELECT COUNT(*) as count FROM users", (err, result) => {
    if (result && result.count === 0) {
      const adminPin = bcrypt.hashSync('0000', 8);
      db.run(
        "INSERT INTO users (id, name, email, pin, role, status) VALUES (?, ?, ?, ?, ?, ?)",
        [1, 'Administrador', 'admin@uni.edu.pe', adminPin, 'admin', 'active'],
        (err) => {
          if (!err) {
            console.log('✓ [INIT] Admin user creado (id=1, PIN=0000)');
          }
        }
      );
    }
  });
});

// ============================================================================
// MIDDLEWARE AUTENTICACIÓN
// ============================================================================
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    console.log(`[AUTH] ✗ Token no encontrado - ${req.method} ${req.path}`);
    return res.status(401).json({ message: 'No autorizado' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log(`[AUTH] ✓ ${decoded.role.toUpperCase()} ${decoded.name} - ${req.method} ${req.path}`);
    next();
  } catch (e) {
    console.log(`[AUTH] ✗ Token inválido - ${e.message}`);
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware: Solo Admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.log(`[AUTH] ✗ Acceso denegado (no admin) - ${req.user.name}`);
    return res.status(403).json({ message: 'Solo administrador' });
  }
  next();
};

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

// Login
app.post('/api/auth/login', (req, res) => {
  const { userId, pin } = req.body;
  
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    if (!bcrypt.compareSync(pin, user.pin)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Usuario inactivo' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log(`[LOGIN] ✓ ${user.name} (${user.role})`);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  });
});

// Get current user
app.get('/api/auth/me', authenticate, (req, res) => {
  db.get(
    "SELECT id, name, email, role, status FROM users WHERE id = ?",
    [req.user.id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    }
  );
});

// Get disponible users para login (solo USER activos y sus roles)
app.get('/api/users', (req, res) => {
  db.all(
    "SELECT id, name, email, role FROM users WHERE status = 'active' ORDER BY role DESC, name ASC",
    (err, users) => {
      if (err) return res.status(500).json({ message: 'Error en BD' });
      res.json(users);
    }
  );
});

// ============================================================================
// ADMIN: GESTIÓN DE TEACHERS
// ============================================================================

// Admin: Get all teachers
app.get('/api/admin/teachers', authenticate, adminOnly, (req, res) => {
  db.all(
    "SELECT id, name, email, role, status, created_at FROM users WHERE role = 'teacher' ORDER BY name ASC",
    (err, teachers) => {
      if (err) return res.status(500).json({ message: 'Error en BD' });
      res.json(teachers);
    }
  );
});

// Admin: Create new teacher
app.post('/api/admin/teachers', authenticate, adminOnly, (req, res) => {
  const { name, email, pin } = req.body;
  
  if (!name || !pin) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  const pinHash = bcrypt.hashSync(pin, 8);
  
  db.run(
    "INSERT INTO users (name, email, pin, role, status) VALUES (?, ?, ?, ?, ?)",
    [name, email || null, pinHash, 'teacher', 'active'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ message: 'Email ya existe' });
        }
        return res.status(500).json({ message: 'Error al crear teacher' });
      }
      
      console.log(`[ADMIN] ✓ Teacher creado: ${name} (id=${this.lastID})`);
      res.json({
        id: this.lastID,
        name,
        email,
        role: 'teacher',
        status: 'active'
      });
    }
  );
});

// Admin: Update teacher
app.put('/api/admin/teachers/:id', authenticate, adminOnly, (req, res) => {
  const { name, email, status } = req.body;
  
  db.run(
    "UPDATE users SET name = ?, email = ?, status = ? WHERE id = ? AND role = 'teacher'",
    [name, email, status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error al actualizar' });
      if (this.changes === 0) return res.status(404).json({ message: 'Teacher no encontrado' });
      
      res.json({ message: 'Teacher actualizado' });
    }
  );
});

// Admin: Delete teacher
app.delete('/api/admin/teachers/:id', authenticate, adminOnly, (req, res) => {
  db.run(
    "DELETE FROM users WHERE id = ? AND role = 'teacher'",
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error al eliminar' });
      if (this.changes === 0) return res.status(404).json({ message: 'Teacher no encontrado' });
      
      console.log(`[ADMIN] ✓ Teacher eliminado (id=${req.params.id})`);
      res.json({ message: 'Teacher eliminado' });
    }
  );
});

// ============================================================================
// ADMIN: ESTADÍSTICAS GLOBALES
// ============================================================================

app.get('/api/admin/stats', authenticate, adminOnly, (req, res) => {
  Promise.all([
    new Promise((resolve) => {
      db.get("SELECT COUNT(*) as count FROM users WHERE role = 'teacher'", (err, r) => {
        resolve(r?.count || 0);
      });
    }),
    new Promise((resolve) => {
      db.get("SELECT COUNT(*) as count FROM courses", (err, r) => {
        resolve(r?.count || 0);
      });
    }),
    new Promise((resolve) => {
      db.get("SELECT COUNT(*) as count FROM students", (err, r) => {
        resolve(r?.count || 0);
      });
    })
  ]).then(([teachers, courses, students]) => {
    res.json({
      total_teachers: teachers,
      total_courses: courses,
      total_students: students
    });
  });
});

// ============================================================================
// TEACHER: GESTIÓN DE CURSOS
// ============================================================================

// Teacher: Get my courses
app.get('/api/courses', authenticate, (req, res) => {
  if (req.user.role === 'admin') {
    // Admin ve todos los cursos
    db.all(
      "SELECT c.*, u.name as teacher_name FROM courses c JOIN users u ON c.teacher_id = u.id ORDER BY c.created_at DESC",
      (err, courses) => {
        if (err) return res.status(500).json({ message: 'Error en BD' });
        res.json(courses);
      }
    );
  } else {
    // Teacher ve solo sus cursos
    db.all(
      "SELECT * FROM courses WHERE teacher_id = ? ORDER BY created_at DESC",
      [req.user.id],
      (err, courses) => {
        if (err) return res.status(500).json({ message: 'Error en BD' });
        res.json(courses);
      }
    );
  }
});

// Teacher: Create course
app.post('/api/courses', authenticate, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Solo teachers pueden crear cursos' });
  }

  const { name, code, schedule } = req.body;
  const teacherId = req.user.role === 'admin' ? req.body.teacher_id : req.user.id;
  
  if (!name || !code || !teacherId) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  db.run(
    "INSERT INTO courses (name, code, teacher_id, schedule) VALUES (?, ?, ?, ?)",
    [name, code, teacherId, schedule || null],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ message: 'Código de curso ya existe' });
        }
        return res.status(500).json({ message: 'Error al crear curso' });
      }
      
      console.log(`[COURSE] ✓ Curso creado: ${name} (id=${this.lastID})`);
      res.json({
        id: this.lastID,
        name,
        code,
        teacher_id: teacherId,
        schedule
      });
    }
  );
});

// Teacher: Update course
app.put('/api/courses/:id', authenticate, (req, res) => {
  const { name, code, schedule } = req.body;
  
  db.get("SELECT teacher_id FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    
    if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }

    db.run(
      "UPDATE courses SET name = ?, code = ?, schedule = ? WHERE id = ?",
      [name, code, schedule, req.params.id],
      function(err) {
        if (err) return res.status(500).json({ message: 'Error al actualizar' });
        res.json({ message: 'Curso actualizado' });
      }
    );
  });
});

// Teacher: Delete course
app.delete('/api/courses/:id', authenticate, (req, res) => {
  db.get("SELECT teacher_id FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    
    if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }

    db.run("DELETE FROM courses WHERE id = ?", [req.params.id], function(err) {
      if (err) return res.status(500).json({ message: 'Error al eliminar' });
      res.json({ message: 'Curso eliminado' });
    });
  });
});

// ============================================================================
// TEACHER: GESTIÓN DE ESTUDIANTES
// ============================================================================

// Teacher: Get students of a course
app.get('/api/courses/:id/students', authenticate, (req, res) => {
  db.get("SELECT teacher_id FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    
    if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }

    db.all(
      "SELECT * FROM students WHERE course_id = ? ORDER BY name ASC",
      [req.params.id],
      (err, students) => {
        if (err) return res.status(500).json({ message: 'Error en BD' });
        res.json(students);
      }
    );
  });
});

// Teacher: Add student to course
app.post('/api/courses/:id/students', authenticate, (req, res) => {
  const { name, code, email } = req.body;
  
  db.get("SELECT teacher_id FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    
    if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }

    db.run(
      "INSERT INTO students (name, code, email, course_id) VALUES (?, ?, ?, ?)",
      [name, code, email, req.params.id],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ message: 'Código de estudiante ya existe' });
          }
          return res.status(500).json({ message: 'Error al agregar estudiante' });
        }
        res.json({
          id: this.lastID,
          name,
          code,
          email,
          course_id: req.params.id
        });
      }
    );
  });
});

// Teacher: Delete student
app.delete('/api/courses/:id/students/:studentId', authenticate, (req, res) => {
  db.get("SELECT teacher_id FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    
    if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }

    db.run(
      "DELETE FROM students WHERE id = ? AND course_id = ?",
      [req.params.studentId, req.params.id],
      (err) => {
        if (err) return res.status(500).json({ message: 'Error al eliminar' });
        res.json({ message: 'Estudiante eliminado' });
      }
    );
  });
});

// ============================================================================
// TEACHER: GESTIÓN DE SESIONES
// ============================================================================

app.get('/api/courses/:id/sessions', authenticate, (req, res) => {
  db.get("SELECT teacher_id FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    
    if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }

    db.all(
      "SELECT * FROM sessions WHERE course_id = ? ORDER BY date DESC",
      [req.params.id],
      (err, sessions) => {
        if (err) return res.status(500).json({ message: 'Error en BD' });
        res.json(sessions);
      }
    );
  });
});

app.post('/api/courses/:id/sessions', authenticate, (req, res) => {
  const { date, start_time, end_time, topic } = req.body;
  
  db.get("SELECT teacher_id FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    
    if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }

    db.run(
      "INSERT INTO sessions (course_id, date, start_time, end_time, topic) VALUES (?, ?, ?, ?, ?)",
      [req.params.id, date, start_time, end_time, topic],
      function(err) {
        if (err) return res.status(500).json({ message: 'Error' });
        res.json({
          id: this.lastID,
          course_id: req.params.id,
          date,
          start_time,
          end_time,
          topic
        });
      }
    );
  });
});

// ============================================================================
// TEACHER: GESTIÓN DE ASISTENCIA
// ============================================================================

app.get('/api/courses/:id/attendance', authenticate, (req, res) => {
  db.get("SELECT teacher_id FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    
    if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }

    const sql = `SELECT a.*, s.name, s.code, se.date, se.topic
                 FROM attendance a
                 JOIN students s ON a.student_id = s.id
                 JOIN sessions se ON a.session_id = se.id
                 WHERE se.course_id = ?
                 ORDER BY se.date DESC`;
    
    db.all(sql, [req.params.id], (err, records) => {
      if (err) return res.status(500).json({ message: 'Error' });
      res.json(records);
    });
  });
});

app.put('/api/courses/:id/sessions/:sessionId/attendance', authenticate, (req, res) => {
  const { attendance } = req.body;
  
  db.get("SELECT teacher_id FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    
    if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }

    let processed = 0;
    attendance.forEach(({ studentId, status }) => {
      db.run(
        "INSERT OR REPLACE INTO attendance (student_id, session_id, status) VALUES (?, ?, ?)",
        [studentId, req.params.sessionId, status],
        () => {
          processed++;
          if (processed === attendance.length) {
            res.json({ message: 'Asistencia registrada' });
          }
        }
      );
    });
  });
});

// ============================================================================
// SERVER START
// ============================================================================

app.listen(PORT, () => {
  console.log(`\n🎓 SERVER RUNNING http://localhost:${PORT}`);
  console.log(`✓ Database: database.sqlite`);
  console.log(`✓ Admin: PIN=0000\n`);
});
