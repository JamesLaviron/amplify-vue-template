#!/usr/bin/env node

import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';

const client = new DynamoDBClient({
  region: 'us-east-1',
  credentials: fromIni({ profile: 'default' }),
});

const TABLE_NAME = 'static-leagues';

async function createTable() {
  try {
    const command = new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH', // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S', // String
        },
      ],
      BillingMode: 'PAY_PER_REQUEST', // On-demand pricing
    });

    const result = await client.send(command);
    console.log('✅ Table créée avec succès:', result.TableDescription.TableName);
    console.log('📊 Status:', result.TableDescription.TableStatus);
    console.log('🔗 ARN:', result.TableDescription.TableArn);

    console.log("\n⏳ Attente de l'activation de la table...");
    // Attendre que la table soit active
    let tableReady = false;
    while (!tableReady) {
      const describeCommand = new DescribeTableCommand({ TableName: TABLE_NAME });
      const describeResult = await client.send(describeCommand);

      if (describeResult.Table.TableStatus === 'ACTIVE') {
        tableReady = true;
        console.log('🎉 Table active et prête à utiliser !');
      } else {
        console.log(`⏳ Status: ${describeResult.Table.TableStatus}, attente...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('⚠️  La table existe déjà');
    } else {
      console.error('❌ Erreur lors de la création:', error.message);
      throw error;
    }
  }
}

// Import nécessaire pour DescribeTableCommand
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';

createTable().catch(console.error);
