import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as pipelines from '@aws-cdk/pipelines'
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import * as iam from '@aws-cdk/aws-iam';
import { SampleStack } from './sample-app';


export interface PipelineStackProps extends cdk.StackProps {
  name: string;
}

export class PipelineStack extends cdk.Stack {
  // public readonly pipeline: pipelines.CdkPipeline;

  public readonly codePipeline: codepipeline.Pipeline;

  constructor(scope: cdk.Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const buildArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const sampleAppStack = new SampleStack(scope, 'devSampleStack', {
      env: {
        account: '467592754234',
        region: 'us-west-2'
      }
    });
    
    this.codePipeline = new codepipeline.Pipeline(this, `${props.name}-DeliveryPipeline`, {
      stages: [
        {
          stageName: 'Source',
          actions: [
              new actions.GitHubSourceAction({
              actionName: 'GitHub',
              output: sourceArtifact,
              oauthToken: cdk.SecretValue.secretsManager('github-token'),
              trigger: actions.GitHubTrigger.WEBHOOK,
              owner: 'cmalcom',
              repo: 'cdk-sample-pipelines-app',
              branch: 'main'
            })
          ]
        },
        {
          stageName: 'Build',
          actions: [
            new actions.CodeBuildAction({
              actionName: `NpmBuild`,
              project: new codebuild.PipelineProject(this, `NpmBuildProject`, {
                  buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                      install: {
                        commands: [
                          'npm install'
                        ]
                      },
                      build: {
                        commands: [
                          'npm run build'
                        ]
                      }
                    },
                    artifacts: {
                      'base-directory': './',
                      // files: [
                      //   `*.*`
                      // ]
                    }
                  }),
                  environment: {
                    buildImage: codebuild.LinuxBuildImage.STANDARD_2_0
                  }
                }),
              input: sourceArtifact,
              outputs: [ buildArtifact ] //will be to s3 source drop so it can be used by each env
            })
          ], 
        },
        {
          stageName: 'Deploy',
          actions: [
            new actions.CodeBuildAction({
              actionName: `DeployAction`,
              project: new codebuild.PipelineProject(this, `NpmDeployProject`, {
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
              input: buildArtifact
            })          
          ]
        }
      ]
    });
    // this.pipeline = new pipelines.CdkPipeline(this, 'Pipeline', {
    //   pipelineName: `${props.name}-DeliveryPipeline`,
    //   cloudAssemblyArtifact,
    //   sourceAction: new actions.GitHubSourceAction({
    //     actionName: 'GitHub',
    //     output: sourceArtifact,
    //     oauthToken: cdk.SecretValue.secretsManager('github-token'),
    //     trigger: actions.GitHubTrigger.WEBHOOK,
    //     owner: 'cmalcom',
    //     repo: 'cdk-sample-pipelines-app',
    //     branch: 'main'
    //   }),
    //   synthAction: pipelines.SimpleSynthAction.standardNpmSynth({
    //     sourceArtifact,
    //     cloudAssemblyArtifact,
    //     rolePolicyStatements: [
    //       new iam.PolicyStatement({
    //         effect: iam.Effect.ALLOW,
    //         actions: [
    //           "sts:AssumeRole",
    //         ],
    //         resources: [
    //           "arn:aws:iam::*:role/cdk-readOnlyRole"
    //         ]
    //       })
    //     ]
    //   })
    // });
  }
}

