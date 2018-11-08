export interface RoutesController {
  subject: string;
}

export interface SuccessResponseBody {
  code: string;
  message: string;
  data: any;
}

export interface ErrorResponseBody {
  code: string;
  errorMessage: string;
}

export interface Agent {
  email: string;
  password: string;
  permissions: string;
  timestamp: Date;
  app: string;
  is_login: boolean;
  queued: number;
  status: number;
  type: number;
}

export interface Queue {
  agent: string;
  fb_id: string;
  client: string;
  timestamp: Date;
  status: number;
}

export interface Message {
  queue: string;
  agent: string;
  text: string;
  timestamp: Date;
  attachments: string[];
  status: number;
  type: number;
}
