/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Button,
  View,
  Text,
  NativeModules,
  TextInput,
  TextStyle,
  ViewStyle,
} from 'react-native';

// Type definition for TypeScript
type BunBridgeType = {
  executeBunScript: (script: string) => Promise<string>;
};

// Access the module
const {BunBridge} = NativeModules as {BunBridge: BunBridgeType};

// Function to execute a Bun script
const executeBunScript = async (script: string): Promise<string> => {
  try {
    const result = await BunBridge.executeBunScript(script);
    console.log('Bun script executed successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to execute Bun script:', error);
    throw error; // Re-throw the error if you want to handle it further up the chain
  }
};
const defaultScript = `console.log('Hello from Bun!');`;

const BunRunner = () => {
  const [status, setStatus] = React.useState<string>(
    'Hit the button to execute the Bun script runner.',
  );
  const [result, setResult] = React.useState<string>('Nothing here yet.');
  const [error, setError] = React.useState<string>('No errors yet.');
  const [script, setScript] = React.useState<string>(defaultScript);

  const handlePress = async () => {
    setStatus('Executing Bun script...');
    setResult('');
    setError('');
    try {
      const res = await executeBunScript(script);
      setResult(JSON.stringify(res, null, 2));
      setStatus('Bun script executed successfully');
    } catch (err) {
      setError(JSON.stringify(err, null, 2));
      setStatus('Failed to execute Bun script');
      console.error(err);
    }
  };

  const $box: ViewStyle = {
    padding: 16,
    backgroundColor: '#444',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 8,
  };

  const $heading: TextStyle = {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  };

  const $result: TextStyle = {
    color: '#2c8',
  };
  const $error: TextStyle = {
    color: '#e42',
  };

  return (
    <View style={{padding: 32, gap: 32}}>
      <View style={$box}>
        <Text style={$heading}>Enter Your JavaScript</Text>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={text => setScript(text)}
          value={script}
          style={{
            padding: 16,
            borderColor: '#000',
            borderWidth: 1,
            borderRadius: 8,
            paddingTop: 20,
            backgroundColor: '#333',
            fontFamily: 'Courier New',
          }}
        />
      </View>
      <Button title="Execute Bun Script" onPress={handlePress} />
      <View style={$box}>
        <Text style={$heading}>Status</Text>
        <Text>{status}</Text>
      </View>
      <View style={$box}>
        <Text style={$heading}>Result</Text>
        <Text style={$result}>{result}</Text>
      </View>
      <View style={$box}>
        <Text style={$heading}>Error</Text>
        <Text style={$error}>{error}</Text>
      </View>
    </View>
  );
};

export default BunRunner;
