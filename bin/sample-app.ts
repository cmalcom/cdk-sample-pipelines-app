#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleApp, SampleStack } from '../lib/sample-app';
import { PipelineStack } from '../lib/pipeline-stack';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import * as codebuild from '@aws-cdk/aws-codebuild';

const app = new cdk.App();

const delivery = new PipelineStack(app, 'sample-DeliveryPipeline', {
  name: 'sample-app',
  env: {
    account: '051378770748',
    region: 'us-west-2',
  }
});

const sampleAppStack = new SampleStack(app, 'devSampleStack', {
    env: {
      account: '467592754234',
      region: 'us-west-2'
    }
});

delivery.codePipeline.addStage({
  stageName: 'Deploy',
  actions: [
    new actions.CodeBuildAction({
      actionName: `DeployAction`,
      project: new codebuild.PipelineProject(delivery, `NpmDeployProject`, {
          buildSpec: codebuild.BuildSpec.fromObject({
            version: '0.2',
            phases: {
              build: {
                commands: [
                  `npx cdk deploy 'devSampleStack'`
                ]
              }
            }
          }),
          environment: {
            buildImage: codebuild.LinuxBuildImage.STANDARD_2_0
          }
        }),
      input: delivery.buildArtifact
    })  
  ]
});

// delivery.pipeline.addApplicationStage(
//   new SampleApp(app, 'devSampleApp', { 
//     env: {
//       account: '467592754234',
//       region: 'us-west-2'
//     }
//   })
// );

// delivery.pipeline.addApplicationStage(
//   new SampleApp(app, 'prodSampleApp', {
//     env: {
//       account: 'REPLACE_WITH_PROD_ACCOUNT_ID',
//       region: 'us-east-1'
//     }
//   })
// );
