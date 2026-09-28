import mongoose from 'mongoose';
await mongoose.connect('mongodb://localhost:27017/ael');
const courses = await mongoose.connection.db.collection('courses').find({}).toArray();
const quizzes = await mongoose.connection.db.collection('quizzes').find({}).toArray();
console.log('COURSE COUNT:', courses.length);
courses.forEach(c => console.log('Course:', c.courseId, c.title, 'slug:', c.slug, 'lessons in curriculum:', c.curriculum?.map(m => m.lessons?.length)));
console.log('QUIZ COUNT:', quizzes.length);
quizzes.forEach(q => console.log('Quiz:', q.courseId, q.title, 'questionCount:', q.questions?.length));
await mongoose.disconnect();
