class URI_Auth {
  constructor(uri) {
    this.uri = uri;
    this.parsedURI = new URL(uri);
    this.path = this.parsedURI.hostname;
    this.params = new URLSearchParams(this.parsedURI.search);

    // check if parsed URI is equal to requirement
    if (this.parsedURI.protocol !== 'visma-identity:') {
        throw new Error('Invalid scheme for URI.');
    }

    // check if allowed paths are used
    const allowedPaths = ['login', 'confirm', 'sign'];
    if (!allowedPaths.includes(this.path)) {
        throw new Error('Invalid path for URI.');
    }

    // validates parameters based on input URI path
    switch (this.path) {
      case 'login':
        this.validateLoginParams();
        break;

      case 'confirm':
        this.validateConfirmParams();
        break;

      case 'sign':
        this.validateSignParams();
        break;

      default:
        break;
    }
  }

  validateLoginParams() {
    if (!this.params.has('source')) {
      throw new Error('Missing required parameter "source" in URI');
    }
  }

  validateConfirmParams() {
    if (!this.params.has('source')) {
      throw new Error('Missing required parameter "source" in URI');
    }
    if (!this.params.has('paymentnumber')) {
      throw new Error('Missing required parameter "paymentnumber" in URI');
    }
    if (isNaN(parseInt(this.params.get('paymentnumber'))) || !Number.isInteger(parseInt(this.params.get('paymentnumber')))) {
      throw new Error('Parameter "paymentnumber" must be an integer');
    }
  }

  validateSignParams() {
    if (!this.params.has('source')) {
      throw new Error('Missing required parameter "source" in URI');
    }
    if (!this.params.has('documentid')) {
      throw new Error('Missing required parameter "documentid" in URI');
    }
  }

  getParams() {
    const params = {};
    for (const [key, value] of this.params) {
      params[key] = value;
    }
    return params;
  }
}

class Client {
  constructor() {}

  parseURI(uri) {
    try {
      const parsedURI = new URI_Auth(uri);
      return {
        path: parsedURI.path,
        params: parsedURI.getParams(),
        success: true,
      };
    } catch (error) {
      return {
        error: error.message,
        success: false,
      };
    }
  }
}

const client = new Client();
const result = client.parseURI('visma-identity://confirm?source=netvisor&paymentnumber=102226');

if (result.success) {
  console.log('path: ' + result.path);
  console.log(result.params);
} else {
  console.error(result.error);
}