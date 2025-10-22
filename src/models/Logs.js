import mongoose from "mongoose";

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	action: {
		type: String,
		required: true,
	},
	collection: {
		type: String,
		required: true,
	},
	documentId: Schema.Types.ObjectId,
	oldValue: Schema.Types.Mixed,
	newValue: Schema.Types.Mixed,
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

const Logs = mongoose.model("Logs", auditLogSchema);

export default Logs;
