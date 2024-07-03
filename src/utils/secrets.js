import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

export const getSecret = async (key) => {
  if (process.env.ENVIRONMENT == 'local') {
    return process.env[key];
  }
  return await getAWSSecret('PROJECT_SECRETS', key);
};

export const getAWSSecret = async (secretId, key) => {
  const client = new SecretsManagerClient({
    region: 'us-east-1',
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretId,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  const keyValueDict = JSON.parse(response.SecretString);
  return keyValueDict[key];
};
