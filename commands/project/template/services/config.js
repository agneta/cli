module.exports = {

  /*sftp: {
    acl: [{
      email: '',
      root: '',
      allow: true
    }
    ]
  },*/

  /*
  google:{
    api: '',
    recaptcha: ''
  },
  */

  limiter: {
    global: {
      freeRetries: 400,
      attachResetToRequest: false,
      refreshTimeoutOnRequest: false,
      minWait: 11 * 60 * 1000,
      maxWait: 11 * 60 * 1000,
      lifetime: 10 * 60
    },
    paths: [
      /*{
        title: '',
        name: '',
        paths: [''],
        options: {
          freeRetries: 5,
          minWait: 5 * 60 * 1000,
          maxWait: 60 * 60 * 1000
        }
      }*/
    ],
    whitelist: [
      //'0.0.0.0'
    ]
  },
  roles: {
    /*
    name: {
      model: 'ModelName'
    }*/
  },
  email: {
    info: {
      name: {
        en: 'Company name'
      },
      address: {
        en: 'Company address'
      },
      city: {
        gr: 'Company city'
      },
      state: {
        gr: 'Company state'
      },
      zip: 'Company zip'
    },
    sendgrid: {
      apiKey: '',
    },
    contacts: {
      /*
      contact_name: {
        name: {
          en: ''
        },
        email: ''
      },*/
      default: {
        name: {
          en: 'No reply',
        },
        email: 'noreply@company.com'
      }
    },
    subject: {
      prefix: {
        en: ''
      }
    }
  },

  /*certificate: {
    map: '',
    roles: []
  },*/

  /*git: {
    host: '',
    username: '',
    remote: {
      name: '',
      url: ''
    },
    authors: {}
  },*/

  account: {
    callbacks: []
  },

  /*
  wsdl: {
    path: null,
    acl: {},
    override: {},
    auth: {}
  },*/

  //esri: {},
  //cookie_secret: ''
};
