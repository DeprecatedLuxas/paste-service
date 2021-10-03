import AWS from "aws-sdk";

export default class DB {
    client: AWS.S3;
    bucket: string;

    constructor() {
        this.bucket = "paste-service";
        this.client = new AWS.S3({
            region: "eu-west-2",
            credentials: new AWS.Credentials({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }),
        });
    }

    generateId() {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
        
        let id = "";
        for (let i = 0; i < 10; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        return id;
    }



    async get(id: string, callback: Function) {
        const params = {
            Bucket: this.bucket,
            Key: id.toString(),
        };
        try {
            const data = await this.client.getObject(params).promise();
            callback(null, data.Body.toString());
        } catch (err) {
            callback(err, null);
        }
    }

    create(id: string, data: string, callback: Function) {
        const params = {
            Bucket: this.bucket,
            Key: id.toString(),
            Body: data,
        };
        this.client.putObject(params, (err, data) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    }
}
