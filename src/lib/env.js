import "dotenv/config";

export const ENV = {
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	NODE_ENV: process.env.NODE_ENV,
	JWT_SECRET: process.env.JWT_SECRET,
	RESEND_API_KEY: process.env.RESEND_API_KEY,
	EMAIL_FROM: process.env.EMAIL_FROM,
	EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
	CLIENT_URL: process.env.CLIENT_URL,
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	ARCJET_API_KEY: process.env.ARCJET_API_KEY,
	ARCJET_ENV: process.env.ARCJET_ENV,
};

// PORT = 5000
// MONGO_URI = mongodb://localhost:27017/CCSL
// NODE_ENV = development
// JWT_SECRET = secretKEYJWT
// RESEND_API_KEY = re_D6xjTcg4_AuFcG6NBqm2rT5s7uxqCn8hG
// EMAIL_FROM = oboarding@resend.dev
// EMAIL_FROM_NAME = Test Email
// CLIENT_URL = http://localhost:5000
