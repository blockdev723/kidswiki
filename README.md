# kidswiki


# Runtime error fix
Xcode 11.0 build get error - Unknown argument type '__attribute__' in method -[RCTAppState getCurrentAppState:error:]

1. go to node_modules/react-native/React/Base/RCTModuleMethod.mm
2. Add the line from the patch.

static BOOL RCTParseUnused(const char **input)
{
  return RCTReadString(input, "__unused") || 
        RCTReadString(input, "__attribute__((__unused__))") || 
        RCTReadString(input, "__attribute__((unused))");
}