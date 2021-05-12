#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RequiredResourcesStack } from '../lib/required-resources';

const dev = { account: '467592754234', region: 'us-west-2' }
// const prod = { account: 'REPLACE_WITH_PROD_ACCOUNT_ID', region: 'us-east-2' }
const trustedAccount = '051378770748';

const app = new cdk.App();

new RequiredResourcesStack(app, 'dev', {
  env: dev,
  trustedAccount
});

// new RequiredResourcesStack(app, 'prod', {
//   env: prod,
//   trustedAccount
// });
