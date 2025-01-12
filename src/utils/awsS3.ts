import * as AWS from "aws-sdk";
import * as fs from "fs";
import config from "../config/environments";
import { PromiseResult } from "aws-sdk/lib/request";

/**
 * Singleton class for interacting with Amazon S3.
 * @class
 */
export default class AWSS3 {
  private static _instance: AWSS3;

  /** Default values in case the environment variables are not taken */
  private S3_ACCESS_KEY_ID = "";
  private S3_SECRET_ACCESS_KEY ="";
  private S3_ENDPOINT_URL = "";
  private S3_BUCKET_NAME = "";

  /** Amazon S3 Access Key ID. @private */
  private _S3_ACCESS_KEY_ID: string =
    config.S3_ACCESS_KEY_ID! ?? this.S3_ACCESS_KEY_ID;
  /** Amazon S3 Secret Access Key. @private */
  private _S3_SECRET_ACCESS_KEY: string =
    config.S3_SECRET_ACCESS_KEY! ?? this.S3_SECRET_ACCESS_KEY;
  /** Amazon S3 Endpoint URL. @private */
  private _S3_ENDPOINT_URL: string =
    config.S3_ENDPOINT_URL! ?? this.S3_ENDPOINT_URL;
  /** Amazon S3 Bucket Name. @private */
  private _S3_BUCKET_NAME: string =
    config.S3_BUCKET_NAME! ?? this.S3_BUCKET_NAME;

  /** Amazon S3 Object. @private */
  private _s3: AWS.S3 = new AWS.S3();

  /**
   * Private constructor to initialize Amazon S3 configurations.
   * @private
   */
  private constructor() {
    AWS.config.update({
      accessKeyId: this._S3_ACCESS_KEY_ID,
      secretAccessKey: this._S3_SECRET_ACCESS_KEY,
    });

    this._s3 = new AWS.S3({
      endpoint: this._S3_ENDPOINT_URL,
      params: {
        Bucket: this._S3_BUCKET_NAME,
      },
    });
  }

  /**
   * Static method to get the unique instance of AWSS3.
   * @returns {AWSS3} - The unique instance of AWSS3.
   */
  public static getInstance(): AWSS3 {
    if (!AWSS3._instance) {
      AWSS3._instance = new AWSS3();
    }
    return AWSS3._instance;
  }

  /**
   * Method to upload a file to Amazon S3 using a file path.
   * @param {string} filePath - Path of the file to upload.
   * @param {string} fileNameKey - The key name of the file in S3.
   * @returns {Promise<{result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>, url: string}>} - Operation result and file URL in S3.
   * @throws {Error} - Error if something goes wrong.
   */
  async uploadByFilePath(
    filePath: string,
    fileNameKey: string
  ): Promise<{
    result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    url: string;
  }> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const params = {
        Bucket: this._S3_BUCKET_NAME,
        Key: fileNameKey,
        Body: fileContent,
        ACL: "public-read",
      };

      const result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError> =
        await this._s3.putObject(params).promise();

      return {
        result,
        url: `https://${this._S3_ENDPOINT_URL}/${this._S3_BUCKET_NAME}/${fileNameKey}`,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Method to delete a file from Amazon S3.
   * @param fileNameKey - The key name of the file in S3
   */
  deleteObject(fileNameKey: string): Promise<AWS.S3.DeleteObjectOutput> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this._S3_BUCKET_NAME,
        Key: fileNameKey,
      };

      this._s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error("ERROR deleteObject ", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * Method to upload a PDF file to Amazon S3 using a file path.
   * @param {string} filePath - Path of the PDF file to upload.
   * @param {string} fileNameKey - The key name of the file in S3.
   * @returns {Promise<{result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>, url: string}>} - Operation result and file URL in S3.
   * @throws {Error} - Error if something goes wrong.
   */
  async uploadPDFByFilePath(
    filePath: string,
    fileNameKey: string
  ): Promise<{
    result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    url: string;
  }> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const params = {
        Bucket: this._S3_BUCKET_NAME,
        Key: fileNameKey,
        Body: fileContent,
        ContentType: "application/pdf",
        ACL: "public-read",
      };

      const result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError> =
        await this._s3.putObject(params).promise();

      return {
        result,
        url: `https://${this._S3_ENDPOINT_URL}/${this._S3_BUCKET_NAME}/${fileNameKey}`,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Method to upload a file to Amazon S3 using a buffer.
   * @param {Buffer | ArrayBuffer} buffer - The buffer containing the file content.
   * @param {string} fileNameKey - The key name of the file in S3.
   * @returns {Promise<{result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>, url: string}>} - Operation result and file URL in S3.
   * @throws {Error} - Error if something goes wrong.
   */
  async uploadByBuffer(
    buffer: Buffer | ArrayBuffer,
    fileNameKey: string
  ): Promise<{
    result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    url: string;
  }> {
    try {
      const params = {
        Bucket: this._S3_BUCKET_NAME,
        Key: fileNameKey,
        Body: buffer,
        ACL: "public-read",
      };

      const result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError> =
        await this._s3.putObject(params).promise();

      return {
        result,
        url: `https://${this._S3_ENDPOINT_URL}/${this._S3_BUCKET_NAME}/${fileNameKey}`,
      };
    } catch (error) {
      console.log("ERROR uploadByBuffer ", error);
      throw error;
    }
  }
}
