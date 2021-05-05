#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleApp } from '../lib/sample-app';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

const delivery = new PipelineStack(app, 'sample-DeliveryPipeline', {
  name: 'sample-app',
  env: {
    account: '006684778752',
    region: 'us-west-2',
  }
});

delivery.pipeline.addApplicationStage(
  new SampleApp(app, 'devSampleApp', { 
    env: {
      account: '873087544906',
      region: 'us-west-2'
    }
  })
);

// delivery.pipeline.addApplicationStage(
//   new SampleApp(app, 'prodSampleApp', {
//     env: {
//       account: 'REPLACE_WITH_PROD_ACCOUNT_ID',
//       region: 'us-east-1'
//     }
//   })
// );
