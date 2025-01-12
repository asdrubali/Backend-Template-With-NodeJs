import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const TEMPORAL_FILES_PATH: string = path.join(__dirname, "../api/attachments");

export class FileMiddleware {
  private upload: multer.Multer;

  private multerErrorMessages: { [key: string]: string } = {
    LIMIT_FILE_SIZE: "The file exceeds the maximum allowed size.",
    LIMIT_UNEXPECTED_FILE: "File limit exceeded.",
    LIMIT_FIELD_COUNT: "Too many fields submitted.",
    LIMIT_FIELD_KEY: "Too many fields submitted.",
    LIMIT_FIELD_VALUE: "Too many fields submitted.",
    LIMIT_FILE_COUNT: "Too many files submitted.",
    LIMIT_PART_COUNT: "Too many files submitted.",
  };

  private STORAGE: multer.StorageEngine = multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) {
      const dest = TEMPORAL_FILES_PATH;
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }

      cb(null, dest);
    },
    filename: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) {
      cb(null, uuidv4() + path.extname(file.originalname));
    },
  });

  constructor(options?: multer.Options | undefined, returnBuffer?: boolean) {
    this.upload = multer({
      storage: returnBuffer ? multer.memoryStorage() : this.STORAGE,
      ...options,
    });
  }

  private handleMulterError(
    err: any,
    req: Request,
    res: Response,
    customErrorMessage?: string
  ) {
    let statusCode = 500;
    let errorMessage = customErrorMessage || "Error processing file";

    if (err instanceof createHttpError.HttpError) {
      statusCode = err.statusCode;
      errorMessage = err.message;
    } else {
      if (err instanceof multer.MulterError) {
        console.error(err);
        statusCode = 400;
        errorMessage = this.multerErrorMessages[err.code] || errorMessage;
      }
    }

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (error) => {
        if (error) {
          console.error("Error deleting file: ", error);
        }
      });
    }

    if (req.files) {
      let i = 0;
      if (
        typeof req.files === "object" &&
        !Array.isArray(req.files) &&
        req.files !== null
      ) {
        // Delete file
        const varWithFiles = req.files;

        for (const key in varWithFiles) {
          varWithFiles[key].forEach((file: Express.Multer.File) => {
            if (file && fs.existsSync(file.path)) {
              fs.unlink(file.path, (error) => {
                if (error && i == 0) {
                  console.error("- Error deleting file: ", error);
                  i++;
                }
              });
            }
          });
        }
      } else {
        req.files.forEach((file: Express.Multer.File) => {
          if (file && fs.existsSync(file.path)) {
            fs.unlink(file.path, (error) => {
              if (error && i == 0) {
                console.error("* Error deleting file(s): ", error);
                i++;
              }
            });
          }
        });
      }
    }

    if (statusCode >= 500) {
      console.error("Error in FileMiddleware: ", err);
    }

    return res.status(statusCode).json({ message: errorMessage });
  }

  /**
   * Splits the content of a multipart form into body and file through the Request.
   * @param {string} fieldName Name of the File field located in the multipart form
   * @returns Middleware
   */
  public uploadSingleFile = (fieldName: string, maxSizeMB?: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const middleware = this.upload.single(fieldName);
      middleware(req, res, (err: any) => {
        if (err) {
          const handleError = this.handleMulterError(
            err,
            req,
            res,
            "Error processing file"
          );
          return handleError;
        }

        if (maxSizeMB !== undefined && req.file && req.file.size > maxSizeMB * 1024 * 1024) {
          // The file exceeds the maximum allowed size
          return res.status(400).json({
            message: `The file exceeds the maximum allowed size of ${maxSizeMB} MB`,
          });
        }

        next();
      });
    };
  };

  /**
   * Splits the content of a multipart form into body and file through the Request.
   * @param {string} fieldName Name of the File field located in the multipart form
   * @param {number} maxCount Maximum number of files to process
   * @returns Middleware
   */
  public uploadMultipleFiles = (
    fieldName: string,
    maxCount?: number,
    allowedExtensions: string[] = [] // List of allowed extensions
  ) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const middleware = this.upload.array(fieldName, maxCount);

      middleware(req, res, (err: any) => {
        if (err) {
          const handleError = this.handleMulterError(
            err,
            req,
            res,
            "Error processing multiple files"
          );
          return handleError;
        }

        // Check the file extensions
        const files: Express.Multer.File[] = (req as any).files; // Accessing the correct type of files
        const invalidFiles: string[] = [];
        files.forEach(file => {
          const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
          if (!allowedExtensions.includes(fileExtension || '')) {
            invalidFiles.push(file.originalname);
          }
        });

        if (invalidFiles.length > 0) {
          return res.status(400).json({ error: `Not allowed files: ${invalidFiles.join(', ')}` });
        }

        next();
      });
    };
  };

  /**
   * Handles file upload for multiple fields with different names and count limits.
   * Each field is defined with an object that contains the field name and optionally the maximum allowed number of files.
   *
   * @param {Object[]} fields - Array of objects specifying file fields and their limits.
   *                            Each object must have a 'name' property corresponding to the field name in the form,
   *                            and an optional 'maxCount' property defining the maximum number of files allowed for that field.
   *
   * @returns Express middleware that handles file upload for the specified fields.
   *          In case of an error during the upload, the error is handled using 'handleMulterError'.
   *
   * @example
   * // Using the middleware to upload images and audios with specific limits
   * const fileFields = [
   *     { name: 'images', maxCount: 10 },
   *     { name: 'audios', maxCount: 5 }
   * ];
   * router.post('/upload', fileMiddleware.uploadFilesWithMultipleFields(fileFields), (req, res) => {
   *     // Process uploaded files
   * });
   */
  public uploadFilesWithMultipleFields = (
    fields: { name: string; maxCount?: number }[]
  ) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const middleware = this.upload.fields(fields);
      middleware(req, res, (err) => {
        if (err) {
          const handleError = this.handleMulterError(
            err,
            req,
            res,
            "Error processing multiple file fields"
          );
          return handleError;
        }
        next();
      });
    };
  };
}
