// import * as cdk from '@aws-cdk/core';
// import * as pipelines from '@aws-cdk/pipelines'
// import * as codepipeline from '@aws-cdk/aws-codepipeline';
// import * as codebuild from '@aws-cdk/aws-codebuild';
// import * as actions from '@aws-cdk/aws-codepipeline-actions';
// import * as iam from '@aws-cdk/aws-iam';
// const s3 = require('@aws-cdk/aws-s3');
// // import {Bucket} from '@aws-cdk/aws-s3';

// export interface PipelineStackProps extends cdk.StackProps {
//   name: string;
// }

// export class PipelineStack extends cdk.Stack {
//   public readonly pipeline: pipelines.CdkPipeline;

//   constructor(scope: cdk.Construct, id: string, props: PipelineStackProps) {
//     super(scope, id, props);

//     //SOURCE ACTION
//     const sourceArtifact = new codepipeline.Artifact();

//     const sourceActionGithub = new actions.GitHubSourceAction({
//         actionName: 'GitHub',
//         output: sourceArtifact,
//         oauthToken: cdk.SecretValue.secretsManager('github-token'),
//         trigger: actions.GitHubTrigger.WEBHOOK,
//         owner: 'cmalcom',
//         repo: 'cdk-sample-pipelines-app',
//         branch: 'main'
//       });

//       const codeBucket = s3.Bucket.fromBucketName(this, `ArtifactBucket`, `corey-code-artifacts`);
//       const sourceActionS3 = new actions.S3SourceAction({
//         actionName: `S3SourceAction`,
//         bucket: codeBucket,
//         bucketKey: 'artifact/thecode.zip',
//         output: sourceArtifact
//       });


//       //SYNTH ACTION
//     const cloudAssemblyArtifact = new codepipeline.Artifact();
//     const npmSynthAction = pipelines.SimpleSynthAction.standardNpmSynth({
//       sourceArtifact,
//       cloudAssemblyArtifact,
//       rolePolicyStatements: [
//         new iam.PolicyStatement({
//           effect: iam.Effect.ALLOW,
//           actions: [
//             "sts:AssumeRole",
//           ],
//           resources: [
//             "arn:aws:iam::*:role/cdk-readOnlyRole"
//           ]
//         })
//       ]
//     });
      

//     //BUILD CODE STAGE

//     const samBuildProject = new codebuild.PipelineProject(this, `SamBuildProject`, {
//       buildSpec: codebuild.BuildSpec.fromObject({
//         version: '0.2',
//         phases: {
//           install: {
//             commands: [
//               'npm install'
//             ]
//           },
//           build: {
//             commands: [
//               // "set -e",
//               // "npx webpack",
//               "sam build",
//               "sam package --template-file template.yaml --output-template-file package.yaml --s3-bucket coreysourcedrop",
//               "cat package.yaml"
//             ]
//           }
//         },
//         artifacts: {
//           'base-directory': './',
//           files: [
//             `package.yaml`
//           ]
//         },
        
//       }),
//       environment: {
//         buildImage: codebuild.LinuxBuildImage.STANDARD_2_0
//       },
//     });
//     // const buildStage = this.pipeline.addStage('SamBuild');

//     const samBuildArtifact = new codepipeline.Artifact(`SamBuildOutput`);
//     const buildAction = new actions.CodeBuildAction({
//       actionName: `Sam_Build`,
//       project: samBuildProject,
//       input: sourceArtifact,
//       outputs: [ samBuildArtifact ], //will be to s3 source drop so it can be used by each env
      
//     });
//     // buildStage.addActions(buildAction);

//     //PIPELINE
//     this.pipeline = new pipelines.CdkPipeline(this, 'Pipeline', {
//       pipelineName: `${props.name}-DeliveryPipeline`,
//       // cloudAssemblyArtifact,
//       sourceAction: sourceActionS3,
//       synthAction: buildAction,
//       cloudAssemblyArtifact: samBuildArtifact,
//       // synthAction: npmSynthAction
//       selfMutating: false
//     });


//   //   {
//   //     "Effect": "Allow",
//   //     "Resource": [
//   //         "arn:aws:s3:::bucketname/*"
//   //     ],
//   //     "Action": [
//   //         "s3:PutObject"
//   //     ]
//   // }

//     // const deployStage = this.pipeline.addStage('SamDeploy');
//     // deployStage.addActions(new actions.CloudFormationCreateUpdateStackAction({
//     //   account: '',
//     //   region: '',
//     //   actionName: `samDeploy`,
//     //   templatePath: samBuildArtifact.atPath(`package.yaml`),
//     //   parameterOverrides: {
//     //     'EnvironmentTagName': `tc`,
//     //     'StackTagName': `svc-example-template`
//     //   },
//     //   stackName: `svc-example-template`,
//     //   cfnCapabilities: [cdk.CfnCapabilities.AUTO_EXPAND, cdk.CfnCapabilities.ANONYMOUS_IAM],
//     //   adminPermissions: true,
//     // }));

//   }
// }

