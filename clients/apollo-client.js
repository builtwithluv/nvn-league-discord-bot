global.WebSocket = require('ws');
require('es6-promise').polyfill();
require('isomorphic-fetch');

import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import AWSAppSyncClient from 'aws-appsync';
import AWS from 'aws-sdk';
import aws_exports from '../aws-exports';
import config from '../config';

AWS.config.update({
    region: aws_exports.aws_appsync_region,
    credentials: new AWS.Credentials({
        accessKeyId: config.AWS_ACCESS_KEY,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    })
});

const client = new AWSAppSyncClient({
    url: aws_exports.aws_appsync_graphqlEndpoint,
    region: aws_exports.aws_appsync_region,
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: aws_exports.aws_appsync_apiKey
    },
    disableOffline: true
});

export default client;
