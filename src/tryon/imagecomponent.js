import * as sha256 from "js-sha256";
import * as storage from "@google-cloud/storage";
import config from "./config";
import * as vision from "@google-cloud/vision";
import * as aws from "aws-sdk";
const gcs = storage({
	projectId: config.GCS.PROJECTID,
	keyFilename: './credentails.json'
});
const s3 = new aws.S3({
	secretAccessKey: config.AWS.AWS_SECRET_ACCESS_KEY,
	accessKeyId: config.AWS.AWS_ACCESS_KEY_ID,
	region: config.AWS.AWS_REGION
});
export default s3;