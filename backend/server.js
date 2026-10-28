require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lab5_students';

// Middleware to parse JSON request bodies
app.use(express.json());

// Handle malformed JSON body errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Malformed JSON payload in request body' });
  }
  next();
});

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Student Records REST API is healthy and operational',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/students - Return all student records as JSON
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({ message: 'Failed to retrieve student records' });
  }
});

// GET /api/students/:id - Return one student record by ID
app.get('/api/students/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid student ID format' });
  }

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error.message);
    res.status(500).json({ message: 'Failed to retrieve student record' });
  }
});

// POST /api/students - Create a new student record
app.post('/api/students', async (req, res) => {
  try {
    const { fullName, course, yearLevel, section } = req.body;
    const newStudent = new Student({
      fullName,
      course,
      yearLevel,
      section,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: messages,
      });
    }
    console.error('Error creating student:', error.message);
    res.status(500).json({ message: 'Failed to create student record' });
  }
});

// PUT /api/students/:id - Update an existing student record
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid student ID format' });
  }

  try {
    const { fullName, course, yearLevel, section } = req.body;
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (course !== undefined) updateData.course = course;
    if (yearLevel !== undefined) updateData.yearLevel = yearLevel;
    if (section !== undefined) updateData.section = section;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: messages,
      });
    }
    console.error('Error updating student:', error.message);
    res.status(500).json({ message: 'Failed to update student record' });
  }
});

// DELETE /api/students/:id - Delete a student record
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid student ID format' });
  }

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    res.status(200).json({
      message: 'Student record deleted successfully',
      student: deletedStudent,
    });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    res.status(500).json({ message: 'Failed to delete student record' });
  }
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB and start the server only after a successful connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected successfully to MongoDB at ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`Server is running and listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });