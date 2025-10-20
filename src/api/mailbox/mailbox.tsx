import Api from "../api-base-config";

class MailBox {
  static async createEmail(data: {
    subject: string;
    content: string;
  }): Promise<any> {
    return await Api.post(`api/v1/mailbox`, data);
  }
}

export default MailBox;
