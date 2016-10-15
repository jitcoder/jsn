#include "JValue.h"
#include <stdlib.h>
#include <string.h>

struct JValue *JValue_declareVariable(char *indentifier)
{
  struct JValue *variable = malloc(sizeof(struct JValue));
  variable->size = 0;
  variable->identifier = (char *) malloc(strlen(indentifier));
  strcpy(variable->identifier, indentifier);
  return variable;
}

void JValue_setSize(struct JValue *val, int size){
  if(val->size != size){
    if(val->size > 0) {
      free(val->mem);
    }
    val->mem = malloc(size);
    val->size = 4;
  }
}

void JValue_setIntegerValue(struct JValue *val, int newValue){
  JValue_setSize(val, sizeof(int));
  *(int *)val->mem = newValue;
}

void JValue_setDecimalValue(struct JValue *val, double newValue){
  JValue_setSize(val, sizeof(double));
  *(double *)val->mem = newValue;
}

void JValue_setStringValue(struct JValue *val, char* newValue){
  JValue_setSize(val, strlen(newValue));
  strcpy(val->mem, newValue);
}