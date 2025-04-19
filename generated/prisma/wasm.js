
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  bio: 'bio',
  avatar: 'avatar',
  phone: 'phone',
  address: 'address',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  description: 'description',
  thumbnail: 'thumbnail',
  level: 'level',
  ststus: 'ststus',
  price: 'price',
  duration: 'duration',
  instructorId: 'instructorId',
  isPublished: 'isPublished',
  isApproved: 'isApproved',
  publishedAt: 'publishedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoriesOnCourseScalarFieldEnum = {
  courseId: 'courseId',
  categoryId: 'categoryId',
  assignedAt: 'assignedAt'
};

exports.Prisma.ModuleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  order: 'order',
  isPublished: 'isPublished',
  courseId: 'courseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContentScalarFieldEnum = {
  id: 'id',
  title: 'title',
  type: 'type',
  contentData: 'contentData',
  duration: 'duration',
  order: 'order',
  isPublished: 'isPublished',
  moduleId: 'moduleId',
  authorId: 'authorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuizScalarFieldEnum = {
  id: 'id',
  contentId: 'contentId',
  timeLimit: 'timeLimit',
  passingScore: 'passingScore',
  maxAttempts: 'maxAttempts',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuestionScalarFieldEnum = {
  id: 'id',
  quizId: 'quizId',
  questionText: 'questionText',
  questiontype: 'questiontype',
  options: 'options',
  correctAnswer: 'correctAnswer',
  points: 'points',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuizAttemptScalarFieldEnum = {
  id: 'id',
  quizId: 'quizId',
  userId: 'userId',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  score: 'score',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnswerScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  questionId: 'questionId',
  answerText: 'answerText',
  isCorrect: 'isCorrect',
  points: 'points',
  feedback: 'feedback',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EnrollmentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId',
  status: 'status',
  enrollmentDate: 'enrollmentDate',
  completionDate: 'completionDate',
  certificateIssued: 'certificateIssued',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AssigmentScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  courseId: 'courseId',
  creatorId: 'creatorId',
  dueDate: 'dueDate',
  pointPossible: 'pointPossible',
  instruction: 'instruction',
  attachment: 'attachment',
  isPublished: 'isPublished',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubmissionScalarFieldEnum = {
  id: 'id',
  assigmentId: 'assigmentId',
  userId: 'userId',
  content: 'content',
  attachment: 'attachment',
  submittedAt: 'submittedAt',
  grade: 'grade',
  feedback: 'feedback',
  gradeAt: 'gradeAt',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProgressRecordScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId',
  contentId: 'contentId',
  enrollmentId: 'enrollmentId',
  status: 'status',
  progress: 'progress',
  timeSpent: 'timeSpent',
  lastAccessedAt: 'lastAccessedAt',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiscussionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  userId: 'userId',
  courseId: 'courseId',
  isPinned: 'isPinned',
  isLocked: 'isLocked',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  userId: 'userId',
  discussionId: 'discussionId',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  message: 'message',
  isRead: 'isRead',
  data: 'data',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RatingScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  userId: 'userId',
  rating: 'rating',
  review: 'review',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatMessageScalarFieldEnum = {
  id: 'id',
  content: 'content',
  senderId: 'senderId',
  receiverId: 'receiverId',
  isRead: 'isRead',
  readAt: 'readAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatRoomScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatRoomMessageScalarFieldEnum = {
  id: 'id',
  content: 'content',
  charRoomId: 'charRoomId',
  senderId: 'senderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatParticipantScalarFieldEnum = {
  userId: 'userId',
  chatRoomId: 'chatRoomId',
  joinedAt: 'joinedAt',
  leftAt: 'leftAt'
};

exports.Prisma.MessageReadReceiptScalarFieldEnum = {
  messageId: 'messageId',
  userId: 'userId',
  readAt: 'readAt'
};

exports.Prisma.UserSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  socketId: 'socketId',
  isOnline: 'isOnline',
  lastActiveAt: 'lastActiveAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MediaScalarFieldEnum = {
  id: 'id',
  name: 'name',
  originalName: 'originalName',
  mimeType: 'mimeType',
  size: 'size',
  url: 'url',
  publicId: 'publicId',
  uploadedBy: 'uploadedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CertificateScalarFieldEnum = {
  id: 'id',
  enrollmentId: 'enrollmentId',
  templateId: 'templateId',
  certificateNumber: 'certificateNumber',
  issuedAt: 'issuedAt',
  expiresAt: 'expiresAt',
  pdfUrl: 'pdfUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CertificateTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  htmlTemplate: 'htmlTemplate',
  cssStyles: 'cssStyles',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailNotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  subject: 'subject',
  body: 'body',
  status: 'status',
  scheduledFor: 'scheduledFor',
  sentAt: 'sentAt',
  error: 'error',
  templateId: 'templateId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  subject: 'subject',
  body: 'body',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ScheduledTaskScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  cronExpression: 'cronExpression',
  data: 'data',
  isActive: 'isActive',
  lastRun: 'lastRun',
  nextRun: 'nextRun',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  ADMIN: 'ADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT: 'STUDENT'
};

exports.CourseLevel = exports.$Enums.CourseLevel = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT'
};

exports.CourseStatus = exports.$Enums.CourseStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.ContentType = exports.$Enums.ContentType = {
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  QUIZ: 'QUIZ',
  ASSIGNMENT: 'ASSIGNMENT',
  PRESENTATION: 'PRESENTATION',
  TEXT: 'TEXT',
  AUDIO: 'AUDIO',
  LINK: 'LINK'
};

exports.QuestionType = exports.$Enums.QuestionType = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  TRUE_FALSE: 'TRUE_FALSE',
  SHORT_ANSWER: 'SHORT_ANSWER',
  ESSAY: 'ESSAY'
};

exports.AttemptStatus = exports.$Enums.AttemptStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED'
};

exports.EnrollmentStatus = exports.$Enums.EnrollmentStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  DROPPED: 'DROPPED',
  EXPIRED: 'EXPIRED'
};

exports.SubmissionStatus = exports.$Enums.SubmissionStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  LATE: 'LATE',
  GRADED: 'GRADED',
  RETURNED: 'RETURNED'
};

exports.ProgressStatus = exports.$Enums.ProgressStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  COURSE_UPDATE: 'COURSE_UPDATE',
  ASSIGNMENT_POSTED: 'ASSIGNMENT_POSTED',
  GRADE_POSTED: 'GRADE_POSTED',
  DISCUSSION_REPLY: 'DISCUSSION_REPLY',
  ENROLLMENT_CONFIRMED: 'ENROLLMENT_CONFIRMED',
  NEW_MESSAGE: 'NEW_MESSAGE',
  SYSTEM: 'SYSTEM'
};

exports.ChatRoomType = exports.$Enums.ChatRoomType = {
  DIRECT: 'DIRECT',
  GROUP: 'GROUP',
  COURSE: 'COURSE'
};

exports.EmailStatus = exports.$Enums.EmailStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.TaskType = exports.$Enums.TaskType = {
  EMAIL_REMINDER: 'EMAIL_REMINDER',
  COURSE_PUBLISH: 'COURSE_PUBLISH',
  CERTIFICATE_GENERATION: 'CERTIFICATE_GENERATION',
  ENROLLMENT_EXPIRY: 'ENROLLMENT_EXPIRY',
  DATA_BACKUP: 'DATA_BACKUP',
  CUSTOM: 'CUSTOM'
};

exports.Prisma.ModelName = {
  User: 'User',
  Course: 'Course',
  Category: 'Category',
  CategoriesOnCourse: 'CategoriesOnCourse',
  Module: 'Module',
  Content: 'Content',
  Quiz: 'Quiz',
  Question: 'Question',
  QuizAttempt: 'QuizAttempt',
  Answer: 'Answer',
  Enrollment: 'Enrollment',
  Assigment: 'Assigment',
  Submission: 'Submission',
  ProgressRecord: 'ProgressRecord',
  Discussion: 'Discussion',
  Comment: 'Comment',
  Notification: 'Notification',
  Rating: 'Rating',
  ChatMessage: 'ChatMessage',
  ChatRoom: 'ChatRoom',
  ChatRoomMessage: 'ChatRoomMessage',
  ChatParticipant: 'ChatParticipant',
  MessageReadReceipt: 'MessageReadReceipt',
  UserSession: 'UserSession',
  Media: 'Media',
  Certificate: 'Certificate',
  CertificateTemplate: 'CertificateTemplate',
  EmailNotification: 'EmailNotification',
  EmailTemplate: 'EmailTemplate',
  ScheduledTask: 'ScheduledTask'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
