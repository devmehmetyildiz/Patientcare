module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@Provider': './src/Provider',
          '@Pages': './src/Pages',
          '@Realm': './src/Realm',
          '@Redux': './src/Redux',
          '@Utils': './src/Utils',
        },
      },
    ],
  ],
};
