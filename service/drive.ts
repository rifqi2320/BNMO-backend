import { PrismaClient } from "@prisma/client";
import { google, drive_v3 } from "googleapis";
import { Readable } from "stream";

const oAuth2Client = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

class DriveService {
  prisma: PrismaClient;
  drive: drive_v3.Drive;
  constructor() {
    this.prisma = new PrismaClient();
    this.drive = google.drive({
      version: "v3",
      auth: oAuth2Client,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folderId: string,
    filename: string
  ) {
    const fileMetadata = {
      name: filename,
      parents: [folderId],
    };
    const media = {
      mimeType: file.mimetype,
      body: Readable.from(file.buffer),
    };

    const res = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    return res.data.id;
  }
}

export default new DriveService();
