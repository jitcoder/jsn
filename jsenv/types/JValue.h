
struct JValue {
  char *identifier;
  int size;
  void *mem;
};

struct JValue *JValue_declareVariable(char *indentifier);

void JValue_setIntegerValue(struct JValue *val, int newValue);
void JValue_setStringValue(struct JValue *val, char* newValue);
void JValue_setDecimalValue(struct JValue *val, double newValue);