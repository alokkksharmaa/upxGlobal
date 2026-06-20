'use strict';

/**
 * Seed sample courses into Firebase Firestore.
 * Run: node server/scripts/seedCourses.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { db } = require('../config/firebase');
const CourseModel = require('../models/Course');
const logger = require('../config/logger');

const SAMPLE_COURSES = [
  {
    title: 'Full Stack Web Development',
    description: 'Master React.js, Node.js, Express, Firebase, and MongoDB. Build 5 real-world projects and land your dream job as a full-stack engineer.',
    duration: '6 months',
    price: 19999,
    instructor: 'Rajesh Kumar',
    level: 'beginner',
    category: 'Web Development',
    status: 'active',
    skillsCovered: ['React.js', 'Node.js', 'Express.js', 'Firebase', 'MongoDB', 'REST APIs', 'JWT Auth', 'Deployment'],
    learningOutcomes: [
      'Build production-ready full-stack applications',
      'Implement secure authentication & authorization',
      'Deploy apps to cloud (Firebase, Heroku)',
      'Write clean, maintainable code',
      'Work with relational and NoSQL databases',
    ],
    thumbnailUrl: '',
  },
  {
    title: 'Data Science & Machine Learning',
    description: 'Learn Python, Pandas, NumPy, Scikit-learn, TensorFlow, and build real ML models. From data analysis to deployment.',
    duration: '5 months',
    price: 24999,
    instructor: 'Dr. Anita Sharma',
    level: 'intermediate',
    category: 'Data Science',
    status: 'active',
    skillsCovered: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow', 'SQL', 'Power BI'],
    learningOutcomes: [
      'Perform exploratory data analysis',
      'Build and evaluate ML models',
      'Create data visualisations',
      'Deploy ML models as APIs',
      'Work with real-world datasets',
    ],
    thumbnailUrl: '',
  },
  {
    title: 'Cloud Computing with AWS',
    description: 'Become AWS certified. Master EC2, S3, Lambda, RDS, VPC, IAM and build scalable cloud architectures.',
    duration: '4 months',
    price: 21999,
    instructor: 'Vikram Nair',
    level: 'intermediate',
    category: 'Cloud & DevOps',
    status: 'active',
    skillsCovered: ['AWS EC2', 'S3', 'Lambda', 'RDS', 'VPC', 'IAM', 'CloudFormation', 'Docker'],
    learningOutcomes: [
      'Architect highly available AWS applications',
      'Implement cloud security best practices',
      'Prepare for AWS Solutions Architect exam',
      'Deploy containerised apps on ECS',
      'Automate infrastructure with CloudFormation',
    ],
    thumbnailUrl: '',
  },
  {
    title: 'Cyber Security & Ethical Hacking',
    description: 'Learn penetration testing, network security, web app security, and prepare for CEH and CompTIA Security+ certifications.',
    duration: '4 months',
    price: 22999,
    instructor: 'Arjun Mehta',
    level: 'intermediate',
    category: 'Cyber Security',
    status: 'active',
    skillsCovered: ['Penetration Testing', 'Kali Linux', 'Metasploit', 'Wireshark', 'OWASP Top 10', 'Network Security', 'Cryptography'],
    learningOutcomes: [
      'Conduct ethical penetration tests',
      'Identify and fix web vulnerabilities',
      'Secure network infrastructure',
      'Prepare for CEH certification',
      'Write professional security reports',
    ],
    thumbnailUrl: '',
  },
  {
    title: 'UI/UX Design with Figma',
    description: 'Design stunning digital products. Learn user research, wireframing, prototyping, and build a professional design portfolio.',
    duration: '3 months',
    price: 14999,
    instructor: 'Priya Singh',
    level: 'beginner',
    category: 'Design',
    status: 'active',
    skillsCovered: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Adobe XD'],
    learningOutcomes: [
      'Design mobile and web interfaces',
      'Create interactive Figma prototypes',
      'Build a 5-project design portfolio',
      'Apply UX research methodologies',
      'Collaborate with developers using handoff tools',
    ],
    thumbnailUrl: '',
  },
  {
    title: 'DevOps & CI/CD Pipeline',
    description: 'Master Docker, Kubernetes, Jenkins, GitHub Actions, Terraform, and implement DevOps culture in real engineering teams.',
    duration: '4 months',
    price: 23999,
    instructor: 'Suresh Patel',
    level: 'advanced',
    category: 'Cloud & DevOps',
    status: 'active',
    skillsCovered: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Prometheus', 'Grafana'],
    learningOutcomes: [
      'Build complete CI/CD pipelines',
      'Deploy and manage Kubernetes clusters',
      'Implement Infrastructure as Code',
      'Monitor production systems',
      'Reduce deployment time by 80%',
    ],
    thumbnailUrl: '',
  },
];

const seed = async () => {
  logger.info('Starting course seeding...');

  // Check existing
  const snap = await db.collection('courses').get();
  if (!snap.empty) {
    logger.info(`Courses already exist (${snap.size}). Skipping seed.`);
    process.exit(0);
  }

  for (const course of SAMPLE_COURSES) {
    const created = await CourseModel.create(course);
    logger.info(`Created course: ${created.title} (${created.id})`);
  }

  logger.info(`✅ Seeded ${SAMPLE_COURSES.length} courses successfully!`);
  process.exit(0);
};

seed().catch((err) => {
  logger.error('Seed failed:', err);
  process.exit(1);
});
