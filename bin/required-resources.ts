#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RequiredResourcesStack } from '../lib/required-resources';

const dev = { account: '873087544906', region: 'us-west-2' }
// const prod = { account: 'REPLACE_WITH_PROD_ACCOUNT_ID', region: 'us-east-2' }
const trustedAccount = '006684778752';

const app = new cdk.App();

new RequiredResourcesStack(app, 'dev', {
  env: dev,
  trustedAccount
});

// new RequiredResourcesStack(app, 'prod', {
//   env: prod,
//   trustedAccount
// });
